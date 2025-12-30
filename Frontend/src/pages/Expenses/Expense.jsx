import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";

import ExpenseForm from "../../Components/ExpenseForm";
import ExpenseList from "../../Components/ExpenseList";
import ExpenseCategoryBarChart from "../../Components/ExpenseCategoryChart";

const LIST_LIMIT = 6;

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  /* ================= FETCH ================= */
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setExpenses(res.data?.expenses || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= STATE ================= */
  const addExpense = useCallback((expense) => {
    setExpenses((prev) => [expense.expense, ...prev]);
  }, []);

  const updateExpense = useCallback((updated) => {
    setExpenses((prev) =>
      prev.map((e) => (e._id === updated._id ? updated : e))
    );
  }, []);

  const deleteExpense = useCallback(async(id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?"
    );
    if (!confirmed) return;

    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:5000/expenses/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => {
      setExpenses((prev) => prev.filter((e) => e._id !== id));
    });
  }, []);

  /* ================= DERIVED ================= */
  const totalExpense = useMemo(
    () => expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0),
    [expenses]
  );

  const filteredExpenses = useMemo(() => {
    if (!search) return expenses;
    const term = search.toLowerCase();
    return expenses.filter((e) =>
      (
        e.type +
        e.category +
        e.amount +
        new Date(e.createdAt).toLocaleDateString("en-IN")
      )
        .toLowerCase()
        .includes(term)
    );
  }, [expenses, search]);

  const visibleExpenses = useMemo(
    () =>
      showAll
        ? filteredExpenses
        : filteredExpenses.slice(0, LIST_LIMIT),
    [filteredExpenses, showAll]
  );

  /* ================= UI ================= */
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* HEADER */}
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">
          Expenses
        </h1>
        <p className="text-sm text-gray-500">
          Track, analyze, and manage your spending efficiently.
        </p>
      </header>

      {/* KPI BAR */}
      <section className="flex items-center justify-between bg-white border rounded-xl px-5 py-4">
        <div>
          <p className="text-xs text-gray-500">
            Total Spending
          </p>
          <p className="text-2xl font-bold text-red-600">
            ₹ {totalExpense}
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
          {expenses.length > 0 ? (
            <ExpenseCategoryBarChart expenses={expenses} />
          ) : (
            <p className="text-sm text-gray-500">
              Add expenses to see category insights.
            </p>
          )}
        </div>

        {/* FORM */}
        <div className="lg:col-span-2 bg-white border rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-2">
            Add / Edit Expense
          </h3>
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
        <h2 className="text-lg font-semibold">
          Expense History
        </h2>

        <ExpenseList
          expenses={visibleExpenses}
          allCount={filteredExpenses.length}
          loading={loading}
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
