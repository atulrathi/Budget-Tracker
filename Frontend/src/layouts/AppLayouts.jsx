import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  Sparkles,
  Repeat,
  LogOut,
  Menu,
  X,
  DollarSign,
  PiggyBank,
} from "lucide-react";
import Income from "../Components/income";
import { useEffect, useState, useCallback, useMemo, useContext } from "react";
import { UserContext } from "../usecontext/usercontext";
import Budget from "../Components/monthelytarget";

const NAV_ITEMS = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/expenses", icon: Receipt, label: "Expenses" },
  { to: "/budgets", icon: Wallet, label: "Budgets" },
  { to: "/insights", icon: Sparkles, label: "Insights" },
  { to: "/subscriptions", icon: Repeat, label: "Subscriptions" },
];

const API_URL = "http://localhost:5000";

export default function AppLayout() {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);

  const [user, setUser] = useState(null);
  const [income, setIncome] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);

  const fetchUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      const response = await fetch(`${API_URL}/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched user data:", data);
      setUser(data.user);
      setIncome(data.user.Income);
      setMonthlyBudget(data.user.monthlyBudget || "");
      userContext.income = data.user.Income;
      userContext.Budget = data.user.MonthlyBudget || '';
    } catch (err) {
      console.error("Error fetching user data:", err.message);
      localStorage.removeItem("token");
      navigate("/");
    }
  }, [navigate, userContext]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    navigate("/");
  }, [navigate]);

  const linkClass = useCallback(
    ({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
        isActive
          ? "bg-purple-600 text-white"
          : "text-gray-700 hover:bg-gray-100"
      }`,
    []
  );

  const userInitial = useMemo(
    () => (user?.name ? user.name.charAt(0).toUpperCase() : "U"),
    [user]
  );

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
    setIncome(userContext.income);
    setShowBudgetModal(false);
  }, []);

  const toggleIncomeModal = useCallback(() => {
    setIsSidebarOpen(false);
    setShowBudgetModal(false);
    setIncome('')
  }, []);

  const toggleBudgetModal = useCallback(() => {
    setIsSidebarOpen(false);
    setShowBudgetModal(true);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
        aria-label="Toggle menu"
      >
        {isSidebarOpen ? (
          <X className="w-6 h-6 text-gray-700" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 backdrop-blur-lg bg-opacity-50 z-30"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-white border-r border-gray-200 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">SpendWise</h2>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={linkClass}
              onClick={closeSidebar}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </NavLink>
          ))}

          {/* Budget & Income Management Buttons */}
          <div className="pt-4 mt-4 border-t border-gray-200 space-y-2">
            <button
              onClick={toggleIncomeModal}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-green-700 hover:bg-green-50 transition-all"
            >
              <DollarSign className="w-5 h-5" />
              <span>{income ? "Update Income" : "Add Income"}</span>
            </button>

            <button
              onClick={toggleBudgetModal}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-blue-700 hover:bg-blue-50 transition-all"
            >
              <PiggyBank className="w-5 h-5" />
              <span>
                {monthlyBudget ? "Update Monthly Target" : "Monthly Target"}
              </span>
            </button>
          </div>
        </nav>

        {/* Profile Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold">
              {userInitial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">
                {user?.name || "Loading..."}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-red-600 text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full">
        {!showBudgetModal ? ( !income ?  <Income/>  : <Outlet />):<Budget /> }
      </main>
    </div>
  );
}
