import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";

import ExpenseForm from "../../Components/ExpenseForm";
import ExpenseList from "../../Components/ExpenseList";
import ExpenseCategoryBarChart from "../../Components/ExpenseCategoryChart";

const LIST_LIMIT = 6;
const API_BASE_URL = "http://localhost:5000";

// Centralized API helper
const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// Skeleton Components
const SkeletonKPI = () => (
  <div className="flex items-center justify-between bg-white border rounded-xl px-5 py-4 animate-pulse">
    <div>
      <div className="h-3 w-24 bg-gray-200 rounded mb-2"></div>
      <div className="h-8 w-32 bg-gray-300 rounded"></div>
    </div>
    <div className="h-3 w-48 bg-gray-200 rounded"></div>
  </div>
);

const SkeletonChart = () => (
  <div className="bg-white border rounded-xl p-5 animate-pulse">
    <div className="h-4 w-40 bg-gray-200 rounded mb-4"></div>
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-end gap-2 h-32">
          <div className="w-full bg-gray-200 rounded" style={{ height: `${(i + 1) * 25}%` }}></div>
        </div>
      ))}
    </div>
  </div>
);

const SkeletonForm = () => (
  <div className="bg-white border rounded-xl p-5 animate-pulse">
    <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
    <div className="space-y-4">
      <div className="h-10 bg-gray-200 rounded"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
      <div className="h-10 bg-gray-300 rounded"></div>
    </div>
  </div>
);

const SkeletonList = () => (
  <div className="space-y-2 animate-pulse">
    <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>
    <div className="bg-white border rounded-xl p-4 space-y-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center justify-between py-3 border-b last:border-b-0">
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
            <div className="h-3 w-48 bg-gray-100 rounded"></div>
          </div>
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  /* ================= FETCH ================= */
  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_BASE_URL}/expenses`, {
        headers: getAuthHeaders(),
      });
      setExpenses(data?.expenses || []);
    } catch (err) {
      console.error("Fetch error:", err);
      // Consider adding user-facing error handling here
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  /* ================= STATE ================= */
  const addExpense = useCallback((expense) => {
    setExpenses((prev) => [expense.expense, ...prev]);
  }, []);

  const updateExpense = useCallback((updated) => {
    setExpenses((prev) =>
      prev.map((e) => (e._id === updated._id ? updated : e))
    );
  }, []);

  const deleteExpense = useCallback(async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/expenses/${id}`, {
        headers: getAuthHeaders(),
      });
      setExpenses((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      // Consider adding user-facing error handling here
    }
  }, []);

  /* ================= DERIVED ================= */
  const totalExpense = useMemo(
    () => expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0),
    [expenses]
  );

  const filteredExpenses = useMemo(() => {
    if (!search.trim()) return expenses;
    
    const term = search.toLowerCase().trim();
    return expenses.filter((e) => {
      const searchableText = [
        e.type,
        e.category,
        e.amount,
        new Date(e.createdAt).toLocaleDateString("en-IN"),
      ]
        .join(" ")
        .toLowerCase();
      
      return searchableText.includes(term);
    });
  }, [expenses, search]);

  const visibleExpenses = useMemo(
    () => (showAll ? filteredExpenses : filteredExpenses.slice(0, LIST_LIMIT)),
    [filteredExpenses, showAll]
  );

  const hasExpenses = expenses.length > 0;

  /* ================= UI ================= */
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* HEADER */}
        <header>
          <h1 className="text-2xl font-semibold text-gray-900">Expenses</h1>
          <p className="text-sm text-gray-500">
            Track, analyze, and manage your spending efficiently.
          </p>
        </header>

        {/* SKELETON KPI */}
        <SkeletonKPI />

        {/* SKELETON ANALYTICS + FORM */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <SkeletonChart />
          </div>
          <div className="lg:col-span-2">
            <SkeletonForm />
          </div>
        </section>

        {/* SKELETON HISTORY */}
        <SkeletonList />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* HEADER */}
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">Expenses</h1>
        <p className="text-sm text-gray-500">
          Track, analyze, and manage your spending efficiently.
        </p>
      </header>

      {/* KPI BAR */}
      <section className="flex items-center justify-between bg-white border rounded-xl px-5 py-4">
        <div>
          <p className="text-xs text-gray-500">Total Spending</p>
          <p className="text-2xl font-bold text-red-600">
            ₹{totalExpense.toLocaleString("en-IN")}
          </p>
        </div>
        <p className="text-xs text-gray-400 max-w-xs text-right">
          Updated in real time as expenses are added or modified.
        </p>
      </section>

      {/* ANALYTICS + FORM */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* CHART */}
        <div className="lg:col-span-3 bg-white border rounded-xl p-5">
          {hasExpenses ? (
            <ExpenseCategoryBarChart expenses={expenses} />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-sm text-gray-500">
                Add expenses to see category insights.
              </p>
            </div>
          )}
        </div>

        {/* FORM */}
        <div className="lg:col-span-2 bg-white border rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-2">Add / Edit Expense</h3>
          <ExpenseForm
            editingExpense={editingExpense}
            setEditingExpense={setEditingExpense}
            addExpense={addExpense}
            updateExpense={updateExpense}
          />
        </div>
      </section>

      {/* HISTORY */}
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Expense History</h2>

        <ExpenseList
          expenses={visibleExpenses}
          allCount={filteredExpenses.length}
          loading={false}
          search={search}
          setSearch={setSearch}
          showAll={showAll}
          setShowAll={setShowAll}
          onEdit={setEditingExpense}
          onDelete={deleteExpense}
        />
      </section>
    </div>
  );
}