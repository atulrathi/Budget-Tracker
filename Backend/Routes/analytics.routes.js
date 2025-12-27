const express = require("express");
const router = express.Router();

const authMiddleware = require("../Middleweres/Auth.middlewere");
const {
  monthlySummary,
  categoryWiseExpense,
} = require("../Controller/analytics.controller");

// protected routes
router.get("/summary", authMiddleware, monthlySummary);
router.get("/category", authMiddleware, categoryWiseExpense);

module.exports = router;
