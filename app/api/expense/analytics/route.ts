import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Expense } from "@/models/Expense";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const month = Number(searchParams.get("month"));
    const year = Number(searchParams.get("year"));

    if (!month || !year) {
      return NextResponse.json(
        { error: "Month and year are required" },
        { status: 400 }
      );
    }

    // Month range
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month, 31);

    const analytics = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(user.userId),
          date: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $sort: { totalAmount: -1 },
      },
    ]);

    const totalSpent = analytics.reduce(
      (sum, item) => sum + item.totalAmount,
      0
    );

    return NextResponse.json(
      {
        month,
        year,
        totalSpent,
        breakdown: analytics,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
