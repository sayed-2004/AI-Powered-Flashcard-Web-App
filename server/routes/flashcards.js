import express from "express";
import Flashcard from "../models/Flashcard.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE a flashcard
router.post("/", authMiddleware, async (req, res) => {
  const { question, answer } = req.body;
  const flashcard = new Flashcard({ question, answer, owner: req.user.id });
  await flashcard.save();
  res.json(flashcard);
});

// GET all flashcards for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  const cards = await Flashcard.find({ owner: req.user.id });
  res.json(cards);
});

// UPDATE flashcard
router.put("/:id", authMiddleware, async (req, res) => {
  const updated = await Flashcard.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// DELETE flashcard
router.delete("/:id", authMiddleware, async (req, res) => {
  await Flashcard.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
