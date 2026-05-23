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
} from "lucide-react";
import Link from "next/link";
import { registerCompany } from "@/src/services/register.service";
import { getErrorMessage } from "@/src/utils/axios";
import { RegisterCompanyPayload } from "@/src/types";

interface RegisterFormData extends RegisterCompanyPayload {
  confirmPassword: string;
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
    }
  };

  const onBack = () => {
    setStep(1);
  };

  const onSubmit = async (data: RegisterFormData) => {
    if (step === 2) {
      if (data.password !== data.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      try {
        setLoading(true);
        const { confirmPassword, ...payload } = data;
        const response = await registerCompany(payload);
        toast.success(response.message || "Company registered successfully!");

        setTimeout(() => {
          window.location.href = "/login";
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
      {/* Left Side - Organic Handmade Design */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-50 via-white to-slate-50/50 items-center justify-center p-12 overflow-hidden">
        {/* Organic blob shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-50 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-slate-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

        {/* Hand-drawn style circles */}
        <svg
          className="absolute top-12 right-12 w-24 h-24 opacity-20"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4 6"
            className="text-slate-400"
          />
        </svg>
        <svg
          className="absolute bottom-16 left-16 w-32 h-32 opacity-15"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-slate-500"
          />
        </svg>

        {/* Content */}
        <div className="relative z-10 max-w-md text-center">
          {/* Hand-drawn squiggle */}
          <svg
            className="w-32 h-8 mx-auto mb-6 opacity-60"
            viewBox="0 0 120 20"
          >
            <path
              d="M5,10 Q20,5 35,10 T65,10 T95,10 T115,10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="text-emerald-400"
            />
          </svg>

          {/* Company name with organic typography */}
          <div className="space-y-2">
            <h1 className="text-6xl font-light tracking-tighter text-slate-800">
              Pulse
            </h1>
            <div className="flex items-center justify-center gap-2">
              <span className="text-[11px] font-mono text-slate-300 uppercase tracking-wider">
                join the community
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span className="text-[11px] font-mono text-slate-300 uppercase tracking-wider">
                free trial
              </span>
            </div>
          </div>

          {/* Hand-drawn divider */}
          <div className="my-6 flex items-center justify-center gap-2">
            <div className="w-8 h-px bg-slate-200"></div>
            <span className="text-[10px] font-mono text-slate-300">✦</span>
            <div className="w-8 h-px bg-slate-200"></div>
          </div>

          {/* Quote / Tagline */}
          <div className="space-y-3">
            <p className="text-sm text-slate-500 leading-relaxed font-normal">
              start your journey with
              <br />
              seamless attendance management
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-mono text-emerald-500">●</span>
              <span className="text-[10px] font-mono text-slate-400">
                get started in minutes
              </span>
            </div>
          </div>

          {/* Benefits list */}
          <div className="mt-8 space-y-2 text-left">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="text-emerald-400">→</span>
              <span>no credit card required</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="text-emerald-400">→</span>
              <span>30-day free trial</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="text-emerald-400">→</span>
              <span>cancel anytime</span>
            </div>
          </div>

          {/* Hand-drawn signature line */}
          <div className="mt-8 pt-4 border-t border-slate-100">
            <p className="text-[10px] font-mono text-slate-300 tracking-wider">
              trusted by 500+ teams
            </p>
          </div>
        </div>

        {/* Decorative dots pattern */}
        <div className="absolute bottom-8 left-8 flex gap-1 opacity-30">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1 h-1 rounded-full bg-slate-400"
              style={{ opacity: 1 - i * 0.15 }}
            />
          ))}
        </div>
        <div className="absolute top-8 right-8 flex gap-1 opacity-30">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-0.5 h-0.5 rounded-full bg-slate-400" />
          ))}
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8">
            <p className="text-xs text-slate-400 tracking-[0.2em] uppercase mb-3 font-medium">
              02 — Register Company
            </p>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-[1.2] mb-2">
              Create an
              <br />
              account.
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
                  step === 1 ? "bg-slate-900" : "bg-slate-200"
                }`}
              ></div>
              <div
                className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                  step === 2 ? "bg-slate-900" : "bg-slate-200"
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
                Admin Account
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Step 1: Company Information */}
            {step === 1 && (
              <>
                {/* Company Name */}
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

                {/* Industry */}
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

                {/* Next Button */}
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

            {/* Step 2: Admin Information */}
            {step === 2 && (
              <>
                {/* Admin Name */}
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

                {/* Email */}
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

                {/* Phone */}
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

                {/* Password */}
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

                {/* Confirm Password */}
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

                {/* Buttons */}
                <div className="pt-4 space-y-3">
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
