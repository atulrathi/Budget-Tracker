import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { 
  Repeat, 
  Plus,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Pause,
  Play,
  Trash2,
  Edit2,
  X,
  Clock
} from "lucide-react";

const API_URL = "http://localhost:5000/subscriptions";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: 'Subscriptions',
    frequency: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    notes: '',
    reminderDays: 3
  });
  const [formError, setFormError] = useState('');
  const targetref = useRef(null);

  //scroll to top on load
  const scrollTo = useCallback(() => {
    targetref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  useEffect(() => {
    fetchSubscriptions();
    if(showForm){
      scrollTo();
    }
  }, [showForm]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(API_URL, {
        headers: getAuthHeaders(),
      });
      setSubscriptions(data.subscriptions || []);
      setSummary(data.summary || null);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name || !formData.amount) {
      setFormError('Please fill in all required fields');
      return;
    }

    try {
      if (editingSubscription) {
        await axios.put(
          `${API_URL}/${editingSubscription._id}`,
          formData,
          { headers: getAuthHeaders() }
        );
      } else {
        await axios.post(API_URL, formData, {
          headers: getAuthHeaders(),
        });
      }

      setShowForm(false);
      setEditingSubscription(null);
      resetForm();
      fetchSubscriptions();
    } catch (error) {
      setFormError(error.response?.data?.message || 'Failed to save subscription');
    }
  };

  const handleEdit = (subscription) => {
    setEditingSubscription(subscription);
    setFormData({
      name: subscription.name,
      amount: subscription.amount,
      category: subscription.category,
      frequency: subscription.frequency,
      startDate: new Date(subscription.startDate).toISOString().split('T')[0],
      notes: subscription.notes || '',
      reminderDays: subscription.reminderDays || 3
    });
    setShowForm(true);
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'paused' : 'active';
      await axios.patch(
        `${API_URL}/${id}/toggle`,
        { status: newStatus },
        { headers: getAuthHeaders() }
      );
      fetchSubscriptions();
    } catch (error) {
      console.error('Error toggling subscription:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subscription?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: getAuthHeaders(),
      });
      fetchSubscriptions();
    } catch (error) {
      console.error('Error deleting subscription:', error);
    }
  };

  const handleProcessRenewals = async () => {
    if (!window.confirm('Process all due renewals and create expenses?')) {
      return;
    }

    try {
      setProcessing(true);
      const { data } = await axios.post(
        `${API_URL}/process-renewals`,
        {},
        { headers: getAuthHeaders() }
      );
      alert(`Processed ${data.processed} renewals successfully!`);
      fetchSubscriptions();
    } catch (error) {
      console.error('Error processing renewals:', error);
      alert('Failed to process renewals');
    } finally {
      setProcessing(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      amount: '',
      category: 'Subscriptions',
      frequency: 'monthly',
      startDate: new Date().toISOString().split('T')[0],
      notes: '',
      reminderDays: 3
    });
    setFormError('');
  };

  const getDaysUntilRenewal = (nextRenewalDate) => {
    const today = new Date();
    const renewal = new Date(nextRenewalDate);
    const diffTime = renewal - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (days) => {
    if (days < 0) return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
    if (days <= 3) return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' };
    if (days <= 7) return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' };
    return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* HEADER SKELETON */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl animate-shimmer bg-[length:200%_100%]"></div>
              <div className="space-y-2">
                <div className="h-8 w-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-shimmer bg-[length:200%_100%]"></div>
                <div className="h-4 w-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]"></div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="h-10 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl animate-shimmer bg-[length:200%_100%]"></div>
              <div className="h-10 w-44 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl animate-shimmer bg-[length:200%_100%]"></div>
            </div>
          </header>

          {/* SUMMARY CARDS SKELETON */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative bg-white rounded-3xl shadow-2xl p-6 overflow-hidden border border-gray-100">
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-xl animate-shimmer bg-[length:200%_100%]"></div>
                  <div className="h-3 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]"></div>
                  <div className="h-8 w-28 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-shimmer bg-[length:200%_100%]"></div>
                </div>
              </div>
            ))}
          </div>

          {/* SUBSCRIPTIONS LIST SKELETON */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-8">
            <div className="h-6 w-56 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%] mb-6"></div>

            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-6 w-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]"></div>
                        <div className="h-5 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-shimmer bg-[length:200%_100%]"></div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="h-4 w-28 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]"></div>
                        <div className="h-4 w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-shimmer bg-[length:200%_100%]"></div>
                      </div>

                      <div className="h-8 w-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-shimmer bg-[length:200%_100%]"></div>
                    </div>

                    <div className="flex gap-2">
                      <div className="w-9 h-9 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-shimmer bg-[length:200%_100%]"></div>
                      <div className="w-9 h-9 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-shimmer bg-[length:200%_100%]"></div>
                      <div className="w-9 h-9 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-shimmer bg-[length:200%_100%]"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Repeat className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Subscriptions
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage recurring expenses automatically
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleProcessRenewals}
              disabled={processing}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-cyan-600 rounded-xl font-medium hover:bg-cyan-50 transition-all shadow-md hover:shadow-lg border border-cyan-100"
            >
              <Clock className={`w-4 h-4 ${processing ? 'animate-spin' : ''}`} />
              Process Due
            </button>
            
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditingSubscription(null);
                resetForm();
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all font-semibold shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Add Subscription
            </button>
          </div>
        </header>

        {/* SUMMARY CARDS */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="relative bg-gradient-to-br from-red-500 to-rose-600 rounded-3xl shadow-2xl p-6 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3 border border-white/30">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <p className="text-white/80 text-xs font-medium mb-1">Monthly Cost</p>
                <p className="text-3xl font-bold text-white">
                  ₹{summary.monthlyTotal.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            <div className="relative bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl shadow-2xl p-6 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3 border border-white/30">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <p className="text-white/80 text-xs font-medium mb-1">Yearly Cost</p>
                <p className="text-3xl font-bold text-white">
                  ₹{summary.yearlyTotal.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-2xl p-6 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3 border border-white/30">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <p className="text-white/80 text-xs font-medium mb-1">Average</p>
                <p className="text-3xl font-bold text-white">
                  ₹{summary.averageCost.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            <div className="relative bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl shadow-2xl p-6 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3 border border-white/30">
                  <Repeat className="w-5 h-5 text-white" />
                </div>
                <p className="text-white/80 text-xs font-medium mb-1">Active</p>
                <p className="text-3xl font-bold text-white">
                  {summary.active} / {summary.total}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ADD/EDIT FORM */}
        {showForm && (
          <div ref={targetref} className="bg-white border border-gray-100 rounded-2xl shadow-2xl p-8">            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingSubscription ? 'Edit Subscription' : 'Add New Subscription'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingSubscription(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {formError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subscription Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Netflix, Spotify"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Amount (₹) *
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  placeholder="0"
                  min="0"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  placeholder="Subscriptions"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Frequency *
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reminder (days before)
                </label>
                <input
                  type="number"
                  value={formData.reminderDays}
                  onChange={(e) => setFormData({...formData, reminderDays: e.target.value})}
                  min="0"
                  max="30"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Any additional notes..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingSubscription(null);
                  resetForm();
                }}
                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {editingSubscription ? 'Update' : 'Create'} Subscription
              </button>
            </div>
          </div>
        )}

        {/* SUBSCRIPTIONS LIST */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Subscriptions</h2>

          {subscriptions.length === 0 ? (
            <div className="text-center py-16">
              <Repeat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No subscriptions yet</p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Add Your First Subscription
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {subscriptions.map((sub) => {
                const daysUntil = getDaysUntilRenewal(sub.nextRenewalDate);
                const statusColor = getStatusColor(daysUntil);

                return (
                  <div
                    key={sub._id}
                    className="group relative bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{sub.name}</h3>
                          <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                            sub.status === 'active' ? 'bg-green-100 text-green-700' :
                            sub.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {sub.status}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <span className="font-semibold">₹{sub.amount.toLocaleString('en-IN')} / {sub.frequency}</span>
                          <span>•</span>
                          <span>{sub.category}</span>
                        </div>

                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 ${statusColor.bg} ${statusColor.border} border rounded-lg`}>
                          <Clock className={`w-4 h-4 ${statusColor.text}`} />
                          <span className={`text-sm font-semibold ${statusColor.text}`}>
                            {daysUntil < 0 
                              ? `Overdue by ${Math.abs(daysUntil)} days` 
                              : daysUntil === 0
                              ? 'Renews today!'
                              : `${daysUntil} days until renewal`
                            }
                          </span>
                        </div>

                        {sub.notes && (
                          <p className="text-sm text-gray-500 mt-2">{sub.notes}</p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleStatus(sub._id, sub.status)}
                          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
                          title={sub.status === 'active' ? 'Pause' : 'Resume'}
                        >
                          {sub.status === 'active' ? (
                            <Pause className="w-4 h-4 text-gray-700" />
                          ) : (
                            <Play className="w-4 h-4 text-gray-700" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEdit(sub)}
                          className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4 text-blue-700" />
                        </button>
                        <button
                          onClick={() => handleDelete(sub._id)}
                          className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4 text-red-700" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}