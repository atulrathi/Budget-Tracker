export default function ExpenseSummary({ totalExpense }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm max-w-md">
      <p className="text-gray-500">Total Expenses</p>
      <h2 className="text-2xl font-bold text-red-600">
        ₹ {totalExpense}
      </h2>
    </div>
  );
}
