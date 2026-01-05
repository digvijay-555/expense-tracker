import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AddRecurringDialog from "./components/AddRecurringForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AddRecurringForm from "./components/AddRecurringForm";
import ExpenseList from "./components/RecurringList";
import RecurringList from "./components/RecurringList";
import { connectDB } from "@/lib/db";
import { RecurringExpense } from "@/models/RecurringExpense";



async function getRecurringExpenses(token: string) {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/recurring-expense`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch expenses");
  return res.json();
}


export default async function RecurringPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const token = session.appToken;

  //const recurring_expenses = await getRecurringExpenses(token);

  await connectDB();

  const recurring_expenses = await RecurringExpense.find({
    userId: session.user.id,
  }).lean();

  

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Recurring Expenses</h1>
        <AddRecurringForm />
      </div>

      <RecurringList recurring_expenses={recurring_expenses} />
    </div>
  );
}


