import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generatePayslipPdf = async ({
  payroll,
  user,
  month,
  year,
  companyName,
}: {
  payroll: any;
  user: any;
  month: string;
  year: number;
  companyName: string;
}) => {
  const fileName = `payslip-${user.staffId}-${Date.now()}.pdf`;
  const uploadDir = path.join(process.cwd(), "uploads", "payslips");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, fileName);
  const doc = new PDFDocument({ margin: 0, size: "A4" });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  const C = {
    black: "#0A0A0A",
    dark: "#1A1A1A",
    mid: "#6B6B6B",
    light: "#9B9B9B",
    border: "#E8E8E8",
    bg: "#FAFAFA",
    white: "#FFFFFF",
    accent: "#16A34A",
  };

  const PAGE_W = 595.28;
  const PAGE_H = 841.89;
  const L = 52;
  const R = PAGE_W - 52;
  const W = R - L; // Printable content width

  // FIXED: Changed '₹' to 'INR' to stop Helvetica from rendering a broken '¹' symbol
  const fmt = (n: number) =>
    `INR ${Number(n || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;

  const hline = (y: number, color = C.border) => {
    doc
      .save()
      .strokeColor(color)
      .lineWidth(0.5)
      .moveTo(L, y)
      .lineTo(R, y)
      .stroke()
      .restore();
  };

  // ── Top bar ──────────────────────────────────────────────────────
  doc.rect(0, 0, PAGE_W, 3).fill(C.black);

  // ── Header ──────────────────────────────────────────────────────
  let y = 42;

  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor(C.light)
    .text(companyName.toUpperCase(), L, y, { characterSpacing: 1.5 });

  doc
    .font("Helvetica-Bold")
    .fontSize(28)
    .fillColor(C.black)
    .text("Payslip", L, y + 14);

  doc
    .save()
    .roundedRect(R - 80, y + 16, 80, 22, 3)
    .fill(C.bg)
    .font("Helvetica-Bold")
    .fontSize(9)
    .fillColor(C.dark)
    .text(`${month} ${year}`, R - 80, y + 23, { width: 80, align: "center" })
    .restore();

  y += 60;
  hline(y);
  y += 20;

  // ── Employee row ─────────────────────────────────────────────────
  doc
    .font("Helvetica-Bold")
    .fontSize(13)
    .fillColor(C.black)
    .text(user.name, L, y);

  doc
    .font("Helvetica")
    .fontSize(7.5)
    .fillColor(C.light)
    .text(
      `PAY-${user.staffId}-${year}-${month.slice(0, 3).toUpperCase()}`,
      L,
      y + 2,
      { width: W, align: "right" }
    );

  y += 18;

  const details = [
    user.staffId,
    user.department?.name || "—",
    user.branch?.name || "—",
    user.role || "Staff",
  ].join("   ·   ");
  doc.font("Helvetica").fontSize(8).fillColor(C.mid).text(details, L, y);

  y += 28;
  hline(y);
  y += 24;

  // ── Earnings ─────────────────────────────────────────────────────
  doc
    .font("Helvetica")
    .fontSize(7)
    .fillColor(C.light)
    .text("EARNINGS", L, y, { characterSpacing: 1 });
  y += 14;

  [
    { name: "Basic Salary", amount: payroll.basicSalary },
    { name: "Overtime Pay", amount: payroll.overtimePay },
    { name: "Bonus / Allowances", amount: payroll.bonus || 0 },
  ].forEach((row) => {
    doc.font("Helvetica").fontSize(9).fillColor(C.dark).text(row.name, L, y);
    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor(C.dark)
      .text(fmt(row.amount), L, y, { width: W, align: "right" });
    y += 18;
  });

  y += 8;
  hline(y);
  y += 14;

  // ── Deductions ───────────────────────────────────────────────────
  doc
    .font("Helvetica")
    .fontSize(7)
    .fillColor(C.light)
    .text("DEDUCTIONS", L, y, { characterSpacing: 1 });
  y += 14;

  doc.font("Helvetica").fontSize(9).fillColor(C.dark).text("Deductions", L, y);
  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor(C.dark)
    .text(`− ${fmt(payroll.deductions)}`, L, y, { width: W, align: "right" });

  y += 26;
  hline(y);
  y += 20;

  // ── Net salary ───────────────────────────────────────────────────
  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor(C.mid)
    .text("Net Salary", L, y + 4);
  doc
    .font("Helvetica-Bold")
    .fontSize(22)
    .fillColor(C.accent)
    .text(fmt(payroll.netSalary), L, y, { width: W, align: "right" });

  y += 38;
  hline(y);
  y += 28;

  // ── Attendance ───────────────────────────────────────────────────
  doc
    .font("Helvetica")
    .fontSize(7)
    .fillColor(C.light)
    .text("ATTENDANCE", L, y, { characterSpacing: 1 });
  y += 16;

  const attCols = [
    {
      label: "Working Days",
      value: String(payroll.presentDays + payroll.absentDays),
    },
    { label: "Present", value: String(payroll.presentDays) },
    { label: "Absent", value: String(payroll.absentDays) },
    { label: "Half Days", value: String(payroll.halfDays) },
    { label: "Late (min)", value: String(payroll.lateMinutes || 0) },
    { label: "OT (hrs)", value: (payroll.overtimeMinutes / 60).toFixed(1) },
  ];

  const colW = W / attCols.length;
  attCols.forEach(({ label: lbl, value: val }, i) => {
    const cx = L + i * colW;
    doc.font("Helvetica-Bold").fontSize(14).fillColor(C.black).text(val, cx, y);
    doc
      .font("Helvetica")
      .fontSize(7)
      .fillColor(C.light)
      .text(lbl, cx, y + 17);
  });

  y += 44;
  hline(y);
  y += 24;

  // ── Summary ──────────────────────────────────────────────────────
  doc
    .font("Helvetica")
    .fontSize(7)
    .fillColor(C.light)
    .text("SUMMARY", L, y, { characterSpacing: 1 });
  y += 16;

  const summaryRows = [
    {
      k: "Gross Earnings",
      v: fmt(payroll.basicSalary + payroll.overtimePay + (payroll.bonus || 0)),
    },
    { k: "Total Deductions", v: fmt(payroll.deductions) },
    {
      k: "Joining Date",
      v: user.joinedOn
        ? new Date(user.joinedOn).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "—",
    },
    {
      k: "Generated On",
      v: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    },
  ];

  summaryRows.forEach(({ k, v }) => {
    doc.font("Helvetica").fontSize(8.5).fillColor(C.mid).text(k, L, y);
    doc
      .font("Helvetica")
      .fontSize(8.5)
      .fillColor(C.dark)
      .text(v, L, y, { width: W, align: "right" });
    y += 17;
  });

  // ── Footer ───────────────────────────────────────────────────────
  const footerY = PAGE_H - 36;
  hline(footerY);

  doc
    .font("Helvetica")
    .fontSize(7)
    .fillColor(C.light)
    .text("System-generated document. No signature required.", L, footerY + 10);
  doc
    .font("Helvetica")
    .fontSize(7)
    .fillColor(C.light)
    .text(`${companyName}  ·  HR & Payroll`, L, footerY + 10, {
      width: W,
      align: "right",
    });

  doc.end();

  return new Promise<string>((resolve, reject) => {
    stream.on("finish", () => resolve(fileName));
    stream.on("error", reject);
  });
};
