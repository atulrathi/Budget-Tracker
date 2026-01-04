const Expense = require("../Models/Expense");

exports.insightrout = async (req, res) => {
     try {
    const userId = req.userId; // Get from your auth middleware
    
    // Calculate dates
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    // Fetch expenses from MongoDB
    const [currentMonthExpenses, lastMonthExpenses] = await Promise.all([
      Expense.find({
        userId: userId,
        date: { $gte: currentMonthStart, $lte: currentMonthEnd },
        deleted: false
      }).lean(),
      Expense.find({
        userId: userId,
        date: { $gte: lastMonthStart, $lte: lastMonthEnd },
        deleted: false
      }).lean()
    ]);

    // Calculate totals
    const currentTotal = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const lastTotal = lastMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const difference = currentTotal - lastTotal;
    const percentageChange = lastTotal > 0 ? ((difference / lastTotal) * 100).toFixed(1) : 0;

    // Category breakdown
    const categoryMap = currentMonthExpenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});

    const topCategories = Object.entries(categoryMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: currentTotal > 0 ? ((amount / currentTotal) * 100).toFixed(1) : 0
      }));

    // Generate insight message
    let insightMessage = '';
    if (topCategories.length > 0) {
      const top = topCategories[0];
      insightMessage = `Your highest spending category is ${top.category} at ₹${top.amount.toLocaleString('en-IN')}.`;
      if (difference > 0) {
        insightMessage += ` Consider reducing expenses here to improve savings.`;
      } else {
        insightMessage += ` Great job managing your expenses!`;
      }
    }

    // Send response
    res.json({
      hasData: currentMonthExpenses.length > 0,
      currentMonth: now.toLocaleString('default', { month: 'long' }),
      lastMonth: lastMonthStart.toLocaleString('default', { month: 'long' }),
      currentTotal,
      lastTotal,
      difference,
      percentageChange,
      trendUp: difference > 0,
      topCategories,
      insightMessage
    });

  } catch (error) {
    console.error('Insights error:', error);
    res.status(500).json({ error: 'Failed to fetch insights' });
  }
}