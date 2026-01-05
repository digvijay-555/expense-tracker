"use client";

import { useRouter } from "next/navigation";

type RecurringExpense = {
  _id: string;
  type: string;
  title: string;
  amount: number;
  startDate: string;
  //endDate?: string;
  interval: string;
};


export default function RecurringList({
  recurring_expenses,
  token,
}: {
  recurring_expenses: RecurringExpense[];
  token?: string;
}) {
  const router = useRouter();

  async function deleteRecurringExpense(id: string, token?: string) {
    const res = await fetch(`/api/recurring-expense?id=${id}`, {
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

  if (recurring_expenses.length === 0) {
    return (
      <p className="text-[var(--foreground)] opacity-60">
        No recurring expenses yet.
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
      {recurring_expenses.map((e) => (
        <div
          key={e._id}
          className="flex justify-between items-center p-4
                     border-b border-[var(--border)]
                     last:border-b-0
                     hover:bg-white/5 transition"
        >
          {/* Left */}
          <div>
            <p className="font-medium">
              {e.type}
            </p>

            <p className="text-sm opacity-60">
              {new Date(e.startDate).toDateString()}
            </p>

            {e.title && (
              <p className="text-sm opacity-80">
                {e.title}
              </p>
            )}
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            <span className="font-bold text-red-500">
              ₹{e.amount}
            </span>

            <button
              onClick={() => deleteRecurringExpense(e._id, token)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
