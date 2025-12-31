"use client";

import { useRouter } from "next/navigation";

type Expense = {
  _id: string;
  amount: number;
  category: string;
  note?: string;
  date: string;
};

export default function ExpenseList({ expenses, token }: { expenses: Expense[]; token?: string }) {
  const router = useRouter();

  async function deleteExpense(id: string, token?: string) {
    const res = await fetch(`/api/expense?id=${id}`, {
      method: "DELETE",
      headers: {
      Authorization: `Bearer ${token}`,
    },
    });

    if (res.ok) {
      router.refresh(); // re-fetch server data
    } else {
      alert("Failed to delete expense");
    }
  }

  if (expenses.length === 0) {
    return <p className="text-gray-500">No expenses yet.</p>;
  }

  return (
    <div className="bg-white rounded shadow divide-y">
      {expenses.map((e) => (
        <div
          key={e._id}
          className="flex justify-between items-center p-4"
        >
          <div>
            <p className="font-medium">{e.category}</p>
            <p className="text-sm text-gray-500">
              {new Date(e.date).toDateString()}
            </p>
            {e.note && <p className="text-sm">{e.note}</p>}
          </div>

          <div className="flex items-center gap-4">
            <span className="font-bold">₹{e.amount}</span>
            <button
              onClick={() => deleteExpense(e._id, token)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
