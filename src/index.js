require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const connectDB = require("./db");
const createServer = require("./server");
const {
  handleStart,
  handleHelp,
  handleMyInfo,
  handleStats,
  handleLastSeen,
  handleTotalUsers,
  handleUnknown,
} = require("./handlers/commands");

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const PORT = process.env.PORT || 3000;

if (!TOKEN) {
  console.error("❌ TELEGRAM_BOT_TOKEN is missing in environment variables.");
  process.exit(1);
}

// ── Bootstrap ─────────────────────────────────────────────────────────────────
const start = async () => {
  // 1. Connect to MongoDB
  await connectDB();

  // 2. Start Express server (required by Render to keep the service alive)
  const app = createServer();
  app.listen(PORT, () => {
    console.log(`🌐 Express server listening on port ${PORT}`);
  });

  // 3. Start Telegram bot in polling mode
  const bot = new TelegramBot(TOKEN, { polling: true });
  console.log("🤖 Telegram bot started (polling)...");

  // ── Commands ────────────────────────────────────────────────────────────────
  bot.onText(/\/start/, (msg) => handleStart(bot, msg));
  bot.onText(/\/help/, (msg) => handleHelp(bot, msg));
  bot.onText(/\/myinfo/, (msg) => handleMyInfo(bot, msg));
  bot.onText(/\/stats/, (msg) => handleStats(bot, msg));
  bot.onText(/\/lastseen/, (msg) => handleLastSeen(bot, msg));
  bot.onText(/\/totalusers/, (msg) => handleTotalUsers(bot, msg));

  // Catch-all for non-command text messages
  bot.on("message", (msg) => {
    if (!msg.text || msg.text.startsWith("/")) return;
    handleUnknown(bot, msg);
  });

  // ── Error handling ──────────────────────────────────────────────────────────
  bot.on("polling_error", (err) => {
    console.error("❌ Polling error:", err.message);
  });

  bot.on("error", (err) => {
    console.error("❌ Bot error:", err.message);
  });

  // ── Graceful shutdown ───────────────────────────────────────────────────────
  const shutdown = async (signal) => {
    console.log(`\n🛑 Received ${signal}. Shutting down...`);
    bot.stopPolling();
    process.exit(0);
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
};

start().catch((err) => {
  console.error("❌ Fatal startup error:", err);
  process.exit(1);
});
