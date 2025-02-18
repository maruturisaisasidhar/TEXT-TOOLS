// server.js
import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import fetch from "node-fetch";
const app = express();

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const PORT = process.env.PORT || 3000;
const GEMINI_API =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: function (origin, callback) {
      // For Chrome extensions, origin is the extension ID in the format:
      // chrome-extension://[extension-id]
      if (!origin || origin.startsWith("chrome-extension://")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

// Authentication endpoint - generate a token when extension is installed
app.post("/auth", (req, res) => {
  const { extensionId } = req.body;

  if (!extensionId) {
    return res.status(400).json({ error: "Extension ID is required" });
  }

  const token = jwt.sign({ extensionId }, JWT_SECRET, {
    expiresIn: "7d", // Token expires in 7 days
  });

  res.json({ token });
});

// JWT verification middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(401).json({ error: "Authentication token is required" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid or expired token" });
    req.user = user;
    next();
  });
}

// Protected endpoint for text processing
app.post("/api/process-text", authenticateToken, async (req, res) => {
  try {
    const { text, task, targetLang } = req.body;

    if (!text || !task) {
      return res.status(400).json({ error: "Text and task are required" });
    }

    let prompt = "";
    const LANGUAGES = {
      en: "English",
      es: "Spanish",
      fr: "French",
      de: "German",
      it: "Italian",
      pt: "Portuguese",
      ru: "Russian",
      zh: "Chinese",
      ja: "Japanese",
      ko: "Korean",
    };

    if (task === "translate") {
      if (!targetLang || !LANGUAGES[targetLang]) {
        return res
          .status(400)
          .json({ error: "Valid target language is required for translation" });
      }
      prompt = `Translate the following text to ${LANGUAGES[targetLang]}:\n${text}`;
    } else if (task === "rephrase") {
      prompt = `Rephrase this text in a clear and professional way:\n${text}`;
    } else if (task === "summarize") {
      prompt = `Provide a concise summary of this text:\n${text}`;
    } else if (task === "grammar") {
      prompt = `Check and correct any grammar issues in this text:\n${text}`;
    } else {
      return res.status(400).json({ error: "Invalid task" });
    }

    // Make the actual API call to Gemini
    const response = await fetch(`${GEMINI_API}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    const data = await response.json();
    const result =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    res.json({ result });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error processing text" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
