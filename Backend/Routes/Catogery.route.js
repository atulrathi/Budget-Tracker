const express = require("express");
const router = express.Router();

const authMiddleware = require("../Middleweres/Auth.middlewere");
const {
  createCategory,
  getCategories,
} = require("../Controller/Catogary.controller");

// protected routes
router.post("/", authMiddleware, createCategory);
router.get("/", authMiddleware, getCategories);

module.exports = router;
