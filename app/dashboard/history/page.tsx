import { getServerSession } from "next-auth";
import ExpenseList from "../components/ExpenseList";

import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

async function getExpenses(token: string) {
  const res = await fetch("http://localhost:3000/api/expense", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch expenses");
  return res.json();
}

export default async function HistoryPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const token = session.appToken;
    const expenses = await getExpenses(token);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Expense History</h1>
            <p className="text-sm text-gray-600">
                Logged in as {session.user.email}
            </p>

            <ExpenseList expenses={expenses} token={token} />
        </div>
    );
}