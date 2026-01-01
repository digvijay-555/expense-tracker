import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Expense } from "@/models/Expense";
import { getUserFromWhatsapp } from "@/lib/auth";

/**
 * Twilio sends form-data (not JSON)
 */
export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const body = formData.get("Body")?.toString() || "";
  const from = formData.get("From")?.toString();
  // example: whatsapp:+919876543210

  if (!from || !body) {
    return NextResponse.json({ message: "Invalid request" });
  }

  await connectDB();

  // 🔐 Auth via WhatsApp number (NEW)
  const user = await getUserFromWhatsapp(from);

  if (!user) {
    return twilioReply(
      "❌ Your WhatsApp number is not linked to any account."
    );
  }

  const parsed = parseExpense(body);

  if (!parsed) {
    return twilioReply(
      "❌ Invalid format.\nUse: expense 250 food lunch"
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

function parseExpense(message: string) {
  // supports: expense 250 food lunch with friends
  const regex = /^expense\s+(\d+)\s+(\w+)\s+(.+)/i;
  const match = message.trim().match(regex);

  if (!match) return null;

  return {
    amount: Number(match[1]),
    category: match[2],
    note: match[3],
  };
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
