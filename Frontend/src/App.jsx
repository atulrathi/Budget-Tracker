import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashbord/Dashbord";
import Expenses from "./pages/Expenses/Expense";
import Budgets from "./pages/Budget/Budget";
import Insights from "./pages/Insights/Insights";
import Subscriptions from "./pages/Subscriptions/Subscripton";
// import Settings from "./pages/Settings/Settings";
import AppLayout from "../src/layouts/AppLayouts";
import Proctedroute from "./pages/proctedroute/Userproctedroute";
import Userproctedroute from "./pages/proctedroute/userloginroute";

function App() {
  // 🔥 CENTRAL DATA SOURCE
  const [expenses, setExpenses] = useState([]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/" 
        element={
          <Userproctedroute>
            <Login />
          </Userproctedroute>
        } 
      />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes with Layout */}
      <Route element={<AppLayout />}>
        <Route 
          path="/dashboard" 
          element={
            <Proctedroute>
              <Dashboard expenses={expenses} />
            </Proctedroute>
          } 
        />
        <Route
          path="/expenses"
          element={
            <Proctedroute>
              <Expenses expenses={expenses} setExpenses={setExpenses} />
            </Proctedroute>
          }
        />
        <Route 
          path="/budgets" 
          element={
            <Proctedroute>
              <Budgets expenses={expenses} />
            </Proctedroute>
          } 
        />
        <Route
          path="/insights"
          element={
            <Proctedroute>
              <Insights expenses={expenses} />
            </Proctedroute>
          }
        />
        <Route
          path="/subscriptions"
          element={
            <Proctedroute>
              <Subscriptions expenses={expenses} />
            </Proctedroute>
          }
        />
        {/* <Route
          path="/settings"
          element={
            <Proctedroute>
              <Settings />
            </Proctedroute>
          }
        /> */}
      </Route>
    </Routes>
  );
}

export default App;