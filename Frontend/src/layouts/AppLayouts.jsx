import { Outlet, NavLink } from "react-router-dom";

export default function AppLayout() {
  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-lg font-medium ${
      isActive
        ? "bg-purple-100 text-purple-700"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col">
        {/* App Name */}
        <h2 className="text-2xl font-bold mb-8 text-purple-600">
          SpendWise
        </h2>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          <NavLink to="/dashboard" className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/expenses" className={linkClass}>
            Expenses
          </NavLink>
          <NavLink to="/budgets" className={linkClass}>
            Budgets
          </NavLink>
          <NavLink to="/insights" className={linkClass}>
            Insights
          </NavLink>
          <NavLink to="/subscriptions" className={linkClass}>
            Subscriptions
          </NavLink>
        </nav>

        {/* 👤 Simple Rounded Profile (Bottom Left) */}
        <div className="h-9 w-9 rounded-2xl ">
          <img src="/public/profile.jpg" alt="" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-9 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
