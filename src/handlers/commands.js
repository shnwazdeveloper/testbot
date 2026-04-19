const User = require("../models/User");

// Helper: format date nicely
const fmt = (date) =>
  new Date(date).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });

// /start command
const handleStart = async (bot, msg) => {
  const { from, chat } = msg;
  const user = await User.findOrCreate(from);

  const welcomeText = `
👋 *Welcome, ${user.firstName || "Friend"}!*

I'm your *Info Bot* — I store and display your Telegram profile information.

Here's what I can do:
📋 /myinfo — View your full profile info
📊 /stats — Your activity stats
🕒 /lastseen — When you last interacted
👥 /totalusers — Total users in the system
❓ /help — Show all commands

Type any command to get started!
  `.trim();

  await bot.sendMessage(chat.id, welcomeText, { parse_mode: "Markdown" });
};

// /help command
const handleHelp = async (bot, msg) => {
  const text = `
🤖 *Bot Commands*

📋 /myinfo — Your full Telegram profile
📊 /stats — Your message count & activity
🕒 /lastseen — Your last interaction time
👥 /totalusers — Number of registered users
🔄 /start — Restart / re-register
❓ /help — Show this message

_All your data is saved securely in our database._
  `.trim();

  await bot.sendMessage(msg.chat.id, text, { parse_mode: "Markdown" });
};

// /myinfo command
const handleMyInfo = async (bot, msg) => {
  const user = await User.findOrCreate(msg.from);

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
  const username = user.username ? `@${user.username}` : "_(not set)_";

  const text = `
📋 *Your Profile Info*

👤 *Name:* ${fullName || "_(not set)_"}
🔖 *Username:* ${username}
🆔 *Telegram ID:* \`${user.telegramId}\`
🌐 *Language:* ${user.languageCode?.toUpperCase() || "Unknown"}
🤖 *Is Bot:* ${user.isBot ? "Yes" : "No"}

📅 *Joined Bot:* ${fmt(user.joinedAt)}
🕒 *Last Seen:* ${fmt(user.lastSeen)}
💬 *Total Messages:* ${user.messageCount}
  `.trim();

  await bot.sendMessage(msg.chat.id, text, { parse_mode: "Markdown" });
};

// /stats command
const handleStats = async (bot, msg) => {
  const user = await User.findOrCreate(msg.from);

  const daysSinceJoin = Math.floor(
    (Date.now() - new Date(user.joinedAt)) / (1000 * 60 * 60 * 24)
  );

  const text = `
📊 *Your Activity Stats*

💬 *Messages Sent:* ${user.messageCount}
📅 *Days Since Join:* ${daysSinceJoin} day(s)
📈 *Avg Messages/Day:* ${
    daysSinceJoin > 0
      ? (user.messageCount / daysSinceJoin).toFixed(1)
      : user.messageCount
  }
✅ *Status:* ${user.isActive ? "Active" : "Inactive"}
  `.trim();

  await bot.sendMessage(msg.chat.id, text, { parse_mode: "Markdown" });
};

// /lastseen command
const handleLastSeen = async (bot, msg) => {
  const user = await User.findOrCreate(msg.from);

  const text = `
🕒 *Last Seen Info*

👤 *User:* ${user.firstName || "You"}
🕐 *Last Interaction:* ${fmt(user.lastSeen)}
📅 *First Joined:* ${fmt(user.joinedAt)}
  `.trim();

  await bot.sendMessage(msg.chat.id, text, { parse_mode: "Markdown" });
};

// /totalusers command
const handleTotalUsers = async (bot, msg) => {
  const total = await User.countDocuments();
  const active = await User.countDocuments({ isActive: true });

  const text = `
👥 *User Statistics*

📊 *Total Registered Users:* ${total}
✅ *Active Users:* ${active}
  `.trim();

  await bot.sendMessage(msg.chat.id, text, { parse_mode: "Markdown" });
};

// Unknown message handler
const handleUnknown = async (bot, msg) => {
  await User.findOrCreate(msg.from);
  await bot.sendMessage(
    msg.chat.id,
    "🤔 I didn't understand that. Type /help to see available commands.",
    { parse_mode: "Markdown" }
  );
};

module.exports = {
  handleStart,
  handleHelp,
  handleMyInfo,
  handleStats,
  handleLastSeen,
  handleTotalUsers,
  handleUnknown,
};
