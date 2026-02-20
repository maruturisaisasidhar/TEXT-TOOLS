const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(express.json());
app.use(cors());

// OpenRouter API configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// In-memory storage for sessions
let inMemorySessions = {};

const generateRandomToken = () => Math.random().toString(36).substring(2, 7);

// Generate Token endpoint
app.post("/generate-token", (req, res) => {
  try {
    const token = generateRandomToken();
    inMemorySessions[token] = { token, history: [], createdAt: new Date() };
    res.json({ token });
  } catch (error) {
    console.error("Error generating token:", error);
    res.status(500).json({ error: "Error generating token" });
  }
});

// Update History endpoint
app.post("/update-history", (req, res) => {
  const {
    token,
    action,
    text: historyText,
    task,
    result: historyResult,
  } = req.body;
  try {
    const session = inMemorySessions[token];
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    const newHistoryEntry = {
      action,
      text: historyText,
      task,
      result: historyResult,
      timestamp: new Date(),
    };
    session.history.push(newHistoryEntry);

    res.json({ history: session.history });
  } catch (error) {
    console.error("Error updating history:", error);
    res.status(500).json({ error: "Error updating history" });
  }
});

// Get History endpoint
app.post("/get-history", (req, res) => {
  const { token } = req.body;
  try {
    const session = inMemorySessions[token];

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json({ history: session.history });
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ error: "Error fetching history" });
  }
});

// AI API endpoint (using OpenRouter)
app.post("/api/gemini", async (req, res) => {
  const { text, task } = req.body;

  if (!text || !task) {
    return res.status(400).json({ error: "Text and task are required" });
  }

  try {
    const prompt = `here is the text, ${task}: ${text}`;

    console.log("Calling OpenRouter API with prompt:", prompt);

    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: "meta-llama/llama-3.1-8b-instruct",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost",
          "X-Title": "TextTools",
        },
      },
    );

    console.log("OpenRouter API Response:", response.data);

    const generatedText =
      response.data?.choices?.[0]?.message?.content || "No response";

    res.json({ text: generatedText });
  } catch (error) {
    console.error("OpenRouter API Error details:", error.message);
    console.error("Full error:", error.response?.data || error);
    res.status(500).json({
      error: "Error fetching response from AI",
      details: error.message,
    });
  }
});

// Google Drive direct download link route
app.get("/download-chrome-extension", (req, res) => {
  res.redirect(
    "https://drive.google.com/uc?export=download&id=1xatQTHY4wysNuULccTlFMWb40Gz4SUzd",
  );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
