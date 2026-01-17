import { useCallback, useEffect, useState } from "react";
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
  BarChart3,
  Activity
} from "lucide-react";
import { useContext } from "react";
import {UserContext} from "../../usecontext/usercontext";
import Userbudget from "../../Components/monthelytarget";
const api = "https://budget-tracker-s0vs.onrender.com";

const COLORS = ["#6366F1", "#10B981", "#EF4444", "#8B5CF6", "#F59E0B", "#06B6D4", "#EC4899"];

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userContext = useContext(UserContext);
  const [userincome, setuserincome] = useState();

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication required. Please log in.");
      }

      const response = await fetch(`${api}/expenses`, {
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
      setuserincome(!userContext.income?window.location.reload():userContext.income);
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

  const setBudget = useCallback((data)=>{
    setDashboardData(data.dashboard)
  },[fetchDashboard]);

  // Loading State with Skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-8 w-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-shimmer bg-[length:200%_100%]"></div>
              <div className="h-4 w-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]"></div>
            </div>
            <div className="h-10 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl animate-shimmer bg-[length:200%_100%]"></div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>

          {/* Charts Row 1 Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartBoxSkeleton height="h-80" />
            <ChartBoxSkeleton height="h-80" />
          </div>

          {/* Monthly Trend Skeleton */}
          <ChartBoxSkeleton height="h-96" />

          {/* Bottom Section Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartBoxSkeleton height="h-96" />
            <ChartBoxSkeleton height="h-96" />
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Unable to Load Dashboard</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={fetchDashboard}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty State
  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">No Data Yet</h2>
          <p className="text-gray-600">Start tracking your expenses to see your financial overview</p>
          <button
            onClick={fetchDashboard}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh Data
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-blue-600" />
              Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Your complete financial overview</p>
          </div>
          <button
            onClick={fetchDashboard}
            className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4 group-hover:rotate-360 transition-all duration-1000 " />
            Refresh
          </button>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {userincome&&<StatCard
            icon={<Wallet className="w-6 h-6" />}
            title="Monthly Income"
            value={`₹${userincome}`}
            subtitle="Total income"
            gradient="from-blue-500 to-cyan-600"
            bgGradient="from-blue-50 to-cyan-50"
          />}
          <StatCard
            icon={<Activity className="w-6 h-6" />}
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
            icon={<TrendingUp className="w-6 h-6" />}
            title="Budget Status"
            value={`${dashboardData.summary.budgetUtilization}%`}
            subtitle={dashboardData.summary.totalSpending > dashboardData.summary.budget ? "Over budget" : "Within budget"}
            gradient={dashboardData.summary.totalSpending > dashboardData.summary.budget ? "from-orange-500 to-red-600" : "from-emerald-500 to-teal-600"}
            bgGradient={dashboardData.summary.totalSpending > dashboardData.summary.budget ? "from-orange-50 to-red-50" : "from-emerald-50 to-teal-50"}
          />
        </div>

{/* CHARTS ROW 1 */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {userContext.Budget?<ChartBox
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
          </ChartBox>:<Userbudget budget={setBudget} />}

  <ChartBox title="Category Breakdown" subtitle="Spending by category" icon={<Activity className="w-5 h-5" />}>
    <div className="overflow-visible">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={dashboardData.categoryChart}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            label={(entry) => entry.name}
          >
            {/* FIX: Changed from budgetChart to categoryChart */}
            {dashboardData.categoryChart.map((_, i) => (
              <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
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
        </PieChart>
      </ResponsiveContainer>
    </div>
  </ChartBox>
</div>

        {/* MONTHLY TREND */}
        {dashboardData.monthlyTrend.length > 0 && (
          <ChartBox title="Monthly Trend" subtitle="Last 6 months" icon={<TrendingUp className="w-5 h-5" />}>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={dashboardData.monthlyTrend}>
                <XAxis dataKey="month" stroke="#64748B" style={{ fontSize: '12px' }} />
                <YAxis stroke="#64748B" style={{ fontSize: '12px' }} tickFormatter={(v) => `₹${v.toLocaleString('en-IN')}`} />
                <Tooltip
                  formatter={(v) => `₹${v.toLocaleString('en-IN')}`}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                  }}
                />
                <Line type="monotone" dataKey="amount" stroke="#6366F1" strokeWidth={3} dot={{ fill: '#6366F1', r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartBox>
        )}

        {/* TOP CATEGORIES */}
        {dashboardData.topCategories.length > 0 && (
          <ChartBox title="Top Spending Categories" subtitle="Your biggest expenses" icon={<BarChart3 className="w-5 h-5" />}>
            <div className="space-y-4">
              {dashboardData.topCategories.map((c, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-gray-900">{c.name}</span>
                      <span className="font-bold text-gray-900">₹{c.value.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${c.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">{c.percentage}% of total</span>
                  </div>
                </div>
              ))}
            </div>
          </ChartBox>
        )}

        {/* TRANSACTIONS */}
        <ChartBox title="Recent Transactions" subtitle="Latest expenses" icon={<Activity className="w-5 h-5" />}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Category</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Amount</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-8 text-gray-500">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  dashboardData.recentTransactions.map((txn) => (
                    <tr key={txn._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-sm text-gray-900">{txn.subCategory || txn.category}</td>
                      <td className="py-3 px-4 text-sm font-semibold text-gray-900 text-right">{txn.formattedAmount}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 text-right">{txn.formattedDate}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </ChartBox>
      </div>
    </div>
  );
}

/* ================= UI COMPONENTS ================= */
function StatCard({ icon, title, value, subtitle, gradient, bgGradient, trend }) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${bgGradient} rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border border-white/50`}>
      {/* Decorative circle */}
      <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/30 rounded-full blur-2xl"></div>
      
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-4 shadow-lg relative z-10`}>
        {icon}
      </div>

      {trend && (
        <div className="absolute top-6 right-6">
          {trend === 'up' ? <ArrowUpRight className="w-5 h-5 text-red-500" /> : <ArrowDownRight className="w-5 h-5 text-green-500" />}
        </div>
      )}

      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  );
}

function ChartBox({ title, subtitle, icon, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

/* ================= SKELETON COMPONENTS ================= */
function StatCardSkeleton() {
  return (
    <div className="relative overflow-hidden bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="absolute -right-6 -top-6 w-32 h-32 bg-gray-100 rounded-full blur-2xl"></div>
      
      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 mb-4 animate-shimmer bg-[length:200%_100%]"></div>

      <div className="space-y-2">
        <div className="h-4 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]"></div>
        <div className="h-8 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]"></div>
        <div className="h-3 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]"></div>
      </div>
    </div>
  );
}

function ChartBoxSkeleton({ height = "h-80" }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer bg-[length:200%_100%]"></div>
        <div className="flex-1 space-y-2">
          <div className="h-5 w-40 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]"></div>
          <div className="h-3 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]"></div>
        </div>
      </div>
      <div className={`${height} bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl animate-shimmer bg-[length:200%_100%]`}></div>
    </div>
  );
}