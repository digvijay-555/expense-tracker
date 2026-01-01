"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Expense = {
  amount: number;
  category: string;
};

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function ExpenseChart({ expenses }: { expenses: Expense[] }) {
  // Group by category
  const dataMap: Record<string, number> = {};

  expenses.forEach((e) => {
    dataMap[e.category] = (dataMap[e.category] || 0) + e.amount;
  });

  const chartData = Object.entries(dataMap).map(([name, value]) => ({
    name,
    value,
  }));

  if (chartData.length === 0) return null;

  return (
    <div
      className="p-6 rounded-lg
                 bg-[var(--card)]
                 border border-[var(--border)]
                 shadow-sm"
    >
      <h2 className="font-semibold mb-4">
        Expenses by Category
      </h2>

      {/* IMPORTANT: give the chart a fixed height */}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius={110}
              innerRadius={50}
              paddingAngle={2}
              label={({ name, value }) => `${name}: ${value}`}
              labelLine={false}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            {/* Dark-mode friendly tooltip */}
            <Tooltip
              contentStyle={{
                backgroundColor: "#020617",
                border: "1px solid #1e293b",
                color: "#e5e7eb",
                borderRadius: "6px",
              }}
              itemStyle={{ color: "#e5e7eb" }}
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
