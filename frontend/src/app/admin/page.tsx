// app/admin/page.tsx
"use client";

import { useState } from "react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import CardinalNav from "@/components/admin/CardinalNav";
import DashboardStats from "@/components/admin/DashboardStats";
import DashboardAttendanceStats from "@/components/admin/DashboardAttendanceStats";
import FloorMap from "@/components/admin/floor/FloorMap";
import PayrollPage from "./paryole/page";

// Dashboard Tab
function DashboardContent() {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-4 bg-slate-400 rounded-full" />
          <h2 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            Company Overview
          </h2>
        </div>
        <DashboardStats />
      </div>

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

function PayrollContent() {
  return <PayrollPage />;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardContent />;
      case "floor":
        return <FloorContent />;
      case "payroll":
        return <PayrollContent />;
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
