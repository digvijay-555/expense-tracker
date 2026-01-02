// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import { connectDB } from "@/lib/db";
// import { User } from "@/models/Users";
// import { signToken } from "@/lib/auth";

// export async function POST(req: Request) {
//   try {
//     const { name, email, password, whatsappNumber} = await req.json();

//     // Validation
//     if (!name || !email || !password) {
//       return NextResponse.json(
//         { message: "All fields are required" },
//         { status: 400 }
//       );
//     }

//     await connectDB();

//     // Check existing user
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return NextResponse.json(
//         { message: "User already exists" },
//         { status: 409 }
//       );
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user
//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     // Generate token
//     const token = signToken({ userId: user._id, email: user.email });

//     return NextResponse.json(
//       {
//         token,
//         user: {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//           whatsappNumber: user.whatsappNumber,
//         },
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Register error:", error);
//     return NextResponse.json(
//       { message: "Registration failed" },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/Users";

export async function POST(req: Request) {
  try {
    const { name, email, password, whatsappNumber } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All required fields must be filled" },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // ✅ HASH PASSWORD (CRITICAL)
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      whatsapp: whatsappNumber || undefined, // 🔥 FIXED
      provider: "credentials",
    });

    return NextResponse.json(
      { message: "Registration successful" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
