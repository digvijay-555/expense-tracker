"use client";

export default function TestLogin() {
  async function login() {
    await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "digvijay2@test.com",
        password: "password123"
      }),
    });

    window.location.href = "/dashboard";
  }

  return (
    <div className="p-10">
      <button
        onClick={login}
        className="px-4 py-2 bg-black text-white rounded"
      >
        Test Login
      </button>
    </div>
  );
}
