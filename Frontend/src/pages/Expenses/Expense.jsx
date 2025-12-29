import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import ExpenseForm from "../../Components/ExpenseForm";
import ExpenseList from "../../Components/ExpenseList";
import ExpenseCategoryChart from "../../Components/ExpenseCategoryChart";

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
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= OPTIMISTIC UPDATES ================= */
  const addExpense = useCallback((newExpense) => {
    setExpenses((prev) => [newExpense, ...prev]);
  }, []);

  const updateExpense = useCallback((updated) => {
    setExpenses((prev) =>
      prev.map((e) => (e._id === updated._id ? updated : e))
    );
  }, []);

  const deleteExpense = useCallback((id) => {
    setExpenses((prev) => prev.filter((e) => e._id !== id));
  }, []);

  /* ================= DERIVED DATA ================= */
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
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* HEADER */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Expense Management
        </h1>
        <p className="text-gray-600 max-w-3xl">
          Record your daily expenses and instantly see how they impact your
          overall spending. This page helps you stay aware and in control while
          adding or updating expense entries.
        </p>
      </header>

      {/* MAIN ACTION AREA */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-stretch">
        {/* LEFT: ACTION PANEL */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <ExpenseForm
              editingExpense={editingExpense}
              setEditingExpense={setEditingExpense}
              addExpense={addExpense}
              updateExpense={updateExpense}
            />
          </div>

          {/* TOTAL SPENDING */}
          <div className="mt-8 pt-6 border-t">
            <p className="text-sm text-gray-500">
              Total Spending
            </p>
            <p className="text-3xl font-bold text-red-600 mt-1">
              ₹ {totalExpense}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This amount updates automatically as you add, edit, or remove
              expenses.
            </p>
          </div>
        </div>

        {/* RIGHT: VISUAL INSIGHT */}
        <div className="lg:col-span-2">
          {expenses.length > 0 ? (
            <ExpenseCategoryChart expenses={expenses} />
          ) : (
            <div className="bg-white p-6 rounded-2xl shadow-sm text-gray-500 h-full flex items-center">
              Add a few expenses to see a visual breakdown of your spending by
              category.
            </div>
          )}
        </div>
      </section>

      {/* EXPENSE HISTORY */}
      <section className="space-y-4">
        <div className="max-w-3xl">
          <h2 className="text-xl font-semibold text-gray-900">
            Expense History
          </h2>
          <p className="text-sm text-gray-600">
            Browse, search, and manage all previously added expenses. You can
            edit or delete entries at any time.
          </p>
        </div>

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
