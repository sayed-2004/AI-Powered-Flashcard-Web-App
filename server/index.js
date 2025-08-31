import express from "express";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import flashcardRoutes from "./routes/flashcards.js";
import aiFlashcardsRoutes from "./routes/aiFlashcards.js";
import cors from "cors";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());


// Connect to MongoDB
connectDB();

app.use("/api/ai-flashcards", aiFlashcardsRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/flashcards", flashcardRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));