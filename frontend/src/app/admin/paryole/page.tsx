// app/admin/payroll/page.tsx
"use client";

import { Search, X, Calendar } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { usePayroll } from "@/src/hooks/payrole/usePayroll";
import PayrollTable from "@/components/payroll/PayrollTable";
import PayrollSummary from "@/components/payroll/PayrollSummary";

export default function PayrollPage() {
  const {
    payrolls,
    summary,
    isLoading,
    pagination,
    selectedMonth,
    selectedYear,
    searchTerm,
    generatingId,
    months,
    years,
    handlePageChange,
    handleMonthChange,
    handleYearChange,
    handleSearch,
    handleGeneratePayslip,
  } = usePayroll();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };

  const handleClearSearch = () => {
    handleSearch("");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-400 mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-6 bg-emerald-400 rounded-full" />
            <span className="text-[11px] font-mono text-emerald-500 tracking-wider">
              PAYROLL MANAGEMENT
            </span>
          </div>
          <div>
            <h1 className="text-3xl lg:text-4xl font-light tracking-tight text-slate-800">
              Salary & Payslips
            </h1>
            <p className="text-sm text-slate-400 mt-2">
              Manage staff salaries, view payroll summaries, and generate
              payslips
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* Month Selector */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400" />
            <select
              value={selectedMonth}
              onChange={(e) => handleMonthChange(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-slate-300 bg-white"
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          {/* Year Selector */}
          <select
            value={selectedYear}
            onChange={(e) => handleYearChange(parseInt(e.target.value))}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-slate-300 bg-white"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex-1 max-w-xs"
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="search by name or staff ID..."
              className="w-full px-4 py-2 pl-10 pr-10 rounded-lg border border-slate-200 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:border-slate-300"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="h-4 w-4 text-slate-400 hover:text-slate-600" />
              </button>
            )}
          </form>
        </div>

        {/* Summary Cards */}
        <PayrollSummary summary={summary} />

        {/* Payroll Table */}
        <div className="mt-6">
          <PayrollTable
            payrolls={payrolls}
            isLoading={isLoading}
            generatingId={generatingId}
            onGeneratePayslip={handleGeneratePayslip}
          />
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 rounded-lg text-sm text-slate-600 disabled:text-slate-300 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
            >
              ← Previous
            </button>
            <span className="text-sm text-slate-500">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-4 py-2 rounded-lg text-sm text-slate-600 disabled:text-slate-300 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
