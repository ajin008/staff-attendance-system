// components/admin/payroll/PayrollTable.tsx
"use client";

import {
  Loader2,
  FileText,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        <span className="ml-2 text-sm text-slate-400">
          Loading payroll data...
        </span>
      </div>
    );
  }

  if (payrolls.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
        <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500">No payroll records found</p>
        <p className="text-xs text-slate-400 mt-1">
          Try selecting a different month or year
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Staff
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                Present
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                Absent
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                OT (hrs)
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                OT Amount
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Deduction
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Net Salary
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {payrolls.map((payroll) => (
              <tr
                key={payroll.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {payroll.name}
                    </p>
                    <p className="text-xs font-mono text-slate-400">
                      {payroll.staffId}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-600">
                    {payroll.department}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-medium text-emerald-600">
                    {payroll.presentDays}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-medium text-rose-600">
                    {payroll.absentDays}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm text-slate-600">
                    {payroll.overtimeHours.toFixed(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm text-slate-600">
                    {formatCurrency(payroll.overtimeAmount)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm text-rose-600">
                    {formatCurrency(payroll.deduction)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-semibold text-slate-800">
                    {formatCurrency(payroll.netSalary)}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() =>
                      onGeneratePayslip(payroll.staffId, payroll.name)
                    }
                    disabled={generatingId === payroll.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors disabled:opacity-50"
                  >
                    {generatingId === payroll.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <FileText className="h-3.5 w-3.5" />
                    )}
                    <span>Payslip</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
