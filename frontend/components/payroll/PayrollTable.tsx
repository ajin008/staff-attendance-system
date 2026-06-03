// components/admin/payroll/PayrollTable.tsx
"use client";

import { Loader2, FileText, CheckCircle, Download } from "lucide-react";
import type { PayrollRecord } from "@/src/services/payroll.service";

interface PayrollTableProps {
  payrolls: PayrollRecord[];
  isLoading: boolean;
  generatingId: number | null;
  onGeneratePayslip: (
    staffId: string,
    staffName: string,
    index: number
  ) => void;
}

export default function PayrollTable({
  payrolls,
  isLoading,
  generatingId,
  onGeneratePayslip,
}: PayrollTableProps) {
  const handleDownload = (pdfUrl?: string) => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-2 antialiased">
        <Loader2 className="h-5 w-5 animate-spin text-slate-900" />
        <span className="text-xs font-medium text-slate-400">
          Loading payroll records...
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
          Try selecting a different month or department
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
              Staff ID
            </th>
            <th className="px-6 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Member Name
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
            <th className="px-6 py-3.5 text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {payrolls.map((payroll, index) => {
            const isGenerating = generatingId === index;
            const isGenerated = payroll.payslipGenerated;

            return (
              <tr
                key={payroll.id}
                className="hover:bg-slate-50/40 transition-colors"
              >
                <td className="px-6 py-3.5 whitespace-nowrap">
                  <p className="text-xs font-mono font-medium text-slate-600">
                    {payroll.staffId}
                  </p>
                </td>
                <td className="px-6 py-3.5 whitespace-nowrap">
                  <p className="text-xs font-semibold text-slate-900">
                    {payroll.name}
                  </p>
                </td>
                <td className="px-6 py-3.5 whitespace-nowrap">
                  <span className="text-xs font-medium text-slate-600">
                    {payroll.department}
                  </span>
                </td>
                <td className="px-6 py-3.5 text-center whitespace-nowrap">
                  <span className="text-xs font-semibold text-emerald-600">
                    {payroll.presentDays}
                  </span>
                </td>
                <td className="px-6 py-3.5 text-center whitespace-nowrap">
                  <span className="text-xs font-semibold text-rose-600">
                    {payroll.absentDays}
                  </span>
                </td>
                <td className="px-6 py-3.5 text-center whitespace-nowrap">
                  <span className="text-xs font-medium text-slate-600">
                    {payroll.overtimeHours?.toFixed(1) || "0.0"}
                  </span>
                </td>
                <td className="px-6 py-3.5 text-center whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2">
                    {isGenerated && (
                      <>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-medium">
                          <CheckCircle className="h-3 w-3" />
                          Generated
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDownload(payroll.pdfUrl)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-blue-600 hover:bg-blue-50 transition-all"
                          title="Download Payslip"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Download</span>
                        </button>
                      </>
                    )}
                    {!isGenerated && (
                      <button
                        type="button"
                        onClick={() =>
                          onGeneratePayslip(
                            payroll.staffId,
                            payroll.name,
                            index
                          )
                        }
                        disabled={isGenerating}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all shadow-2xs
                          ${
                            isGenerating
                              ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                              : "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50"
                          }
                        `}
                      >
                        {isGenerating ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <FileText className="h-3.5 w-3.5" />
                        )}
                        <span>Generate</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
