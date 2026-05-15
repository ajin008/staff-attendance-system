import AttendanceCard from "@/components/staff/AttendanceCard";
import StaffNavbar from "@/components/staff/StaffNavbar";

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-50">
      <StaffNavbar />

      <main className="px-8 py-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-xs text-slate-400 tracking-widest uppercase mb-2">
            01 — Dashboard
          </p>

          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome Back
          </h1>
        </div>

        <AttendanceCard />
      </main>
    </div>
  );
}
