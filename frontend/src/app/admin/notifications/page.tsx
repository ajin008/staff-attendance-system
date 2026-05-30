// app/admin/notifications/page.tsx
"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import NotificationHistory from "@/components/admin/notifications/NotificationHistory";
import NotificationComposer from "@/components/admin/notifications/NotificationComposer";

export default function NotificationsPage() {
  const [notificationTab, setNotificationTab] = useState<"history" | "send">(
    "history"
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <div className="w-full max-w-[1600px] mx-auto px-6 py-8 flex-1">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-mono font-medium text-slate-400 uppercase tracking-wider mb-2">
            <Bell className="h-3.5 w-3.5" />
            <span>Communications</span>
            <span className="text-neutral-700">/</span>
            <span className="text-slate-600">Notification Engine</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Notification Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Send broadcasts or personal messages, track delivery history and
            read receipts
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-slate-200 mb-6">
          <button
            onClick={() => setNotificationTab("history")}
            className={`px-4 py-2 text-sm font-medium transition-all ${
              notificationTab === "history"
                ? "text-slate-900 border-b-2 border-slate-900"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <div className="flex items-center gap-2">
              <span>Notification History</span>
            </div>
          </button>
          <button
            onClick={() => setNotificationTab("send")}
            className={`px-4 py-2 text-sm font-medium transition-all ${
              notificationTab === "send"
                ? "text-slate-900 border-b-2 border-slate-900"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <div className="flex items-center gap-2">
              <span>Compose Message</span>
            </div>
          </button>
        </div>

        {/* Render Components */}
        {notificationTab === "history" ? (
          <NotificationHistory />
        ) : (
          <NotificationComposer />
        )}
      </div>
    </div>
  );
}
