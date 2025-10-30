import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from "cors";

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Gemini API setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Routes
app.post("/ask", async (req, res) => {
  try {
    const { question, language } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(question);
    const answer = result.response.text();
    res.json({ answer });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Something went wrong!" });
  }
});

app.get("/", (req, res) => {
  res.send("✅ Mirror-AI API is running!");
});

// Set up port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
