"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

export default function Navbar() {
  return (
    <nav className="w-full h-14 px-6 flex items-center justify-between border-b bg-white">
      {/* Left: Logo / Dashboard */}
      <Link
        href="/dashboard"
        className="text-lg font-semibold"
      >
        Expense-Tracker
      </Link>

      {/* Right: Buttons */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="px-3 py-1 rounded hover:bg-gray-100"
        >
          Dashboard
        </Link>

        <Link
          href="/dashboard/profile"
          className="px-3 py-1 rounded hover:bg-gray-100"
        >
          Profile
        </Link>

        <Link
          href="/dashboard/history"
          className="px-3 py-1 rounded hover:bg-gray-100"
        >
          History
        </Link>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
