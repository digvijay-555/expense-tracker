import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SummaryCards from "./components/SummaryCards";
import ExpenseList from "./components/ExpenseList";

async function getExpenses(token: string) {
  const res = await fetch("http://localhost:3000/api/expense", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch expenses");
  return res;
}


export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/login");

  const analytics = await getAnalytics(token);
  const expensesRes = await getExpenses(token);
  const expenses = await expensesRes.json();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Expense Dashboard</h1>

      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(analytics, null, 2)}
      </pre>

      <ExpenseList expenses={expenses} token={token} />
      <SummaryCards totalSpent={analytics.totalSpent} />
    </div>
  );
}


async function getAnalytics(token: string) {
  const res = await fetch(
    "http://localhost:3000/api/expense/analytics?month=12&year=2025",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch analytics");
  }

  return res.json();
}
