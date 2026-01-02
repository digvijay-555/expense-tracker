"use client";

import { useState } from "react";

export default function UpdateWhatsappForm() {
  const [whatsapp, setWhatsapp] = useState("");
  const [status, setStatus] = useState("");

  async function handleSave() {
    setStatus("");

    const res = await fetch("/api/user/whatsapp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ whatsapp: "whatsapp:+91" + whatsapp }),
    });

    const data = await res.json();

    if (!res.ok) {
      setStatus(data.error || "Failed to save");
      return;
    }

    setStatus("✅ WhatsApp number saved");
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">
        WhatsApp Number
      </label>

      <input
        className="border p-2 w-full"
        placeholder=""
        value={whatsapp}
        onChange={(e) => setWhatsapp(e.target.value)}
      />

      <button
        onClick={handleSave}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Save
      </button>

      {status && <p className="text-sm">{status}</p>}
    
    </div>
  );
}
