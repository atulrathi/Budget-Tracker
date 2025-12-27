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
      sparse: true,   // ✅ allows null
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true,   // ✅ allows null
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
