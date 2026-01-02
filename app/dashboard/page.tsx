import { getServerSession } from "next-auth";

import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

import SummaryCards from "./components/SummaryCards";
import ExpenseList from "./components/ExpenseList";
import AddExpenseForm from "./components/AddExpenseForm";
import ExpenseChart from "./components/ExpenseChart";
import LogoutButton from "./components/LogoutButton";
import TopExpenseList from "./components/TopExpenseList";

/* ------------------ API HELPERS ------------------ */

async function getExpenses(token: string) {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/expense`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch expenses");
  return res.json();
}

async function getAnalytics(token: string) {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/expense/analytics?month=12&year=2025`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) throw new Error("Failed to fetch analytics");
  return res.json();
}

/* ------------------ DASHBOARD ------------------ */

export default async function DashboardPage() {
  // ✅ Use NextAuth session (works for Google + credentials)
  const session = await getServerSession(authOptions);
  

  // 🔐 Protect route
  if (!session) {
    redirect("/login");
  }

  // ✅ Your app JWT (created after Google sign-in)
  const token = session.appToken;

  const analytics = await getAnalytics(token);
  const expenses = await getExpenses(token);

  return (
    <div className="p-6 space-y-6">
      
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Expense Dashboard</h1>
        {/* <LogoutButton /> */}
      </div>

      <p className="text-sm text-gray-600">
        Logged in as {session.user.email}
      </p>
      
      <ExpenseChart expenses={expenses} />

      
        <AddExpenseForm token={token} />
      
      <TopExpenseList expenses={expenses} token={token} />

      {/* <ExpenseList expenses={expenses} token={token} /> */}

      <SummaryCards totalSpent={analytics.totalSpent} />
    </div>
  );
}
