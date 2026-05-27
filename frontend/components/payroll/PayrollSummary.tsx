// components/admin/payroll/PayrollSummary.tsx
"use client";

interface PayrollSummaryProps {
  summary: {
    totalSalary: number;
    totalDeduction: number;
    netPayable: number;
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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white rounded-xl border border-slate-100 p-4">
        <p className="text-xs text-slate-400 mb-1">Total Salary</p>
        <p className="text-2xl font-light text-slate-800">
          {formatCurrency(summary.totalSalary)}
        </p>
        <p className="text-[10px] text-slate-400 mt-1">before deductions</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-100 p-4">
        <p className="text-xs text-slate-400 mb-1">Total Deductions</p>
        <p className="text-2xl font-light text-rose-600">
          {formatCurrency(summary.totalDeduction)}
        </p>
        <p className="text-[10px] text-slate-400 mt-1">
          absences & adjustments
        </p>
      </div>
      <div className="bg-white rounded-xl border border-slate-100 p-4">
        <p className="text-xs text-slate-400 mb-1">Net Payable</p>
        <p className="text-2xl font-light text-emerald-600">
          {formatCurrency(summary.netPayable)}
        </p>
        <p className="text-[10px] text-slate-400 mt-1">total to be paid</p>
      </div>
    </div>
  );
}
