// app/admin/page.tsx
"use client";

import { useState } from "react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import CardinalNav from "@/components/admin/CardinalNav";
import DashboardStats from "@/components/admin/DashboardStats";
import DashboardAttendanceStats from "@/components/admin/DashboardAttendanceStats";
import FloorMap from "@/components/admin/floor/FloorMap";

// Dashboard Tab - shows stats and summary
function DashboardContent() {
  return (
    <div className="space-y-8">
      {/* Company Stats Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-4 bg-slate-400 rounded-full" />
          <h2 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            Company Overview
          </h2>
        </div>
        <DashboardStats />
      </div>

      {/* Today's Attendance Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-4 bg-emerald-400 rounded-full" />
          <h2 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            Today&apos;s Attendance
          </h2>
        </div>
        <DashboardAttendanceStats />
      </div>
    </div>
  );
}

function FloorContent() {
  return <FloorMap />;
}

function StaffContent() {
  return (
    <div className="mt-6">
      <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
        <p className="text-sm text-slate-500">Staff directory and management</p>
      </div>
    </div>
  );
}

function SalaryContent() {
  return (
    <div className="mt-6">
      <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
        <p className="text-sm text-slate-500">Payroll and salary records</p>
      </div>
    </div>
  );
}

function ReportsContent() {
  return (
    <div className="mt-6">
      <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
        <p className="text-sm text-slate-500">
          Generate attendance and salary reports
        </p>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardContent />;
      case "floor":
        return <FloorContent />;
      case "staff":
        return <StaffContent />;
      case "salary":
        return <SalaryContent />;
      case "reports":
        return <ReportsContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <AdminNavbar />
      <CardinalNav activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="max-w-400 mx-auto px-6 pb-12">{renderContent()}</div>
    </div>
  );
}
