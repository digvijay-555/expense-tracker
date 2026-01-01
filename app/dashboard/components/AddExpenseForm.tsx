"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function AddExpenseForm({token} : {token?: string}) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement | null>(null);
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

    <div>
      <button
              onClick={() => dialogRef.current?.showModal()}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Add Expense
            </button>
    <dialog ref={dialogRef}
    onClick={(e) => {
    if (e.target === dialogRef.current) {
      dialogRef.current.close();
    }
  }}
   className="rounded-lg p-6 backdrop:bg-black/50 
             fixed top-1/2 left-1/2 
             -translate-x-1/2 -translate-y-1/2">

              
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow space-y-4"
    >
      <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          className="absolute top-8 right-10 w-6 rounded text-white hover:text-black bg-red-600"
        >
          ✕
        </button>
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
    </dialog>
    </div>
  );
}
