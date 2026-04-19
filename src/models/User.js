const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    telegramId: {
      type: Number,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      default: null,
    },
    firstName: {
      type: String,
      default: null,
    },
    lastName: {
      type: String,
      default: null,
    },
    languageCode: {
      type: String,
      default: null,
    },
    isBot: {
      type: Boolean,
      default: false,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    messageCount: {
      type: Number,
      default: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Update lastSeen and increment messageCount
userSchema.methods.recordActivity = async function () {
  this.lastSeen = new Date();
  this.messageCount += 1;
  return this.save();
};

// Static: find or create user from Telegram msg.from
userSchema.statics.findOrCreate = async function (telegramUser) {
  let user = await this.findOne({ telegramId: telegramUser.id });

  if (!user) {
    user = await this.create({
      telegramId: telegramUser.id,
      username: telegramUser.username || null,
      firstName: telegramUser.first_name || null,
      lastName: telegramUser.last_name || null,
      languageCode: telegramUser.language_code || null,
      isBot: telegramUser.is_bot || false,
    });
  } else {
    user.lastSeen = new Date();
    user.messageCount += 1;
    user.username = telegramUser.username || user.username;
    user.firstName = telegramUser.first_name || user.firstName;
    user.lastName = telegramUser.last_name || user.lastName;
    await user.save();
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);
