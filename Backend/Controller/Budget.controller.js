const Budget = require("../Models/Budget");
const Expense = require("../Models/Expense");
const mongoose = require("mongoose");

/* CREATE BUDGET*/
exports.createBudget = async (req, res) => {
  try {
    let { category, limit } = req.body;
    const userId = req.userId;

    if (!category || !limit) {
      return res.status(400).json({
        message: "Category and limit are required",
      });
    }

  
    category = category.toLowerCase().trim();

   
    const month = getCurrentMonth();

    
    const existingBudget = await Budget.findOne({
      userId,
      category,
      month,
    });

    if (existingBudget) {
      return res.status(400).json({
        message: "Budget for this category already exists for this month",
      });
    }

    const budget = await Budget.create({
      userId,
      category,
      limit,
      month,
    });

    res.status(201).json(budget);
  } catch (error) {
    console.error("Create Budget Error:", error);
    res.status(500).json({
      message: "Failed to create budget",
    });
  }
};

/* Helpers*/
function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;
}

function getMonthRange(month) {
  const [year, mon] = month.split("-");
  const start = new Date(year, mon - 1, 1);
  const end = new Date(year, mon, 1);
  return { start, end };
}

/* FETCH TRACKED BUDGETS*/
exports.getTrackedBudgets = async (req, res) => {
  try {
    const userId = req.userId;
    const month = getCurrentMonth();

    /* 1️⃣ Fetch budgets */
    const budgets = await Budget.find({
      userId,
      month,
    }).lean();

    const userObjectId = new mongoose.Types.ObjectId(userId);

    /* 2️⃣ Month range */
    const { start, end } = getMonthRange(month);

    /* 3️⃣ Aggregate expenses */
    const expenses = await Expense.aggregate([
      {
    $match: {
      userId: userObjectId,
      deleted: false, 
      date: { $gte: start, $lt: end },
    },
  },
  {
    $group: {
      _id: {
        $toLower: { $trim: { input: "$type" } }, // 🔥 FIX #3
      },
      totalSpent: { $sum: "$amount" },
    },
  },
    ]);

    /* 4️⃣ Expense map */
    const expenseMap = {};
    expenses.forEach((e) => {
      expenseMap[e._id] = e.totalSpent;
    });

    /* 5️⃣ Merge logic */
    const trackedBudgets = budgets.map((b) => {
      const key = b.category.toLowerCase().trim();
      const spent = expenseMap[key] || 0;
      const usage = spent / b.limit;

      let status = "safe";
      if (usage >= 0.8 && usage <= 1) status = "warning";
      if (usage > 1) status = "exceeded";

      return {
        category: b.category,
        limit: b.limit,
        spent,
        remaining: b.limit - spent,
        percentage: Math.min(usage * 100, 100),
        status,
      };
    });

    res.status(200).json(trackedBudgets);
  } catch (error) {
    console.error("Budget Tracking Error:", error);
    res.status(500).json({
      message: "Failed to fetch budget tracking data",
    });
  }
};
