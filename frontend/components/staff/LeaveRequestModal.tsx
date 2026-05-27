// components/staff/LeaveRequestModal.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Calendar, FileText, AlertCircle } from "lucide-react";
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
      description: "For illness or medical appointments",
    },
    {
      value: "casual",
      label: "Casual Leave",
      description: "For personal or family matters",
    },
    {
      value: "emergency",
      label: "Emergency Leave",
      description: "For urgent unforeseen situations",
    },
  ];

// Helper function to get today's date in YYYY-MM-DD format (Indian timezone)
const getTodayDate = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper function to format date for API (YYYY-MM-DD)
const formatDateForAPI = (date: string): string => {
  if (!date) return date;
  // Return the date string as is since it's already YYYY-MM-DD
  return date;
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
  const endDate = watch("endDate");

  const handleTypeChange = (type: LeaveType) => {
    setSelectedType(type);
  };

  const onFormSubmit = async (data: CreateLeavePayload) => {
    // Format dates for API (already in correct format)
    const payload = {
      ...data,
      leaveType: selectedType,
      startDate: formatDateForAPI(data.startDate),
      endDate: formatDateForAPI(data.endDate),
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
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
            <div>
              <p className="text-xs text-slate-400 tracking-widest uppercase">
                Request Leave
              </p>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Submit Leave Request
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="text-slate-300 hover:text-slate-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-5">
            {/* Leave Type Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Leave Type <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {LEAVE_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleTypeChange(type.value)}
                    className={`
                      p-3 rounded-xl border-2 text-left transition-all
                      ${
                        selectedType === type.value
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-slate-200 hover:border-slate-300"
                      }
                    `}
                  >
                    <p
                      className={`text-sm font-medium ${
                        selectedType === type.value
                          ? "text-emerald-700"
                          : "text-slate-700"
                      }`}
                    >
                      {type.label}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {type.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Start Date <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    {...register("startDate", {
                      required: "Start date is required",
                    })}
                    min={todayDate}
                    className={`
                      w-full px-4 py-2.5 rounded-lg border bg-white
                      ${
                        errors.startDate
                          ? "border-red-300 focus:border-red-400"
                          : "border-slate-200 focus:border-slate-300"
                      }
                      focus:outline-none focus:ring-2 focus:ring-slate-100 text-sm
                    `}
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
                {errors.startDate && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  End Date <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    {...register("endDate", {
                      required: "End date is required",
                      validate: (value) => {
                        if (startDate && value && value < startDate) {
                          return "End date must be after start date";
                        }
                        return true;
                      },
                    })}
                    min={startDate || todayDate}
                    className={`
                      w-full px-4 py-2.5 rounded-lg border bg-white
                      ${
                        errors.endDate
                          ? "border-red-300 focus:border-red-400"
                          : "border-slate-200 focus:border-slate-300"
                      }
                      focus:outline-none focus:ring-2 focus:ring-slate-100 text-sm
                    `}
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
                {errors.endDate && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Reason <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <textarea
                  {...register("reason", {
                    required: "Reason is required",
                    minLength: {
                      value: 5,
                      message: "Reason must be at least 5 characters",
                    },
                    maxLength: {
                      value: 500,
                      message: "Reason cannot exceed 500 characters",
                    },
                  })}
                  rows={4}
                  placeholder="Please provide details about your leave request..."
                  className={`
                    w-full px-4 py-2.5 rounded-lg border bg-white resize-none
                    ${
                      errors.reason
                        ? "border-red-300 focus:border-red-400"
                        : "border-slate-200 focus:border-slate-300"
                    }
                    focus:outline-none focus:ring-2 focus:ring-slate-100 text-sm
                  `}
                />
                <FileText className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
              {errors.reason && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.reason.message}
                </p>
              )}
              <p className="text-xs text-slate-400 mt-1">
                {watch("reason")?.length || 0}/500 characters
              </p>
            </div>

            {/* Info Note */}
            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5" />
              <div className="text-xs text-blue-700">
                <p className="font-medium mb-1">Note:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Leave requests will be reviewed by your manager</li>
                  <li>
                    You&lsquo;ll be notified once your request is processed
                  </li>
                  <li>Emergency leaves should be reported via phone as well</li>
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-700 hover:bg-slate-50 border border-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
