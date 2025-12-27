export default function Dashboard({ expenses }) {
  // 🔢 Total expense calculation
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  // 📊 Category-wise calculation
  const categories = {};
  expenses.forEach((e) => {
    categories[e.category] = (categories[e.category] || 0) + e.amount;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Dashboard Overview
        </h1>
        <p className="text-sm text-gray-500 mt-1 sm:mt-0">
          Track your expenses intelligently
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <Card title="Total Expenses" amount={`₹ ${totalExpense}`} />
        <Card title="Total Categories" amount={Object.keys(categories).length} />
        <Card title="Transactions" amount={expenses.length} />
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-5">
          Category-wise Expenses
        </h2>

        <div className="space-y-4">
          {Object.entries(categories).map(([category, amount]) => {
            const percentage = ((amount / totalExpense) * 100).toFixed(1);

            return (
              <div key={category}>
                <div className="flex justify-between text-sm font-medium text-gray-600 mb-1">
                  <span>{category}</span>
                  <span>₹ {amount}</span>
                </div>

                <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Card({ title, amount }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 hover:shadow-md transition">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="mt-2 text-xl sm:text-2xl font-bold text-gray-900">
        {amount}
      </h2>
    </div>
  );
}
