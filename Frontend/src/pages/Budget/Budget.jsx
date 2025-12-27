export default function Budgets({ expenses }) {
  const budgets = [
    { category: "Food", limit: 5000 },
    { category: "Rent", limit: 10000 },
    { category: "Travel", limit: 3000 },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Budgets</h1>

      <div className="space-y-4 max-w-md">
        {budgets.map(budget => {
          const spent = expenses
            .filter(e => e.category === budget.category)
            .reduce((sum, e) => sum + e.amount, 0);

          const percent = Math.min(
            (spent / budget.limit) * 100,
            100
          );

          const exceeded = spent > budget.limit;

          return (
            <div
              key={budget.category}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <div className="flex justify-between mb-2">
                <h3 className="font-semibold">{budget.category}</h3>
                <span>
                  ₹ {spent} / ₹ {budget.limit}
                </span>
              </div>

              <div className="w-full bg-gray-200 h-2 rounded">
                <div
                  className={`h-2 rounded ${
                    exceeded
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              <p
                className={`text-sm mt-2 ${
                  exceeded
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                {exceeded
                  ? "Budget exceeded!"
                  : `Remaining ₹ ${
                      budget.limit - spent
                    }`}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
