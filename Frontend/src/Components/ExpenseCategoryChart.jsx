import { useMemo } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Lightbulb,
  Brain
} from "lucide-react";

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
      message: `You spend about ₹${calendarDailyAvg.toLocaleString('en-IN')} per day on average across this period. On days you actually spend money, the average rises to ₹${activeDailyAvg.toLocaleString('en-IN')}.`,
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
        message: `"${topCategory}" accounts for ${percent}% of your total expenses (₹${topAmount.toLocaleString('en-IN')}).`,
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
            ? `Your spending increased by ${changePercent}% compared to the previous week (₹${last7Total.toLocaleString('en-IN')} vs ₹${prev7Total.toLocaleString('en-IN')}).`
            : `Good job! Your spending dropped by ${Math.abs(
                changePercent
              )}% compared to last week (₹${last7Total.toLocaleString('en-IN')} vs ₹${prev7Total.toLocaleString('en-IN')}).`,
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

  const getLevelConfig = (level) => {
    const configs = {
      warning: {
        gradient: "from-red-500 to-rose-600",
        bg: "from-red-50 to-rose-50",
        border: "border-red-200",
        icon: AlertTriangle,
        iconBg: "bg-red-100",
        iconColor: "text-red-600",
        textColor: "text-red-900",
      },
      success: {
        gradient: "from-emerald-500 to-green-600",
        bg: "from-emerald-50 to-green-50",
        border: "border-emerald-200",
        icon: CheckCircle,
        iconBg: "bg-emerald-100",
        iconColor: "text-emerald-600",
        textColor: "text-emerald-900",
      },
      info: {
        gradient: "from-blue-500 to-indigo-600",
        bg: "from-blue-50 to-indigo-50",
        border: "border-blue-200",
        icon: Info,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        textColor: "text-blue-900",
      },
      neutral: {
        gradient: "from-gray-500 to-slate-600",
        bg: "from-gray-50 to-slate-50",
        border: "border-gray-200",
        icon: TrendingUp,
        iconBg: "bg-gray-100",
        iconColor: "text-gray-600",
        textColor: "text-gray-900",
      },
    };
    return configs[level] || configs.neutral;
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-lg">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Smart Insights</h3>
          <p className="text-sm text-gray-600">
            AI-powered analysis of your spending behavior
          </p>
        </div>
      </div>

      {/* INSIGHTS LIST */}
      <div className="space-y-4">
        {insights.map((item, index) => {
          const config = getLevelConfig(item.level);
          const Icon = config.icon;

          return (
            <div
              key={index}
              className={`relative bg-gradient-to-br ${config.bg} border ${config.border} rounded-xl p-6 overflow-hidden group hover:shadow-md transition-all duration-300`}
            >
              {/* Decorative element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-30 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-300"></div>
              
              <div className="relative z-10">
                {/* Header with icon */}
                <div className="flex items-start gap-4 mb-3">
                  <div className={`w-10 h-10 ${config.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${config.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-bold text-base ${config.textColor} mb-2`}>
                      {item.title}
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                </div>

                {/* Suggestion */}
                <div className="flex items-start gap-3 mt-4 pt-4 border-t border-gray-200/50">
                  <Lightbulb className={`w-4 h-4 ${config.iconColor} flex-shrink-0 mt-0.5`} />
                  <p className="text-xs text-gray-600 font-medium leading-relaxed">
                    {item.suggestion}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER NOTE */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Insights are generated based on your spending patterns and updated in real-time
        </p>
      </div>
    </div>
  );
}