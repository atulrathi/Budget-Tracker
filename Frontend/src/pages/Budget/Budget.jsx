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

/* ============================
   CONSTANTS & CONFIG
============================ */
const API_URL ="http://localhost:5000/budgets";
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
      color: "bg-red-500",
      textColor: "text-red-600",
      message: "Budget exceeded",
    },
    warning: {
      color: "bg-yellow-400",
      textColor: "text-yellow-600",
      message: "Close to limit",
    },
    safe: {
      color: "bg-green-500",
      textColor: "text-green-600",
      message: (remaining) => `Remaining ${formatCurrency(remaining)}`,
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

  const submit = useCallback(async () => {
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

  // ✅ FIX: Return with correct prop names for BudgetModal
  return {
    isOpen,
    category,
    setCategory,
    limit,
    setLimit,
    submitting,
    error,
    open,
    onClose: close,    // ← Map 'close' to 'onClose'
    onSubmit: submit,  // ← Map 'submit' to 'onSubmit'
  };
};

/* ============================
   PRESENTATIONAL COMPONENTS
============================ */
const SkeletonCard = () => (
  <div className="bg-white border rounded-xl p-5 space-y-3 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-1/3" />
    <div className="h-2 bg-gray-200 rounded w-full" />
    <div className="h-3 bg-gray-200 rounded w-1/4" />
  </div>
);

const SkeletonChart = () => (
  <div className="bg-white border rounded-xl p-6 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
    <div className="space-y-4">
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <div key={i} className="h-6 bg-gray-200 rounded" />
      ))}
    </div>
  </div>
);

const EmptyState = ({ icon: Icon, message }) => (
  <div className="bg-white border rounded-xl p-8 text-center">
    {Icon && <Icon className="w-16 h-16 text-gray-300 mx-auto mb-4" />}
    <p className="text-gray-500 text-sm">{message}</p>
  </div>
);

const MoneyIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

/* ============================
   BUDGET CARD COMPONENT
============================ */
const BudgetCard = ({ budget }) => {
  const { category, spent = 0, limit, percentage = 0, status, remaining } = budget;
  const config = getStatusConfig(status);

  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="capitalize font-medium text-gray-900">{category}</h3>
        <span className="text-xs text-gray-500 font-medium">
          {formatCurrency(spent)} / {formatCurrency(limit)}
        </span>
      </div>

      <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${config.color}`}
          style={{ 
            width: `${Math.min(percentage, 100)}%`,
            transitionDuration: `${ANIMATION_DURATION}ms`
          }}
        />
      </div>

      <p className={`mt-2 text-xs ${config.textColor}`}>
        {typeof config.message === 'function' 
          ? config.message(remaining) 
          : config.message}
      </p>
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 w-full max-w-md space-y-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-semibold text-lg text-gray-900">Create Budget</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              placeholder="e.g., Food, Transport, Entertainment"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={submitting}
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Budget Limit (₹)
            </label>
            <input
              type="number"
              placeholder="Enter amount"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              disabled={submitting}
              min="1"
              step="1"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!category.trim() || !limit || submitting}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {submitting ? "Saving..." : "Save Budget"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ============================
   BUDGET CHART COMPONENT
============================ */
const BudgetChart = ({ data }) => (
  <div className="bg-white border rounded-xl p-6 shadow-sm">
    <h2 className="font-semibold text-lg text-gray-900 mb-1">
      Spending Distribution
    </h2>
    <p className="text-sm text-gray-500 mb-4">
      Spent vs remaining budget per category
    </p>

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
            style={{ fontSize: '14px', textTransform: 'capitalize' }}
          />
          <Tooltip 
            formatter={(v) => formatCurrency(v)}
            contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
          />
          <Legend />

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

  // Error state
  if (error && !loading) {
    return (
      <section className="space-y-8 max-w-7xl mx-auto px-4 py-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 font-medium mb-2">Failed to load budgets</p>
          <p className="text-sm text-red-500 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8 max-w-7xl mx-auto px-4 py-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Budgets</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track spending against your planned limits
          </p>
        </div>

        <button
          onClick={modalProps.open}
          className="px-5 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md"
        >
          + Create Budget
        </button>
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* BUDGET CARDS */}
        <div className="space-y-4">
          <h2 className="font-semibold text-lg text-gray-900">
            Category Budgets
          </h2>

          {loading ? (
            Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          ) : hasBudgets ? (
            budgets.map((b) => <BudgetCard key={b.category} budget={b} />)
          ) : (
            <EmptyState
              icon={MoneyIcon}
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
            message="Chart will appear once you add budgets"
          />
        )}
      </div>

      {/* MODAL */}
      <BudgetModal {...modalProps} />
    </section>
  );
}