import { useMemo } from "react";

export default function SmartInsights({ expenses }) {
  const insights = useMemo(() => {
    if (!expenses || expenses.length === 0) return [];

    const result = [];
    const total = expenses.reduce(
      (sum, e) => sum + Number(e.amount || 0),
      0
    );

    /* ================= CATEGORY ANALYSIS ================= */
    const categoryTotals = {};
    expenses.forEach((e) => {
      categoryTotals[e.category] =
        (categoryTotals[e.category] || 0) +
        Number(e.amount || 0);
    });

    const sortedCategories = Object.entries(
      categoryTotals
    ).sort((a, b) => b[1] - a[1]);

    if (sortedCategories.length > 0) {
      const [topCategory, topAmount] =
        sortedCategories[0];
      const percentage = (
        (topAmount / total) *
        100
      ).toFixed(1);

      result.push({
        level: "info",
        title: "Top Spending Area",
        message: `Most of your spending is concentrated in "${topCategory}", which accounts for ${percentage}% of your total expenses.`,
        suggestion:
          "If this category is flexible, consider setting a monthly limit to stay in control.",
      });
    }

    /* ================= DAILY SPENDING ================= */
    const uniqueDays = new Set(
      expenses.map((e) =>
        new Date(e.createdAt).toDateString()
      )
    ).size;

    const dailyAverage = Math.round(
      total / Math.max(uniqueDays, 1)
    );

    result.push({
      level: "neutral",
      title: "Daily Spending Pattern",
      message: `On average, you spend around ₹${dailyAverage} per day.`,
      suggestion:
        "Tracking daily averages helps you avoid unplanned overspending.",
    });

    /* ================= RECENT ACTIVITY ================= */
    const last7DaysExpenses = expenses.filter(
      (e) =>
        new Date(e.createdAt) >
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );

    const last7Total = last7DaysExpenses.reduce(
      (sum, e) => sum + Number(e.amount || 0),
      0
    );

    if (last7Total > dailyAverage * 7 * 1.25) {
      result.push({
        level: "warning",
        title: "Recent Spending Increase",
        message:
          "Your spending over the last 7 days is higher than your usual daily pattern.",
        suggestion:
          "Review recent transactions to identify any unnecessary or impulsive expenses.",
      });
    }

    /* ================= HEALTH CHECK ================= */
    if (total < 5000 && expenses.length >= 5) {
      result.push({
        level: "success",
        title: "Healthy Spending Behavior",
        message:
          "Your overall spending is currently well balanced and under control.",
        suggestion:
          "Maintaining this consistency will help you reach your financial goals faster.",
      });
    }

    return result;
  }, [expenses]);

  if (insights.length === 0) return null;

  return (
    <div className="bg-white border rounded-xl p-5 space-y-4">
      <h3 className="text-sm font-semibold text-gray-900">
        Smart Insights
      </h3>
      <p className="text-xs text-gray-500">
        Personalized observations based on your recent
        spending activity.
      </p>

      <ul className="space-y-3">
        {insights.map((item, index) => (
          <li
            key={index}
            className={`p-4 rounded-lg border-l-4 ${
              item.level === "warning"
                ? "bg-red-50 border-red-500"
                : item.level === "success"
                ? "bg-green-50 border-green-500"
                : item.level === "info"
                ? "bg-blue-50 border-blue-500"
                : "bg-gray-50 border-gray-400"
            }`}
          >
            <p className="text-sm font-semibold text-gray-800">
              {item.title}
            </p>
            <p className="text-sm text-gray-700 mt-1">
              {item.message}
            </p>
            <p className="text-xs text-gray-600 mt-2">
              💡 {item.suggestion}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
