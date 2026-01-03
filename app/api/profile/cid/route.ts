import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { User } from "@/models/Users";
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  await connectDB();

  const user = await User.findOne(
    { email: session.user.email },
    { cid: 1 }
  );

  return NextResponse.json({ cid: user?.cid ?? null });
}
