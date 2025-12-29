import { useEffect, useState } from "react";
import axios from "axios";

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
          `http://localhost:5000/expenses/${editingExpense._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        updateExpense(res.data);
      } else {
        const res = await axios.post(
          "http://localhost:5000/expenses",
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

  return (
    <div className="space-y-3">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      {/* ROW 1: TITLE */}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Expense title (e.g. Grocery, Petrol)"
        className="w-full border px-3 py-2 rounded"
      />

      {/* ROW 2: AMOUNT + CATEGORY */}
      <div className="grid grid-cols-2 gap-3">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount (₹)"
          className="border px-3 py-2 rounded"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">Category</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* OPTIONAL NOTE */}
      {showNote && (
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional note"
          rows={2}
          className="w-full border px-3 py-2 rounded resize-none"
        />
      )}

      {!showNote && (
        <button
          type="button"
          onClick={() => setShowNote(true)}
          className="text-xs text-blue-600 hover:underline"
        >
          + Add a note (optional)
        </button>
      )}

      {/* ACTIONS */}
      <div className="flex gap-3 pt-1">
        <button
          onClick={saveExpense}
          disabled={loading}
          className={`flex-1 py-2 rounded text-white ${
            loading
              ? "bg-blue-400"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {editingExpense ? "Update Expense" : "Add Expense"}
        </button>

        {editingExpense && (
          <button
            onClick={resetForm}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
