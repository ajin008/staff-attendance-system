// app/admin/floor/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Building2 } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { useFloors } from "@/src/hooks/floor/useFloors";
import FloorStaffSection from "@/components/admin/floor/FloorStaffSection";
export default function FloorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const floorId = parseInt(params.id as string);
  const { floors, isLoading } = useFloors();

  const floor = floors.find((f) => f.id === floorId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <AdminNavbar />
        <div className="max-w-400 mx-auto px-6 pb-12">
          <div className="flex items-center justify-center h-96">
            <div className="animate-pulse text-slate-400">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!floor) {
    return (
      <div className="min-h-screen bg-white">
        <AdminNavbar />
        <div className="max-w-400 mx-auto px-6 pb-12">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-slate-500">Floor not found</p>
              <button
                onClick={() => router.push("/admin")}
                className="mt-3 text-sm text-blue-600 hover:text-blue-700"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <AdminNavbar />
      <div className="max-w-400 mx-auto px-6 pb-12">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 transition-colors mt-6 mb-6"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>back to floors</span>
        </button>

        {/* Floor Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="h-6 w-6 text-blue-500" />
            <h1 className="text-2xl font-light tracking-tight text-slate-800">
              {floor.name}
            </h1>
          </div>
          <p className="text-sm text-slate-400">
            {floor.branch?.name} • Capacity: {floor.maxCapacity}
          </p>
        </div>

        {/* Staff Section */}
        <FloorStaffSection floorId={floorId} maxCapacity={floor.maxCapacity} />
      </div>
    </div>
  );
}
