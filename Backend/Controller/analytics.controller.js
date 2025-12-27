const Expense = require("../Models/Expense");

// 📊 Monthly Summary
exports.monthlySummary = async (req, res) => {
  try {
    const userId = req.userId;

    const summary = await Expense.aggregate([
      {
        $match: { userId }
      },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" }
        }
      }
    ]);

    let income = 0;
    let expense = 0;

    summary.forEach((item) => {
      if (item._id === "income") income = item.total;
      if (item._id === "expense") expense = item.total;
    });

    res.json({
      success: true,
      income,
      expense,
      balance: income - expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch monthly summary",
    });
  }
};

// 📂 Category-wise expenses
exports.categoryWiseExpense = async (req, res) => {
  try {
    const userId = req.userId;

    const data = await Expense.aggregate([
      {
        $match: {
          userId,
          type: "expense",
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
      {
        $sort: { total: -1 },
      },
    ]);

    res.json({
      success: true,
      categories: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch category analytics",
    });
  }
};
