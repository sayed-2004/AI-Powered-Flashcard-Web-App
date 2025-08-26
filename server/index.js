import express from "express";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";

const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));