import { useMemo } from "react";
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from "recharts";

const COLORS = [
  "#6366F1", // indigo
  "#22C55E", // green
  "#F97316", // orange
  "#EC4899", // pink
  "#0EA5E9", // sky
];

export default function ExpenseCategoryChart({ expenses }) {
  const data = useMemo(() => {
    const map = {};
    let total = 0;

    expenses.forEach((e) => {
      const amount = Number(e.amount || 0);
      map[e.category] = (map[e.category] || 0) + amount;
      total += amount;
    });

    return Object.entries(map).map(
      ([category, amount], index) => ({
        name: category,
        value: Math.round((amount / total) * 100),
        fill: COLORS[index % COLORS.length],
      })
    );
  }, [expenses]);

  if (data.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm max-w-md">
      <h2 className="text-lg font-semibold mb-1">
        Spending Overview
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Visual summary of category spending
      </p>

      <div className="w-full h-[260px]">
        <ResponsiveContainer>
          <RadialBarChart
            innerRadius="25%"
            outerRadius="90%"
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <RadialBar
              minAngle={15}
              background
              clockWise
              dataKey="value"
              cornerRadius={10}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 space-y-2">
        {data.map((item) => (
          <div
            key={item.name}
            className="flex items-center gap-2 text-sm"
          >
            <span
              className="w-3 h-3 rounded-full"
              style={{ background: item.fill }}
            />
            <span className="flex-1">
              {item.name}
            </span>
            <span className="text-gray-600">
              {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
