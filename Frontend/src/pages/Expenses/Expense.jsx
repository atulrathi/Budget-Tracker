import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { 
  Receipt, 
  TrendingDown, 
  Loader2, 
  RefreshCw,
  Plus,
  BarChart3
} from "lucide-react";

import ExpenseForm from "../../Components/ExpenseForm";
import ExpenseList from "../../Components/ExpenseList";
import ExpenseCategoryBarChart from "../../Components/ExpenseCategoryChart";

const LIST_LIMIT = 6;
const API_BASE_URL = "http://localhost:5000";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showForm, setShowForm] = useState(false);

  /* ================= FETCH ================= */
  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_BASE_URL}/expenses`, {
        headers: getAuthHeaders(),
      });
      setExpenses(data?.filterexpense || []);
      console.log("Fetched expenses:", data);
    } catch (err) {
      console.error("Fetch error:", err);
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
    setShowForm(false);
  }, []);

  const updateExpense = useCallback((updated) => {
    setExpenses((prev) =>
      prev.map((e) => (e._id === updated.expense._id ? updated.expense : e))
    );
    setShowForm(false);
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

  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-orange-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <Receipt className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
              Expenses
            </h1>
          </div>
          
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-orange-600 rounded-full blur-xl opacity-30 animate-pulse"></div>
              </div>
              <p className="text-gray-600 text-lg font-medium">Loading expenses...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ================= MAIN UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-orange-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER WITH ACTIONS */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <Receipt className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
                Expenses
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Track and manage your spending
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={fetchExpenses}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-rose-600 rounded-xl font-medium hover:bg-rose-50 transition-all shadow-md hover:shadow-lg border border-rose-100"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditingExpense(null);
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all font-semibold shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Add Expense
            </button>
          </div>
        </header>

        {/* KPI CARD - TOTAL SPENDING */}
        <section className="relative bg-gradient-to-br from-rose-500 to-orange-600 rounded-3xl shadow-2xl p-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium mb-2">Total Spending</p>
              <p className="text-5xl font-bold text-white mb-2">
                ₹{totalExpense.toLocaleString("en-IN")}
              </p>
              <p className="text-white/70 text-sm">
                {expenses.length} transaction{expenses.length !== 1 ? 's' : ''} • This Month
              </p>
            </div>
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
              <TrendingDown className="w-8 h-8 text-white" />
            </div>
          </div>
        </section>

        {/* ADD/EDIT FORM (MODAL STYLE) */}
        {showForm && (
          <section className="bg-white border border-gray-100 rounded-2xl shadow-2xl p-8 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {editingExpense ? 'Edit Expense' : 'Add New Expense'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {editingExpense ? 'Update expense details' : 'Record a new transaction'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingExpense(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <ExpenseForm
              editingExpense={editingExpense}
              setEditingExpense={setEditingExpense}
              addExpense={addExpense}
              updateExpense={updateExpense}
              fetchExpenses={fetchExpenses}
            />
          </section>
        )}

        {/* CATEGORY ANALYTICS CHART */}
        <section className="bg-white border border-gray-100 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-orange-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Category Analytics</h3>
              <p className="text-sm text-gray-600">Visual breakdown of your spending by category</p>
            </div>
          </div>
          
          {hasExpenses ? (
            <ExpenseCategoryBarChart expenses={expenses} />
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="w-10 h-10 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h4>
              <p className="text-sm text-gray-600 mb-4">
                Add expenses to see category insights and analytics
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all font-semibold shadow-lg"
              >
                Add Your First Expense
              </button>
            </div>
          )}
        </section>

        {/* EXPENSE HISTORY */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Transaction History</h2>
              <p className="text-sm text-gray-600">
                {filteredExpenses.length} transaction{filteredExpenses.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>

          <ExpenseList
            expenses={visibleExpenses}
            allCount={filteredExpenses.length}
            loading={false}
            search={search}
            setSearch={setSearch}
            showAll={showAll}
            setShowAll={setShowAll}
            onEdit={(expense) => {
              setEditingExpense(expense);
              setShowForm(true);
            }}
            onDelete={deleteExpense}
          />
        </section>
      </div>
    </div>
  );
}