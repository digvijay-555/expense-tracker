import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { RecurringExpense } from "@/models/RecurringExpense";
import { authOptions, getUserFromRequest } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export async function GET(req: NextRequest) {
  //const user = getUserFromRequest(req);

  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = session.user;


  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const data = await RecurringExpense.find({
    userId: user.id,
  }).sort({ createdAt: -1 });

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = session.user;
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    type,
    title,
    amount,
    startDate,
    //endDate,
    interval,
  } = body;

  if (!type || !title || !amount || !startDate) {
    return NextResponse.json(
      { error: `Missing fields ${type} ${title} ${amount} ${startDate}` },
      { status: 400 }
    );
  }

  await connectDB();

  const expense = await RecurringExpense.create({
    userId: user.id,
    type,
    title,
    amount,
    startDate,
    //endDate: type === "emi" ? endDate : null,
    interval,
  });

  return NextResponse.json(expense, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = session.user;
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  await connectDB();

  await RecurringExpense.deleteOne({ _id: id, userId: user.id });

  return NextResponse.json({ success: true });
}