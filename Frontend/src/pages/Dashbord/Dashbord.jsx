import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { Search, TrendingUp, Wallet, PiggyBank, AlertCircle, RefreshCw } from "lucide-react";

const COLORS = ["#2563EB", "#16A34A", "#DC2626", "#9333EA", "#F59E0B", "#06B6D4", "#EC4899"];

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ================= FETCH DATA (SAME URL AS BEFORE!) ================= */
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required. Please log in.");
      }

      // ✨ SAME URL - No changes!
      const response = await fetch("http://localhost:5000/expenses", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load dashboard");
      }

      const data = await response.json();
      
      // ✨ Use the pre-calculated dashboard data from backend
      setDashboardData(data.dashboard);
      
    } catch (err) {
      setError(err.message);
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        {/* HEADER */}
        <header className="space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Financial Overview</h1>
            <button
              onClick={fetchDashboard}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
          <p className="text-gray-600 max-w-3xl">
            Track your income, spending, and savings with detailed insights.
          </p>
        </header>

        {/* ERROR STATE */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900">Error Loading Data</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <button
                onClick={fetchDashboard}
                className="mt-3 text-sm text-red-700 underline hover:text-red-800"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* LOADING STATE */}
        {loading ? (
          <Skeleton />
        ) : !dashboardData ? (
          <EmptyState onRefresh={fetchDashboard} />
        ) : (
          <>
            {/* SUMMARY CARDS - No calculations needed! */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card
                icon={<Wallet className="w-5 h-5" />}
                title="Monthly Income"
                value={`₹${dashboardData.summary.income.toLocaleString('en-IN')}`}
                subtitle="Total income for this period"
                color="blue"
              />
              <Card
                icon={<TrendingUp className="w-5 h-5" />}
                title="Total Spending"
                value={`₹${dashboardData.summary.totalSpending.toLocaleString('en-IN')}`}
                subtitle={`${dashboardData.summary.budgetUtilization}% of budget used`}
                color="purple"
              />
              <Card
                icon={<PiggyBank className="w-5 h-5" />}
                title="Current Savings"
                value={`₹${dashboardData.summary.savings.toLocaleString('en-IN')}`}
                subtitle={`${dashboardData.summary.savingsRate}% savings rate`}
                color={dashboardData.summary.savings >= 0 ? "green" : "red"}
              />
              <Card
                icon={<TrendingUp className="w-5 h-5" />}
                title="Budget Status"
                value={`${dashboardData.summary.budgetUtilization}%`}
                subtitle={dashboardData.summary.totalSpending > dashboardData.summary.budget ? "Over budget" : "Within budget"}
                color={dashboardData.summary.totalSpending > dashboardData.summary.budget ? "red" : "green"}
              />
            </section>

            {/* CHARTS - Just display, no processing! */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartBox
                title="Budget Utilization"
                subtitle="Planned vs actual spending"
              >
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={dashboardData.budgetChart}>
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(v) => `₹${v.toLocaleString('en-IN')}`}
                      contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
                    />
                    <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                      {dashboardData.budgetChart.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartBox>

              <ChartBox
                title="Spending by Category"
                subtitle="Distribution across categories"
              >
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={dashboardData.categoryChart}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                    >
                      {dashboardData.categoryChart.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(v) => `₹${v.toLocaleString('en-IN')}`}
                      contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px" }} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </ChartBox>
            </section>

            {/* MONTHLY TREND */}
            {dashboardData.monthlyTrend.length > 0 && (
              <section>
                <ChartBox
                  title="Monthly Spending Trend"
                  subtitle="Track spending patterns over time"
                >
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={dashboardData.monthlyTrend}>
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        formatter={(v) => `₹${v.toLocaleString('en-IN')}`}
                        contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }}
                      />
                      <Line
                        dataKey="amount"
                        stroke={COLORS[0]}
                        strokeWidth={3}
                        dot={{ fill: COLORS[0], r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartBox>
              </section>
            )}

            {/* TOP CATEGORIES */}
            {dashboardData.topCategories.length > 0 && (
              <section>
                <ChartBox
                  title="Top Spending Categories"
                  subtitle="Your highest expense categories"
                >
                  <div className="space-y-4">
                    {dashboardData.topCategories.map((c, i) => (
                      <div key={c.name}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-700">
                            {i + 1}. {c.name}
                          </span>
                          <span className="text-gray-600">
                            ₹{c.value.toLocaleString('en-IN')} ({c.percentage}%)
                          </span>
                        </div>
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${c.percentage}%`,
                              backgroundColor: COLORS[i % COLORS.length],
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </ChartBox>
              </section>
            )}

            {/* TRANSACTIONS - Already formatted by backend! */}
            <section>
              <ChartBox
                title="Recent Transactions"
                subtitle={`Showing ${dashboardData.recentTransactions.length} of ${dashboardData.pagination.totalTransactions} transactions`}
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b-2 border-gray-200 bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {dashboardData.recentTransactions.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="py-8 text-center text-gray-500">
                            No transactions found
                          </td>
                        </tr>
                      ) : (
                        dashboardData.recentTransactions.map((txn) => (
                          <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4">
                              <span className="font-medium text-gray-900">
                                {txn.subCategory || txn.category}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right font-semibold text-gray-900">
                              {txn.formattedAmount}
                            </td>
                            <td className="py-3 px-4 text-right text-gray-600">
                              {txn.formattedDate}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </ChartBox>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

/* ================= UI COMPONENTS ================= */

function Card({ icon, title, value, subtitle, color = "blue" }) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className={`inline-flex p-2 rounded-lg ${colorClasses[color]} mb-3`}>
        {icon}
      </div>
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  );
}

function ChartBox({ title, subtitle, children }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80 bg-gray-200 rounded-xl" />
        <div className="h-80 bg-gray-200 rounded-xl" />
      </div>
      <div className="h-80 bg-gray-200 rounded-xl" />
    </div>
  );
}

function EmptyState({ onRefresh }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
      <div className="max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
          <Wallet className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">No Expenses Found</h3>
        <p className="text-gray-600">
          Start tracking your expenses to see your financial overview here.
        </p>
        <button
          onClick={onRefresh}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
}