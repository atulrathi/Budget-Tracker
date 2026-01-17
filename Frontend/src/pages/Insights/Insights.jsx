import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, AlertCircle, RefreshCw, Sparkles, PieChart, Calendar } from "lucide-react";
const api = "https://budget-tracker-ruby.vercel.app";
export default function Insights() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");

      const response = await fetch(`${api}/insights`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch insights");
      }

      const data = await response.json();
      setInsights(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Loading State with Skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl animate-shimmer bg-[length:200%_100%]"></div>
              <div className="h-8 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-shimmer bg-[length:200%_100%]"></div>
            </div>
            <div className="h-10 w-28 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl animate-shimmer bg-[length:200%_100%]"></div>
          </div>

          {/* Hero Card Skeleton */}
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 mb-6 overflow-hidden border border-gray-100">
            <div className="space-y-6">
              {/* Title */}
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]"></div>
                <div className="h-5 w-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]"></div>
              </div>

              {/* Two columns */}
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <div className="h-4 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] mb-3"></div>
                    <div className="h-10 w-40 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-shimmer bg-[length:200%_100%] mb-2"></div>
                    <div className="h-3 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]"></div>
                  </div>
                ))}
              </div>

              {/* Trend indicator */}
              <div className="flex items-center gap-3 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-12 h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl animate-shimmer bg-[length:200%_100%]"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]"></div>
                  <div className="h-4 w-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Categories Card Skeleton */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-5 h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]"></div>
              <div className="h-6 w-56 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]"></div>
            </div>

            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl animate-shimmer bg-[length:200%_100%]"></div>
                      <div className="space-y-2">
                        <div className="h-5 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]"></div>
                        <div className="h-4 w-40 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]"></div>
                      </div>
                    </div>
                    <div className="h-6 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]"></div>
                  </div>
                  <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-shimmer bg-[length:200%_100%]"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Insight Card Skeleton */}
          <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl animate-shimmer bg-[length:200%_100%]"></div>
              <div className="h-6 w-36 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]"></div>
            </div>
            <div className="space-y-3">
              <div className="h-5 w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]"></div>
              <div className="h-5 w-5/6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Insights
            </h1>
          </div>
          <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-12 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Insights</h2>
            <p className="text-gray-600 mb-8">{error}</p>
            <button
              onClick={fetchInsights}
              className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  if (!insights || !insights.hasData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Insights
            </h1>
          </div>
          <div className="bg-white rounded-2xl shadow-xl border-2 border-dashed border-gray-300 p-16 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <PieChart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No Data Yet</h2>
            <p className="text-gray-600 text-lg mb-2">Start tracking your expenses to unlock powerful insights</p>
            <p className="text-gray-500 text-sm">Add at least one expense to see your spending patterns</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 z-10">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Insights
            </h1>
          </div>
<button
  onClick={fetchInsights}
  className="group flex items-center gap-2 px-4 mr-[4rem] py-2 bg-white text-indigo-600 rounded-xl font-medium hover:bg-indigo-50 transition-all duration-200 shadow-md hover:shadow-lg border border-indigo-100"
>
  <RefreshCw className="w-4 h-4 group-hover:rotate-360 transition-all duration-1000 " />
</button>

        </div>

        {/* Month Comparison - Hero Card */}
        <div className="relative bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl shadow-2xl p-8 mb-6 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-white/80" />
              <h2 className="text-xl font-semibold text-white">Monthly Comparison</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Current Month */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
                <p className="text-white/70 text-sm font-medium mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                  {insights.currentMonth} 
                </p>
                <p className="text-4xl font-bold text-white mb-1">
                  {formatCurrency(insights.currentTotal)}
                </p>
                <p className="text-white/60 text-sm">Current spending</p>
              </div>

              {/* Last Month */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
                <p className="text-white/70 text-sm font-medium mb-2">
                  {insights.lastMonth} 
                </p>
                <p className="text-4xl font-bold text-white mb-1">
                  {formatCurrency(insights.lastTotal)}
                </p>
                <p className="text-white/60 text-sm">Previous spending</p>
              </div>
            </div>

            {/* Trend Indicator */}
            <div className={`flex items-center gap-3 p-5 rounded-2xl backdrop-blur-sm ${
              insights.trendUp
                ? "bg-red-500/20 border border-red-400/30"
                : "bg-emerald-500/20 border border-emerald-400/30"
            }`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                insights.trendUp ? "bg-red-500/30" : "bg-emerald-500/30"
              }`}>
                {insights.trendUp ? (
                  <TrendingUp className="w-6 h-6 text-white" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-white" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-bold text-white text-lg">
                  {insights.trendUp ? "↑" : "↓"} {formatCurrency(Math.abs(insights.difference))}
                </p>
                <p className="text-white/80 text-sm">
                  {insights.percentageChange}% {insights.trendUp ? "increase" : "decrease"} from last month
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Categories Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="w-5 h-5 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">Top Spending Categories</h2>
          </div>

          {insights.topCategories && insights.topCategories.length > 0 ? (
            <div className="space-y-6">
              {insights.topCategories.map(({ category, amount, percentage }, index) => {
                const colors = [
                  { bg: "from-red-500 to-pink-500", light: "bg-red-50", text: "text-red-700" },
                  { bg: "from-orange-500 to-amber-500", light: "bg-orange-50", text: "text-orange-700" },
                  { bg: "from-blue-500 to-indigo-500", light: "bg-blue-50", text: "text-blue-700" }
                ];
                const color = colors[index] || colors[0];

                return (
                  <div key={category} className="group">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${color.bg} rounded-xl flex items-center justify-center text-white font-bold shadow-lg`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-lg">{category}</p>
                          <p className="text-gray-500 text-sm">{percentage}% of total spending</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 text-xl">
                          {formatCurrency(amount)}
                        </p>
                      </div>
                    </div>
                    <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${color.bg} rounded-full transition-all duration-700 ease-out shadow-sm`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No categories to display</p>
          )}
        </div>

        {/* Smart Insight Card */}
        {insights.topCategories && insights.topCategories.length > 0 && (
          <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl shadow-lg p-8 border border-amber-200 overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-200 opacity-20 rounded-full -mr-20 -mt-20"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                  💡
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Smart Insight</h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                {insights.insightMessage ||
                  `Your highest spending category is ${
                    insights.topCategories[0].category
                  } at ${formatCurrency(insights.topCategories[0].amount)}.`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}