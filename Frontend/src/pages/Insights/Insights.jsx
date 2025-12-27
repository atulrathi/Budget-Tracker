export default function Insights({ expenses }) {
  // 🗓️ Simulated month data (later backend will handle this)
  const currentMonth = "August";
  const lastMonth = "July";

  // Split expenses by month (mock logic)
  const currentMonthExpenses = expenses.filter(
    e => e.month === "August" || !e.month
  );

  const lastMonthExpenses = [
    { amount: 3000, category: "Food" },
    { amount: 6000, category: "Rent" },
    { amount: 1500, category: "Travel" },
  ];

  // 💰 Total calculations
  const currentTotal = currentMonthExpenses.reduce(
    (sum, e) => sum + e.amount,
    0
  );

  const lastTotal = lastMonthExpenses.reduce(
    (sum, e) => sum + e.amount,
    0
  );

  // 📊 Category-wise breakdown
  const categoryMap = {};
  currentMonthExpenses.forEach(e => {
    categoryMap[e.category] =
      (categoryMap[e.category] || 0) + e.amount;
  });

  // 🔝 Top overspending categories
  const sortedCategories = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const difference = currentTotal - lastTotal;
  const trendUp = difference > 0;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Insights</h1>

      {/* Month Comparison */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-2">
          Month-to-Month Comparison
        </h2>

        <p className="text-gray-600">
          {currentMonth}: ₹ {currentTotal}
        </p>
        <p className="text-gray-600">
          {lastMonth}: ₹ {lastTotal}
        </p>

        <p
          className={`mt-2 font-semibold ${
            trendUp ? "text-red-500" : "text-green-600"
          }`}
        >
          {trendUp
            ? `You spent ₹${difference} more than last month`
            : `You saved ₹${Math.abs(difference)} compared to last month`}
        </p>
      </div>

      {/* Top Categories */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">
          Top Overspending Categories
        </h2>

        {sortedCategories.map(([category, amount]) => (
          <div key={category} className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span>{category}</span>
              <span>₹ {amount}</span>
            </div>

            <div className="w-full bg-gray-200 h-2 rounded">
              <div
                className="h-2 bg-red-500 rounded"
                style={{
                  width: `${(amount / currentTotal) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Summary Insight */}
      <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
        <h2 className="text-lg font-semibold mb-2">
          💡 Insight Summary
        </h2>
        <p className="text-sm text-gray-700">
          Your highest spending is on{" "}
          <strong>{sortedCategories[0]?.[0]}</strong>.  
          Consider reducing it to improve savings next month.
        </p>
      </div>
    </div>
  );
}
