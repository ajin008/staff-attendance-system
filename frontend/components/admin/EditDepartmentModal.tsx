// components/admin/EditDepartmentModal.tsx
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "../ui/Modal";
import type { Department } from "@/src/types";

interface EditDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: Department | null;
  isSubmitting: boolean;
  onSubmit: (data: Partial<Department>) => void;
}

const WEEKDAYS = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

export default function EditDepartmentModal({
  isOpen,
  onClose,
  department,
  isSubmitting,
  onSubmit,
}: EditDepartmentModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Partial<Department>>({
    defaultValues: {
      name: "",
      shiftStart: "09:00",
      shiftEnd: "17:00",
      defaultSalary: 0,
      overtimeEnabled: false,
      overtimeGraceMins: 15,
      overtimeHourlyRate: undefined,
      weeklyOffDays: [],
    },
  });

  const overtimeEnabled = watch("overtimeEnabled");
  const weeklyOffDays = watch("weeklyOffDays") || [];

  useEffect(() => {
    if (department && isOpen) {
      reset({
        name: department.name,
        shiftStart: department.shiftStart,
        shiftEnd: department.shiftEnd,
        defaultSalary: department.defaultSalary,
        overtimeEnabled: department.overtimeEnabled,
        overtimeGraceMins: department.overtimeGraceMins,
        overtimeHourlyRate: department.overtimeHourlyRate || undefined,
        weeklyOffDays: department.weeklyOffDays || [],
      });
    }
  }, [department, isOpen, reset]);

  const handleToggleOvertime = () => {
    setValue("overtimeEnabled", !overtimeEnabled);
  };

  const handleDayToggle = (day: string) => {
    const currentDays = weeklyOffDays;
    const updatedDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day];
    setValue("weeklyOffDays", updatedDays);
  };

  const onFormSubmit = (data: Partial<Department>) => {
    onSubmit(data);
  };

  if (!department) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Department" size="lg">
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
        {/* Department Name */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Department Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("name", { required: "Department name is required" })}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 text-sm"
            placeholder="e.g., Engineering, HR, Sales"
          />
          {errors.name && (
            <p className="text-xs text-rose-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Shift Timing Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Shift Start <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              {...register("shiftStart", {
                required: "Shift start is required",
              })}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Shift End <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              {...register("shiftEnd", { required: "Shift end is required" })}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 text-sm"
            />
          </div>
        </div>

        {/* Default Salary */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Default Salary (₹/month) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="1000"
            {...register("defaultSalary", {
              required: "Salary is required",
              min: { value: 1, message: "Salary must be at least ₹1" },
              valueAsNumber: true,
            })}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 text-sm"
            placeholder="e.g., 50000"
          />
          {errors.defaultSalary && (
            <p className="text-xs text-rose-500 mt-1">
              {errors.defaultSalary.message}
            </p>
          )}
        </div>

        {/* Weekly Off Days Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Weekly Off Days
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {WEEKDAYS.map((day) => (
              <button
                key={day.value}
                type="button"
                onClick={() => handleDayToggle(day.value)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  weeklyOffDays.includes(day.value)
                    ? "bg-slate-900 text-white border border-slate-900"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Select days when employees are off work
          </p>
        </div>

        {/* Overtime Toggle Section */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Enable Overtime
              </label>
              <p className="text-xs text-slate-400 mt-0.5">
                Allow overtime tracking for this department
              </p>
            </div>
            <button
              type="button"
              onClick={handleToggleOvertime}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full 
                transition-colors duration-200 focus:outline-none focus:ring-2 
                focus:ring-slate-200 focus:ring-offset-2
                ${overtimeEnabled ? "bg-slate-900" : "bg-slate-200"}
              `}
            >
              <span
                className={`
                  inline-block h-5 w-5 transform rounded-full bg-white 
                  shadow-sm transition-transform duration-200
                  ${overtimeEnabled ? "translate-x-6" : "translate-x-0.5"}
                `}
              />
            </button>
          </div>

          {overtimeEnabled && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Grace Minutes <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  {...register("overtimeGraceMins", {
                    required: overtimeEnabled
                      ? "Grace minutes is required"
                      : false,
                    min: { value: 0, message: "Must be 0 or more" },
                    valueAsNumber: true,
                  })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 text-sm"
                  placeholder="e.g., 15"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Overtime Hourly Rate (₹/hour){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="10"
                  {...register("overtimeHourlyRate", {
                    required: overtimeEnabled
                      ? "Hourly rate is required"
                      : false,
                    min: { value: 1, message: "Rate must be at least ₹1" },
                    valueAsNumber: true,
                  })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 text-sm"
                  placeholder="e.g., 500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-700 hover:bg-slate-50 border border-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
