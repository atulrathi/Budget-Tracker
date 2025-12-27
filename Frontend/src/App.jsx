import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashbord/Dashbord";
import Expenses from "./pages/Expenses/Expense";
import Budgets from "./pages/Budget/Budget";
import AppLayout from "../src/layouts/AppLayouts";
import Insights from "./pages/Insights/Insights";
import Subscriptions from "./pages/Subscriptions/Subscripton"

function App() {
  // 🔥 CENTRAL DATA SOURCE
  const [expenses, setExpenses] = useState([
    { id: 1, title: "Food", amount: 4000, category: "Food" },
    { id: 2, title: "Rent", amount: 8000, category: "Rent" },
  ]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard expenses={expenses} />} />
        <Route
          path="/expenses"
          element={<Expenses expenses={expenses} setExpenses={setExpenses} />}
        />
        <Route path="/budgets" element={<Budgets expenses={expenses} />} />
        <Route
  path="/insights"
  element={<Insights expenses={expenses} />}
/>
<Route
  path="/subscriptions"
  element={<Subscriptions expenses={expenses} />}
/>

      </Route>
    </Routes>
  );
}

export default App;
