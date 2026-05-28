// components/admin/StaffModal.tsx
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, UserPlus, Info, AlertTriangle, X } from "lucide-react";
import Modal from "../ui/Modal";
import type { CreateStaffInput, Department } from "@/src/types";
import type { Branch } from "@/src/services/branch.service";

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateStaffInput) => Promise<void>;
  isSubmitting: boolean;
  departments: Department[];
  branches: Branch[];
  isLoadingDepartments: boolean;
  isLoadingBranches: boolean;
}

export default function StaffModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  departments,
  branches,
  isLoadingDepartments,
  isLoadingBranches,
}: StaffModalProps) {
  const [selectedDeptDetails, setSelectedDeptDetails] =
    useState<Department | null>(null);
  const [overrideWorkConfig, setOverrideWorkConfig] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      branchId: undefined,
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
  const selectedBranchId = watch("branchId");

  useEffect(() => {
    if (selectedDepartmentId) {
      const dept = departments.find(
        (d) => d.id === Number(selectedDepartmentId)
      );
      setSelectedDeptDetails(dept || null);

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

  useEffect(() => {
    if (selectedBranchId) {
      const branch = branches.find((b) => b.id === Number(selectedBranchId));
      if (branch) {
        setValue("branch", branch.name);
      }
    } else {
      setValue("branch", "");
    }
  }, [selectedBranchId, branches, setValue]);

  const handleToggleOvertime = () =>
    setValue("overtimeEnabled", !overtimeEnabled);

  const handleOverrideToggle = () => {
    setOverrideWorkConfig(!overrideWorkConfig);
    if (!overrideWorkConfig) {
      setValue("shiftStart", "");
      setValue("shiftEnd", "");
      setValue("salary", undefined);
      setValue("overtimeEnabled", false);
      setValue("overtimeHourlyRate", undefined);
      setValue("overtimeGraceMins", undefined);
    }
  };

  const onFormSubmit = async (data: CreateStaffInput) => {
    const formattedData: CreateStaffInput = {
      ...data,
      joinedOn: data.joinedOn || new Date(),
      departmentId: Number(data.departmentId),
      branchId: data.branchId ? Number(data.branchId) : undefined,
    };

    if (!overrideWorkConfig) {
      delete formattedData.shiftStart;
      delete formattedData.shiftEnd;
      delete formattedData.salary;
      delete formattedData.overtimeEnabled;
      delete formattedData.overtimeHourlyRate;
      delete formattedData.overtimeGraceMins;
    } else {
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
    setShowPassword(false);
  };

  const handleClose = () => {
    reset();
    setOverrideWorkConfig(false);
    setSelectedDeptDetails(null);
    setShowPassword(false);
    onClose();
  };

  const hasNoDepartments = !isLoadingDepartments && departments.length === 0;

  const selectDropdownStyles = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E")`,
    backgroundPosition: "right 14px center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "16px",
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Staff"
      size="lg"
    >
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="space-y-6 antialiased"
      >
        {/* Core Fieldsets Block */}
        <div className="space-y-4">
          <h4 className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider block mb-2">
            Personal Registry Details
          </h4>

          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 tracking-tight block">
              Full Name <span className="text-slate-400">*</span>
            </label>
            <input
              type="text"
              {...register("name", {
                required: "Name field required",
                minLength: { value: 2, message: "Too short" },
              })}
              className={`w-full px-3.5 py-2 rounded-md border text-sm font-medium transition-all bg-white placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-0 ${
                errors.name
                  ? "border-rose-300 bg-rose-50/10 text-rose-900"
                  : "border-slate-200 text-slate-900"
              }`}
              placeholder="E.g. Ashish Nath"
            />
            {errors.name && (
              <p className="text-[11px] text-rose-500 font-medium">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 tracking-tight block">
              Email Address <span className="text-slate-400">*</span>
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email field required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid formatting",
                },
              })}
              className={`w-full px-3.5 py-2 rounded-md border text-sm font-medium transition-all bg-white placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-0 ${
                errors.email
                  ? "border-rose-300 bg-rose-50/10 text-rose-900"
                  : "border-slate-200 text-slate-900"
              }`}
              placeholder="example@domain.com"
            />
            {errors.email && (
              <p className="text-[11px] text-rose-500 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone Number & Branch Alignment Grid Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 tracking-tight block">
                Phone Number
              </label>
              <input
                type="tel"
                {...register("phone")}
                className="w-full px-3.5 py-2 rounded-md border border-slate-200 text-sm font-medium transition-all bg-white placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-0 text-slate-900"
                placeholder="+91 00000 00000"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 tracking-tight block">
                Office Assignment Branch
              </label>
              <select
                {...register("branchId", { valueAsNumber: true })}
                className="w-full px-3.5 py-2 rounded-md border border-slate-200 text-sm font-medium transition-all bg-white focus:outline-none focus:border-slate-900 focus:ring-0 appearance-none text-slate-900 cursor-pointer disabled:bg-slate-50"
                disabled={isLoadingBranches}
                style={selectDropdownStyles}
              >
                <option value="">Optional placement allocation</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Department Selection Input Block */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 tracking-tight block">
              Core Operational Department{" "}
              <span className="text-slate-400">*</span>
            </label>
            <select
              {...register("departmentId", {
                required: "Department choice mandated",
                valueAsNumber: true,
              })}
              className={`w-full px-3.5 py-2 rounded-md border text-sm font-medium transition-all bg-white focus:outline-none focus:border-slate-900 focus:ring-0 appearance-none cursor-pointer disabled:bg-slate-50 ${
                errors.departmentId
                  ? "border-rose-300 text-rose-900"
                  : "border-slate-200 text-slate-900"
              }`}
              disabled={isLoadingDepartments || hasNoDepartments}
              style={selectDropdownStyles}
            >
              <option value="">Assign functional unit node...</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            {errors.departmentId && (
              <p className="text-[11px] text-rose-500 font-medium">
                {errors.departmentId.message}
              </p>
            )}
          </div>

          {/* Password Entry Segment with Inline Eye Icon */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 tracking-tight block">
              System Access Password <span className="text-slate-400">*</span>
            </label>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "System credentials missing",
                  minLength: { value: 6, message: "Min 6 characters required" },
                })}
                className={`w-full pl-3.5 pr-10 py-2 rounded-md border text-sm font-medium transition-all bg-white placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-0 ${
                  errors.password
                    ? "border-rose-300 bg-rose-50/10 text-rose-900"
                    : "border-slate-200 text-slate-900"
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] text-rose-500 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Joined Initialization Calendar Date Selector */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 tracking-tight block">
              Official Engagement Date <span className="text-slate-400">*</span>
            </label>
            <input
              type="date"
              {...register("joinedOn", {
                required: "Date missing",
                valueAsDate: true,
              })}
              className={`w-full px-3.5 py-2 rounded-md border text-sm font-medium transition-all bg-white focus:outline-none focus:border-slate-900 focus:ring-0 ${
                errors.joinedOn
                  ? "border-rose-300 text-rose-900"
                  : "border-slate-200 text-slate-900"
              }`}
            />
            {errors.joinedOn && (
              <p className="text-[11px] text-rose-500 font-medium">
                {errors.joinedOn.message}
              </p>
            )}
          </div>
        </div>

        {/* Missing Organizational Core Unit Fallbacks Banner */}
        {hasNoDepartments && (
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
            <div className="space-y-0.5">
              <h5 className="text-xs font-bold text-amber-900">
                Department Prerequisites Triggered
              </h5>
              <p className="text-[11px] font-medium text-amber-700 leading-normal">
                Before user access configurations map successfully, structured
                operational department profiles must exist inside settings.
              </p>
            </div>
          </div>
        )}

        {/* Read-Only Core Allocation Defaults Matrix info summary */}
        {selectedDeptDetails && !overrideWorkConfig && (
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 space-y-3">
            <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs tracking-tight">
              <Info className="h-3.5 w-3.5 text-slate-400" />
              <span>Department System Defaults Will Apply</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 text-[11px] font-medium text-slate-500">
              <div>
                <span className="block text-slate-400 uppercase font-mono text-[9px] tracking-wider">
                  Shift Matrix
                </span>
                <span className="text-slate-800 font-semibold text-xs">
                  {selectedDeptDetails.shiftStart} -{" "}
                  {selectedDeptDetails.shiftEnd}
                </span>
              </div>
              <div>
                <span className="block text-slate-400 uppercase font-mono text-[9px] tracking-wider">
                  Core Payroll Base
                </span>
                <span className="text-slate-800 font-semibold text-xs">
                  ₹{selectedDeptDetails.defaultSalary?.toLocaleString()}
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="block text-slate-400 uppercase font-mono text-[9px] tracking-wider">
                  Overtime Profile
                </span>
                <span className="text-slate-800 font-semibold text-xs">
                  {selectedDeptDetails.overtimeEnabled
                    ? `₹${selectedDeptDetails.overtimeHourlyRate}/hr`
                    : "Deactivated"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Configuration Override Engine Selectors */}
        {selectedDeptDetails && (
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/30">
            <div className="space-y-0.5">
              <label className="text-xs font-bold text-slate-900 tracking-tight block">
                Override Corporate Architecture
              </label>
              <p className="text-[11px] font-medium text-slate-400 max-w-sm leading-normal">
                Enable this option to adjust distinct custom parameters for
                salaries or standard time blocks.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOverrideToggle}
              className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 ${
                overrideWorkConfig ? "bg-slate-900" : "bg-slate-200"
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition-transform duration-200 ${
                  overrideWorkConfig ? "translate-x-4.5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        )}

        {/* Work Configuration Section Drawer Layout */}
        {overrideWorkConfig && selectedDeptDetails && (
          <div className="p-4 rounded-xl border border-slate-200/80 bg-white space-y-4 animate-in slide-in-from-top-2 duration-200">
            <h4 className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider block">
              Granular Override Parameters
            </h4>

            {/* Custom Scheduling Shifts Inputs row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 tracking-tight block">
                  Shift Bounds Start
                </label>
                <input
                  type="time"
                  {...register("shiftStart")}
                  className="w-full px-3.5 py-2 rounded-md border border-slate-200 text-sm font-medium transition-all bg-white text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-0"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 tracking-tight block">
                  Shift Bounds End
                </label>
                <input
                  type="time"
                  {...register("shiftEnd")}
                  className="w-full px-3.5 py-2 rounded-md border border-slate-200 text-sm font-medium transition-all bg-white text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-0"
                />
              </div>
            </div>

            {/* Salary Metric Configuration Input Overrides */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 tracking-tight block">
                Monthly Payroll Matrix (₹)
              </label>
              <input
                type="number"
                step="1000"
                {...register("salary", {
                  min: { value: 0, message: "Value cannot be negative" },
                  valueAsNumber: true,
                })}
                className={`w-full px-3.5 py-2 rounded-md border text-sm font-medium transition-all bg-white text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-0 ${
                  errors.salary ? "border-rose-300" : "border-slate-200"
                }`}
                placeholder="Enter custom absolute salary metrics"
              />
              {errors.salary && (
                <p className="text-[11px] text-rose-500 font-medium">
                  {errors.salary.message}
                </p>
              )}
            </div>

            {/* Active Overtime Functional Matrix Parameters Segment */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-xs font-semibold text-slate-900 tracking-tight block">
                    Custom Overtime Tracking
                  </label>
                  <p className="text-[11px] font-medium text-slate-400">
                    Calculate alternate hourly additions
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleToggleOvertime}
                  className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 ${
                    overtimeEnabled ? "bg-slate-900" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-xs transition-transform duration-200 ${
                      overtimeEnabled ? "translate-x-4.5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              {overtimeEnabled && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 animate-in slide-in-from-top-1 duration-200">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 tracking-tight block">
                      Grace Margin Window (Minutes)
                    </label>
                    <input
                      type="number"
                      {...register("overtimeGraceMins", {
                        required: overtimeEnabled ? "Field required" : false,
                        min: { value: 0, message: "Invalid lower boundaries" },
                        valueAsNumber: true,
                      })}
                      className={`w-full px-3.5 py-2 rounded-md border text-sm font-medium transition-all bg-white text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-0 ${
                        errors.overtimeGraceMins
                          ? "border-rose-300"
                          : "border-slate-200"
                      }`}
                      placeholder="E.g. 15"
                    />
                    {errors.overtimeGraceMins && (
                      <p className="text-[11px] text-rose-500 font-medium">
                        {errors.overtimeGraceMins.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 tracking-tight block">
                      Hourly Overtime Valuation Rate (₹)
                    </label>
                    <input
                      type="number"
                      step="10"
                      {...register("overtimeHourlyRate", {
                        required: overtimeEnabled
                          ? "Rate assignment required"
                          : false,
                        min: {
                          value: 1,
                          message: "Minimum baseline ₹1 boundary rule met",
                        },
                        valueAsNumber: true,
                      })}
                      className={`w-full px-3.5 py-2 rounded-md border text-sm font-medium transition-all bg-white text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-0 ${
                        errors.overtimeHourlyRate
                          ? "border-rose-300"
                          : "border-slate-200"
                      }`}
                      placeholder="E.g. 350"
                    />
                    {errors.overtimeHourlyRate && (
                      <p className="text-[11px] text-rose-500 font-medium">
                        {errors.overtimeHourlyRate.message}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Global Modal CTA Controls Row Layout footer */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2 rounded-md text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || hasNoDepartments || !selectedDepartmentId}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-xs font-medium text-white bg-[#0F0F11] hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-slate-300 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus className="h-3.5 w-3.5" />
                <span>Create Staff Profile</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
