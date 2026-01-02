// import jwt from "jsonwebtoken";
// import GoogleProvider from "next-auth/providers/google";
// import type { NextAuthOptions } from "next-auth";
// import { connectDB } from "@/lib/db";
// import { User as UserModel } from "@/models/Users";

// const JWT_SECRET = process.env.JWT_SECRET as string;

// if (!JWT_SECRET) {
//   throw new Error("JWT_SECRET is not defined");
// }

// /* =========================
//    APP JWT HELPERS (UNCHANGED)
// ========================= */

// export function signToken(payload: { userId: string; email: string }) {
//   return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
// }

// export function verifyToken(token: string) {
//   return jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
// }

// /* =========================
//    NEXTAUTH CONFIG (NEW)
// ========================= */

// export const authOptions: NextAuthOptions = {
//   session: {
//     strategy: "jwt",
//   },

//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//   ],

//   callbacks: {
//     /**
//      * Runs on sign-in (Google)
//      * Ensures DB user exists
//      */
//     async signIn({ user, account }) {
//       if (account?.provider !== "google") return true;

//       await connectDB();

//       let dbUser = await UserModel.findOne({ email: user.email });

//       if (!dbUser) {
//         dbUser = await UserModel.create({
//           name: user.name,
//           email: user.email,
//           provider: "google",
//         });
//       }

//       // attach DB userId to NextAuth user
//       (user as any).id = dbUser._id.toString();

//       return true;
//     },

//     /**
//      * Runs whenever JWT is created/updated
//      * We generate OUR app token here
//      */
//     async jwt({ token, user }) {
//       if (user) {
//         const userId = (user as any).id;

//         token.userId = userId;

//         token.appToken = signToken({
//           userId,
//           email: user.email!,
//         });
//       }

//       return token;
//     },

//     /**
//      * Expose app token to session
//      */
//     async session({ session, token }) {
//       session.user.id = token.userId as string;
//       (session as any).appToken = token.appToken;
//       return session;
//     },

//     /**
//      * Force redirect after login
//      */
//     async redirect({ baseUrl }) {
//       return `${baseUrl}/dashboard`;
//     },
//   },
// };

// /* =========================
//    BACKEND HELPER (UNCHANGED)
// ========================= */

// import { NextRequest } from "next/server";

// export function getUserFromRequest(req: NextRequest) {
//   const authHeader = req.headers.get("authorization");

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return null;
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     return verifyToken(token);
//   } catch {
//     return null;
//   }
// }


import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { connectDB } from "@/lib/db";
import { User as UserModel } from "@/models/Users";
import { NextRequest } from "next/server";

import CredentialsProvider from "next-auth/providers/credentials";


const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

/* =========================
   APP JWT HELPERS (UNCHANGED)
========================= */

export function signToken(payload: { userId: string; email: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

// export function verifyToken(token: string) {
//   return jwt.verify(token) as { userId: string; email: string };
// }

 export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
}


/* =========================
   NEXTAUTH CONFIG (UNCHANGED)
========================= */

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),


    CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },

    async authorize(credentials) {
      if (!credentials?.email || !credentials.password) {
        return null;
      }

      await connectDB();

      const user = await UserModel.findOne({ email: credentials.email });

      if (!user) return null;

      // ⚠️ adjust this if you hash passwords
      // const isValid = user.password === credentials.password;

      const isValid = await bcrypt.compare(
        credentials.password,
        user.password
      );

      

      if (!isValid) return null;

      return {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      };
    },
  }),
  ],

  

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") return true;

      await connectDB();

      let dbUser = await UserModel.findOne({ email: user.email });

      if (!dbUser) {
        dbUser = await UserModel.create({
          name: user.name,
          email: user.email,
          provider: "google",
        });
      }

      (user as any).id = dbUser._id.toString();
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        const userId = (user as any).id;

        token.userId = userId;
        token.appToken = signToken({
          userId,
          email: user.email!,
        });
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.userId as string;
      (session as any).appToken = token.appToken;
      return session;
    },

    async redirect({ baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
  },
};

/* =========================
   BACKEND AUTH HELPERS
========================= */

/**
 * ✅ Used by app APIs (JWT-based)
 */
export function getUserFromRequest(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];

  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}

/**
 * ✅ Used ONLY by WhatsApp webhook
 * Auth via WhatsApp number
 */
export async function getUserFromWhatsapp(from: string) {
  await connectDB();

  // from = "whatsapp:+91XXXXXXXXXX"
  const user = await UserModel.findOne({ whatsapp: from });

  if (!user) return null;

  return {
    userId: user._id.toString(),
    email: user.email,
  };
}
