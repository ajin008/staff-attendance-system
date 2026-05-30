// components/admin/notifications/NotificationComposer.tsx
"use client";

import { useState } from "react";
import { Send, Users, User, Search, X, Loader2 } from "lucide-react";
import { useNotificationComposer } from "@/src/hooks/notification/useNotificationComposer";

interface NotificationComposerProps {
  onSuccess?: () => void;
}

export default function NotificationComposer({
  onSuccess,
}: NotificationComposerProps) {
  const {
    sendType,
    title,
    message,
    selectedStaff,
    searchStaff,
    staffList,
    showStaffDropdown,
    isSending,
    isLoadingStaff,
    setTitle,
    setMessage,
    setSearchStaff,
    setShowStaffDropdown,
    clearForm,
    sendNotification,
    selectStaff,
    removeSelectedStaff,
    toggleSendType,
  } = useNotificationComposer({ onSuccess });

  return (
    <div className="max-w-2xl">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-base font-semibold text-slate-900">
            Compose Notification
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Send broadcast messages to all staff or personal messages to
            specific employees
          </p>
        </div>

        <div className="p-5 space-y-5">
          {/* Notification Type */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-2">
              Notification Type <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="ALL"
                  checked={sendType === "ALL"}
                  onChange={() => toggleSendType("ALL")}
                  className="w-4 h-4 text-slate-900 focus:ring-slate-900"
                />
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-500" />
                  <span className="text-sm text-slate-700">
                    Broadcast (All Staff)
                  </span>
                </div>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="PERSONAL"
                  checked={sendType === "PERSONAL"}
                  onChange={() => toggleSendType("PERSONAL")}
                  className="w-4 h-4 text-slate-900 focus:ring-slate-900"
                />
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-slate-700">
                    Personal Message
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Staff Selection */}
          {sendType === "PERSONAL" && (
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-2">
                Select Staff Member <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or staff ID..."
                    value={searchStaff}
                    onChange={(e) => {
                      setSearchStaff(e.target.value);
                      setShowStaffDropdown(true);
                    }}
                    onFocus={() => setShowStaffDropdown(true)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-slate-900 bg-white"
                  />
                </div>

                {isLoadingStaff && (
                  <div className="absolute z-10 mt-1 w-full bg-white rounded-lg border border-slate-200 shadow-lg p-4 text-center">
                    <Loader2 className="h-4 w-4 animate-spin mx-auto text-slate-400" />
                  </div>
                )}

                {selectedStaff && (
                  <div className="mt-2 flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">
                        {selectedStaff.name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {selectedStaff.staffId} •{" "}
                        {selectedStaff.department?.name}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={removeSelectedStaff}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}

                {showStaffDropdown &&
                  !selectedStaff &&
                  staffList.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white rounded-lg border border-slate-200 shadow-lg max-h-64 overflow-y-auto">
                      {staffList.map((staff) => (
                        <button
                          key={staff.id}
                          type="button"
                          onClick={() => selectStaff(staff)}
                          className="w-full px-3 py-2 text-left hover:bg-slate-50 transition-colors"
                        >
                          <p className="text-sm font-medium text-slate-900">
                            {staff.name}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {staff.staffId} • {staff.email} •{" "}
                            {staff.department?.name}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* Title & Message */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-2">
              Notification Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., System Update, Holiday Announcement"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-slate-900 bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={5}
              placeholder="Type your notification message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-slate-900 bg-white resize-none"
            />
          </div>

          {/* Preview */}
          {(title || message) && (
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                Preview
              </p>
              <div className="flex items-start gap-3">
                {sendType === "ALL" ? (
                  <Users className="h-5 w-5 text-purple-500" />
                ) : (
                  <User className="h-5 w-5 text-blue-500" />
                )}
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-slate-900">
                    {title || "Notification Title"}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {message || "Your message will appear here..."}
                  </p>
                  {sendType === "PERSONAL" && selectedStaff && (
                    <p className="text-[10px] text-slate-400 mt-2">
                      To: {selectedStaff.name} ({selectedStaff.staffId})
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/30 flex gap-3">
          <button
            type="button"
            onClick={clearForm}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={sendNotification}
            disabled={
              isSending ||
              !title ||
              !message ||
              (sendType === "PERSONAL" && !selectedStaff)
            }
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-all"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span>Send Notification</span>
          </button>
        </div>
      </div>
    </div>
  );
}
