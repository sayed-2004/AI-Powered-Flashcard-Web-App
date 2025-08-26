import express from "express";
import Flashcard from "../models/Flashcard.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create
router.post("/", authMiddleware, async (req, res) => {
  const { question, answer } = req.body;
  const flashcard = new Flashcard({ question, answer, owner: req.user.id });
  await flashcard.save();
  res.json(flashcard);
});

// Read all
router.get("/", authMiddleware, async (req, res) => {
  const cards = await Flashcard.find({ owner: req.user.id });
  res.json(cards);
});

// Update
router.put("/:id", authMiddleware, async (req, res) => {
  const updated = await Flashcard.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

// Delete
router.delete("/:id", authMiddleware, async (req, res) => {
  await Flashcard.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
