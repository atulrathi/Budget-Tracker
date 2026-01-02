import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { Plus, Wallet, TrendingUp, AlertTriangle, CheckCircle, Loader2, RefreshCw } from "lucide-react";

/* ============================
   CONSTANTS & CONFIG
============================ */
const API_URL = "http://localhost:5000/budgets";
const SKELETON_COUNT = 4;
const ANIMATION_DURATION = 300;

/* ============================
   API SERVICE LAYER
============================ */
class BudgetService {
  static getAuthHeader() {
    return {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
  }

  static async fetchBudgets() {
    const { data } = await axios.get(API_URL, {
      headers: this.getAuthHeader(),
    });
    return data || [];
  }

  static async createBudget(category, limit) {
    await axios.post(
      API_URL,
      { 
        category: category.trim().toLowerCase(), 
        limit: Number(limit) 
      },
      { headers: this.getAuthHeader() }
    );
  }

  static async deleteBudget(category) {
    await axios.delete(`${API_URL}/${category}`, {
      headers: this.getAuthHeader(),
    });
  }
}

/* ============================
   UTILITY FUNCTIONS
============================ */
const formatCurrency = (amount) => {
  return `₹${Number(amount).toLocaleString("en-IN")}`;
};

const getStatusConfig = (status) => {
  const configs = {
    exceeded: {
      color: "from-red-500 to-pink-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-700",
      icon: AlertTriangle,
      message: "Budget exceeded",
    },
    warning: {
      color: "from-amber-400 to-orange-500",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      textColor: "text-amber-700",
      icon: AlertTriangle,
      message: "Close to limit",
    },
    safe: {
      color: "from-emerald-500 to-green-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-700",
      icon: CheckCircle,
      message: (remaining) => `${formatCurrency(remaining)} remaining`,
    },
  };
  return configs[status] || configs.safe;
};

/* ============================
   CUSTOM HOOKS
============================ */
const useBudgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBudgets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await BudgetService.fetchBudgets();
      setBudgets(data);
    } catch (err) {
      console.error("Failed to fetch budgets:", err);
      setError(err.message || "Failed to load budgets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  return { budgets, loading, error, refetch: fetchBudgets };
};

const useBudgetForm = (onSuccess) => {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const reset = useCallback(() => {
    setCategory("");
    setLimit("");
    setError(null);
  }, []);

  const open = useCallback(() => setIsOpen(true), []);
  
  const close = useCallback(() => {
    setIsOpen(false);
    reset();
  }, [reset]);

  const submit = useCallback(async (e) => {
    if (e) e.preventDefault();
    
    if (!category.trim() || !limit) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await BudgetService.createBudget(category, limit);
      close();
      onSuccess?.();
    } catch (err) {
      console.error("Failed to create budget:", err);
      setError(err.response?.data?.message || "Failed to create budget");
    } finally {
      setSubmitting(false);
    }
  }, [category, limit, close, onSuccess]);

  return {
    isOpen,
    category,
    setCategory,
    limit,
    setLimit,
    submitting,
    error,
    open,
    onClose: close,
    onSubmit: submit,
  };
};

/* ============================
   PRESENTATIONAL COMPONENTS
============================ */
const SkeletonCard = () => (
  <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4 animate-pulse shadow-sm">
    <div className="flex justify-between items-start">
      <div className="space-y-2 flex-1">
        <div className="h-5 bg-gray-200 rounded w-1/3" />
        <div className="h-3 bg-gray-200 rounded w-1/4" />
      </div>
      <div className="h-8 w-8 bg-gray-200 rounded-lg" />
    </div>
    <div className="h-3 bg-gray-200 rounded-full w-full" />
    <div className="h-3 bg-gray-200 rounded w-2/5" />
  </div>
);

const SkeletonChart = () => (
  <div className="bg-white border border-gray-100 rounded-2xl p-8 animate-pulse shadow-sm">
    <div className="h-6 bg-gray-200 rounded w-1/3 mb-6" />
    <div className="space-y-6">
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <div key={i} className="h-12 bg-gray-200 rounded-lg" />
      ))}
    </div>
  </div>
);

const EmptyState = ({ icon: Icon, message }) => (
  <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center">
    {Icon && (
      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
        <Icon className="w-10 h-10 text-gray-400" />
      </div>
    )}
    <p className="text-gray-600 font-medium">{message}</p>
  </div>
);

