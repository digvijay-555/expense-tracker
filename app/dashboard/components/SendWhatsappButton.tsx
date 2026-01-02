"use client";

export default function SendWhatsappButton({ token }: { token: string }) {
  async function sendExpenses() {
    const res = await fetch("/api/whatsapp/send-expenses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to send");
      return;
    }

    alert("📲 Expenses sent to your WhatsApp!");
  }

  return (
    <button
      onClick={sendExpenses}
      className="px-4 py-2 rounded
                   bg-blue-600 text-white
                   hover:bg-blue-700 ml-3"
    >
      Send expenses on WhatsApp
    </button>
  );
}
