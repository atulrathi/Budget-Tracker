const Expense = require("../Models/Expense");

// ➕ Add Expense
exports.addExpense = async (req, res) => {
  try {
    const { type, category, amount} = req.body;

    const expense = await Expense.create({
      userId: req.userId,
      type,
      category,
      amount,
    });

    res.status(201).json({
      success: true,
      expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add expense",
    });
  }
};

// 📄 Get All Expenses (for logged-in user)
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId }).sort({
      date: -1,
    });

    res.json({
      success: true,
      expenses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch expenses",
    });
  }
};

// ✏️ Update Expense
exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findOneAndUpdate(
      { _id: id, userId: req.userId },
      req.body,
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.json({
      success: true,
      expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update expense",
    });
  }
};

// ❌ Delete Expense
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete expense",
    });
  }
};