/* ============================
   BUDGET CARD COMPONENT
============================ */
const BudgetCard = ({ budget }) => {
  const { category, spent = 0, limit, percentage = 0, status, remaining } = budget;
  const config = getStatusConfig(status);
  const StatusIcon = config.icon;

  return (
    <div className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="capitalize font-bold text-gray-900 text-lg mb-1">{category}</h3>
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-700">{formatCurrency(spent)}</span> of {formatCurrency(limit)}
          </p>
        </div>
        <div className={`w-12 h-12 rounded-xl ${config.bgColor} ${config.borderColor} border flex items-center justify-center`}>
          <StatusIcon className={`w-6 h-6 ${config.textColor}`} />
        </div>
      </div>

      <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
        <div
          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${config.color} rounded-full transition-all shadow-sm`}
          style={{ 
            width: `${Math.min(percentage, 100)}%`,
            transitionDuration: `${ANIMATION_DURATION}ms`
          }}
        />
      </div>

      <div className="flex justify-between items-center">
        <p className={`text-sm font-medium ${config.textColor}`}>
          {typeof config.message === 'function' 
            ? config.message(remaining) 
            : config.message}
        </p>
        <span className="text-xs font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded-lg">
          {percentage.toFixed(0)}%
        </span>
      </div>
    </div>
  );
};

/* ============================
   BUDGET MODAL COMPONENT
============================ */
const BudgetModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  category, 
  setCategory, 
  limit, 
  setLimit,
  submitting,
  error 
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-2xl text-gray-900">Create Budget</h3>
            <p className="text-sm text-gray-500">Set spending limits for categories</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category Name
            </label>
            <input
              placeholder="e.g., Food, Transport, Entertainment"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={submitting}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Budget Limit (₹)
            </label>
            <input
              type="number"
              placeholder="Enter amount"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              disabled={submitting}
              min="1"
              step="1"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 px-4 py-3 text-sm text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 font-semibold transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSubmit}
              disabled={!category.trim() || !limit || submitting}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all font-semibold shadow-lg hover:shadow-xl"
            >
              {submitting ? "Creating..." : "Create Budget"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================
   BUDGET CHART COMPONENT
============================ */
const BudgetChart = ({ data }) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
        <TrendingUp className="w-5 h-5 text-white" />
      </div>
      <div>
        <h2 className="font-bold text-xl text-gray-900">
          Spending Distribution
        </h2>
        <p className="text-sm text-gray-500">
          Visual breakdown of your budgets
        </p>
      </div>
    </div>

    <div className="h-[420px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          barCategoryGap={18}
          margin={{ left: 0, right: 20, top: 10, bottom: 10 }}
        >
          <XAxis type="number" hide />
          <YAxis
            dataKey="category"
            type="category"
            width={120}
            axisLine={false}
            tickLine={false}
            style={{ fontSize: '14px', textTransform: 'capitalize', fontWeight: 600 }}
          />
          <Tooltip 
            formatter={(v) => formatCurrency(v)}
            contentStyle={{ 
              borderRadius: '12px', 
              border: '1px solid #e5e7eb',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
            }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />

          <Bar
            dataKey="Spent"
            stackId="a"
            fill="#DC2626"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="Remaining"
            stackId="a"
            fill="#22C55E"
            radius={[0, 8, 8, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

/* ============================
   MAIN CONTAINER COMPONENT
============================ */
export default function Budgets() {
  const { budgets, loading, error, refetch } = useBudgets();
  const modalProps = useBudgetForm(refetch);

  const chartData = useMemo(
    () =>
      budgets.map((b) => ({
        category: b.category,
        Spent: b.spent || 0,
        Remaining: Math.max(b.limit - (b.spent || 0), 0),
      })),
    [budgets]
  );

  const hasBudgets = budgets.length > 0;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Budgets
            </h1>
          </div>
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium">Loading budgets...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-12 text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-red-700 font-bold text-xl mb-2">Failed to load budgets</p>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={refetch}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 font-semibold shadow-lg transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Wallet className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Budgets
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Track spending against your planned limits
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={refetch}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-all shadow-md hover:shadow-lg border border-blue-100"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={modalProps.open}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all font-semibold shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Create Budget
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* BUDGET CARDS */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="font-bold text-xl text-gray-900">
                Category Budgets
              </h2>
              {hasBudgets && (
                <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">
                  {budgets.length}
                </span>
              )}
            </div>

            {loading ? (
              Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <SkeletonCard key={i} />
              ))
            ) : hasBudgets ? (
              budgets.map((b) => <BudgetCard key={b.category} budget={b} />)
            ) : (
              <EmptyState
                icon={Wallet}
                message="No budgets yet. Create your first budget to start tracking."
              />
            )}
          </div>

          {/* CHART */}
          {loading ? (
            <SkeletonChart />
          ) : hasBudgets ? (
            <BudgetChart data={chartData} />
          ) : (
            <EmptyState 
              icon={TrendingUp}
              message="Chart will appear once you add budgets"
            />
          )}
        </div>

        {/* MODAL */}
        <BudgetModal {...modalProps} />
      </div>
    </div>
  );
}