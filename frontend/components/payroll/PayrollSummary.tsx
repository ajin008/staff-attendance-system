// components/admin/payroll/PayrollSummary.tsx
"use client";

interface PayrollSummaryProps {
  summary: {
    totalSalary: number;
    totalPaid: number;
  };
}

export default function PayrollSummary({ summary }: PayrollSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Total Salary Card */}
      <div className="bg-white rounded-xl border border-slate-100 p-4">
        <p className="text-xs text-slate-400 mb-1">Total Salary</p>
        <p className="text-2xl font-light text-slate-800">
          {formatCurrency(summary.totalSalary)}
        </p>
        <p className="text-[10px] text-slate-400 mt-1">before deductions</p>
      </div>

      {/* Net Paid Card */}
      <div className="bg-white rounded-xl border border-slate-100 p-4">
        <p className="text-xs text-slate-400 mb-1">Net Paid</p>
        <p className="text-2xl font-light text-emerald-600">
          {formatCurrency(summary.totalPaid)}
        </p>
        <p className="text-[10px] text-slate-400 mt-1">
          total disbursed amount
        </p>
      </div>
    </div>
  );
}
