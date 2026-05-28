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
      if (isValid) setStep(2);
    } else if (step === 2) {
      if (branches.length === 0) {
        toast.error("Please add at least one operational branch location");
        return;
      }
      setStep(3);
    }
  };

  const onBack = () => {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
  };

  const onSubmit = async (data: RegisterFormData) => {
    if (step === 3) {
      if (data.password !== data.confirmPassword) {
        toast.error("Security credentials do not match");
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
        toast.success(
          response.message || "Corporate account registered successfully!"
        );

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

  const selectDropdownStyles = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E")`,
    backgroundPosition: "right 12px center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "14px",
  };

  return (
    <div className="min-h-screen bg-white flex antialiased">
      {/* Left Branding Panel Column Matrix */}
      <div className="hidden lg:flex lg:w-[35%] relative bg-[#0F0F11] items-center p-12 overflow-hidden border-r border-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(#1e1e24_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />

        <div className="relative z-10 w-full space-y-12">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white rounded-xs transform rotate-45 flex items-center justify-center shrink-0">
                <div className="w-1.5 h-1.5 bg-[#0F0F11] rounded-xs" />
              </div>
              <span className="text-sm font-bold text-white tracking-tight">
                Pulse
              </span>
            </div>
            <p className="text-[10px] font-mono font-medium text-slate-500 uppercase tracking-wider">
              Deployment Configuration
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight text-white leading-snug">
              Setup your multi-branch infrastructure node.
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Provision decentralized company clusters, lock internal geofencing
              boundaries, and initialize master administrative credentials
              securely.
            </p>
          </div>

          <div className="text-[10px] font-mono text-slate-500 space-y-1">
            <p>Step 01: Structural Context Data</p>
            <p>Step 02: Geographic Node Mapping</p>
            <p>Step 03: Root Identity Access Layer</p>
          </div>
        </div>
      </div>

      {/* Right Core Form Area Panel Component */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 bg-slate-50/30 overflow-y-auto">
        <div className="w-full max-w-[540px] space-y-8 py-8">
          {/* Section Dynamic Heading */}
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase block">
              Step 0{step} — System Wizard
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {step === 1 && "Company Parameters"}
              {step === 2 && "Geographic Branches"}
              {step === 3 && "Root Root Access Profile"}
            </h1>
          </div>

          {/* Chronological Navigation Bar */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div
                className={`flex-1 h-1 transition-all duration-300 ${
                  step >= 1 ? "bg-slate-900" : "bg-slate-200"
                }`}
              />
              <div
                className={`flex-1 h-1 transition-all duration-300 ${
                  step >= 2 ? "bg-slate-900" : "bg-slate-200"
                }`}
              />
              <div
                className={`flex-1 h-1 transition-all duration-300 ${
                  step >= 3 ? "bg-slate-900" : "bg-slate-200"
                }`}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Step 1 Implementation Node */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-700 tracking-tight block uppercase">
                    Registered Company Corporate Name
                  </label>
                  <div
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-md border bg-white transition-all duration-150 ${
                      errors.companyName
                        ? "border-rose-300"
                        : "border-slate-200 focus-within:border-slate-900"
                    }`}
                  >
                    <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <input
                      placeholder="Acme Industrial Corp."
                      disabled={loading}
                      className="flex-1 bg-transparent text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
                      {...register("companyName", {
                        required: "Company name required parameter",
                      })}
                    />
                  </div>
                  {errors.companyName && (
                    <p className="text-[11px] font-medium text-rose-600 pl-0.5">
                      {errors.companyName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-700 tracking-tight block uppercase">
                    Industry Sector Domain
                  </label>
                  <div
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-md border bg-white transition-all duration-150 ${
                      errors.industry
                        ? "border-rose-300"
                        : "border-slate-200 focus-within:border-slate-900"
                    }`}
                  >
                    <Briefcase className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <select
                      disabled={loading}
                      style={selectDropdownStyles}
                      className="flex-1 bg-transparent text-xs font-medium text-slate-900 focus:outline-none appearance-none cursor-pointer pr-6"
                      {...register("industry", {
                        required: "Sector configuration required",
                      })}
                    >
                      <option value="">Choose industry domain...</option>
                      {industries.map((ind) => (
                        <option key={ind.value} value={ind.value}>
                          {ind.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.industry && (
                    <p className="text-[11px] font-medium text-rose-600 pl-0.5">
                      {errors.industry.message}
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onNext}
                    disabled={
                      !watchedCompanyName || !watchedIndustry || loading
                    }
                    className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold text-white bg-[#0F0F11] hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                  >
                    <span>Continue Initialization</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 Implementation Node */}
            {step === 2 && (
              <div className="space-y-4">
                <BranchForm
                  branches={branches}
                  onBranchesChange={setBranches}
                />

                <div className="pt-2 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={onBack}
                    disabled={loading}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all duration-200"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Previous Layer</span>
                  </button>
                  <button
                    type="button"
                    onClick={onNext}
                    disabled={branches.length === 0 || loading}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold text-white bg-[#0F0F11] hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                  >
                    <span>Proceed Config</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 Implementation Node */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-700 tracking-tight block uppercase">
                      Admin Full Name
                    </label>
                    <div
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-md border bg-white transition-all duration-150 ${
                        errors.adminName
                          ? "border-rose-300"
                          : "border-slate-200 focus-within:border-slate-900"
                      }`}
                    >
                      <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <input
                        placeholder="John Doe"
                        disabled={loading}
                        className="flex-1 bg-transparent text-xs font-medium text-slate-900 focus:outline-none"
                        {...register("adminName", {
                          required: "Name token required",
                        })}
                      />
                    </div>
                    {errors.adminName && (
                      <p className="text-[11px] font-medium text-rose-600 pl-0.5">
                        {errors.adminName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-700 tracking-tight block uppercase">
                      Contact Phone
                    </label>
                    <div
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-md border bg-white transition-all duration-150 ${
                        errors.phone
                          ? "border-rose-300"
                          : "border-slate-200 focus-within:border-slate-900"
                      }`}
                    >
                      <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <input
                        type="tel"
                        placeholder="+91 9876543210"
                        disabled={loading}
                        className="flex-1 bg-transparent text-xs font-medium text-slate-900 focus:outline-none"
                        {...register("phone", {
                          required: "Phone number required",
                        })}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-[11px] font-medium text-rose-600 pl-0.5">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-700 tracking-tight block uppercase">
                    Primary System Email Address
                  </label>
                  <div
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-md border bg-white transition-all duration-150 ${
                      errors.email
                        ? "border-rose-300"
                        : "border-slate-200 focus-within:border-slate-900"
                    }`}
                  >
                    <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <input
                      type="email"
                      placeholder="admin@company.com"
                      disabled={loading}
                      className="flex-1 bg-transparent text-xs font-medium text-slate-900 focus:outline-none"
                      {...register("email", {
                        required: "Email path validation parameter required",
                      })}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[11px] font-medium text-rose-600 pl-0.5">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-700 tracking-tight block uppercase">
                      Pass Key Token
                    </label>
                    <div
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-md border bg-white transition-all duration-150 ${
                        errors.password
                          ? "border-rose-300"
                          : "border-slate-200 focus-within:border-slate-900"
                      }`}
                    >
                      <Lock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        disabled={loading}
                        className="flex-1 bg-transparent text-xs font-medium text-slate-900 focus:outline-none"
                        {...register("password", {
                          required: "Security key string required",
                          minLength: { value: 6, message: "Min 6 tokens" },
                        })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-400 hover:text-slate-900 transition-colors focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOff className="h-3.5 w-3.5" />
                        ) : (
                          <Eye className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-[11px] font-medium text-rose-600 pl-0.5">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-700 tracking-tight block uppercase">
                      Confirm Pass Key
                    </label>
                    <div
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-md border bg-white transition-all duration-150 ${
                        errors.confirmPassword
                          ? "border-rose-300"
                          : "border-slate-200 focus-within:border-slate-900"
                      }`}
                    >
                      <Lock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        disabled={loading}
                        className="flex-1 bg-transparent text-xs font-medium text-slate-900 focus:outline-none"
                        {...register("confirmPassword", {
                          required: "Matching verification required",
                        })}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="text-slate-400 hover:text-slate-900 transition-colors focus:outline-none"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-3.5 w-3.5" />
                        ) : (
                          <Eye className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-[11px] font-medium text-rose-600 pl-0.5">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={onBack}
                    disabled={loading}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all duration-200"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold text-white bg-[#0F0F11] hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Provisioning...</span>
                      </>
                    ) : (
                      <>
                        <span>Deploy Registry</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Subordinate Account Anchor Link */}
          <div className="text-center pt-2">
            <p className="text-xs font-medium text-slate-400">
              Already have an active corporate account?{" "}
              <Link
                href="/login"
                className="text-slate-900 font-bold hover:underline ml-1"
              >
                Authenticate node
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
