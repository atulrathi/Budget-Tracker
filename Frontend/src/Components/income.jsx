const formatCurrency = (value) => {
    const number = parseFloat(value.replace(/,/g, ''));
    if (isNaN(number)) return '';
    return number.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleIncomeChange = (e) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setIncome(value);
    }
  };import { useState, useEffect } from 'react';
import { DollarSign, Briefcase, TrendingUp, CheckCircle, Wallet, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export default function IncomeEntryForm({setIncomee}) {
  const [income, setIncome] = useState('');
  const [source, setSource] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Simulate fetching existing income data
  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulate loaded data (you can replace this with actual API call)
        // const response = await fetch('/api/income');
        // const data = await response.json();
        // setIncome(data.amount || '');
        // setSource(data.source || '');
        
      } catch (err) {
        setError('Failed to load income data. Please try again.');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchIncomeData();
  }, []);

  const handleSubmit = async () => {
    if (!income || !source) return;

    try {
      setSaving(true);
      setError(null);
      
      // Simulate API call
      const incomedata = await fetch('https://budget-xi-liart.vercel.app/income', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ income })
      });

      const result = await incomedata.json();
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 1000);
      setTimeout(() => setIncomee(result.user), 1500);
      
    } catch (err) {
      setError('Failed to save income information. Please try again.');
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => setLoading(false), 1500);
  };

  const formatCurrency = (value) => {
    const number = parseFloat(value.replace(/,/g, ''));
    if (isNaN(number)) return '';
    return number.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleIncomeChange = (e) => {
    const value = e.target.value.replace(/,/g, '');
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setIncome(value);
    }
  };

  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* HEADER SKELETON */}
          <header className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <Wallet className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Monthly Income
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Track and manage your monthly income
              </p>
            </div>
          </header>

          {/* LOADING CARD */}
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full blur-xl opacity-30 animate-pulse"></div>
              </div>
              <p className="text-gray-600 text-lg font-medium">Loading income data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ================= ERROR STATE ================= */
  if (error && !income) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* HEADER */}
          <header className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <Wallet className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Monthly Income
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Track and manage your monthly income
              </p>
            </div>
          </header>

          {/* ERROR CARD */}
          <section className="bg-white border border-red-100 rounded-2xl shadow-lg p-8">
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Data</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {error}
              </p>
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all font-semibold shadow-lg hover:shadow-xl"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>
            </div>
          </section>
        </div>
      </div>
    );
  }

  /* ================= MAIN UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER */}
        <header className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
            <Wallet className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Monthly Income
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Track and manage your monthly income
            </p>
          </div>
        </header>

        {/* KPI CARD - CURRENT INCOME */}
        {income && (
          <section className="relative bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl shadow-2xl p-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
            
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium mb-2">Current Monthly Income</p>
                <p className="text-5xl font-bold text-white mb-2">
                  ₹{income ? Number(income).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                </p>
                <p className="text-white/70 text-sm">
                  {source ? `Source: ${source.charAt(0).toUpperCase() + source.slice(1).replace(/([A-Z])/g, ' $1')}` : 'No source selected'}
                </p>
              </div>
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
            </div>
          </section>
        )}

        {/* ERROR MESSAGE (INLINE) */}
        {error && income && (
          <div className="flex items-center gap-3 bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3.5 rounded-xl">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm font-semibold flex-1">{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* INCOME FORM */}
        <section className="bg-white border border-gray-100 rounded-2xl shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Income Information</h3>
              <p className="text-sm text-gray-600">Enter your monthly income details below</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Monthly Income Input */}
            <div>
              <label htmlFor="income" className="block text-sm font-semibold text-gray-700 mb-2">
                Monthly Income Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-500 font-medium">₹</span>
                </div>
                <input
                  type="text"
                  id="income"
                  onChange={handleIncomeChange}
                  placeholder="0.00"
                  disabled={saving}
                  className="w-full pl-10 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-lg font-medium text-gray-900 placeholder:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">Enter your gross monthly income before deductions</p>
            </div>

            {/* Income Source Dropdown */}
            <div>
              <label htmlFor="source" className="block text-sm font-semibold text-gray-700 mb-2">
                Income Source
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="source"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  disabled={saving}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white appearance-none cursor-pointer text-base font-medium text-gray-900 disabled:bg-gray-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select income source</option>
                  <option value="fullTimeEmployment">Full-time Employment</option>
                  <option value="partTimeEmployment">Part-time Employment</option>
                  <option value="selfEmployed">Self-employed</option>
                  <option value="freelancing">Freelancing</option>
                  <option value="businessIncome">Business Income</option>
                  <option value="investmentIncome">Investment Income</option>
                  <option value="rentalIncome">Rental Income</option>
                  <option value="pension">Pension/Retirement</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Success Message */}
            {submitted && (
              <div className="flex items-center gap-3 bg-emerald-50 border-2 border-emerald-200 text-emerald-700 px-4 py-3.5 rounded-xl animate-fadeIn">
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm font-semibold">Income information saved successfully!</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!income || !source || saving}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all font-semibold shadow-lg hover:shadow-xl disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Save Income Information
                </>
              )}
            </button>
          </div>
        </section>

        {/* INFO FOOTER */}
        <section className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Privacy & Security</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                All your financial information is securely stored and encrypted. We do not share your data with third parties.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}