// components/admin/payroll/PayrollTable.tsx
"use client";

import { Loader2, FileText } from "lucide-react";
import type { PayrollRecord } from "@/src/services/payroll.service";

interface PayrollTableProps {
  payrolls: PayrollRecord[];
  isLoading: boolean;
  generatingId: number | null;
  onGeneratePayslip: (staffId: string, staffName: string) => void;
}

export default function PayrollTable({
  payrolls,
  isLoading,
  generatingId,
  onGeneratePayslip,
}: PayrollTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-2 antialiased">
        <Loader2 className="h-5 w-5 animate-spin text-slate-900" />
        <span className="text-xs font-medium text-slate-400">
          Loading payroll matrix records...
        </span>
      </div>
    );
  }

  if (payrolls.length === 0) {
    return (
      <div className="text-center py-16 antialiased">
        <FileText className="h-8 w-8 text-slate-300 mx-auto mb-2" />
        <p className="text-slate-900 font-semibold text-sm">
          No payroll records found
        </p>
        <p className="text-xs text-slate-400 mt-0.5">
          Try selecting an alternate chronological month or calendar filter
          parameters.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto antialiased">
      <table className="w-full border-collapse">
        <thead className="bg-slate-50/70 border-b border-slate-200/60">
          <tr>
            <th className="px-6 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Staff Member
            </th>
            <th className="px-6 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Department
            </th>
            <th className="px-6 py-3.5 text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Present
            </th>
            <th className="px-6 py-3.5 text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Absent
            </th>
            <th className="px-6 py-3.5 text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              OT (Hrs)
            </th>
            <th className="px-6 py-3.5 text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              OT Pay
            </th>
            <th className="px-6 py-3.5 text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Deductions
            </th>
            <th className="px-6 py-3.5 text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Net Payout
            </th>
            <th className="px-6 py-3.5 text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {payrolls.map((payroll) => (
            <tr
              key={payroll.id}
              className="hover:bg-slate-50/40 transition-colors"
            >
              {/* Staff Member Metadata */}
              <td className="px-6 py-3.5 whitespace-nowrap">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-900">
                    {payroll.name}
                  </p>
                  <p className="text-[10px] font-mono text-slate-400">
                    {payroll.staffId}
                  </p>
                </div>
              </td>

              {/* Department Block */}
              <td className="px-6 py-3.5 whitespace-nowrap">
                <span className="text-xs font-medium text-slate-600">
                  {payroll.department}
                </span>
              </td>

              {/* Present Metric Days */}
              <td className="px-6 py-3.5 text-center whitespace-nowrap">
                <span className="text-xs font-bold text-emerald-600">
                  {payroll.presentDays}
                </span>
              </td>

              {/* Absent Metric Days */}
              <td className="px-6 py-3.5 text-center whitespace-nowrap">
                <span className="text-xs font-bold text-rose-600">
                  {payroll.absentDays}
                </span>
              </td>

              {/* Raw Overtime Clock Hours */}
              <td className="px-6 py-3.5 text-center whitespace-nowrap">
                <span className="text-xs font-medium text-slate-600">
                  {payroll.overtimeHours.toFixed(1)}
                </span>
              </td>

              {/* Calculated Overtime Income Pay */}
              <td className="px-6 py-3.5 text-right whitespace-nowrap">
                <span className="text-xs font-medium text-slate-600">
                  {formatCurrency(payroll.overtimeAmount)}
                </span>
              </td>

              {/* Negative Financial Deductions Outflow */}
              <td className="px-6 py-3.5 text-right whitespace-nowrap">
                <span className="text-xs font-medium text-rose-600">
                  {formatCurrency(payroll.deduction)}
                </span>
              </td>

              {/* Net Payout Summation */}
              <td className="px-6 py-3.5 text-right whitespace-nowrap">
                <span className="text-xs font-bold text-slate-900">
                  {formatCurrency(payroll.netSalary)}
                </span>
              </td>

              {/* Actions Interface Panel Triggers */}
              <td className="px-6 py-3.5 text-center whitespace-nowrap">
                <button
                  type="button"
                  onClick={() =>
                    onGeneratePayslip(payroll.staffId, payroll.name)
                  }
                  disabled={generatingId === payroll.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 transition-all disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed shadow-2xs"
                >
                  {generatingId === payroll.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <FileText className="h-3.5 w-3.5 text-slate-400" />
                  )}
                  <span>Payslip</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
