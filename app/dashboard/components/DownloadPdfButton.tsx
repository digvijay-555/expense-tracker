"use client";

export default function DownloadPdfButton({ token }: { token: string }) {
  function downloadPdf() {
    fetch("/api/expense/pdf", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "expenses.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      });
  }

  return (
    <button onClick={downloadPdf} className="px-4 py-2 rounded
                   bg-blue-600 text-white
                   hover:bg-blue-700 ml-3">
      Download Expenses PDF
    </button>
  );
}
