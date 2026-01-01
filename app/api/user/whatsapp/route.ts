import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/Users";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { whatsapp } = await req.json();

  if (!whatsapp || !whatsapp.startsWith("whatsapp:+")) {
    return NextResponse.json(
      { error: "Invalid WhatsApp format" },
      { status: 400 }
    );
  }

  await connectDB();

  await User.findOneAndUpdate(
    { email: session.user.email },
    { whatsapp }
  );

  return NextResponse.json({ success: true });
}
