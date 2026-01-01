"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddExpenseForm({token} : {token?: string}) {
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/expense", {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${token}`
       },
      body: JSON.stringify({
        amount: Number(amount),
        category,
        note,
        date,
      }),
    });

    setLoading(false);

    if (res.ok) {
      setAmount("");
      setCategory("");
      setNote("");
      setDate("");
      router.refresh(); // 🔥 re-fetch expenses
    } else {
      alert("Failed to add expense");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow space-y-4"
    >
      <h2 className="font-semibold">Add Expense</h2>

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        className="w-full border p-2 rounded"
      />

      <input
        type="text"
        placeholder="Category (Food, Travel...)"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
        className="w-full border p-2 rounded"
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        className="w-full border p-2 rounded"
      />

      <input
        type="text"
        placeholder="Note (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading ? "Adding..." : "Add Expense"}
      </button>
    </form>
  );
}
