import { useEffect, useState, useMemo } from "react";
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
   API CONFIG
============================ */
const API_URL = "http://localhost:5000/budgets";

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export default function Budgets() {
  /* ============================
     STATE
  ============================ */
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");

  /* ============================
     FETCH BUDGETS
  ============================ */
  const fetchBudgets = async () => {
    try {
      const { data } = await axios.get(API_URL, {
        headers: getAuthHeader(),
      });
      setBudgets(data || []);
    } catch (error) {
      console.error("Failed to load budgets", error);
      setBudgets([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  /* ============================
     ADD BUDGET
  ============================ */
  const handleAddBudget = async () => {
    if (!category.trim() || !limit) return;

    try {
      await axios.post(
        API_URL,
        {
          category: category.toLowerCase().trim(),
          limit: Number(limit),
        },
        { headers: getAuthHeader() }
      );

      await fetchBudgets();
      closeModal();
    } catch (error) {
      console.error("Failed to add budget", error);
    }
  };

  const closeModal = () => {
    setCategory("");
    setLimit("");
    setIsModalOpen(false);
  };

  /* ============================
     CHART DATA (MEMOIZED)
  ============================ */
  const chartData = useMemo(
    () =>
      budgets.map((b) => ({
        category: b.category,
        Budget: b.limit || 0,
        Spent: b.spent || 0,
      })),
    [budgets]
  );

  /* ============================
     LOADING STATE
  ============================ */
  if (isLoading) {
    return (
      <p className="text-sm text-gray-500">
        Loading your budgets, please wait…
      </p>
    );
  }

  return (
    <section className="space-y-6">
      {/* ================= HEADER ================= */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Budget Overview</h1>
          <p className="text-sm text-gray-500">
            Monitor category-wise limits and track overspending
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Budget
        </button>
      </header>

      {/* ================= BUDGET LIST ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
        {budgets.length === 0 && (
          <p className="text-sm text-gray-500">
            No budgets created yet. Start by adding one.
          </p>
        )}

        {budgets.map((b) => {
          const spent = b.spent || 0;
          const remaining = b.remaining ?? b.limit;
          const percent = b.percentage || 0;

          const statusColor =
            b.status === "exceeded"
              ? "bg-red-500"
              : b.status === "warning"
              ? "bg-yellow-400"
              : "bg-green-500";

          return (
            <div
              key={b.category}
              className="bg-white border rounded-lg p-4"
            >
              <div className="flex justify-between mb-1">
                <h3 className="font-medium capitalize">
                  {b.category}
                </h3>
                <span className="text-xs text-gray-500">
                  ₹ {spent} / ₹ {b.limit}
                </span>
              </div>

              <div className="w-full h-2 bg-gray-200 rounded">
                <div
                  className={`h-2 rounded ${statusColor}`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              <p className="mt-1 text-xs text-gray-600">
                {b.status === "exceeded"
                  ? "Budget limit exceeded"
                  : b.status === "warning"
                  ? "Approaching budget limit"
                  : `Remaining ₹ ${remaining}`}
              </p>
            </div>
          );
        })}
      </div>

      {/* ================= CHART ================= */}
      {budgets.length > 0 && (
        <div className="bg-white border rounded-lg p-4 max-w-4xl">
          <h2 className="font-medium mb-3">
            Budget vs Actual Spending
          </h2>

          <div className="h-[300px]">
            <ResponsiveContainer>
              <BarChart data={chartData} layout="vertical" barGap={10}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="category" width={100} />
                <Tooltip formatter={(v) => `₹ ${v}`} />
                <Legend />
                <Bar dataKey="Budget" fill="#2563EB" radius={[0, 6, 6, 0]} />
                <Bar dataKey="Spent" fill="#DC2626" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ================= MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-5 w-80 space-y-4">
            <h3 className="font-medium">Create Budget</h3>

            <input
              type="text"
              placeholder="Category name"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
            />

            <input
              type="number"
              placeholder="Monthly limit (₹)"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={closeModal}
                className="text-sm text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBudget}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded"
              >
                Save Budget
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
