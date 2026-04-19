# 🤖 Telegram Info Bot

A Node.js Telegram bot that **saves user data to MongoDB** and lets users view their profile info, activity stats, and more.

---

## 📁 Project Structure

```
telegram-bot/
├── src/
│   ├── index.js              # Main entry point
│   ├── db.js                 # MongoDB connection
│   ├── server.js             # Express server (Render health check)
│   ├── models/
│   │   └── User.js           # Mongoose user schema
│   └── handlers/
│       └── commands.js       # All bot command handlers
├── .env.example              # Environment variable template
├── .gitignore
├── package.json
├── render.yaml               # Render deployment config
└── README.md
```

---

## ⚡ Bot Commands

| Command | Description |
|---|---|
| `/start` | Welcome message + register user |
| `/myinfo` | View your full Telegram profile |
| `/stats` | Your message count & activity |
| `/lastseen` | When you last interacted |
| `/totalusers` | Total users registered |
| `/help` | Show all commands |

---

## 🛠️ Local Setup

### 1. Clone the repo
```bash
git clone https://github.com/yourname/telegram-info-bot.git
cd telegram-info-bot
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
# Edit .env and fill in your values
```

### 4. Run the bot
```bash
npm start          # production
npm run dev        # development (auto-restart with nodemon)
```

---

## 🌍 Deploy to Render

### Step 1 — Create Bot Token
1. Open Telegram → search **@BotFather**
2. Send `/newbot` and follow instructions
3. Copy the token

### Step 2 — Set up MongoDB Atlas
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist `0.0.0.0/0` (allow all IPs, needed for Render)
5. Copy the connection string (replace `<password>`)

### Step 3 — Deploy on Render
1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo
4. Set **Build Command:** `npm install`
5. Set **Start Command:** `npm start`
6. Under **Environment**, add:
   - `TELEGRAM_BOT_TOKEN` = your bot token
   - `MONGODB_URI` = your MongoDB Atlas URI
7. Click **Deploy** ✅

### Render will auto-detect `render.yaml` if you use Blueprint deploys.

---

## 🔒 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | ✅ | From @BotFather |
| `MONGODB_URI` | ✅ | MongoDB Atlas connection string |
| `PORT` | Auto | Set by Render automatically |
| `ADMIN_ID` | ❌ | Your Telegram user ID (optional) |

---

## 📦 Tech Stack

- **Node.js** — Runtime
- **node-telegram-bot-api** — Telegram Bot SDK
- **Mongoose** — MongoDB ODM
- **Express** — HTTP server (for Render health check)
- **dotenv** — Environment variable management

---

## 📄 License

MIT
