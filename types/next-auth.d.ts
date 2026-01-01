import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
    appToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
    appToken: string;
  }
}
