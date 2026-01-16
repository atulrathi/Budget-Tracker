import { useEffect, useState } from "react";
import axios from "axios";
import { AlertCircle, FileText, X } from "lucide-react";

const CATEGORIES = [
  "Rent / Housing",
  "Utilities",
  "Groceries",
  "Dining & Food",
  "Transportation",
  "Fuel",
  "Internet & Mobile",
  "Subscriptions",
  "Shopping",
  "Health & Medical",
  "Education",
  "Entertainment",
  "Travel",
  "Insurance",
  "Loan / EMI",
  "Other",
];

export default function ExpenseForm({
  editingExpense,
  setEditingExpense,
  addExpense,
  updateExpense,
  fetchExpenses,
}) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [showNote, setShowNote] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.type || "");
      setAmount(editingExpense.amount || "");
      setCategory(editingExpense.category || "");
      setNote(editingExpense.note || "");
      setShowNote(Boolean(editingExpense.note));
    }
  }, [editingExpense]);

  const resetForm = () => {
    setTitle("");
    setAmount("");
    setCategory("");
    setNote("");
    setShowNote(false);
    setError("");
    setEditingExpense(null);
  };

  const saveExpense = async () => {
    if (!title || !amount || !category) {
      setError("Please fill in all required fields.");
      return;
    }

    if (loading) return;
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");

    const payload = {
      type: title.trim(),
      amount: Number(amount),
      category,
      note: note.trim() || undefined,
    };

    try {
      if (editingExpense) {
        const res = await axios.put(
          `https://budget-xi-liart.vercel.app/expenses/${editingExpense._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        updateExpense(res.data);
      } else {
        const res = await axios.post(
          "https://budget-xi-liart.vercel.app/expenses",
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        addExpense(res.data);
      }
      resetForm();
    } catch {
      setError("Unable to save expense. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveExpense();
    }
  };

  return (
    <div className="space-y-4">
      {/* ERROR MESSAGE */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 animate-fadeIn">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium">{error}</p>
          </div>
          <button
            onClick={() => setError("")}
            className="text-red-400 hover:text-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* EXPENSE TITLE */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Expense Title <span className="text-red-500">*</span>
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g. Grocery Shopping, Petrol"
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-gray-400"
        />
      </div>

      {/* AMOUNT + CATEGORY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* AMOUNT */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Amount (₹) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
              ₹
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="0"
              min="0"
              step="0.01"
              className="w-full border-2 border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* CATEGORY */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 1rem center',
            }}
          >
            <option value="" disabled>Select a category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* OPTIONAL NOTE */}
      {showNote ? (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Note (Optional)
            </label>
            <button
              onClick={() => {
                setShowNote(false);
                setNote("");
              }}
              className="text-xs text-gray-500 hover:text-gray-700 font-medium flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Remove
            </button>
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add any additional details..."
            rows={3}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none placeholder:text-gray-400"
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowNote(true)}
          className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
        >
          <FileText className="w-4 h-4" />
          Add a note (optional)
        </button>
      )}

      {/* ACTION BUTTONS */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={saveExpense}
          disabled={loading || !title || !amount || !category}
          className={`flex-1 py-3 rounded-xl font-semibold text-white shadow-lg transition-all duration-200 ${
            loading || !title || !amount || !category
              ? "bg-gray-300 cursor-not-allowed"
              : editingExpense
              ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl"
              : "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 hover:shadow-xl"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {editingExpense ? "Updating..." : "Saving..."}
            </span>
          ) : editingExpense ? (
            "Update Expense"
          ) : (
            "Add Expense"
          )}
        </button>

        {editingExpense && (
          <button
            onClick={resetForm}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all duration-200 disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>

      {/* HELPER TEXT */}
      <p className="text-xs text-gray-500 text-center">
        <span className="text-red-500">*</span> Required fields
      </p>
    </div>
  );
}