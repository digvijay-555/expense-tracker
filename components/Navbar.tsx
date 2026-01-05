// "use client";

// import Link from "next/link";
// import { signOut } from "next-auth/react";
// import ThemeToggle from "@/components/ThemeToggle";

// export default function Navbar() {
//   return (
//     <nav
//       className="w-full h-14 px-6 flex items-center justify-between
//                  bg-[var(--background)]
//                  text-[var(--foreground)]
//                  border-b border-[var(--border)]"
//     >
//       {/* Left: Logo */}
//       <Link
//         href="/dashboard"
//         className="text-lg font-semibold hover:opacity-80"
//       >
//         Expense-Tracker
//       </Link>

//       {/* Right: Actions */}
//       <div className="flex items-center gap-4">
//         <ThemeToggle />

//         <Link
//           href="/dashboard"
//           className="px-3 py-1 rounded
//                      hover:bg-white/10"
//         >
//           Dashboard
//         </Link>

//         <Link
//           href="/dashboard/profile"
//           className="px-3 py-1 rounded
//                      hover:bg-white/10"
//         >
//           Profile
//         </Link>

//         <Link
//           href="/dashboard/history"
//           className="px-3 py-1 rounded
//                      hover:bg-white/10"
//         >
//           History
//         </Link>

//         {/* <button
//           onClick={() => signOut({ callbackUrl: "/login" })}
//           className="px-3 py-1 rounded
//                      bg-red-600 text-white
//                      hover:bg-red-700"
//         >
//           Logout
//         </button> */}
//       </div>
//     </nav>
//   );
// }

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const [cid, setCid] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/profile/cid")
      .then((res) => res.json())
      .then((data) => setCid(data.cid))
      .catch(() => {});
  }, []);

  const imageUrl = cid
    ? `https://ipfs.io/ipfs/${cid}` // more reliable than pinata gateway
    : null;

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

      {/* Right */}
      <div className="flex items-center gap-4">
        <ThemeToggle />

        <Link
          href="/dashboard"
          className="px-3 py-1 rounded hover:bg-white/10"
        >
          Dashboard
        </Link>

        <Link
          href="/dashboard/history"
          className="px-3 py-1 rounded hover:bg-white/10"
        >
          History
        </Link>

        <Link
          href="/recurring"
          className="px-3 py-1 rounded hover:bg-white/10"
        >
          Recurring Expenses
        </Link>

        {/* Profile Avatar */}
        <Link href="/dashboard/profile">
          <div className="h-8 w-8 rounded-full overflow-hidden border border-white/20 hover:opacity-80">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Profile"
                width={32}
                height={32}
                className="object-cover"
                
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-xs text-gray-400">
                👤
              </div>
            )}
          </div>
        </Link>
      </div>
    </nav>
  );
}
