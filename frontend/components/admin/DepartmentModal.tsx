// components/admin/DepartmentModal.tsx
"use client";

import { useForm } from "react-hook-form";
import Modal from "../ui/Modal";
import type { CreateDepartmentPayload } from "@/src/types";

interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateDepartmentPayload) => Promise<void>;
  isSubmitting: boolean;
}

// Predefined department options
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

// Predefined salary options
const SALARY_OPTIONS = [
  { id: "default-salary", value: 0, label: "Select salary", isDefault: true },
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
  { id: "others-salary", value: -1, label: "Others (Custom)", isCustom: true },
];

// Weekly off days options
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Department"
      size="lg"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
        {/* Department Name - Dropdown */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Department Name <span className="text-red-400">*</span>
          </label>
          <select
            {...register("departmentSelect", {
              required: "Please select a department",
              validate: (value) => {
                if (!value || value === "") return "Please select a department";
                return true;
              },
            })}
            onChange={handleDepartmentChange}
            className={`
              w-full px-4 py-2.5 rounded-lg border bg-white transition-all appearance-none
              ${
                errors.departmentSelect
                  ? "border-red-300 focus:border-red-400"
                  : "border-slate-200 focus:border-slate-300"
              }
              focus:outline-none focus:ring-2 focus:ring-slate-100 text-sm
              cursor-pointer
            `}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
              backgroundPosition: "right 1rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1.25rem",
            }}
          >
            {DEPARTMENT_OPTIONS.map((dept) => (
              <option key={dept.id} value={dept.value}>
                {dept.label}
              </option>
            ))}
          </select>
          {errors.departmentSelect && (
            <p className="text-xs text-red-400 mt-1">
              {errors.departmentSelect.message}
            </p>
          )}
        </div>

        {/* Custom Department Name - Only shows when "Others" is selected */}
        {departmentSelect === "others" && (
          <div className="animate-in fade-in duration-200">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Custom Department Name <span className="text-red-400">*</span>
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
              className={`
                w-full px-4 py-2.5 rounded-lg border bg-white transition-all
                ${
                  errors.name
                    ? "border-red-300 focus:border-red-400"
                    : "border-slate-200 focus:border-slate-300"
                }
                focus:outline-none focus:ring-2 focus:ring-slate-100 text-sm
              `}
              placeholder="e.g., Research & Development"
            />
            {errors.name && (
              <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>
            )}
          </div>
        )}

        {/* Shift Times */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Shift Start <span className="text-red-400">*</span>
            </label>
            <input
              type="time"
              {...register("shiftStart", {
                required: "Shift start time is required",
              })}
              className={`
                w-full px-4 py-2.5 rounded-lg border transition-all
                ${
                  errors.shiftStart
                    ? "border-red-300 focus:border-red-400"
                    : "border-slate-200 focus:border-slate-300"
                }
                focus:outline-none focus:ring-2 focus:ring-slate-100 text-sm
              `}
            />
            {errors.shiftStart && (
              <p className="text-xs text-red-400 mt-1">
                {errors.shiftStart.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Shift End <span className="text-red-400">*</span>
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
              className={`
                w-full px-4 py-2.5 rounded-lg border transition-all
                ${
                  errors.shiftEnd
                    ? "border-red-300 focus:border-red-400"
                    : "border-slate-200 focus:border-slate-300"
                }
                focus:outline-none focus:ring-2 focus:ring-slate-100 text-sm
              `}
            />
            {errors.shiftEnd && (
              <p className="text-xs text-red-400 mt-1">
                {errors.shiftEnd.message}
              </p>
            )}
          </div>
        </div>

        {/* Weekly Off Days Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Weekly Off Days
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {WEEKLY_OFF_OPTIONS.map((day) => (
              <button
                key={day.id}
                type="button"
                onClick={() => handleWeeklyOffToggle(day.value)}
                className={`
                  px-3 py-2 text-sm rounded-lg border transition-all
                  ${
                    weeklyOffDays.includes(day.value)
                      ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                  }
                `}
              >
                {day.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Select days when this department is off (optional)
          </p>
        </div>

        {/* Salary - Dropdown */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Default Salary (₹/month) <span className="text-red-400">*</span>
          </label>
          <select
            {...register("salarySelect", {
              required: "Please select a salary",
              validate: (value) => {
                if (value === undefined || value === 0)
                  return "Please select a salary";
                return true;
              },
            })}
            onChange={handleSalaryChange}
            className={`
              w-full px-4 py-2.5 rounded-lg border bg-white transition-all appearance-none
              ${
                errors.salarySelect
                  ? "border-red-300 focus:border-red-400"
                  : "border-slate-200 focus:border-slate-300"
              }
              focus:outline-none focus:ring-2 focus:ring-slate-100 text-sm
              cursor-pointer
            `}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
              backgroundPosition: "right 1rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1.25rem",
            }}
          >
            {SALARY_OPTIONS.map((salary) => (
              <option key={salary.id} value={salary.value}>
                {salary.label}
              </option>
            ))}
          </select>
          {errors.salarySelect && (
            <p className="text-xs text-red-400 mt-1">
              {errors.salarySelect.message}
            </p>
          )}
        </div>

        {/* Custom Salary Input - Only shows when "Others (Custom)" is selected */}
        {salarySelect === -1 && (
          <div className="animate-in fade-in duration-200">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Custom Salary Amount <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              step="1000"
              {...register("defaultSalary", {
                required:
                  salarySelect === -1 ? "Please enter salary amount" : false,
                min: { value: 1, message: "Salary must be at least ₹1" },
                validate: (value) => {
                  if (value <= 0) return "Salary must be positive";
                  return true;
                },
              })}
              className={`
                w-full px-4 py-2.5 rounded-lg border bg-white transition-all
                ${
                  errors.defaultSalary
                    ? "border-red-300 focus:border-red-400"
                    : "border-slate-200 focus:border-slate-300"
                }
                focus:outline-none focus:ring-2 focus:ring-slate-100 text-sm
              `}
              placeholder="Enter custom salary"
            />
            {errors.defaultSalary && (
              <p className="text-xs text-red-400 mt-1">
                {errors.defaultSalary.message}
              </p>
            )}
          </div>
        )}

        {/* Overtime Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">
              Enable Overtime
            </label>
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
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Grace Minutes <span className="text-red-400">*</span>
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
                  className={`
                    w-full px-4 py-2.5 rounded-lg border transition-all
                    ${
                      errors.overtimeGraceMins
                        ? "border-red-300 focus:border-red-400"
                        : "border-slate-200 focus:border-slate-300"
                    }
                    focus:outline-none focus:ring-2 focus:ring-slate-100 text-sm
                  `}
                  placeholder="e.g., 15"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Minutes after shift end before overtime applies
                </p>
                {errors.overtimeGraceMins && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.overtimeGraceMins.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Overtime Hourly Rate (₹/hour){" "}
                  <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  step="10"
                  {...register("overtimeHourlyRate", {
                    required: overtimeEnabled
                      ? "Overtime hourly rate is required"
                      : false,
                    min: { value: 1, message: "Rate must be at least ₹1" },
                    valueAsNumber: true,
                  })}
                  className={`
                    w-full px-4 py-2.5 rounded-lg border transition-all
                    ${
                      errors.overtimeHourlyRate
                        ? "border-red-300 focus:border-red-400"
                        : "border-slate-200 focus:border-slate-300"
                    }
                    focus:outline-none focus:ring-2 focus:ring-slate-100 text-sm
                  `}
                  placeholder="e.g., 500"
                />
                {errors.overtimeHourlyRate && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.overtimeHourlyRate.message}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-slate-100 mt-6">
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
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Creating..." : "Create Department"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
