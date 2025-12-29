import { useEffect, useState } from "react";
import axios from "axios";

const CATEGORIES = ["Food", "Transport", "Rent", "Shopping", "Bills", "Other"];

export default function ExpenseForm({
  editingExpense,
  setEditingExpense,
  addExpense,
  updateExpense,
}) {
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (editingExpense) {
      setType(editingExpense.type);
      setAmount(editingExpense.amount);
      setCategory(editingExpense.category);
    }
  }, [editingExpense]);

  const reset = () => {
    setType("");
    setAmount("");
    setCategory("");
    setEditingExpense(null);
  };

  const save = async () => {
    if (!type || !amount || !category) {
      alert("All fields are required");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      if (editingExpense) {
        const res = await axios.put(
          `http://localhost:5000/expenses/${editingExpense._id}`,
          { type, amount: Number(amount), category },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        updateExpense(res.data);
      } else {
        const res = await axios.post(
          "http://localhost:5000/expenses",
          { type, amount: Number(amount), category },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        addExpense({
          ...res.data,
          type,
          amount: Number(amount),
          category,
          createdAt: res.data.createdAt || new Date().toISOString(),
        });
      }
      reset();
    } catch {
      alert("Operation failed");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm max-w-md">
      <h2 className="text-xl font-semibold mb-4">
        {editingExpense ? "Edit Expense" : "Add Expense"}
      </h2>

      <div className="space-y-3">
        <input
          placeholder="Expense type (Petrol, Groceries)"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="number"
          placeholder="Amount (₹)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        >
          <option value="">Select category</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <div className="flex gap-3">
          <button
            onClick={save}
            className="flex-1 bg-blue-600 text-white py-2 rounded"
          >
            {editingExpense ? "Update" : "Add"}
          </button>

          {editingExpense && (
            <button
              onClick={reset}
              className="flex-1 bg-gray-300 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
