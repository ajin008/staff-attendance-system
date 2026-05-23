// app/admin/page.tsx
"use client";

import { useState } from "react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import CardinalNav from "@/components/admin/CardinalNav";
import DashboardStats from "@/components/admin/DashboardStats";

// Dashboard Tab - shows stats and summary
function DashboardContent() {
  return (
    <div className="space-y-6">
      <DashboardStats />
    </div>
  );
}

function AttendanceContent() {
  return (
    <div className="mt-6">
      <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
        <p className="text-sm text-slate-500">
          Today&apos;s attendance will appear here
        </p>
      </div>
    </div>
  );
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
      case "attendance":
        return <AttendanceContent />;
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
