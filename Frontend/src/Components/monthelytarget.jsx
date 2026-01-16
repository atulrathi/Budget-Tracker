import { useState, useEffect } from "react";
import { Target, AlertCircle } from "lucide-react";

const API_URL = "https://budget-xi-liart.vercel.app";

// Skeleton Loading Component
function MonthlyPlanSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0"></div>
        <div className="flex-1 space-y-2">
          <div className="h-5 w-48 bg-gray-200 rounded"></div>
          <div className="h-4 w-64 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Input Skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-40 bg-gray-200 rounded"></div>
        <div className="h-12 w-full bg-gray-200 rounded-lg"></div>
      </div>

      {/* Info Box Skeleton */}
      <div className="h-16 w-full bg-gray-200 rounded-lg"></div>

      {/* Button Skeleton */}
      <div className="h-12 w-full bg-gray-200 rounded-lg"></div>
    </div>
  );
}

export default function MonthlyPlan() {
  const [currentPlan, setCurrentPlan] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Fetch current monthly plan
  useEffect(() => {
    const fetchMonthlyPlan = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setInitialLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Unable to fetch monthly plan data');
        }

        const data = await response.json();
        const plan = data.user.monthlyPlan || '';
        setCurrentPlan(plan);
        setAmount(plan);
      } catch (err) {
        console.error("Error fetching monthly plan:", err.message);
        setError('Failed to load monthly plan. Please try again.');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchMonthlyPlan();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount greater than zero');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/income/budget`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ budget: amount })
      });

      if (!response.ok) {
        throw new Error('Unable to update monthly plan');
      }

      await response.json();
      setCurrentPlan(amount);
      setSuccess(true);
      
      // Dispatch event for other components
      window.dispatchEvent(new CustomEvent('monthlyPlanUpdated', { 
        detail: { monthlyPlan: amount } 
      }));

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'An error occurred while updating your monthly plan');
    } finally {
      setLoading(false);
    }
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
    setError('');
    setSuccess(false);
  };

  // Show skeleton while loading
  if (initialLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <MonthlyPlanSkeleton />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md">
            <Target className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
              Monthly Spending Plan
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Define your total spending limit for the month to help manage your expenses effectively
            </p>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm text-green-800 font-medium">
              Your monthly spending plan has been successfully updated
            </p>
          </div>
        )}

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Input Field */}
          <div>
            <label htmlFor="monthlyPlan" className="block text-sm font-semibold text-gray-700 mb-2">
              Monthly Spending Limit
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-semibold text-lg pointer-events-none">
                ₹
              </span>
              <input
                id="monthlyPlan"
                type="number"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Enter your monthly budget"
                className="w-full pl-10 pr-4 py-3 sm:py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-medium text-gray-900 placeholder:text-gray-400 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                disabled={loading}
                min="1"
                step="1"
              />
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="mt-2 flex items-start gap-2 text-red-600">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Current Plan Info */}
          {currentPlan && !success && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Target className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900 mb-0.5">
                    Current Monthly Plan
                  </p>
                  <p className="text-2xl font-bold text-blue-700">
                    ₹{Number(currentPlan).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !amount}
            className="w-full px-6 py-3 sm:py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 active:from-blue-800 active:to-blue-900 transition-all font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </>
            ) : (
              <span>{currentPlan ? 'Update Monthly Plan' : 'Set Monthly Plan'}</span>
            )}
          </button>
        </form>

        {/* Helper Text */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs sm:text-sm text-gray-500 text-center leading-relaxed">
            This limit will help you track your spending and stay within your budget for the month
          </p>
        </div>
      </div>
    </div>
  );
}