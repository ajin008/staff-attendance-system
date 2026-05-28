/* eslint-disable react-hooks/set-state-in-effect */
// app/admin/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  Building2,
  Briefcase,
  User,
  Phone,
  Lock,
  Save,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import {
  getProfileDetails,
  updateProfileDetails,
  type Branch,
  type UpdateProfileInput,
} from "@/src/services/profile.service";
import { toast } from "sonner";
import { getErrorMessage } from "@/src/utils/axios";

// Dynamically load the detached Branch Management array panel
const BranchManager = dynamic(
  () => import("@/components/admin/profile/BranchManager"),
  { ssr: false }
);

const SECTOR_OPTIONS: string[] = [
  "Technology & Software",
  "Healthcare & Clinics",
  "Education & Academics",
  "Retail & E-commerce",
  "Manufacturing & Logistics",
  "Hospitality & Food Services",
  "Finance & Banking",
];

export default function ProfileSettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    companyName: "",
    sector: "",
    fullName: "",
    phone: "",
    email: "",
    password: "",
  });

  const [initialBranches, setInitialBranches] = useState<Branch[]>([]);

  const fetchProfile = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await getProfileDetails();
      setFormData({
        companyName: response.organization.companyName || "",
        sector: response.organization.sector || "",
        fullName: response.admin.fullName || "",
        phone: response.admin.phone || "",
        email: response.admin.email || "",
        password: "",
      });
      // Store structural branches independently
      setInitialBranches(response.organization.branches || []);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Pull branches configuration data dynamically from database to protect sync state
      const currentProfileState = await getProfileDetails();

      const updateData = {
        companyName: formData.companyName,
        sector: formData.sector,
        fullName: formData.fullName,
        phone: formData.phone,
        branches: currentProfileState.organization.branches || [], // Guard branch matrix state integrity
      };

      const payload = formData.password.trim()
        ? { ...updateData, password: formData.password }
        : updateData;

      await updateProfileDetails(payload as UpdateProfileInput);
      toast.success("Profile specifications synchronized successfully");
      setFormData((prev) => ({ ...prev, password: "" }));
      await fetchProfile();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <div className="w-full bg-white border-b border-slate-100">
          <AdminNavbar />
        </div>
        <div className="w-full max-w-[1600px] mx-auto px-6 py-12 space-y-6 animate-pulse">
          <div className="h-8 bg-slate-200/60 rounded-sm w-1/4" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-72 bg-white rounded-md" />
            <div className="h-72 bg-white rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 antialiased flex flex-col">
      <div className="w-full bg-white border-b border-slate-100">
        <AdminNavbar />
      </div>

      <div className="w-full max-w-[1600px] mx-auto px-6 py-8 flex-1">
        <div className="space-y-8">
          {/* Top Title Bar Layout Block */}
          <div className="flex items-end justify-between border-b border-slate-200/60 pb-6">
            <div>
              <button
                type="button"
                onClick={() => router.back()}
                className="flex items-center gap-1.5 text-[11px] font-mono uppercase font-bold text-slate-400 hover:text-slate-900 transition-colors mb-3 focus:outline-none"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>back to system index</span>
              </button>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">
                Profile Configuration
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* COLUMN ONE: Profile Management Info (Form Wrapped) */}
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="space-y-6 border border-slate-200/60 rounded-md p-6 bg-white shadow-sm">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-2">
                  <Building2 className="h-4 w-4 text-slate-400" />
                  <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    01 — Corporate Profile Specs
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Company Legal Entity Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          companyName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 text-xs font-medium border border-slate-200 bg-white rounded-md focus:outline-none focus:border-slate-900 uppercase transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Business Sector Stream
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={formData.sector}
                        onChange={(e) =>
                          setFormData({ ...formData, sector: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs font-medium border border-slate-200 bg-white rounded-md focus:outline-none focus:border-slate-900 transition-colors appearance-none"
                      >
                        {SECTOR_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt.toUpperCase()}
                          </option>
                        ))}
                      </select>
                      <Briefcase className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 border-b border-slate-100 pb-3 pt-4 mb-2">
                  <User className="h-4 w-4 text-slate-400" />
                  <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    02 — Executive Credentials
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Admin Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs font-medium border border-slate-200 bg-white rounded-md focus:outline-none focus:border-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs font-mono border border-slate-200 bg-white rounded-md focus:outline-none focus:border-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      System Primary Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        disabled
                        value={formData.email}
                        className="w-full px-3 py-2 text-xs font-mono text-slate-400 border border-slate-100 bg-slate-50 rounded-md cursor-not-allowed"
                      />
                      <ShieldAlert className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4">
                    <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      New Passkey Token (Optional)
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="LEAVE BLANK TO RETAIN CURRENT SECURITY VAL"
                      className="w-full px-3 py-2 text-xs font-mono border border-slate-200 bg-white rounded-md focus:outline-none focus:border-slate-900 placeholder:text-[10px]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-white bg-slate-900 rounded-md hover:bg-black transition-colors flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Save className="h-3.5 w-3.5" />
                  )}
                  <span>Commit Core Profiles</span>
                </button>
              </div>
            </form>

            {/* COLUMN TWO: Isolated Branch Management Node */}
            <div className="space-y-6">
              <BranchManager initialBranches={initialBranches} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
