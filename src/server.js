const express = require("express");
const mongoose = require("mongoose");

const createServer = () => {
  const app = express();

  app.use(express.json());

  // Health check endpoint (Render uses this to confirm service is alive)
  app.get("/", (req, res) => {
    res.json({
      status: "ok",
      message: "Telegram Info Bot is running 🤖",
      uptime: process.uptime().toFixed(2) + "s",
      db:
        mongoose.connection.readyState === 1 ? "connected" : "disconnected",
      timestamp: new Date().toISOString(),
    });
  });

  // Ping endpoint (for UptimeRobot or external keep-alive pings)
  app.get("/ping", (req, res) => {
    res.send("pong 🏓");
  });

  // 404 fallback
  app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  return app;
};

module.exports = createServer;
