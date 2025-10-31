import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config(); // 🔑 Load environment variables

const app = express();
app.use(express.json());
app.use(cors());

// Gemini API Key from .env or Replit Secret
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ GEMINI_API_KEY not found. Please set it in .env or Replit Secrets.");
  process.exit(1);
}

app.get("/", (req, res) => {
  res.send("✅ Mirror-AI API is live");
});

app.post("/ask", async (req, res) => {
  try {
    const { question, language } = req.body;
    if (!question) return res.status(400).json({ error: "Question missing" });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: question }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const answer =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn’t answer that.";

    res.json({ answer });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Mirror-AI running on port ${PORT}`));
