import { useMemo } from "react";

export default function SmartInsights({ expenses }) {
  const insights = useMemo(() => {
    if (!expenses || expenses.length === 0) return [];

    const result = [];

    /* ================= TOTAL ================= */
    const total = expenses.reduce(
      (sum, e) => sum + Number(e.amount || 0),
      0
    );

    /* ================= DATE RANGE ================= */
    const dates = expenses.map(e => new Date(e.createdAt));
    const firstDate = new Date(Math.min(...dates));
    const lastDate = new Date(Math.max(...dates));

    const calendarDays =
      Math.ceil(
        (lastDate - firstDate) / (1000 * 60 * 60 * 24)
      ) + 1;

    /* ================= DAILY AVERAGES ================= */
    const spendingDays = new Set(
      expenses.map(e =>
        new Date(e.createdAt).toDateString()
      )
    ).size;

    const calendarDailyAvg = Math.round(
      total / Math.max(calendarDays, 1)
    );

    const activeDailyAvg = Math.round(
      total / Math.max(spendingDays, 1)
    );

    result.push({
      level: "info",
      title: "Daily Spending Overview",
      message: `You spend about ₹${calendarDailyAvg} per day on average across this period. On days you actually spend money, the average rises to ₹${activeDailyAvg}.`,
      suggestion:
        "Keeping an eye on non-spending days helps build stronger saving habits.",
    });

    /* ================= CATEGORY ANALYSIS ================= */
    const categoryTotals = {};
    expenses.forEach(e => {
      categoryTotals[e.category] =
        (categoryTotals[e.category] || 0) +
        Number(e.amount || 0);
    });

    const sortedCategories = Object.entries(categoryTotals).sort(
      (a, b) => b[1] - a[1]
    );

    if (sortedCategories.length > 0) {
      const [topCategory, topAmount] = sortedCategories[0];
      const percent = ((topAmount / total) * 100).toFixed(1);

      result.push({
        level: percent > 50 ? "warning" : "info",
        title: "Top Spending Category",
        message: `"${topCategory}" accounts for ${percent}% of your total expenses.`,
        suggestion:
          percent > 50
            ? "This category dominates your spending. Consider setting a limit or reviewing alternatives."
            : "Your category distribution looks reasonably balanced.",
      });
    }

    /* ================= RECENT TREND ================= */
    const now = Date.now();

    const last7Days = expenses.filter(
      e => new Date(e.createdAt) > new Date(now - 7 * 86400000)
    );

    const prev7Days = expenses.filter(
      e =>
        new Date(e.createdAt) <= new Date(now - 7 * 86400000) &&
        new Date(e.createdAt) > new Date(now - 14 * 86400000)
    );

    const last7Total = last7Days.reduce(
      (sum, e) => sum + Number(e.amount || 0),
      0
    );

    const prev7Total = prev7Days.reduce(
      (sum, e) => sum + Number(e.amount || 0),
      0
    );

    if (prev7Total > 0) {
      const changePercent = (
        ((last7Total - prev7Total) / prev7Total) *
        100
      ).toFixed(1);

      result.push({
        level:
          changePercent > 20
            ? "warning"
            : changePercent < -20
            ? "success"
            : "neutral",
        title: "Spending Trend",
        message:
          changePercent > 0
            ? `Your spending increased by ${changePercent}% compared to the previous week.`
            : `Good job! Your spending dropped by ${Math.abs(
                changePercent
              )}% compared to last week.`,
        suggestion:
          changePercent > 20
            ? "Review recent purchases to avoid budget drift."
            : "Maintaining this trend supports long-term savings.",
      });
    }

    /* ================= OVERSPENDING SIGNAL ================= */
    if (activeDailyAvg > calendarDailyAvg * 1.8) {
      result.push({
        level: "warning",
        title: "Spending Intensity Alert",
        message:
          "Your spending days are significantly heavier than your overall average.",
        suggestion:
          "Try spreading expenses more evenly to reduce financial pressure.",
      });
    }

    /* ================= POSITIVE REINFORCEMENT ================= */
    if (total < 5000 && expenses.length >= 5) {
      result.push({
        level: "success",
        title: "Healthy Financial Behavior",
        message:
          "Your overall spending is controlled and consistent.",
        suggestion:
          "Consistency like this builds long-term financial stability.",
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
        Personalized insights based on your real spending behavior.
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
