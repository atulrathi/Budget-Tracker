const LIST_LIMIT = 6;

export default function ExpenseList({
  expenses,
  allCount,
  loading,
  search,
  setSearch,
  showAll,
  setShowAll,
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
        <h2 className="text-xl font-semibold">Expense List</h2>

        <input
          placeholder="Search expenses..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowAll(false);
          }}
          className="border px-3 py-2 rounded text-sm w-full sm:w-64"
        />
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : expenses.length === 0 ? (
        <p className="text-gray-500">
          No expenses yet. Add your first expense above.
        </p>
      ) : (
        <ul className="divide-y">
          {expenses.map((exp) => (
            <li
              key={exp._id}
              className="flex justify-between items-center py-3 text-sm"
            >
              <div>
                <p className="font-medium">{exp.type}</p>
                <p className="text-gray-500">
                  {exp.category} •{" "}
                  {new Date(exp.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>

              <div className="flex gap-3 items-center">
                <span className="text-red-600 font-semibold">
                  ₹ {exp.amount}
                </span>

                <button
                  onClick={() => onEdit(exp)}
                  className="text-blue-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(exp._id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {allCount > LIST_LIMIT && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-blue-600 text-sm hover:underline"
          >
            {showAll ? "View less" : "View more"}
          </button>
        </div>
      )}
    </div>
  );
}
