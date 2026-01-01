// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import { connectDB } from "@/lib/db";
// import { User } from "@/models/Users";

// const handler = NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//   ],
//   callbacks: {
//     async signIn({ user }) {
//       await connectDB();

//       const existingUser = await User.findOne({ email: user.email });

//       if (!existingUser) {
//         await User.create({
//           name: user.name,
//           email: user.email,
//         });
//       }

//       return true;
//     },
//     async session({ session }) {
//       return session;
//     },
//   },
// });

// export { handler as GET, handler as POST };


// import NextAuth, { type NextAuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { connectDB } from "@/lib/db";
// import { User as UserModel } from "@/models/Users";
// import type { User as NextAuthUser, Account } from "next-auth";


// export const authOptions: NextAuthOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),

//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         await connectDB();

//         if (!credentials?.email || !credentials.password) return null;

//         const user = await UserModel.findOne({ email: credentials.email });
//         if (!user) return null;

//         // TODO: compare hashed password
//         return {
//           id: user._id.toString(),
//           email: user.email,
//           name: user.name,
//         };
//       },
//     }),
//   ],

//   callbacks: {
//     async signIn({
//       user,
//       account
//     }: {
//       user: NextAuthUser;
//       account: Account | null;
//     } )
//      {
//       await connectDB();

//       if (account?.provider === "google") {
//         const existingUser = await UserModel.findOne({ email: user.email });

//         if (!existingUser) {
//           await UserModel.create({
//             name: user.name,
//             email: user.email,
//             provider: "google",
//           });
//         }
//       }
//       return true;
//     },
//     async redirect({ url, baseUrl }) {
//     return `${baseUrl}/dashboard`;
//   },
//   },


//   session: {
//     strategy: "jwt",
//   },
// };

// const handler = NextAuth(authOptions);

// /**
//  * 🔥 THIS IS THE CRITICAL PART 🔥
//  * App Router REQUIRES named exports
//  */
// export { handler as GET, handler as POST };


import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
