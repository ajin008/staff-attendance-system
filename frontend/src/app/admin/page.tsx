// "use client";

// import { useState } from "react";
// import TodayAttendanceTable from "@/components/admin/TodayAttendanceTable";
// import TodaySummaryCards from "@/components/admin/TodaySummary";
// import DatePicker from "@/components/admin/DatePicker";

// const getToday = () => new Date();

// const toDateString = (date: Date): string => {
//   const y = date.getFullYear();
//   const m = String(date.getMonth() + 1).padStart(2, "0");
//   const d = String(date.getDate()).padStart(2, "0");
//   return `${y}-${m}-${d}`;
// };

// export default function AdminPage() {
//   const [selectedDate, setSelectedDate] = useState<Date>(getToday);
//   const today = getToday();
//   const isToday = toDateString(selectedDate) === toDateString(today);

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <AdminNavbar />
//       <main className="px-8 py-8 max-w-7xl mx-auto space-y-6">
//         <div className="flex items-end justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
//               Staff Attendance
//             </h1>
//             <p className="text-xs text-slate-400 mt-1">
//               {isToday
//                 ? "Today's overview"
//                 : `Showing ${toDateString(selectedDate)}`}
//             </p>
//           </div>

//           <div className="flex items-center gap-3">
//             {!isToday && (
//               <button
//                 onClick={() => setSelectedDate(getToday())}
//                 className="text-xs text-slate-400 hover:text-slate-700
//                            transition-colors underline underline-offset-2"
//               >
//                 Back to today
//               </button>
//             )}
//             <DatePicker selected={selectedDate} onSelect={setSelectedDate} />
//           </div>
//         </div>

//         <TodaySummaryCards selectedDate={toDateString(selectedDate)} />
//         <TodayAttendanceTable selectedDate={toDateString(selectedDate)} />
//       </main>
//     </div>
//   );
// }

// app/admin/page.tsx
// app/admin/page.tsx
"use client";

import { useState } from "react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import CardinalNav from "@/components/admin/CardinalNav";

// Dashboard Tab - shows today's summary
function DashboardContent() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
          <p className="text-xs text-slate-400 uppercase tracking-wide">
            Today
          </p>
          <p className="text-2xl font-medium text-slate-800 mt-1">12 present</p>
          <p className="text-sm text-slate-500 mt-1">out of 15 staff</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
          <p className="text-xs text-slate-400 uppercase tracking-wide">
            This Month
          </p>
          <p className="text-2xl font-medium text-slate-800 mt-1">94%</p>
          <p className="text-sm text-slate-500 mt-1">attendance rate</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
          <p className="text-xs text-slate-400 uppercase tracking-wide">
            Pending
          </p>
          <p className="text-2xl font-medium text-slate-800 mt-1">3</p>
          <p className="text-sm text-slate-500 mt-1">leave requests</p>
        </div>
      </div>
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
