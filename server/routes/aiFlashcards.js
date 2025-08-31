import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import Flashcard from "../models/Flashcard.js";
import multer from "multer";
import OpenAI from "openai";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // store file in memory

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// POST /api/ai-flashcards
// Accepts either a text field 'text' OR a file upload
router.post("/", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    let content = "";

    // If text is provided
    if (req.body.text) content = req.body.text;

    // If file uploaded
    if (req.file) {
      content = req.file.buffer.toString("utf-8"); // assumes txt file
    }

    if (!content) return res.status(400).json({ error: "No content provided" });

    // Generate flashcards via OpenAI
    const prompt = `
      Generate 5-10 flashcards in JSON array format from the following text:
      ${content}
      Format: [{"question": "...", "answer": "..."}, ...]
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });

    // Parse AI response
    const textResponse = response.choices[0].message.content;
    let cards = [];

    try {
      cards = JSON.parse(textResponse);
    } catch (err) {
      return res.status(500).json({ error: "Failed to parse AI response", raw: textResponse });
    }

    // Save cards to DB
    const savedCards = [];
    for (const c of cards) {
      const flashcard = new Flashcard({
        question: c.question,
        answer: c.answer,
        owner: req.user.id
      });
      await flashcard.save();
      savedCards.push(flashcard);
    }

    res.json(savedCards);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
