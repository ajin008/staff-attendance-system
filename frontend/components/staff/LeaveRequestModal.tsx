// components/staff/LeaveRequestModal.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Calendar, FileText, AlertTriangle, Loader2 } from "lucide-react";
import type { CreateLeavePayload, LeaveType } from "@/src/types";

interface LeaveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateLeavePayload) => Promise<void>;
  isSubmitting: boolean;
}

const LEAVE_TYPES: { value: LeaveType; label: string; description: string }[] =
  [
    {
      value: "sick",
      label: "Sick Leave",
      description: "Medical issues, illness, or clinical appointments",
    },
    {
      value: "casual",
      label: "Casual Leave",
      description: "Personal tasks or family commitments",
    },
    {
      value: "emergency",
      label: "Emergency Leave",
      description: "Urgent, unexpected occurrences",
    },
  ];

const getTodayDate = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function LeaveRequestModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: LeaveRequestModalProps) {
  const [selectedType, setSelectedType] = useState<LeaveType>("casual");
  const [todayDate, setTodayDate] = useState<string>("");

  useEffect(() => {
    setTodayDate(getTodayDate());
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CreateLeavePayload>({
    defaultValues: {
      leaveType: "casual",
      reason: "",
      startDate: "",
      endDate: "",
    },
  });

  const startDate = watch("startDate");

  const handleTypeChange = (type: LeaveType) => {
    setSelectedType(type);
  };

  const onFormSubmit = async (data: CreateLeavePayload) => {
    const payload = {
      ...data,
      leaveType: selectedType,
      startDate: data.startDate,
      endDate: data.endDate,
    };
    await onSubmit(payload);
    reset();
    setSelectedType("casual");
    setValue("startDate", "");
    setValue("endDate", "");
  };

  const handleClose = () => {
    reset();
    setSelectedType("casual");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Dim Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Viewport */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 antialiased">
        <div className="bg-white border border-slate-200 rounded-lg shadow-lg w-full max-w-xl max-h-[90vh] overflow-y-auto flex flex-col">
          {/* Header Sector */}
          <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                New Request Form
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Submit Leave Application
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-1 text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-200 rounded transition-colors focus:outline-none"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Form Area */}
          <form
            onSubmit={handleSubmit(onFormSubmit)}
            className="p-6 space-y-6 flex-1"
          >
            {/* Category Component Selection */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 tracking-wide mb-2">
                Select Leave Category <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {LEAVE_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleTypeChange(type.value)}
                    className={`p-3 rounded border text-left transition-all focus:outline-none ${
                      selectedType === type.value
                        ? "border-emerald-600 bg-emerald-50/50"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <p
                      className={`text-xs font-bold ${
                        selectedType === type.value
                          ? "text-emerald-700"
                          : "text-slate-800"
                      }`}
                    >
                      {type.label}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1 font-medium leading-tight">
                      {type.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Date Configuration Form Blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 tracking-wide mb-1.5">
                  Start Date <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    {...register("startDate", {
                      required: "Selection of a start date is required.",
                    })}
                    min={todayDate}
                    className={`w-full px-3 py-2 text-xs border rounded bg-white focus:outline-none transition-colors ${
                      errors.startDate
                        ? "border-rose-400 bg-rose-50/30 text-rose-900 focus:border-rose-500"
                        : "border-slate-200 text-slate-800 focus:border-slate-400"
                    }`}
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                </div>
                {errors.startDate && (
                  <p className="text-[11px] font-semibold text-rose-600 mt-1">
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 tracking-wide mb-1.5">
                  End Date <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    {...register("endDate", {
                      required: "Selection of an end date is required.",
                      validate: (value) => {
                        if (!value) {
                          return "Selection of an end date is required.";
                        }
                        if (startDate && value < startDate) {
                          return "End date cannot occur prior to start date.";
                        }
                        return true;
                      },
                    })}
                    min={startDate || todayDate}
                    className={`w-full px-3 py-2 text-xs border rounded bg-white focus:outline-none transition-colors ${
                      errors.endDate
                        ? "border-rose-400 bg-rose-50/30 text-rose-900 focus:border-rose-500"
                        : "border-slate-200 text-slate-800 focus:border-slate-400"
                    }`}
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                </div>
                {errors.endDate && (
                  <p className="text-[11px] font-semibold text-rose-600 mt-1">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* Explanatory Reasons Inputs */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 tracking-wide mb-1.5">
                Reason / Explanation <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <textarea
                  {...register("reason", {
                    required: "A written reason statement is required.",
                    minLength: {
                      value: 5,
                      message: "The statement must be at least 5 characters.",
                    },
                    maxLength: {
                      value: 500,
                      message: "The statement cannot exceed 500 characters.",
                    },
                  })}
                  rows={4}
                  placeholder="Please clarify the specific circumstances necessitating this leave allocation..."
                  className={`w-full px-3 py-2 text-xs border rounded bg-white resize-none focus:outline-none transition-colors ${
                    errors.reason
                      ? "border-rose-400 bg-rose-50/30 text-rose-900 focus:border-rose-500"
                      : "border-slate-200 text-slate-800 focus:border-slate-400"
                  }`}
                />
                <FileText className="absolute right-3 top-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>
              <div className="flex items-center justify-between mt-1">
                <div>
                  {errors.reason && (
                    <p className="text-[11px] font-semibold text-rose-600">
                      {errors.reason.message}
                    </p>
                  )}
                </div>
                <span className="text-[10px] font-medium text-slate-400 shrink-0">
                  {watch("reason")?.length || 0} / 500 characters maximum
                </span>
              </div>
            </div>

            {/* Terms Informational Block */}
            <div className="flex items-start gap-2.5 border border-slate-200 bg-slate-50 p-3 rounded">
              <AlertTriangle className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
              <div className="text-[11px] text-slate-600 leading-normal">
                <span className="font-bold text-slate-800 block mb-0.5">
                  Corporate Notice:
                </span>
                <p>
                  • All submitted leave plans are forwarded to management
                  parameters for strict evaluation.
                </p>
                <p>
                  • Emergency requests must concurrently be verbalized directly
                  to your immediate supervisor.
                </p>
              </div>
            </div>

            {/* Action Confirm Buttons Layout */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-1/3 py-2 text-xs font-bold uppercase tracking-wide
                           border border-slate-200 rounded text-slate-600
                           hover:bg-slate-50 transition-colors focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-2/3 py-2 text-xs font-bold uppercase tracking-wide
                           bg-emerald-600 text-white rounded hover:bg-emerald-700
                           disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed
                           transition-colors flex items-center justify-center gap-2 focus:outline-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Processing Application...</span>
                  </>
                ) : (
                  <span>Submit Leave Form</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
