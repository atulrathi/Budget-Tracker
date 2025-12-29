const express = require("express");
const router = express.Router();

const authMiddleware = require("../Middleweres/Auth.middlewere");
const {
  createBudget,
  getTrackedBudgets,
} = require("../Controller/Budget.controller");

// protected routes
router.post("/", authMiddleware, createBudget);
router.get("/", authMiddleware, getTrackedBudgets);    
module.exports = router;