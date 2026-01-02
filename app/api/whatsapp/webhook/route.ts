import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Expense } from "@/models/Expense";
import { getUserFromWhatsapp } from "@/lib/auth";
import { getUserFromRequest } from "@/lib/auth";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

/**
 * Twilio sends form-data (not JSON)
 */
export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const body = formData.get("Body")?.toString().trim() || "";
  const from = formData.get("From")?.toString();
  // example: whatsapp:+919876543210

  if (!from || !body) {
    return NextResponse.json({ message: "Invalid request" });
  }

  await connectDB();

  // 🔐 Auth via WhatsApp number
  const user = await getUserFromWhatsapp(from);

  if (!user) {
    return twilioReply(
      "❌ Your WhatsApp number is not linked to any account."
    );
  }

  /* ---------------- LIST COMMAND ---------------- */

  if (isListCommand(body)) {

    // const user = await getUserFromWhatsapp(from);
    
        // if (!user) {
        //   return NextResponse.json(
        //     { message: "Unauthorized" },
        //     { status: 401 }
        //   );
        // }
    
        //await connectDB();
    
    const expenses = await Expense.find({ userId: user.userId })
      .sort({ date: -1 });

    if (expenses.length === 0) {
      return twilioReply("📭 No expenses found.");
    }

    let message = "📊 Your recent expenses:\n\n";

    expenses.forEach((e, i) => {
      const date = new Date(e.date).toLocaleDateString();
      message += `${i + 1}. ₹${e.amount} • ${e.category}\n`;
      message += `   ${e.note || ""} (${date})\n\n`;
    });




    return twilioReply(message);
  }

  /* ---------------- ADD EXPENSE ---------------- */

  const parsed = parseExpense(body);

  if (!parsed) {
    return twilioReply(
      "❌ Invalid format.\n\n" +
      "Add expense:\n" +
      "expense 250 food lunch\n\n" +
      "View expenses:\n" +
      "list"
    );
  }

  await Expense.create({
    userId: user.userId,
    amount: parsed.amount,
    category: parsed.category,
    note: parsed.note,
    date: new Date(),
  });

  return twilioReply(
    `✅ Expense added!\n₹${parsed.amount} • ${parsed.category}`
  );
}

/* ---------------- HELPERS ---------------- */

function isListCommand(message: string) {
  const text = message.toLowerCase();
  return (
    text === "list" ||
    text === "expenses" ||
    text === "list expenses"
  );
}

function parseExpense(message: string) {
  // supports: expense 250 food lunch with friends
  const regex = /^expense\s+(\d+)\s+(\w+)\s+(.+)/i;
  const match = message.match(regex);

  if (!match) return null;

  return {
    amount: Number(match[1]),
    category: match[2],
    note: match[3],
  };
}

function formatExpenseList(expenses: any[]) {
  let text = "📊 *Your recent expenses:*\n\n";

  expenses.forEach((e, index) => {
    const date = new Date(e.date).toLocaleDateString();
    text += `${index + 1}. ₹${e.amount} • ${e.category}\n`;
    text += `   ${e.note || ""} (${date})\n\n`;
  });

  text += "Reply `expense <amount> <category> <note>` to add more.";

  return text;
}

/**
 * Twilio expects XML (TwiML)
 */
function twilioReply(message: string) {
  return new NextResponse(
    `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${message}</Message>
</Response>`,
    {
      headers: {
        "Content-Type": "text/xml",
      },
    }
  );
}
