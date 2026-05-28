// components/admin/DepartmentModal.tsx
"use client";

import { useForm } from "react-hook-form";
import { FolderPlus } from "lucide-react";
import Modal from "../ui/Modal";
import type { CreateDepartmentPayload } from "@/src/types";

interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateDepartmentPayload) => Promise<void>;
  isSubmitting: boolean;
}

const DEPARTMENT_OPTIONS = [
  { id: "default-dept", value: "", label: "Select department" },
  { id: "sales", value: "Sales", label: "Sales" },
  { id: "marketing", value: "Marketing", label: "Marketing" },
  { id: "engineering", value: "Engineering", label: "Engineering" },
  { id: "hr", value: "Human Resources", label: "Human Resources" },
  { id: "finance", value: "Finance", label: "Finance" },
  { id: "operations", value: "Operations", label: "Operations" },
  {
    id: "customer-support",
    value: "Customer Support",
    label: "Customer Support",
  },
  { id: "product", value: "Product", label: "Product" },
  { id: "design", value: "Design", label: "Design" },
  { id: "legal", value: "Legal", label: "Legal" },
  { id: "it", value: "IT", label: "IT" },
  { id: "admin", value: "Admin", label: "Administration" },
  { id: "others-dept", value: "others", label: "Others (Custom)" },
];

const SALARY_OPTIONS = [
  { id: "default-salary", value: 0, label: "Select salary" },
  { id: "salary-10k", value: 10000, label: "₹10,000" },
  { id: "salary-15k", value: 15000, label: "₹15,000" },
  { id: "salary-20k", value: 20000, label: "₹20,000" },
  { id: "salary-25k", value: 25000, label: "₹25,000" },
  { id: "salary-30k", value: 30000, label: "₹30,000" },
  { id: "salary-40k", value: 40000, label: "₹40,000" },
  { id: "salary-50k", value: 50000, label: "₹50,000" },
  { id: "salary-60k", value: 60000, label: "₹60,000" },
  { id: "salary-75k", value: 75000, label: "₹75,000" },
  { id: "salary-100k", value: 100000, label: "₹1,00,000" },
  { id: "salary-150k", value: 150000, label: "₹1,50,000" },
  { id: "salary-200k", value: 200000, label: "₹2,00,000" },
  { id: "others-salary", value: -1, label: "Others (Custom)" },
];

const WEEKLY_OFF_OPTIONS = [
  { id: "monday", label: "Monday", value: "monday" },
  { id: "tuesday", label: "Tuesday", value: "tuesday" },
  { id: "wednesday", label: "Wednesday", value: "wednesday" },
  { id: "thursday", label: "Thursday", value: "thursday" },
  { id: "friday", label: "Friday", value: "friday" },
  { id: "saturday", label: "Saturday", value: "saturday" },
  { id: "sunday", label: "Sunday", value: "sunday" },
];

