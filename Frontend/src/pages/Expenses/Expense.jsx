import { useState } from "react";

export default function Expenses({ expenses, setExpenses }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [editId, setEditId] = useState(null);

  const resetForm = () => {
    setTitle("");
    setAmount("");
    setCategory("");
    setEditId(null);
  };

  const addOrUpdateExpense = () => {
    if (!title || !amount || !category) return alert(`please enter details `);

    if (editId) {
      // ✏️ Update
      setExpenses(
        expenses.map(exp =>
          exp.id === editId
            ? {
                ...exp,
                title,
                amount: Number(amount),
                category,
              }
            : exp
        )
      );
    } else {
      // ➕ Add
      setExpenses([
        ...expenses,
        {
          id: Date.now(),
          title,
          amount: Number(amount),
          category,
        },
      ]);
    }

    resetForm();
  };

  const editExpense = exp => {
    setEditId(exp.id);
    setTitle(exp.title);
    setAmount(exp.amount);
    setCategory(exp.category);
  };

  const deleteExpense = id => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const totalExpense = expenses.reduce(
    (sum, e) => sum + e.amount,
    0
  );

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Expenses</h1>

      {/* Add / Edit Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm max-w-md space-y-4">
        <h2 className="text-xl font-semibold">
          {editId ? "Edit Expense" : "Add Expense"}
        </h2>

        <input
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />

        <input
          placeholder="Category"
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />

        <div className="flex gap-3">
          <button
            onClick={addOrUpdateExpense}
            className="flex-1 bg-blue-600 text-white py-2 rounded"
          >
            {editId ? "Update" : "Add"}
          </button>

          {editId && (
            <button
              onClick={resetForm}
              className="flex-1 bg-gray-300 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white p-6 rounded-xl shadow-sm max-w-md">
        <p className="text-gray-500">Total Expenses</p>
        <h2 className="text-2xl font-bold text-red-500">
          ₹ {totalExpense}
        </h2>
      </div>

      {/* Expense List */}
      <div className="bg-white p-6 rounded-xl shadow-sm max-w-md">
        <h2 className="text-xl font-semibold mb-4">Expense List</h2>

        <ul className="divide-y">
          {expenses.map(exp => (
            <li
              key={exp.id}
              className="flex justify-between items-center py-3 text-sm"
            >
              <div>
                <p className="font-medium">{exp.title}</p>
                <p className="text-gray-500">{exp.category}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-red-500 font-semibold">
                  ₹ {exp.amount}
                </span>

                <button
                  onClick={() => editExpense(exp)}
                  className="text-blue-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteExpense(exp.id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
