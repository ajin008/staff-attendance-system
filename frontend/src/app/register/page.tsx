// app/register/page.tsx
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Building2,
  Briefcase,
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { registerCompany } from "@/src/services/register.service";
import { getErrorMessage } from "@/src/utils/axios";
import { RegisterCompanyPayload, Branch } from "@/src/types";
import { BranchForm } from "@/components/register/BranchForm";

interface RegisterFormData extends Omit<RegisterCompanyPayload, "branches"> {
  confirmPassword: string;
  branches: Branch[];
}

const industries = [
  { value: "retail", label: "Retail" },
  { value: "technology", label: "Technology" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "finance", label: "Finance & Banking" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "hospitality", label: "Hospitality" },
  { value: "logistics", label: "Logistics & Supply Chain" },
  { value: "real-estate", label: "Real Estate" },
  { value: "consulting", label: "Consulting" },
  { value: "other", label: "Other" },
];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
    watch,
    setValue,
  } = useForm<RegisterFormData>({
    defaultValues: {
      companyName: "",
      industry: "",
      adminName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      branches: [],
    },
  });

  const watchedCompanyName = watch("companyName");
  const watchedIndustry = watch("industry");

  const onNext = async () => {
    if (step === 1) {
      const isValid = await trigger(["companyName", "industry"]);
      if (isValid) {
        setStep(2);
      }
    } else if (step === 2) {
      if (branches.length === 0) {
        toast.error("Please add at least one branch");
        return;
      }
      setStep(3);
    }
  };

  const onBack = () => {
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    if (step === 3) {
      if (data.password !== data.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      if (branches.length === 0) {
        toast.error("Please add at least one branch");
        return;
      }

      try {
        setLoading(true);
        const { confirmPassword, ...payload } = data;
        const response = await registerCompany({
          ...payload,
          branches: branches,
        });
        toast.success(response.message || "Company registered successfully!");

        setTimeout(() => {
          window.location.href = "/admin";
        }, 2000);
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Registration Form - Full Width */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <p className="text-xs text-slate-400 tracking-[0.2em] uppercase mb-3 font-medium">
              02 — Register Company
            </p>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-[1.2] mb-2">
              Create an account.
            </h1>
            <p className="text-sm text-slate-400 mt-3 font-normal">
              Get started with your company&apos;s attendance system
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center gap-2">
              <div
                className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                  step >= 1 ? "bg-slate-900" : "bg-slate-200"
                }`}
              ></div>
              <div
                className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                  step >= 2 ? "bg-slate-900" : "bg-slate-200"
                }`}
              ></div>
              <div
                className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                  step >= 3 ? "bg-slate-900" : "bg-slate-200"
                }`}
              ></div>
            </div>
            <div className="flex justify-between mt-2">
              <span
                className={`text-xs font-medium ${
                  step === 1 ? "text-slate-900" : "text-slate-400"
                }`}
              >
                Company Details
              </span>
              <span
                className={`text-xs font-medium ${
                  step === 2 ? "text-slate-900" : "text-slate-400"
                }`}
              >
                Branches
              </span>
              <span
                className={`text-xs font-medium ${
                  step === 3 ? "text-slate-900" : "text-slate-400"
                }`}
              >
                Admin Account
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Step 1: Company Information */}
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.15em]">
                    Company Name
                  </label>
                  <div
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border
                      bg-white transition-all duration-150
                      ${
                        errors.companyName
                          ? "border-red-300 bg-red-50/50"
                          : "border-slate-200 focus-within:border-slate-900 focus-within:shadow-sm"
                      }`}
                  >
                    <Building2 className="h-4 w-4 text-slate-300 shrink-0" />
                    <input
                      placeholder="Acme Inc."
                      disabled={loading}
                      className="flex-1 bg-transparent text-sm text-slate-900
                        placeholder:text-slate-300 focus:outline-none font-normal"
                      {...register("companyName", {
                        required: "Company name is required",
                        minLength: {
                          value: 2,
                          message: "Company name must be at least 2 characters",
                        },
                      })}
                    />
                  </div>
                  {errors.companyName && (
                    <p className="text-xs text-red-400 pl-1 font-normal">
                      {errors.companyName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.15em]">
                    Industry
                  </label>
                  <div
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border
                      bg-white transition-all duration-150
                      ${
                        errors.industry
                          ? "border-red-300 bg-red-50/50"
                          : "border-slate-200 focus-within:border-slate-900 focus-within:shadow-sm"
                      }`}
                  >
                    <Briefcase className="h-4 w-4 text-slate-300 shrink-0" />
                    <select
                      disabled={loading}
                      className="flex-1 bg-transparent text-sm text-slate-900
                        focus:outline-none font-normal"
                      {...register("industry", {
                        required: "Industry is required",
                      })}
                    >
                      <option value="">Select industry</option>
                      {industries.map((ind) => (
                        <option key={ind.value} value={ind.value}>
                          {ind.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.industry && (
                    <p className="text-xs text-red-400 pl-1 font-normal">
                      {errors.industry.message}
                    </p>
                  )}
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={onNext}
                    disabled={
                      !watchedCompanyName || !watchedIndustry || loading
                    }
                    className="w-full py-3.5 rounded-xl text-sm font-semibold
                               bg-slate-900 hover:bg-slate-800 text-white
                               shadow-lg shadow-slate-200
                               disabled:opacity-50 disabled:cursor-not-allowed
                               transition-all duration-200
                               flex items-center justify-center gap-2"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}

            {/* Step 2: Branches - Expanded Layout */}
            {step === 2 && (
              <>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-5 w-5 text-emerald-500" />
                    <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.15em]">
                      Company Branches
                    </label>
                  </div>
                  <BranchForm
                    branches={branches}
                    onBranchesChange={setBranches}
                  />
                </div>

                <div className="pt-6 space-y-3">
                  <button
                    type="button"
                    onClick={onNext}
                    disabled={branches.length === 0 || loading}
                    className="w-full py-3.5 rounded-xl text-sm font-semibold
                               bg-slate-900 hover:bg-slate-800 text-white
                               shadow-lg shadow-slate-200
                               disabled:opacity-50 disabled:cursor-not-allowed
                               transition-all duration-200
                               flex items-center justify-center gap-2"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={onBack}
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl text-sm font-semibold
                               border-2 border-slate-200 bg-white text-slate-700
                               hover:border-slate-300 hover:bg-slate-50
                               transition-all duration-200
                               flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                </div>
              </>
            )}

            {/* Step 3: Admin Information */}
            {step === 3 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.15em]">
                      Admin/Owner Name
                    </label>
                    <div
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border
                        bg-white transition-all duration-150
                        ${
                          errors.adminName
                            ? "border-red-300 bg-red-50/50"
                            : "border-slate-200 focus-within:border-slate-900 focus-within:shadow-sm"
                        }`}
                    >
                      <User className="h-4 w-4 text-slate-300 shrink-0" />
                      <input
                        placeholder="John Doe"
                        disabled={loading}
                        className="flex-1 bg-transparent text-sm text-slate-900
                          placeholder:text-slate-300 focus:outline-none font-normal"
                        {...register("adminName", {
                          required: "Admin name is required",
                          minLength: {
                            value: 2,
                            message: "Name must be at least 2 characters",
                          },
                        })}
                      />
                    </div>
                    {errors.adminName && (
                      <p className="text-xs text-red-400 pl-1 font-normal">
                        {errors.adminName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.15em]">
                      Phone Number
                    </label>
                    <div
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border
                        bg-white transition-all duration-150
                        ${
                          errors.phone
                            ? "border-red-300 bg-red-50/50"
                            : "border-slate-200 focus-within:border-slate-900 focus-within:shadow-sm"
                        }`}
                    >
                      <Phone className="h-4 w-4 text-slate-300 shrink-0" />
                      <input
                        type="tel"
                        placeholder="+1 234 567 8900"
                        disabled={loading}
                        className="flex-1 bg-transparent text-sm text-slate-900
                          placeholder:text-slate-300 focus:outline-none font-normal"
                        {...register("phone", {
                          required: "Phone number is required",
                          pattern: {
                            value:
                              /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,3}[)]?[-\s.]?[0-9]{3,4}[-\s.]?[0-9]{3,4}$/,
                            message: "Invalid phone number",
                          },
                        })}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-xs text-red-400 pl-1 font-normal">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.15em]">
                    Email Address
                  </label>
                  <div
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border
                      bg-white transition-all duration-150
                      ${
                        errors.email
                          ? "border-red-300 bg-red-50/50"
                          : "border-slate-200 focus-within:border-slate-900 focus-within:shadow-sm"
                      }`}
                  >
                    <Mail className="h-4 w-4 text-slate-300 shrink-0" />
                    <input
                      type="email"
                      placeholder="admin@company.com"
                      disabled={loading}
                      className="flex-1 bg-transparent text-sm text-slate-900
                        placeholder:text-slate-300 focus:outline-none font-normal"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-400 pl-1 font-normal">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.15em]">
                      Password
                    </label>
                    <div
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border
                        bg-white transition-all duration-150
                        ${
                          errors.password
                            ? "border-red-300 bg-red-50/50"
                            : "border-slate-200 focus-within:border-slate-900 focus-within:shadow-sm"
                        }`}
                    >
                      <Lock className="h-4 w-4 text-slate-300 shrink-0" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        disabled={loading}
                        className="flex-1 bg-transparent text-sm text-slate-900
                          placeholder:text-slate-300 focus:outline-none font-normal"
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                          },
                        })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-300 hover:text-slate-600 transition-colors shrink-0"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-xs text-red-400 pl-1 font-normal">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.15em]">
                      Confirm Password
                    </label>
                    <div
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border
                        bg-white transition-all duration-150
                        ${
                          errors.confirmPassword
                            ? "border-red-300 bg-red-50/50"
                            : "border-slate-200 focus-within:border-slate-900 focus-within:shadow-sm"
                        }`}
                    >
                      <Lock className="h-4 w-4 text-slate-300 shrink-0" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        disabled={loading}
                        className="flex-1 bg-transparent text-sm text-slate-900
                          placeholder:text-slate-300 focus:outline-none font-normal"
                        {...register("confirmPassword", {
                          required: "Please confirm your password",
                          validate: (value) =>
                            value === getValues("password") ||
                            "Passwords do not match",
                        })}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="text-slate-300 hover:text-slate-600 transition-colors shrink-0"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-xs text-red-400 pl-1 font-normal">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-6 space-y-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl text-sm font-semibold
                               bg-slate-900 hover:bg-slate-800 text-white
                               shadow-lg shadow-slate-200
                               disabled:opacity-50 disabled:cursor-not-allowed
                               transition-all duration-200
                               flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Register Company
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={onBack}
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl text-sm font-semibold
                               border-2 border-slate-200 bg-white text-slate-700
                               hover:border-slate-300 hover:bg-slate-50
                               transition-all duration-200
                               flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                </div>
              </>
            )}
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-slate-900 font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
