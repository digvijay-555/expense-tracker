// "use client";

// import { signIn } from "next-auth/react";
// import { useState } from "react";
// import { useRouter } from "next/navigation";


// export default function LoginPage() {
//   const router = useRouter();
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setError("");

//     const res = await fetch("/api/auth/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(form),
//       credentials: "include",
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       setError(data.error || "Login failed");
//       return;
//     }

//     router.push("/dashboard");
//   }

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center
//                  bg-[var(--background)]
//                  text-[var(--foreground)]"
//     >
//       <form
//         onSubmit={handleSubmit}
//         className="w-full max-w-sm p-6 rounded-lg
//                    bg-[var(--card)]
//                    border border-[var(--border)]
//                    shadow-lg space-y-4"
//       >
//         <h1 className="text-xl font-semibold text-center">
//           Login
//         </h1>

//         <input
//           placeholder="Email"
//           type="email"
//           className="input"
//           value={form.email}
//           onChange={(e) =>
//             setForm({ ...form, email: e.target.value })
//           }
//           required
//         />

//         <input
//           placeholder="Password"
//           type="password"
//           className="input"
//           value={form.password}
//           onChange={(e) =>
//             setForm({ ...form, password: e.target.value })
//           }
//           required
//         />

//         {error && (
//           <p className="text-red-500 text-sm">
//             {error}
//           </p>
//         )}

//         <button
//           type="submit"
//           className="btn-primary w-full"
//         >
//           Login
//         </button>

//         <p className="text-sm text-center">
//           No account?{" "}
//           <span
//             className="text-blue-500 cursor-pointer hover:underline"
//             onClick={() => router.push("/register")}
//           >
//             Register
//           </span>
//         </p>

//         <div className="relative text-center">
//           <span className="text-sm opacity-60">
//             or
//           </span>
//         </div>

//         <button
//           type="button"
//           onClick={() =>
//             signIn("google", { redirect: true })
//           }
//           className="w-full py-2 rounded
//                      border border-[var(--border)]
//                      hover:bg-white/5
//                      transition"
//         >
//           Continue with Google
//         </button>
//       </form>
//     </div>
//   );
// }


"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false, // important
    });

    if (res?.error) {
      setError("Invalid email or password");
      return;
    }

    // ✅ NextAuth session is now created
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-[var(--background)]
                    text-[var(--foreground)]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-6 rounded-lg
                   bg-[var(--card)]
                   border border-[var(--border)]
                   shadow-lg space-y-4"
      >
        <h1 className="text-xl font-semibold text-center">
          Login
        </h1>

        <input
          placeholder="Email"
          type="email"
          className="input"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          required
        />

        <input
          placeholder="Password"
          type="password"
          className="input"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          required
        />

        {error && (
          <p className="text-red-500 text-sm">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="btn-primary w-full"
        >
          Login
        </button>

        <p className="text-sm text-center">
          No account?{" "}
          <span
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => router.push("/register")}
          >
            Register
          </span>
        </p>

        <div className="relative text-center">
          <span className="text-sm opacity-60">or</span>
        </div>

        <button
          type="button"
          onClick={() =>
            signIn("google", { callbackUrl: "/dashboard" })
          }
          className="w-full py-2 rounded
                     border border-[var(--border)]
                     hover:bg-white/5 transition"
        >
          Continue with Google
        </button>
      </form>
    </div>
  );
}
