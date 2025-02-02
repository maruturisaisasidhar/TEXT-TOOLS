const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
const Session = require("./models/session");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5174",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://localhost:27017/sessionDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

const generateRandomToken = () => Math.random().toString(36).substring(2, 7);

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("join_session", (token) => {
    socket.join(token);
    console.log(`Client joined session: ${token}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Generate Token endpoint
app.post("/generate-token", async (req, res) => {
  try {
    const token = generateRandomToken();
    const newSession = new Session({ token, history: [] });
    await newSession.save();
    res.json({ token });
  } catch (error) {
    console.error("Error generating token:", error);
    res.status(500).json({ error: "Error generating token" });
  }
});

// Update History endpoint
app.post("/update-history", async (req, res) => {
  const { token, action } = req.body;
  try {
    const session = await Session.findOne({ token });
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    const newHistoryEntry = { action, timestamp: new Date() };
    session.history.push(newHistoryEntry);
    await session.save();

    // Emit the updated history to all clients in this session
    io.to(token).emit("history_updated", session.history);

    res.json({ history: session.history });
  } catch (error) {
    console.error("Error updating history:", error);
    res.status(500).json({ error: "Error updating history" });
  }
});

// Get History endpoint
app.post("/get-history", async (req, res) => {
  const { token } = req.body;
  try {
    const session = await Session.findOne({ token });
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    res.json({ history: session.history });
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ error: "Error fetching history" });
  }
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
