const express = require("express");
const router = express.Router();

const authMiddleware = require("../Middleweres/Auth.middlewere");
const {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} = require("../Controller/expense.controller");

router.post("/", authMiddleware, addExpense);
router.get("/", authMiddleware, getExpenses);
router.put("/:id", authMiddleware, updateExpense);
router.delete("/:id", authMiddleware, deleteExpense);

module.exports = router;
