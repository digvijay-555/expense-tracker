"use client";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

export default function AddRecurringForm({ token }: { token?: string }) {
    const router = useRouter();
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    const [type, setType] = useState("subscription");
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [startDate, setStartDate] = useState("");
    //const [endDate, setEndDate] = useState("");
    const [interval, setInterval] = useState("monthly");
    const [loading, setLoading] = useState(false);

    // async function handleSubmit(e: React.FormEvent) {
    //     e.preventDefault();
    //     setLoading(true);

    //     const res = await fetch("/api/recurring-expense", {
    //         method: "POST",
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //         },
    //         body: {
    //             type,
    //             title,
    //             amount: Number(amount),
    //             startDate,
    //             //endDate: endDate || null,
    //             interval,
    //         },
    //     });

    //     setLoading(false);

    //     if (res.ok) {
    //         setType("");
    //         setTitle("");
    //         setAmount("");
    //         setStartDate("");
    //         //setEndDate("");
    //         setInterval("monthly");
    //         dialogRef.current?.close();
    //         router.refresh();
    //     }
    //     else {
    //         alert("Failed to add recurring expense");
    //     }
    // }   

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const res = await fetch("/api/recurring-expense", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
            type,
            title,
            amount: Number(amount),
            startDate,
            interval,
            }),
        });

        setLoading(false);

        if (res.ok) {
            setType("subscription");
            setTitle("");
            setAmount("");
            setStartDate("");
            setInterval("monthly");
            dialogRef.current?.close();
            router.refresh();
        } else {
            alert("Failed to add recurring expense");
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
                Add Recurring Expense
            </button>

            {/* Dialog */}
            <dialog
                ref={dialogRef}
                className="rounded-lg p-0
                   bg-transparent
                   backdrop:bg-black/60
                   fixed top-1/2 left-1/2
                   -translate-x-1/2 -translate-y-1/2"
            >
                <form onSubmit={handleSubmit} className="relative w-full max-w-md p-6 rounded-lg
                     bg-[var(--card)]
                     text-[var(--foreground)]
                     border border-[var(--border)]
                     shadow-lg space-y-4">

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
                    <h2 className="text-xl font-bold">Add Recurring Expense</h2>

                    <div>
                        <label className="block mb-1">Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full p-2 border"
                        >
                            <option value="subscription">Subscription</option>
                            <option value="emi">EMI</option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 border"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1">Amount</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full p-2 border"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1">Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full p-2 border"
                            required
                        />
                    </div>

                    {/* <div>
                        <label className="block mb-1">End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full p-2 border"
                        />
                    </div> */}

                    <div>
                        <label className="block mb-1">Interval</label>
                        <select
                            value={interval}
                            onChange={(e) => setInterval(e.target.value)}
                            className="w-full p-2 border"
                        >
                            {/* <option value="daily">Daily</option> */}
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            {/* <option value="yearly">Yearly</option> */}
                        </select>
                    </div>

                    <div className="flex justify-end gap-4">
                        {/* <button
                            type="button"
                            onClick={() => dialogRef.current?.close()}
                            className="px-4 py-2 rounded
                               bg-gray-300 text-black
                               hover:bg-gray-400"
                        >
                            Cancel
                        </button> */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 rounded
                               bg-blue-600 text-white
                               hover:bg-blue-700 disabled:opacity-50 w-2xs"
                        >
                            {loading ? "Adding..." : "Add"}
                        </button>
                    </div>
                </form>
            </dialog>
        </>
    );
}