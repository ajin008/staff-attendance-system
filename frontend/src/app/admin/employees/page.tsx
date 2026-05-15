import AdminNavbar from "@/components/admin/AdminNavbar";
import StaffTable from "@/components/admin/StaffTable";

export default function EmployeesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNavbar />
      <main className="px-8 py-8 max-w-7xl mx-auto space-y-6">
        <div>
          <p className="text-xs text-slate-400 tracking-widest uppercase mb-2">
            04 — Directory
          </p>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Employees
          </h1>
        </div>
        <StaffTable />
      </main>
    </div>
  );
}
