import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";

/* ================= CONSTANTS ================= */
const COLORS = ["#2563EB", "#16A34A", "#DC2626", "#9333EA", "#F59E0B"];
const TRANSACTION_LIMIT = 6;

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [search, setSearch] = useState("");

  /* ================= FETCH ================= */
  useEffect(() => {
    async function fetchExpenses() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/expenses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExpenses(res.data?.expenses || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchExpenses();
  }, []);

  /* ================= BASIC CALCULATIONS ================= */
  const income = 50000;
  const budget = 40000;

  const totalSpending = useMemo(
    () =>
      expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0),
    [expenses]
  );

  const savings = income - totalSpending;

  /* ================= CHART DATA ================= */
  const budgetChartData = useMemo(
    () => [
      { label: "Planned Budget", amount: budget },
      { label: "Actual Spending", amount: totalSpending },
      {
        label: "Remaining Budget",
        amount: Math.max(budget - totalSpending, 0),
      },
    ],
    [totalSpending]
  );

  const categoryChartData = useMemo(() => {
    const map = {};
    expenses.forEach((e) => {
      const key = e.subCategory || e.category || "Other";
      map[key] = (map[key] || 0) + Number(e.amount || 0);
    });
    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
    }));
  }, [expenses]);

  const monthlyLineData = useMemo(() => {
    const map = {};
    expenses.forEach((e) => {
      const month = new Date(e.createdAt).toLocaleString("en-IN", {
        month: "short",
      });
      map[month] = (map[month] || 0) + Number(e.amount || 0);
    });
    return Object.entries(map).map(([month, amount]) => ({
      month,
      amount,
    }));
  }, [expenses]);

  const topCategories = useMemo(() => {
    return categoryChartData
      .map((c) => ({
        ...c,
        percentage: ((c.value / totalSpending) * 100).toFixed(1),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [categoryChartData, totalSpending]);

  /* ================= TRANSACTIONS ================= */
  const baseTransactions = useMemo(
    () => (showAll ? expenses : expenses.slice(0, TRANSACTION_LIMIT)),
    [expenses, showAll]
  );

  const visibleTransactions = useMemo(() => {
    if (!search) return baseTransactions;
    const term = search.toLowerCase();
    return baseTransactions.filter((e) =>
      (
        (e.category || "") +
        (e.subCategory || "") +
        e.amount +
        new Date(e.createdAt).toLocaleDateString("en-IN")
      )
        .toLowerCase()
        .includes(term)
    );
  }, [baseTransactions, search]);

  /* ================= UI ================= */
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-14">
      {/* HEADER */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Financial Overview
        </h1>
        <p className="text-gray-600 max-w-3xl">
          This dashboard provides a clear summary of your income, spending,
          savings, and expense patterns. Use it to understand where your money
          goes and how well you are managing your budget.
        </p>
      </header>

      {loading ? (
        <Skeleton />
      ) : (
        <>
          {/* SUMMARY */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">
              Overall Summary
            </h2>
            <p className="text-sm text-gray-600">
              A quick snapshot of your financial position based on recorded
              expenses.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Card
                title="Monthly Income"
                value={income}
                description="Total income considered for this period"
              />
              <Card
                title="Total Spending"
                value={totalSpending}
                description="Amount spent so far"
              />
              <Card
                title="Current Savings"
                value={savings}
                description="Remaining amount after expenses"
              />
            </div>
          </section>

          {/* BUDGET + CATEGORY */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <ChartBox
              title="Budget Utilization"
              subtitle="Comparison between your planned budget and actual spending"
            >
              <ResponsiveContainer height={260}>
                <BarChart data={budgetChartData}>
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip formatter={(v) => `₹ ${v}`} />
                  <Bar dataKey="amount">
                    {budgetChartData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={COLORS[i % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartBox>

            <ChartBox
              title="Spending by Category"
              subtitle="Shows how your expenses are distributed across categories"
            >
              <ResponsiveContainer height={300}>
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={110}
                  >
                    {categoryChartData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={COLORS[i % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `₹ ${v}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartBox>
          </section>

          {/* TREND */}
          <section className="space-y-3">
            <ChartBox
              title="Monthly Spending Trend"
              subtitle="Tracks how your spending changes over time"
            >
              <ResponsiveContainer height={300}>
                <LineChart data={monthlyLineData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(v) => `₹ ${v}`} />
                  <Line
                    dataKey="amount"
                    stroke={COLORS[0]}
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartBox>
          </section>

          {/* TOP CATEGORIES */}
          <section className="space-y-3">
            <ChartBox
              title="Top Spending Categories"
              subtitle="Categories where most of your money is being spent"
            >
              <div className="space-y-4">
                {topCategories.map((c, i) => (
                  <div key={c.name}>
                    <div className="flex justify-between text-sm">
                      <span>
                        {i + 1}. {c.name}
                      </span>
                      <span>
                        ₹ {c.value} ({c.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded">
                      <div
                        className="h-2 bg-blue-600 rounded"
                        style={{ width: `${c.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </ChartBox>
          </section>

          {/* TRANSACTIONS */}
          <section className="space-y-3">
            <ChartBox
              title="Recent Transactions"
              subtitle="Detailed list of your most recent expense entries"
            >
              <input
                placeholder="Search transactions by category or date"
                className="border rounded px-3 py-2 text-sm mb-4 w-full sm:w-72"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowAll(false);
                }}
              />

              <table className="w-full text-sm">
                <thead className="border-b text-gray-400">
                  <tr>
                    <th className="text-left py-2">Category</th>
                    <th className="text-left py-2">Amount</th>
                    <th className="text-left py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleTransactions.map((e, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-2">
                        {e.subCategory || e.category}
                      </td>
                      <td className="py-2">₹ {e.amount}</td>
                      <td className="py-2 text-gray-500">
                        {new Date(e.createdAt).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {expenses.length > TRANSACTION_LIMIT && (
                <button
                  className="mt-4 text-blue-600 text-sm"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? "View fewer transactions" : "View all transactions"}
                </button>
              )}
            </ChartBox>
          </section>
        </>
      )}
    </div>
  );
}

/* ================= UI HELPERS ================= */

function Card({ title, value, description }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm space-y-1">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">₹ {value}</p>
      <p className="text-xs text-gray-400">{description}</p>
    </div>
  );
}

function ChartBox({ title, subtitle, children }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm space-y-2">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        {subtitle && (
          <p className="text-sm text-gray-500">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 bg-gray-200 rounded" />
        ))}
      </div>
      <div className="h-72 bg-gray-200 rounded" />
      <div className="h-60 bg-gray-200 rounded" />
    </div>
  );
}
