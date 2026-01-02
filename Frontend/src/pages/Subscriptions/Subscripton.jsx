import { 
  Repeat, 
  CreditCard, 
  TrendingUp, 
  Lightbulb, 
  Calendar,
  DollarSign,
  AlertCircle
} from "lucide-react";

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

  // Calculate yearly cost
  const yearlyCost = totalSubscriptionCost * 12;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        <header className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Repeat className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Subscriptions
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Track and manage your recurring expenses
            </p>
          </div>
        </header>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Monthly Cost */}
          <div className="relative bg-gradient-to-br from-red-500 to-rose-600 rounded-3xl shadow-2xl p-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 border border-white/30">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <p className="text-white/80 text-sm font-medium mb-2">Monthly Cost</p>
              <p className="text-4xl font-bold text-white mb-2">
                ₹{totalSubscriptionCost.toLocaleString('en-IN')}
              </p>
              <p className="text-white/70 text-sm">
                {subscriptions.length} active subscription{subscriptions.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Yearly Projection */}
          <div className="relative bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl shadow-2xl p-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 border border-white/30">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <p className="text-white/80 text-sm font-medium mb-2">Yearly Projection</p>
              <p className="text-4xl font-bold text-white mb-2">
                ₹{yearlyCost.toLocaleString('en-IN')}
              </p>
              <p className="text-white/70 text-sm">
                Annual recurring cost
              </p>
            </div>
          </div>

          {/* Average per Subscription */}
          <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-2xl p-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 border border-white/30">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <p className="text-white/80 text-sm font-medium mb-2">Average Cost</p>
              <p className="text-4xl font-bold text-white mb-2">
                ₹{subscriptions.length > 0 ? Math.round(totalSubscriptionCost / subscriptions.length).toLocaleString('en-IN') : 0}
              </p>
              <p className="text-white/70 text-sm">
                Per subscription
              </p>
            </div>
          </div>
        </div>

        {/* SUBSCRIPTION LIST */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-8 py-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Active Subscriptions</h2>
                <p className="text-sm text-gray-600">
                  Automatically detected recurring expenses
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {subscriptions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                  <Repeat className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No Subscriptions Detected</h3>
                <p className="text-gray-600 max-w-md">
                  We haven't detected any recurring expenses yet. Subscriptions are automatically identified when expenses with the same name and amount appear multiple times.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {subscriptions.map((sub, index) => {
                  const colors = [
                    { gradient: "from-red-500 to-pink-600", bg: "from-red-50 to-pink-50" },
                    { gradient: "from-blue-500 to-indigo-600", bg: "from-blue-50 to-indigo-50" },
                    { gradient: "from-emerald-500 to-green-600", bg: "from-emerald-50 to-green-50" },
                    { gradient: "from-orange-500 to-amber-600", bg: "from-orange-50 to-amber-50" },
                    { gradient: "from-purple-500 to-pink-600", bg: "from-purple-50 to-pink-50" },
                  ];
                  const color = colors[index % colors.length];

                  return (
                    <div
                      key={index}
                      className={`group relative bg-gradient-to-r ${color.bg} border border-gray-200 rounded-xl p-6 transition-all duration-300 hover:shadow-md hover:border-blue-200 overflow-hidden`}
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-30 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-300"></div>
                      
                      <div className="relative z-10 flex justify-between items-center">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`w-12 h-12 bg-gradient-to-br ${color.gradient} rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg mb-1 capitalize">
                              {sub.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Repeat className="w-4 h-4" />
                              <span>Recurring {sub.count} times</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">
                            ₹{sub.amount.toLocaleString('en-IN')}
                          </p>
                          <p className="text-sm text-gray-600 font-medium">per month</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* SMART SUGGESTION */}
        {subscriptions.length > 0 && (
          <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl shadow-lg p-8 border border-amber-200 overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-200 opacity-20 rounded-full -mr-20 -mt-20"></div>
            <div className="relative z-10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0">
                  💡
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Smart Insights</h2>
                  <div className="space-y-4">
                    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-amber-200">
                      <p className="text-gray-700 leading-relaxed">
                        You're spending{" "}
                        <span className="font-bold text-red-600">₹{totalSubscriptionCost.toLocaleString('en-IN')}</span>{" "}
                        every month on subscriptions. That's{" "}
                        <span className="font-bold text-orange-600">₹{yearlyCost.toLocaleString('en-IN')}</span>{" "}
                        per year!
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900 mb-2">Recommendations:</p>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li className="flex items-start gap-2">
                            <span className="text-amber-600 font-bold">•</span>
                            <span>Review all subscriptions and cancel any you don't actively use</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-amber-600 font-bold">•</span>
                            <span>Look for annual plans that offer better rates than monthly</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-amber-600 font-bold">•</span>
                            <span>Set calendar reminders before renewal dates to reassess</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}