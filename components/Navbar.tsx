"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  return (
    <nav
      className="w-full h-14 px-6 flex items-center justify-between
                 bg-[var(--background)]
                 text-[var(--foreground)]
                 border-b border-[var(--border)]"
    >
      {/* Left: Logo */}
      <Link
        href="/dashboard"
        className="text-lg font-semibold hover:opacity-80"
      >
        Expense-Tracker
      </Link>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <ThemeToggle />

        <Link
          href="/dashboard"
          className="px-3 py-1 rounded
                     hover:bg-white/10"
        >
          Dashboard
        </Link>

        <Link
          href="/dashboard/profile"
          className="px-3 py-1 rounded
                     hover:bg-white/10"
        >
          Profile
        </Link>

        <Link
          href="/dashboard/history"
          className="px-3 py-1 rounded
                     hover:bg-white/10"
        >
          History
        </Link>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="px-3 py-1 rounded
                     bg-red-600 text-white
                     hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
