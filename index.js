import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post("/ask", async (req, res) => {
  try {
    const { question, language } = req.body;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: question }] }],
        }),
      }
    );

    const data = await geminiRes.json();
    const answer =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn’t answer that.";

    res.json({ answer });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ answer: "Internal server error." });
  }
});

app.listen(PORT, () => console.log(`✅ Mirror AI API running on ${PORT}`));
