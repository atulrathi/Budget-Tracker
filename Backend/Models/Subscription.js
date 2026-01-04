const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    default: "Subscriptions",
  },
  frequency: {
    type: String,
    enum: ["daily", "weekly", "monthly", "quarterly", "yearly"],
    default: "monthly",
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  nextRenewalDate: {
    type: Date,
    required: true,
  },
  lastProcessedDate: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ["active", "paused", "cancelled"],
    default: "active",
  },
  autoRenew: {
    type: Boolean,
    default: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  reminderDays: {
    type: Number,
    default: 3,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Subscription", subscriptionSchema);
