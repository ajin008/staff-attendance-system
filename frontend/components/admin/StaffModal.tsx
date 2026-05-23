/* eslint-disable @typescript-eslint/no-explicit-any */
// components/admin/StaffModal.tsx
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "../ui/Modal";
import type { CreateStaffInput, Department } from "@/src/types";

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateStaffInput) => Promise<void>;
  isSubmitting: boolean;
  departments: Department[];
  isLoadingDepartments: boolean;
}

export default function StaffModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  departments,
  isLoadingDepartments,
}: StaffModalProps) {
  const [selectedDeptDetails, setSelectedDeptDetails] =
    useState<Department | null>(null);
  const [overrideWorkConfig, setOverrideWorkConfig] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateStaffInput>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      branch: "",
      password: "",
      departmentId: undefined,
      organizationId: 1,
      joinedOn: new Date(),
      shiftStart: "",
      shiftEnd: "",
      salary: undefined,
      overtimeEnabled: false,
      overtimeHourlyRate: undefined,
      overtimeGraceMins: undefined,
    },
  });

  const overtimeEnabled = watch("overtimeEnabled");
  const selectedDepartmentId = watch("departmentId");

  // Update department details when selection changes
  useEffect(() => {
    if (selectedDepartmentId) {
      const dept = departments.find(
        (d) => d.id === Number(selectedDepartmentId)
      );
      setSelectedDeptDetails(dept || null);

      // Reset override values when department changes
      if (!overrideWorkConfig) {
        setValue("shiftStart", "");
        setValue("shiftEnd", "");
        setValue("salary", undefined);
        setValue("overtimeEnabled", false);
        setValue("overtimeHourlyRate", undefined);
        setValue("overtimeGraceMins", undefined);
      }
    } else {
      setSelectedDeptDetails(null);
    }
  }, [selectedDepartmentId, departments, setValue, overrideWorkConfig]);

  const handleToggleOvertime = () => {
    setValue("overtimeEnabled", !overtimeEnabled);
  };

  const handleOverrideToggle = () => {
    setOverrideWorkConfig(!overrideWorkConfig);
    if (!overrideWorkConfig) {
      // Clearing overrides when toggling off
      setValue("shiftStart", "");
      setValue("shiftEnd", "");
      setValue("salary", undefined);
      setValue("overtimeEnabled", false);
      setValue("overtimeHourlyRate", undefined);
      setValue("overtimeGraceMins", undefined);
    }
  };

  const onFormSubmit = async (data: CreateStaffInput) => {
    const formattedData: any = {
      ...data,
      joinedOn: data.joinedOn || new Date(),
      departmentId: Number(data.departmentId),
    };

    // Only include override values if override is enabled
    if (!overrideWorkConfig) {
      delete formattedData.shiftStart;
      delete formattedData.shiftEnd;
      delete formattedData.salary;
      delete formattedData.overtimeEnabled;
      delete formattedData.overtimeHourlyRate;
      delete formattedData.overtimeGraceMins;
    } else {
      // Clean up override values
      if (formattedData.salary)
        formattedData.salary = Number(formattedData.salary);
      if (formattedData.overtimeGraceMins)
        formattedData.overtimeGraceMins = Number(
          formattedData.overtimeGraceMins
        );
      if (formattedData.overtimeHourlyRate)
        formattedData.overtimeHourlyRate = Number(
          formattedData.overtimeHourlyRate
        );
    }

    await onSubmit(formattedData);
    reset();
    setOverrideWorkConfig(false);
    setSelectedDeptDetails(null);
  };

  const handleClose = () => {
    reset();
    setOverrideWorkConfig(false);
    setSelectedDeptDetails(null);
    onClose();
  };

  // Check if no departments exist
  const hasNoDepartments = !isLoadingDepartments && departments.length === 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Staff"
      size="lg"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
        {/* Basic Information Section */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-3 pb-2 border-b border-slate-100">
            Basic Information
          </h3>
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                {...register("name", {
                  required: "Full name is required",
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
                placeholder="e.g., John Doe"
              />
              {errors.name && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className={`
                  w-full px-4 py-2.5 rounded-lg border bg-white transition-all
                  ${
                    errors.email
                      ? "border-red-300 focus:border-red-400"
                      : "border-slate-200 focus:border-slate-300"
                  }
                  focus:outline-none focus:ring-2 focus:ring-slate-100 text-sm
                `}
                placeholder="john@company.com"
              />
              {errors.email && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone & Branch Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  {...register("phone")}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100 text-sm"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Branch
                </label>
                <input
                  type="text"
                  {...register("branch")}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100 text-sm"
                  placeholder="e.g., Mumbai, Delhi"
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Department <span className="text-red-400">*</span>
              </label>
              <select
                {...register("departmentId", {
                  required: "Please select a department",
                  valueAsNumber: true,
                })}
                className={`
                  w-full px-4 py-2.5 rounded-lg border bg-white transition-all appearance-none
                  ${
                    errors.departmentId
                      ? "border-red-300 focus:border-red-400"
                      : "border-slate-200 focus:border-slate-300"
                  }
                  focus:outline-none focus:ring-2 focus:ring-slate-100 text-sm cursor-pointer
                `}
                disabled={isLoadingDepartments || hasNoDepartments}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                  backgroundPosition: "right 1rem center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "1.25rem",
                }}
              >
                <option value="">Select department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              {errors.departmentId && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.departmentId.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Password <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className={`
                  w-full px-4 py-2.5 rounded-lg border bg-white transition-all
                  ${
                    errors.password
                      ? "border-red-300 focus:border-red-400"
                      : "border-slate-200 focus:border-slate-300"
                  }
                  focus:outline-none focus:ring-2 focus:ring-slate-100 text-sm
                `}
                placeholder="Minimum 6 characters"
              />
              {errors.password && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Joined Date */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Joined Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                {...register("joinedOn", {
                  required: "Joined date is required",
                  valueAsDate: true,
                })}
                className={`
                  w-full px-4 py-2.5 rounded-lg border bg-white transition-all
                  ${
                    errors.joinedOn
                      ? "border-red-300 focus:border-red-400"
                      : "border-slate-200 focus:border-slate-300"
                  }
                  focus:outline-none focus:ring-2 focus:ring-slate-100 text-sm
                `}
              />
              {errors.joinedOn && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.joinedOn.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* No Department Warning */}
        {hasNoDepartments && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg
                className="h-5 w-5 text-amber-500 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-amber-800">
                  No Departments Available
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  Please create a department first before adding staff members.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Department Defaults (Read-only) */}
        {selectedDeptDetails && !overrideWorkConfig && (
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Department Defaults (will be applied)
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Shift:</span>
                <span className="text-slate-700 font-medium">
                  {selectedDeptDetails.shiftStart} -{" "}
                  {selectedDeptDetails.shiftEnd}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Default Salary:</span>
                <span className="text-slate-700 font-medium">
                  ₹{selectedDeptDetails.defaultSalary.toLocaleString()}
                </span>
              </div>
              {selectedDeptDetails.overtimeEnabled && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Overtime:</span>
                  <span className="text-slate-700 font-medium">
                    Enabled (₹
                    {selectedDeptDetails.overtimeHourlyRate?.toLocaleString()}
                    /hr after {selectedDeptDetails.overtimeGraceMins} mins)
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Override Toggle */}
        {selectedDeptDetails && (
          <div className="flex items-center justify-between pt-2">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Override Work Configuration
              </label>
              <p className="text-xs text-slate-400 mt-0.5">
                Enable to set custom shift, salary, and overtime for this staff
              </p>
            </div>
            <button
              type="button"
              onClick={handleOverrideToggle}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full 
                transition-colors duration-200 focus:outline-none focus:ring-2 
                focus:ring-slate-200 focus:ring-offset-2
                ${overrideWorkConfig ? "bg-slate-900" : "bg-slate-200"}
              `}
            >
              <span
                className={`
                  inline-block h-5 w-5 transform rounded-full bg-white 
                  shadow-sm transition-transform duration-200
                  ${overrideWorkConfig ? "translate-x-6" : "translate-x-0.5"}
                `}
              />
            </button>
          </div>
        )}

        {/* Work Configuration Section - Only shows when override is enabled */}
        {overrideWorkConfig && selectedDeptDetails && (
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3 pb-2 border-b border-slate-100">
              Override Work Configuration
            </h3>
            <div className="space-y-4">
              {/* Shift Times */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Shift Start
                  </label>
                  <input
                    type="time"
                    {...register("shiftStart")}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100 text-sm"
                    placeholder="Override shift start"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Shift End
                  </label>
                  <input
                    type="time"
                    {...register("shiftEnd")}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100 text-sm"
                    placeholder="Override shift end"
                  />
                </div>
              </div>

              {/* Salary */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Salary (₹/month)
                </label>
                <input
                  type="number"
                  step="1000"
                  {...register("salary", {
                    min: { value: 0, message: "Salary must be positive" },
                    valueAsNumber: true,
                  })}
                  className={`
                    w-full px-4 py-2.5 rounded-lg border bg-white transition-all
                    ${
                      errors.salary
                        ? "border-red-300 focus:border-red-400"
                        : "border-slate-200 focus:border-slate-300"
                    }
                    focus:outline-none focus:ring-2 focus:ring-slate-100 text-sm
                  `}
                  placeholder="Override salary"
                />
                {errors.salary && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.salary.message}
                  </p>
                )}
              </div>

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
                          min: {
                            value: 1,
                            message: "Rate must be at least ₹1",
                          },
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
            </div>
          </div>
        )}

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
            disabled={isSubmitting || hasNoDepartments || !selectedDepartmentId}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Creating..." : "Create Staff"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
