import mongoose from "mongoose";

const flashcardSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer:   { type: String, required: true },
  owner:    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  nextReview: { type: Date, default: Date.now }
});

export default mongoose.model("Flashcard", flashcardSchema);
