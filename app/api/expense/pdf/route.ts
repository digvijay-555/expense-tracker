import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Expense } from "@/models/Expense";
import { getUserFromRequest } from "@/lib/auth";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function GET(req: NextRequest) {
  const user = getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const expenses = await Expense.find({ userId: user.userId })
    .sort({ date: -1 })
    .limit(50);

  if (expenses.length === 0) {
    return NextResponse.json(
      { error: "No expenses found" },
      { status: 400 }
    );
  }

  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([595, 842]); // A4
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const margin = 40;
  let y = 800;

  /* ---------- TITLE ---------- */
  page.drawText("Expense Report", {
    x: margin,
    y,
    size: 20,
    font: bold,
  });

  y -= 30;

  /* ---------- TABLE HEADER ---------- */
  const headers = ["#", "Date", "Category", "Note", "Amount Rs. "];
  const colX = [margin, 70, 140, 260, 450];

  headers.forEach((h, i) => {
    page.drawText(h, {
      x: colX[i],
      y,
      size: 11,
      font: bold,
    });
  });

  // header underline
  y -= 6;
  page.drawLine({
    start: { x: margin, y },
    end: { x: 555, y },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  y -= 15;

  /* ---------- TABLE ROWS ---------- */
  let total = 0;

  for (let i = 0; i < expenses.length; i++) {
    const e = expenses[i];
    total += e.amount;

    // new page if needed
    if (y < 60) {
      page = pdfDoc.addPage([595, 842]);
      y = 800;
    }

    const row = [
      String(i + 1),
      new Date(e.date).toLocaleDateString(),
      e.category,
      e.note || "-",
      `Rs. ${e.amount}`,
    ];

    row.forEach((cell, idx) => {
      page.drawText(cell, {
        x: colX[idx],
        y,
        size: 10,
        font,
      });
    });

    y -= 16;
  }

  /* ---------- TOTAL ---------- */
  y -= 10;
  page.drawLine({
    start: { x: 350, y },
    end: { x: 555, y },
    thickness: 1,
  });

  y -= 18;
  page.drawText(`Total: Rs. ${total}`, {
    x: 350,
    y,
    size: 12,
    font: bold,
  });

  const pdfBytes = await pdfDoc.save();

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=expenses.pdf",
    },
  });
}
