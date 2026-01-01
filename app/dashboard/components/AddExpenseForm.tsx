"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function AddExpenseForm({ token }: { token?: string }) {
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
        Authorization: `Bearer ${token}`,
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
      dialogRef.current?.close();
      router.refresh();
    } else {
      alert("Failed to add expense");
    }
  }

  return (
    <>
      {/* Open dialog button */}
      <button
        onClick={() => dialogRef.current?.showModal()}
        className="px-4 py-2 rounded
                   bg-blue-600 text-white
                   hover:bg-blue-700"
      >
        Add Expense
      </button>

      {/* Dialog */}
      <dialog
        ref={dialogRef}
        onClick={(e) => {
          if (e.target === dialogRef.current) {
            dialogRef.current.close();
          }
        }}
        className="rounded-lg p-0
                   bg-transparent
                   backdrop:bg-black/60
                   fixed top-1/2 left-1/2
                   -translate-x-1/2 -translate-y-1/2"
      >
        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="relative w-full max-w-md p-6 rounded-lg
                     bg-[var(--card)]
                     text-[var(--foreground)]
                     border border-[var(--border)]
                     shadow-lg space-y-4"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="absolute top-3 right-3 w-7 h-7
                       flex items-center justify-center
                       rounded-full
                       bg-red-600 text-white
                       hover:bg-red-700"
            aria-label="Close"
          >
            ✕
          </button>

          <h2 className="text-lg font-semibold">
            Add Expense
          </h2>

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="w-full p-2 rounded
                       bg-[var(--background)]
                       text-[var(--foreground)]
                       border border-[var(--border)]
                       focus:outline-none focus:ring-2
                       focus:ring-blue-500"
          />

          <input
            type="text"
            placeholder="Category (Food, Travel...)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full p-2 rounded
                       bg-[var(--background)]
                       text-[var(--foreground)]
                       border border-[var(--border)]
                       focus:outline-none focus:ring-2
                       focus:ring-blue-500"
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full p-2 rounded
                       bg-[var(--background)]
                       text-[var(--foreground)]
                       border border-[var(--border)]
                       focus:outline-none focus:ring-2
                       focus:ring-blue-500"
          />

          <input
            type="text"
            placeholder="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-2 rounded
                       bg-[var(--background)]
                       text-[var(--foreground)]
                       border border-[var(--border)]
                       focus:outline-none focus:ring-2
                       focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded
                       bg-blue-600 text-white
                       hover:bg-blue-700
                       disabled:opacity-60"
          >
            {loading ? "Adding..." : "Add Expense"}
          </button>
        </form>
      </dialog>
    </>
  );
}
