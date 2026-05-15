"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateStaff } from "@/src/services/auth.service";
import { User } from "@/src/types";
import { Loader2, X } from "lucide-react";

interface EditStaffForm {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  staff: User | null;
  onUpdated: () => void;
}

export default function EditStaffModal({
  open,
  onClose,
  staff,
  onUpdated,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditStaffForm>();

  useEffect(() => {
    if (staff) {
      reset({
        name: staff.name,
        email: staff.email,
        password: "",
        phone: staff.phone ?? "",
      });
    }
  }, [staff, reset]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const onSubmit = async (data: EditStaffForm) => {
    if (!staff) return;

    const payload: Partial<EditStaffForm> = {};
    if (data.name !== staff.name) payload.name = data.name;
    if (data.email !== staff.email) payload.email = data.email;
    if (data.password) payload.password = data.password;
    if (data.phone !== staff.phone) payload.phone = data.phone;

    if (Object.keys(payload).length === 0) {
      toast.info("No changes made");
      onClose();
      return;
    }

    try {
      await updateStaff(staff.staffId, payload);
      toast.success("Staff updated successfully");
      onUpdated();
      onClose();
    } catch {
      toast.error("Failed to update staff");
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40
                    transition-opacity duration-300
                    ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />

      {/* Slide-in panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md
                       bg-white shadow-2xl z-50 flex flex-col
                       transition-transform duration-300 ease-in-out
                       ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div
          className="px-8 py-6 border-b border-slate-100 flex items-start
                        justify-between"
        >
          <div>
            <p className="text-xs text-slate-400 tracking-widest uppercase mb-1">
              Edit Member
            </p>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {staff?.name}
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {staff?.staffId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-slate-700 transition-colors mt-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <form
            id="edit-staff-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Name */}
            <div className="space-y-1.5">
              <label
                className="text-xs font-semibold text-slate-400
                                uppercase tracking-widest"
              >
                Full Name
              </label>
              <input
                placeholder="Full name"
                disabled={isSubmitting}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm
                  text-slate-900 placeholder:text-slate-300
                  focus:outline-none focus:ring-2 focus:ring-slate-900
                  focus:border-transparent bg-white transition-all
                  disabled:opacity-50
                  ${errors.name ? "border-red-300" : "border-slate-200"}`}
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <p className="text-xs text-red-400">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label
                className="text-xs font-semibold text-slate-400
                                uppercase tracking-widest"
              >
                Email Address
              </label>
              <input
                type="email"
                placeholder="email@company.com"
                disabled={isSubmitting}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm
                  text-slate-900 placeholder:text-slate-300
                  focus:outline-none focus:ring-2 focus:ring-slate-900
                  focus:border-transparent bg-white transition-all
                  disabled:opacity-50
                  ${errors.email ? "border-red-300" : "border-slate-200"}`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email",
                  },
                })}
              />
              {errors.email && (
                <p className="text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label
                className="text-xs font-semibold text-slate-400
                    uppercase tracking-widest"
              >
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                disabled={isSubmitting}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm
      text-slate-900 placeholder:text-slate-300
      focus:outline-none focus:ring-2 focus:ring-slate-900
      focus:border-transparent bg-white transition-all
      disabled:opacity-50
      ${errors.phone ? "border-red-300" : "border-slate-200"}`}
                {...register("phone", {
                  pattern: {
                    value: /^[+]?[\d\s\-()]{10,15}$/,
                    message: "Enter a valid phone number",
                  },
                })}
              />
              {errors.phone && (
                <p className="text-xs text-red-400">{errors.phone.message}</p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label
                className="text-xs font-semibold text-slate-400
                                uppercase tracking-widest"
              >
                New Password
                <span className="ml-1 normal-case font-normal text-slate-300">
                  (leave blank to keep current)
                </span>
              </label>
              <input
                type="password"
                placeholder="Min 6 characters"
                disabled={isSubmitting}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm
                  text-slate-900 placeholder:text-slate-300
                  focus:outline-none focus:ring-2 focus:ring-slate-900
                  focus:border-transparent bg-white transition-all
                  disabled:opacity-50
                  ${errors.password ? "border-red-300" : "border-slate-200"}`}
                {...register("password", {
                  minLength: { value: 6, message: "Min 6 characters" },
                })}
              />
              {errors.password && (
                <p className="text-xs text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Info */}
            <div className="flex gap-3 p-4 bg-slate-50 rounded-xl">
              <div className="w-1 bg-slate-200 rounded-full shrink-0" />
              <p className="text-xs text-slate-400 leading-relaxed">
                Only changed fields will be updated. Leave password blank to
                keep the current password.
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-slate-100 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200
                       text-sm font-medium text-slate-600
                       hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-staff-form"
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-700
                       text-white text-sm font-semibold
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes →"
            )}
          </button>
        </div>
      </div>
    </>
  );
}
