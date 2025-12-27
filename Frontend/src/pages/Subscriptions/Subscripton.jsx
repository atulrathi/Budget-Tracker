export default function Subscriptions({ expenses }) {
  // 🔁 Detect recurring expenses
  const subscriptionMap = {};

  expenses.forEach(exp => {
    const key = `${exp.title}-${exp.amount}`;
    subscriptionMap[key] = subscriptionMap[key]
      ? {
          ...subscriptionMap[key],
          count: subscriptionMap[key].count + 1,
        }
      : {
          title: exp.title,
          amount: exp.amount,
          count: 1,
        };
  });

  // Keep only recurring ones
  const subscriptions = Object.values(subscriptionMap).filter(
    sub => sub.count >= 2
  );

  const totalSubscriptionCost = subscriptions.reduce(
    (sum, sub) => sum + sub.amount,
    0
  );

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Subscriptions</h1>

      {/* Summary */}
      <div className="bg-white p-6 rounded-xl shadow-sm max-w-md">
        <p className="text-gray-500">
          Monthly Subscription Cost
        </p>
        <h2 className="text-2xl font-bold text-red-500">
          ₹ {totalSubscriptionCost}
        </h2>
      </div>

      {/* Subscription List */}
      <div className="bg-white p-6 rounded-xl shadow-sm max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          Active Subscriptions
        </h2>

        {subscriptions.length === 0 && (
          <p className="text-gray-500 text-sm">
            No recurring subscriptions detected yet.
          </p>
        )}

        <ul className="divide-y">
          {subscriptions.map((sub, index) => (
            <li
              key={index}
              className="flex justify-between py-3 text-sm"
            >
              <div>
                <p className="font-medium">{sub.title}</p>
                <p className="text-gray-500">
                  Occurred {sub.count} times
                </p>
              </div>

              <span className="text-red-500 font-semibold">
                ₹ {sub.amount}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Smart Suggestion */}
      {subscriptions.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl max-w-md">
          <h2 className="text-lg font-semibold mb-2">
            💡 Smart Suggestion
          </h2>
          <p className="text-sm text-gray-700">
            You are spending{" "}
            <strong>₹ {totalSubscriptionCost}</strong> every month on
            subscriptions. Review and cancel unused ones to save more.
          </p>
        </div>
      )}
    </div>
  );
}