export default function DepartmentModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: DepartmentModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<
    CreateDepartmentPayload & { departmentSelect: string; salarySelect: number }
  >({
    defaultValues: {
      name: "",
      departmentSelect: "",
      shiftStart: "09:00",
      shiftEnd: "17:00",
      overtimeEnabled: false,
      overtimeGraceMins: 15,
      overtimeHourlyRate: undefined,
      defaultSalary: 0,
      salarySelect: 0,
      weeklyOffDays: [],
    },
  });

  const overtimeEnabled = watch("overtimeEnabled");
  const departmentSelect = watch("departmentSelect");
  const salarySelect = watch("salarySelect");
  const weeklyOffDays = watch("weeklyOffDays") || [];

  const handleToggleOvertime = () => {
    setValue("overtimeEnabled", !overtimeEnabled);
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setValue("departmentSelect", value);
    if (value && value !== "others") {
      setValue("name", value);
    } else if (value === "others") {
      setValue("name", "");
    }
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value);
    setValue("salarySelect", value);
    if (value && value !== -1) {
      setValue("defaultSalary", value);
    } else if (value === -1) {
      setValue("defaultSalary", 0);
    }
  };

  const handleWeeklyOffToggle = (day: string) => {
    const currentDays = weeklyOffDays;
    if (currentDays.includes(day)) {
      setValue(
        "weeklyOffDays",
        currentDays.filter((d) => d !== day)
      );
    } else {
      setValue("weeklyOffDays", [...currentDays, day]);
    }
  };

  const onFormSubmit = async (data: CreateDepartmentPayload) => {
    await onSubmit(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const selectDropdownStyles = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23475569' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E")`,
    backgroundPosition: "right 14px center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "16px",
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Department"
      size="lg"
    >
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="space-y-5 antialiased"
      >
        {/* Department Name Dropdown */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-tight block">
            Department Name <span className="text-rose-500 font-normal">*</span>
          </label>
          <select
            {...register("departmentSelect", {
              required: "Please select a department",
              validate: (value) =>
                !value || value === "" ? "Please select a department" : true,
            })}
            onChange={handleDepartmentChange}
            className={`w-full px-3.5 py-2 rounded-md border text-xs font-medium transition-colors bg-white focus:outline-none focus:border-slate-900 focus:ring-0 appearance-none cursor-pointer ${
              errors.departmentSelect
                ? "border-rose-300 text-rose-900"
                : "border-slate-200 text-slate-900"
            }`}
            style={selectDropdownStyles}
          >
            {DEPARTMENT_OPTIONS.map((dept) => (
              <option key={dept.id} value={dept.value}>
                {dept.label}
              </option>
            ))}
          </select>
          {errors.departmentSelect && (
            <p className="text-[11px] text-rose-500 font-medium mt-0.5">
              {errors.departmentSelect.message}
            </p>
          )}
        </div>

        {/* Custom Department Name */}
        {departmentSelect === "others" && (
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-tight block">
              Custom Department Name{" "}
              <span className="text-rose-500 font-normal">*</span>
            </label>
            <input
              type="text"
              {...register("name", {
                required:
                  departmentSelect === "others"
                    ? "Please enter department name"
                    : false,
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
              className={`w-full px-3.5 py-2 rounded-md border text-xs font-medium transition-colors bg-white placeholder:text-slate-300 focus:outline-none focus:border-slate-900 focus:ring-0 ${
                errors.name
                  ? "border-rose-300 text-rose-900"
                  : "border-slate-200 text-slate-900"
              }`}
              placeholder="e.g., Research & Development"
            />
            {errors.name && (
              <p className="text-[11px] text-rose-500 font-medium mt-0.5">
                {errors.name.message}
              </p>
            )}
          </div>
        )}

        {/* Shift Timings Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-tight block">
              Shift Start <span className="text-rose-500 font-normal">*</span>
            </label>
            <input
              type="time"
              {...register("shiftStart", {
                required: "Shift start time is required",
              })}
              className={`w-full px-3.5 py-2 rounded-md border text-xs font-mono font-bold text-slate-900 transition-colors bg-white focus:outline-none focus:border-slate-900 focus:ring-0 ${
                errors.shiftStart ? "border-rose-300" : "border-slate-200"
              }`}
            />
            {errors.shiftStart && (
              <p className="text-[11px] text-rose-500 font-medium mt-0.5">
                {errors.shiftStart.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-tight block">
              Shift End <span className="text-rose-500 font-normal">*</span>
            </label>
            <input
              type="time"
              {...register("shiftEnd", {
                required: "Shift end time is required",
                validate: (value) => {
                  const start = watch("shiftStart");
                  if (start && value && value <= start) {
                    return "Shift end must be after shift start";
                  }
                  return true;
                },
              })}
              className={`w-full px-3.5 py-2 rounded-md border text-xs font-mono font-bold text-slate-900 transition-colors bg-white focus:outline-none focus:border-slate-900 focus:ring-0 ${
                errors.shiftEnd ? "border-rose-300" : "border-slate-200"
              }`}
            />
            {errors.shiftEnd && (
              <p className="text-[11px] text-rose-500 font-medium mt-0.5">
                {errors.shiftEnd.message}
              </p>
            )}
          </div>
        </div>

        {/* Weekly Off Days Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-tight block">
            Weekly Off Days{" "}
            <span className="text-slate-400 font-normal font-mono">
              [ Optional ]
            </span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {WEEKLY_OFF_OPTIONS.map((day) => {
              const isSelected = weeklyOffDays.includes(day.value);
              return (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => handleWeeklyOffToggle(day.value)}
                  className={`px-3 py-1.5 text-xs font-mono font-bold rounded-sm border transition-all uppercase tracking-tight ${
                    isSelected
                      ? "bg-slate-900 border-slate-950 text-white"
                      : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {day.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Default Salary Dropdown */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-tight block">
            Default Base Salary{" "}
            <span className="text-rose-500 font-normal">*</span>
          </label>
          <select
            {...register("salarySelect", {
              required: "Please select a salary specification",
              validate: (value) =>
                value === undefined || value === 0
                  ? "Please select a salary valuation"
                  : true,
            })}
            onChange={handleSalaryChange}
            className={`w-full px-3.5 py-2 rounded-md border text-xs font-medium transition-colors bg-white focus:outline-none focus:border-slate-900 focus:ring-0 appearance-none cursor-pointer ${
              errors.salarySelect
                ? "border-rose-300 text-rose-900"
                : "border-slate-200 text-slate-900"
            }`}
            style={selectDropdownStyles}
          >
            {SALARY_OPTIONS.map((salary) => (
              <option key={salary.id} value={salary.value}>
                {salary.label === "Select salary"
                  ? "Select base scale alignment"
                  : salary.label}
              </option>
            ))}
          </select>
          {errors.salarySelect && (
            <p className="text-[11px] text-rose-500 font-medium mt-0.5">
              {errors.salarySelect.message}
            </p>
          )}
        </div>

        {/* Custom Salary Input Box */}
        {salarySelect === -1 && (
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-tight block">
              Custom Valuation Metrics{" "}
              <span className="text-rose-500 font-normal">*</span>
            </label>
            <input
              type="number"
              step="1000"
              {...register("defaultSalary", {
                required:
                  salarySelect === -1
                    ? "Please input absolute valuation metrics"
                    : false,
                min: { value: 1, message: "Metrics value must be at least 1" },
                validate: (value) =>
                  value <= 0 ? "Metrics value must be positive" : true,
              })}
              className={`w-full px-3.5 py-2 rounded-md border text-xs font-mono font-bold text-slate-900 transition-colors bg-white focus:outline-none focus:border-slate-900 focus:ring-0 ${
                errors.defaultSalary ? "border-rose-300" : "border-slate-200"
              }`}
              placeholder="Enter salary valuation scale"
            />
            {errors.defaultSalary && (
              <p className="text-[11px] text-rose-500 font-medium mt-0.5">
                {errors.defaultSalary.message}
              </p>
            )}
          </div>
        )}

        {/* Overtime Configuration Panel Wireframe */}
        <div className="p-4 rounded-md border border-slate-200/70 bg-slate-50 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-tight block">
                Enable Overtime Logging
              </label>
              <p className="text-[11px] text-slate-400 font-normal">
                Trigger parameter processing algorithms for overtime allocation
                indices.
              </p>
            </div>
            <button
              type="button"
              onClick={handleToggleOvertime}
              className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-150 ${
                overtimeEnabled ? "bg-slate-900" : "bg-slate-200"
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-150 ${
                  overtimeEnabled ? "translate-x-4.5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          {overtimeEnabled && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200/60">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-tight block">
                  Grace Minutes Boundary{" "}
                  <span className="text-rose-500 font-normal">*</span>
                </label>
                <input
                  type="number"
                  {...register("overtimeGraceMins", {
                    required: overtimeEnabled
                      ? "Grace minutes variable is required"
                      : false,
                    min: { value: 0, message: "Must be 0 or more" },
                    valueAsNumber: true,
                  })}
                  className={`w-full px-3.5 py-2 rounded-md border text-xs font-mono font-bold text-slate-900 transition-colors bg-white focus:outline-none focus:border-slate-900 focus:ring-0 ${
                    errors.overtimeGraceMins
                      ? "border-rose-300"
                      : "border-slate-200"
                  }`}
                  placeholder="15"
                />
                <p className="text-[10px] text-slate-400 font-normal leading-normal">
                  Threshold minute intervals preceding shift closure bounds.
                </p>
                {errors.overtimeGraceMins && (
                  <p className="text-[11px] text-rose-500 font-medium mt-0.5">
                    {errors.overtimeGraceMins.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-tight block">
                  Hourly Allocation Rate{" "}
                  <span className="text-rose-500 font-normal">*</span>
                </label>
                <input
                  type="number"
                  step="10"
                  {...register("overtimeHourlyRate", {
                    required: overtimeEnabled
                      ? "Hourly matrix rate calculation variable required"
                      : false,
                    min: {
                      value: 1,
                      message: "Variable scale must be at least 1",
                    },
                    valueAsNumber: true,
                  })}
                  className={`w-full px-3.5 py-2 rounded-md border text-xs font-mono font-bold text-slate-900 transition-colors bg-white focus:outline-none focus:border-slate-900 focus:ring-0 ${
                    errors.overtimeHourlyRate
                      ? "border-rose-300"
                      : "border-slate-200"
                  }`}
                  placeholder="500"
                />
                {errors.overtimeHourlyRate && (
                  <p className="text-[11px] text-rose-500 font-medium mt-0.5">
                    {errors.overtimeHourlyRate.message}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Global Action Footer Layout Buttons */}
        <div className="flex items-center gap-3 pt-3 border-t border-slate-100 mt-6">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2 border border-slate-200 rounded-md text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 transition-all focus:outline-none"
          >
            Cancel Allocation
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 border border-slate-950 rounded-md text-xs font-bold uppercase tracking-wider text-white hover:bg-black disabled:opacity-30 disabled:cursor-not-allowed transition-all focus:outline-none"
          >
            {isSubmitting ? (
              <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <FolderPlus className="h-3.5 w-3.5" />
                <span>Create Sector Node</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
