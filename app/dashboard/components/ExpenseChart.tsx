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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

export default function ExpenseChart({ expenses }: { expenses: Expense[] }) {
  // group by category
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
    <div className="bg-white p-4 rounded shadow h-[300px]">
      <h2 className="font-semibold mb-4">Expenses by Category</h2>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >
            {chartData.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
