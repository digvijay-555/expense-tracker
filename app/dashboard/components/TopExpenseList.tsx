"use client";

import { useRouter } from "next/navigation";

type Expense = {
  _id: string;
  amount: number;
  category: string;
  note?: string;
  date: string;
};

export default function TopExpenseList({
  expenses,
  token,
  limit = 5,
}: {
  expenses: Expense[];
  token?: string;
  limit?: number;
}) {
  const router = useRouter();

  async function deleteExpense(id: string, token?: string) {
    const res = await fetch(`/api/expense?id=${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      router.refresh();
    } else {
      alert("Failed to delete expense");
    }
  }

  const topExpenses = [...expenses]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);

  if (topExpenses.length === 0) {
    return (
      <p className="text-[var(--foreground)] opacity-60">
        No expenses yet.
      </p>
    );
  }

  return (
    <div
      className="rounded-lg
                 bg-[var(--card)]
                 border border-[var(--border)]
                 shadow-sm"
    >
      <h2
        className="text-lg font-semibold p-4
                   border-b border-[var(--border)]"
      >
        Top Expenses
      </h2>

      <div>
        {topExpenses.map((e) => (
          <div
            key={e._id}
            className="flex justify-between items-center p-4
                       border-b border-[var(--border)]
                       last:border-b-0
                       hover:bg-white/5 transition"
          >
            <div>
              <p className="font-medium">
                {e.category}
              </p>

              <p className="text-sm opacity-60">
                {new Date(e.date).toDateString()}
              </p>

              {e.note && (
                <p className="text-sm opacity-80">
                  {e.note}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <span className="font-bold text-red-500">
                ₹{e.amount}
              </span>

              <button
                onClick={() => deleteExpense(e._id, token)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
