// components/admin/notifications/NotificationHistory.tsx
"use client";

import { useState } from "react";
import { Bell, Users, User, Search, Filter, Clock, Eye } from "lucide-react";
import { useAdminNotifications } from "@/src/hooks/notification/useAdminNotifications";

export default function NotificationHistory() {
  const {
    notifications,
    isLoading,
    selectedMonth,
    selectedYear,
    filterType,
    searchQuery,
    totalCount,
    months,
    years,
    setFilterType,
    setSearchQuery,
    handleMonthChange,
    handleYearChange,
  } = useAdminNotifications();

  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearch = () => {
    setSearchQuery(localSearch);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const getFormattedDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(hours / 24);

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  const getTypeBadge = (type: string) => {
    if (type === "ALL") {
      return (
        <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-medium">
          Broadcast
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-medium">
        Personal
      </span>
    );
  };

  const selectDropdownStyles = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E")`,
    backgroundPosition: "right 12px center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "14px",
  };

  return (
    <div className="space-y-6">
      {/* Top Row: Filters and Period Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left Side: Filter Controls */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-medium text-slate-500">Filter:</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType("all")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                filterType === "all"
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType("ALL")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                filterType === "ALL"
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
              }`}
            >
              Broadcast
            </button>
            <button
              onClick={() => setFilterType("PERSONAL")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                filterType === "PERSONAL"
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
              }`}
            >
              Personal
            </button>
          </div>
        </div>

        {/* Right Side: Search + Period Selector */}
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-slate-900 bg-white"
            />
          </div>

          {/* Period Selector */}
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400" />
            <div className="flex items-center gap-2">
              {/* Month Select */}
              <div className="relative">
                <select
                  value={selectedMonth}
                  onChange={(e) => handleMonthChange(parseInt(e.target.value))}
                  className="pl-3 pr-8 py-2 rounded-md border border-slate-200 text-xs font-medium transition-all bg-white text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-0 appearance-none cursor-pointer"
                  style={selectDropdownStyles}
                >
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Select */}
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => handleYearChange(parseInt(e.target.value))}
                  className="pl-3 pr-8 py-2 rounded-md border border-slate-200 text-xs font-medium transition-all bg-white text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-0 appearance-none cursor-pointer"
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
          </div>

          {/* Total Count Badge */}
          {/* <div className="text-[10px] font-mono text-slate-400 whitespace-nowrap">
            Total:{" "}
            <span className="font-bold text-slate-600">{totalCount}</span>
          </div> */}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-400">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
            <Bell className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-900 font-semibold text-sm">
              No notifications found
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {searchQuery
                ? "Try adjusting your search"
                : "No notifications for this period"}
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start gap-4 p-4 rounded-xl border ${
                notification.type === "ALL"
                  ? "bg-white border-slate-200"
                  : "bg-slate-50/80 border-slate-200"
              }`}
            >
              <div className="shrink-0">
                {notification.type === "ALL" ? (
                  <Users className="h-5 w-5 text-purple-500" />
                ) : (
                  <User className="h-5 w-5 text-blue-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-900">
                      {notification.title}
                    </h3>
                    {getTypeBadge(notification.type)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {getFormattedDate(notification.createdAt)}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-500">{notification.message}</p>

                {/* Personal target info */}
                {notification.type === "PERSONAL" &&
                  notification.targetUser && (
                    <p className="text-[10px] text-slate-400 mt-1">
                      To: {notification.targetUser.name} (
                      {notification.targetUser.staffId})
                    </p>
                  )}

                {/* Read Receipts Summary for Broadcasts */}
                {notification.type === "ALL" && notification.readReceipts && (
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3 text-slate-400" />
                      <span className="text-[10px] text-slate-500">
                        {notification.readReceipts.read}/
                        {notification.readReceipts.total} read
                      </span>
                    </div>
                    <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{
                          width: `${notification.readReceipts.percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
