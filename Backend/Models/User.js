const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true,   
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },Income:{
      type: Number,
      default: 0,
    },
    MonthlyBudget: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
