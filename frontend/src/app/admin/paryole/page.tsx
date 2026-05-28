// app/admin/payroll/page.tsx
"use client";

import { Search, X, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
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

  const selectDropdownStyles = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E")`,
    backgroundPosition: "right 12px center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "14px",
  };

  return (
    /* CRITICAL FIX: 
      Using 'w-full' with no max-width limits ([1400px], 7xl, etc.) 
      so the background canvas fills out to the window edges exactly like your Floor Registry map.
    */
    <div className="min-h-screen bg-slate-50/50 w-full px-6 py-8 antialiased">
      {/* Header Alignment Segment */}
      <div className="w-full border-b border-slate-200/60 pb-5 mb-6">
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-medium text-slate-400 tracking-wider uppercase">
            Financial Overview
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Salary & Payslips
          </h1>
          <p className="text-xs text-slate-400 max-w-md leading-relaxed font-normal">
            Manage staff salaries, view payroll summaries, and generate official
            payslips.
          </p>
        </div>
      </div>

      {/* Global Toolbar Filters Layout Matrix */}
      <div className="w-full flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          {/* Month Selector Dropdown */}
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => handleMonthChange(e.target.value)}
              className="pl-3 pr-8 py-1.5 rounded-md border border-slate-200 text-xs font-medium transition-all bg-white text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-0 appearance-none cursor-pointer"
              style={selectDropdownStyles}
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          {/* Year Selector Dropdown */}
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => handleYearChange(parseInt(e.target.value))}
              className="pl-3 pr-8 py-1.5 rounded-md border border-slate-200 text-xs font-medium transition-all bg-white text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-0 appearance-none cursor-pointer"
              style={selectDropdownStyles}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Box Form Layout */}
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by name or staff ID..."
            className="w-full pl-8 pr-8 py-1.5 rounded-md border border-slate-200 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-0 transition-all"
          />
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </form>
      </div>

      {/* Financial Summary Dashboard Cards Layout */}
      <div className="w-full">
        <PayrollSummary summary={summary} />
      </div>

      {/* Tabular Data Grid Wrapper */}
      <div className="w-full mt-6 bg-white border border-slate-200/60 rounded-xl overflow-hidden shadow-xs">
        <PayrollTable
          payrolls={payrolls}
          isLoading={isLoading}
          generatingId={generatingId}
          onGeneratePayslip={handleGeneratePayslip}
        />
      </div>

      {/* Global Pagination Grid Controls Footer */}
      {pagination.totalPages > 1 && (
        <div className="w-full flex items-center justify-between border border-slate-200/60 bg-white rounded-xl p-3 mt-4 shadow-2xs">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:bg-slate-50 disabled:text-slate-300 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Previous</span>
          </button>

          <span className="text-xs font-medium text-slate-500">
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 disabled:bg-slate-50 disabled:text-slate-300 disabled:cursor-not-allowed transition-all"
          >
            <span>Next</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
