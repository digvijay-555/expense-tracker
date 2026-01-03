import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/Users";


export async function POST(req: Request) {
  const formData = await req.formData();
  const jwt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmZWUyNWM2ZS03N2MwLTRjZTktYWRiNy02MDU1Mjk5NDYxOWIiLCJlbWFpbCI6ImRldi5kZWNlcHRvcjU1NUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiNmE0NDU4MGRlZTU1YTM4YjUxMTAiLCJzY29wZWRLZXlTZWNyZXQiOiI2NDVmOTcwODA0NThlMWE3Y2IzYzA5MTMyZGFjZmEwOTQ5ZGQzNWJmZmZhN2NkMTczODAyMmRhMjU2YjZjOGI5IiwiZXhwIjoxNzk5MDAxNjczfQ.RKxY2IvzJjfOmDfysE0yT9_8XSaJcanDn1P1hslbtZk`
  if (!jwt) {
        throw new Error("Pinata JWT is missing");
      }

  const res = await axios.post(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    formData,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      maxContentLength: Infinity,
    }
  );
  const session = await getServerSession(authOptions);
  
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  const dt = NextResponse.json(res.data);
  const new_dt = await dt.json();
  const cid = new_dt.IpfsHash;
  console.log("CID from upload route:", cid);
  await connectDB();

  
  await User.findOneAndUpdate(
    { email: session.user.email },
    { cid: cid }
  );

  return NextResponse.json(res.data);
}
