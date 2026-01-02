import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Expense } from "@/models/Expense";
import { getUserFromRequest } from "@/lib/auth";
import twilio from "twilio";
import { User } from "@/models/Users";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get user with WhatsApp number
    const expenses = await Expense.find({ userId: user.userId })
      .sort({ date: -1 })
      .limit(5);

    if (expenses.length === 0) {
      return NextResponse.json(
        { message: "No expenses found" },
        { status: 200 }
      );
    }

    let text = "📊 Your recent expenses:\n\n";

    expenses.forEach((e, i) => {
      text += `${i + 1}. ₹${e.amount} • ${e.category}\n`;
      if (e.note) text += `   ${e.note}\n`;
      text += "\n";
    });

    const WhatsappObj = await User.findOne({ _id: user.userId }).select("whatsapp");
    // console.log("Found WhatsApp:", whatsapp);
    const whatsapp = WhatsappObj.whatsapp.replace("whatsapp:+", "");
    // Send WhatsApp message
    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM!,
      to: `whatsapp:${whatsapp}`, // must exist in DB
      body: text,
    });

    return NextResponse.json(
      { message: "Expenses sent on WhatsApp" },
      { status: 200 }
    );
  } catch (err) {
    console.error("WhatsApp send error:", err);
    return NextResponse.json(
      { error: "Failed to send WhatsApp message" },
      { status: 500 }
    );
  }
}
