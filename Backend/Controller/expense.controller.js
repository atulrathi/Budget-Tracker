const Expense = require("../Models/Expense");
const user = require("../Models/User");

//  Add Expense
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

//  Get All Expenses (for logged-in user)

exports.getExpenses = async (req, res) => {
  try {

    const now = new Date();

// Start of current month (00:00:00)
const startOfMonth = new Date(
  now.getFullYear(),
  now.getMonth(),
  1
);

// Start of next month (used as end boundary)
const endOfMonth = new Date(
  now.getFullYear(),
  now.getMonth() + 1,
  1
);


    // Fetch all expenses
    const expenses = await Expense.find({ 
      userId: req.userId, 
      deleted: false ,
    }).sort({ date: -1 });

    const userdata = await user.findById(req.userId);

    if (!expenses || !userdata) {
      return res.status(404).json({
        success: false,
        message: "No expenses or user data found",
      });
    }

    // ==================== DASHBOARD CALCULATIONS ====================
    const filterexpense = expenses.filter(e =>  e.date >= startOfMonth && e.date < endOfMonth );
    // 1. Calculate totals
    const totalSpending = filterexpense.reduce((sum, e) => sum + e.amount, 0);
    const income = userdata.Income;
    const budget = 50000;
    const savings = income - totalSpending;
    
    // 2. Calculate percentages
    const budgetUtilization = budget > 0 
      ? parseFloat(((totalSpending / budget) * 100).toFixed(1)) 
      : 0;
    
    const savingsRate = income > 0 
      ? parseFloat(((savings / income) * 100).toFixed(1)) 
      : 0;

    // 3. Group by category with percentages
    const categoryMap = {};
    expenses.forEach(e => {
      const key = e.subCategory || e.category || "Uncategorized";
      categoryMap[key] = (categoryMap[key] || 0) + e.amount;
    });
    
    const categoryChart = Object.entries(categoryMap)
      .map(([name, value]) => ({
        name,
        value: Math.round(value),
        percentage: totalSpending > 0 
          ? parseFloat(((value / totalSpending) * 100).toFixed(1)) 
          : 0
      }))
      .sort((a, b) => b.value - a.value);

    // 4. Group by month for trend
    const monthlyMap = {};
    expenses.forEach(e => {
      const date = new Date(e.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleDateString('en-IN', { 
        month: 'short', 
        year: '2-digit' 
      });
      
      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = { month: monthLabel, amount: 0, key: monthKey };
      }
      monthlyMap[monthKey].amount += e.amount;
    });
    
    const monthlyTrend = Object.values(monthlyMap)
      .sort((a, b) => a.key.localeCompare(b.key))
      .slice(-6)
      .map(({ month, amount }) => ({
        month,
        amount: Math.round(amount)
      }));

    // 5. Budget chart data
    const budgetChart = [
      { label: "Planned Budget", amount: budget },
      { label: "Actual Spending", amount: Math.round(totalSpending) },
      { label: "Remaining", amount: Math.max(budget - totalSpending, 0) }
    ];

    // 6. Format recent transactions (first 6)
    const recentTransactions = expenses.slice(0, 6).map(e => ({
      id: e._id,
      category: e.category,
      subCategory: e.subCategory,
      description: e.description,
      amount: e.amount,
      date: e.date,
      formattedDate: new Date(e.date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      formattedAmount: new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(e.amount)
    }));

    // ==================== SEND COMPLETE RESPONSE ====================
    res.json({
      success: true,
      filterexpense,
      dashboard: {
        summary: {
          income,
          budget,
          totalSpending: Math.round(totalSpending),
          savings: Math.round(savings),
          budgetUtilization,
          savingsRate,
          transactionCount: expenses.length,
          averageTransaction: expenses.length > 0 
            ? Math.round(totalSpending / expenses.length) 
            : 0
        },
        budgetChart,
        categoryChart,
        monthlyTrend,
        topCategories: categoryChart.slice(0, 5),
        recentTransactions,
        pagination: {
          currentPage: 1,
          totalPages: Math.ceil(expenses.length / 6),
          totalTransactions: expenses.length,
          perPage: 6
        }
      }
    });

  } catch (error) {
    console.error('Expense fetch error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch expenses",
      error: error.message
    });
  }
};

//  Update Expense
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

//  Delete Expense
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findOneAndUpdate({
      _id: id,
      userId: req.userId,
    }, { deleted: true }, { new: true });

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
