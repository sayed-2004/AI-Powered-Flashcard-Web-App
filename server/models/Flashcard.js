import mongoose from "mongoose";

const flashcardSchema = new mongoose.Schema({
  question: String,
  answer: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  nextReview: { type: Date, default: Date.now }
});

export default mongoose.model("Flashcard", flashcardSchema);
