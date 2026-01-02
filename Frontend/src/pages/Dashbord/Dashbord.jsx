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
import { 
  TrendingUp, 
  Wallet, 
  PiggyBank, 
  AlertCircle, 
  RefreshCw, 
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  BarChart3,
  Activity
} from "lucide-react";

const COLORS = ["#6366F1", "#10B981", "#EF4444", "#8B5CF6", "#F59E0B", "#06B6D4", "#EC4899"];

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required. Please log in.");
      }

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

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full blur-xl opacity-30 animate-pulse"></div>
              </div>
              <p className="text-gray-600 text-lg font-medium">Loading your financial overview...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>
          <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-12 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Dashboard</h2>
            <p className="text-gray-600 mb-8">{error}</p>
            <button
              onClick={fetchDashboard}
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
  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>
          <div className="bg-white rounded-2xl shadow-xl border-2 border-dashed border-gray-300 p-16 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Wallet className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No Data Yet</h2>
            <p className="text-gray-600 text-lg mb-2">Start tracking your expenses to see your financial overview</p>
            <button
              onClick={fetchDashboard}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-violet-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-violet-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Your complete financial overview
              </p>
            </div>
          </div>
          
          <button
            onClick={fetchDashboard}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-violet-600 rounded-xl font-medium hover:bg-violet-50 transition-all shadow-md hover:shadow-lg border border-violet-100 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </header>

        {/* SUMMARY CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<Wallet className="w-6 h-6" />}
            title="Monthly Income"
            value={`₹${dashboardData.summary.income.toLocaleString('en-IN')}`}
            subtitle="Total income"
            gradient="from-blue-500 to-cyan-600"
            bgGradient="from-blue-50 to-cyan-50"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Total Spending"
            value={`₹${dashboardData.summary.totalSpending.toLocaleString('en-IN')}`}
            subtitle={`${dashboardData.summary.budgetUtilization}% of budget`}
            gradient="from-purple-500 to-pink-600"
            bgGradient="from-purple-50 to-pink-50"
            trend={dashboardData.summary.totalSpending > dashboardData.summary.budget ? 'up' : 'down'}
          />
          <StatCard
            icon={<PiggyBank className="w-6 h-6" />}
            title="Current Savings"
            value={`₹${dashboardData.summary.savings.toLocaleString('en-IN')}`}
            subtitle={`${dashboardData.summary.savingsRate}% savings rate`}
            gradient={dashboardData.summary.savings >= 0 ? "from-emerald-500 to-green-600" : "from-red-500 to-rose-600"}
            bgGradient={dashboardData.summary.savings >= 0 ? "from-emerald-50 to-green-50" : "from-red-50 to-rose-50"}
            trend={dashboardData.summary.savings >= 0 ? 'up' : 'down'}
          />
          <StatCard
            icon={<Activity className="w-6 h-6" />}
            title="Budget Status"
            value={`${dashboardData.summary.budgetUtilization}%`}
            subtitle={dashboardData.summary.totalSpending > dashboardData.summary.budget ? "Over budget" : "Within budget"}
            gradient={dashboardData.summary.totalSpending > dashboardData.summary.budget ? "from-orange-500 to-red-600" : "from-emerald-500 to-teal-600"}
            bgGradient={dashboardData.summary.totalSpending > dashboardData.summary.budget ? "from-orange-50 to-red-50" : "from-emerald-50 to-teal-50"}
          />
        </section>

        {/* CHARTS ROW 1 */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartBox
            title="Budget Utilization"
            subtitle="Planned vs actual spending"
            icon={<BarChart3 className="w-5 h-5" />}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.budgetChart}>
                <XAxis 
                  dataKey="label" 
                  tick={{ fontSize: 12, fill: '#6B7280' }} 
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#6B7280' }} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  formatter={(v) => `₹${v.toLocaleString('en-IN')}`}
                  contentStyle={{ 
                    borderRadius: "12px", 
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                  }}
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
            icon={<Activity className="w-5 h-5" />}
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardData.categoryChart}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={3}
                >
                  {dashboardData.categoryChart.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(v) => `₹${v.toLocaleString('en-IN')}`}
                  contentStyle={{ 
                    borderRadius: "12px", 
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: "12px", fontWeight: 600 }} 
                  iconType="circle" 
                />
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
              icon={<TrendingUp className="w-5 h-5" />}
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dashboardData.monthlyTrend}>
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    formatter={(v) => `₹${v.toLocaleString('en-IN')}`}
                    contentStyle={{ 
                      borderRadius: "12px", 
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                    }}
                  />
                  <Line
                    dataKey="amount"
                    stroke={COLORS[0]}
                    strokeWidth={3}
                    dot={{ fill: COLORS[0], r: 5, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 7, strokeWidth: 2 }}
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
              icon={<BarChart3 className="w-5 h-5" />}
            >
              <div className="space-y-5">
                {dashboardData.topCategories.map((c, i) => (
                  <div key={c.name} className="group">
                    <div className="flex justify-between items-baseline mb-2">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm"
                          style={{ backgroundColor: COLORS[i % COLORS.length] }}
                        >
                          {i + 1}
                        </div>
                        <span className="font-bold text-gray-900 text-lg capitalize">
                          {c.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 text-lg">
                          ₹{c.value.toLocaleString('en-IN')}
                        </p>
                        <p className="text-xs text-gray-500 font-semibold">
                          {c.percentage}% of total
                        </p>
                      </div>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
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

        {/* TRANSACTIONS */}
        <section>
          <ChartBox
            title="Recent Transactions"
            subtitle={`Showing ${dashboardData.recentTransactions.length} of ${dashboardData.pagination.totalTransactions} transactions`}
            icon={<Activity className="w-5 h-5" />}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="text-left py-4 px-4 font-bold text-gray-700">Category</th>
                    <th className="text-right py-4 px-4 font-bold text-gray-700">Amount</th>
                    <th className="text-right py-4 px-4 font-bold text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {dashboardData.recentTransactions.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="py-12 text-center">
                        <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">No transactions found</p>
                      </td>
                    </tr>
                  ) : (
                    dashboardData.recentTransactions.map((txn) => (
                      <tr key={txn.id} className="hover:bg-gradient-to-r hover:from-violet-50 hover:to-indigo-50 transition-all">
                        <td className="py-4 px-4">
                          <span className="font-semibold text-gray-900 capitalize">
                            {txn.subCategory || txn.category}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right font-bold text-gray-900">
                          {txn.formattedAmount}
                        </td>
                        <td className="py-4 px-4 text-right text-gray-600 font-medium">
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
      </div>
    </div>
  );
}

/* ================= UI COMPONENTS ================= */

function StatCard({ icon, title, value, subtitle, gradient, bgGradient, trend }) {
  return (
    <div className={`relative bg-gradient-to-br ${bgGradient} border border-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1`}>
      {/* Decorative circle */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-20 rounded-full group-hover:scale-110 transition-transform duration-300"></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg`}>
            {icon}
          </div>
          {trend && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
              trend === 'up' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
            }`}>
              {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            </div>
          )}
        </div>
        
        <p className="text-sm font-semibold text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
        <p className="text-xs font-medium text-gray-600">{subtitle}</p>
      </div>
    </div>
  );
}

function ChartBox({ title, subtitle, icon, children }) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-3 mb-6">
        {icon && (
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center text-white">
            {icon}
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}