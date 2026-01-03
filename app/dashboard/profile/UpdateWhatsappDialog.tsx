"use client";

import { useState } from "react";

export default function UpdateWhatsappDialog() {
  const [open, setOpen] = useState(false);
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/profile", {
      method: "PUT",
      body: new FormData(
        Object.assign(document.createElement("form"), {
          whatsapp,
        })
      ),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Failed to update WhatsApp number");
      return;
    }

    setOpen(false);
    alert("WhatsApp number updated");
  }

  return (
    <>
      {/* Button */}
      <button
        onClick={() => setOpen(true)}
        className="btn-primary"
      >
        Update WhatsApp Number
      </button>

      {/* Dialog */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[var(--background)] p-6 rounded-lg w-full max-w-sm space-y-4">
            <h2 className="text-lg font-semibold">
              Update WhatsApp Number
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                className="input"
                placeholder="whatsapp:+91XXXXXXXXXX"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                required
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
