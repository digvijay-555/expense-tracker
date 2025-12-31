"use client";

type Props = {
  totalSpent: number;
};

export default function SummaryCards({ totalSpent }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="p-4 bg-white rounded shadow">
        <p className="text-sm text-gray-500">Total Spent</p>
        <p className="text-2xl font-bold">₹{totalSpent}</p>
      </div>
    </div>
  );
}
