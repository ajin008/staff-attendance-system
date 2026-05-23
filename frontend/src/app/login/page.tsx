"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/src/context/AuthContext";
import { loginUser } from "@/src/services/auth.service";
import { getErrorMessage } from "@/src/utils/axios";

interface LoginForm {
  identifier: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login, user, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  useEffect(() => {
    if (!isLoading && user && !isRedirecting) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsRedirecting(true);
      const targetPath = user.role === "admin" ? "/admin" : "/staff";
      window.location.href = targetPath;
    }
  }, [user, isLoading, isRedirecting]);

  const onSubmit = async (data: LoginForm) => {
    if (isRedirecting) return;

    try {
      const res = await loginUser(data);
      login(res.user);
      toast.success(`Welcome back, ${res.user.name}!`);
      setIsRedirecting(true);
      setTimeout(() => {
        const targetPath = res.user.role === "admin" ? "/admin" : "/staff";
        window.location.href = targetPath;
      }, 50);
    } catch (err) {
      toast.error(getErrorMessage(err));
      setIsRedirecting(false);
    }
  };

  if (isLoading || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
        {isRedirecting && (
          <p className="ml-2 text-sm text-slate-400">Redirecting...</p>
        )}
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
        <p className="ml-2 text-sm text-slate-400">Already logged in...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Organic Handmade Design */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-linear-to-br from-slate-50 via-white to-slate-50/50 items-center justify-center p-12 overflow-hidden">
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
                since 2026
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span className="text-[11px] font-mono text-slate-300 uppercase tracking-wider">
                v1.0
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
              attendance & workforce management
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-mono text-emerald-500">●</span>
              <span className="text-[10px] font-mono text-slate-400">
                operational
              </span>
            </div>
          </div>

          {/* Hand-drawn features list */}
          <div className="mt-8 space-y-2 text-left">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="text-emerald-400">→</span>
              <span>real-time attendance tracking</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="text-emerald-400">→</span>
              <span>automated payroll processing</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="text-emerald-400">→</span>
              <span>department & staff management</span>
            </div>
          </div>

          {/* Hand-drawn signature line */}
          <div className="mt-8 pt-4 border-t border-slate-100">
            <p className="text-[10px] font-mono text-slate-300 tracking-wider">
              trusted by teams · everywhere
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

      {/* Right Side - Login Form (unchanged) */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8 text-center">
            <h2 className="text-xl font-semibold text-slate-900">
              Welcome Back
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Sign in to your account
            </p>
          </div>

          <div className="mb-8 lg:mb-10">
            <p className="text-xs text-slate-400 tracking-[0.2em] uppercase mb-3 font-medium">
              01 — Sign In
            </p>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-[1.2] mb-2">
              Welcome
              <br />
              back.
            </h1>
            <p className="text-sm text-slate-400 mt-3 font-normal">
              Staff · Staff ID &nbsp;✦&nbsp; Admin · Email
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.15em]">
                Identifier
              </label>
              <div
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border
                bg-white transition-all duration-150
                ${
                  errors.identifier
                    ? "border-red-300 bg-red-50/50"
                    : "border-slate-200 focus-within:border-slate-900 focus-within:shadow-sm"
                }`}
              >
                <svg
                  className="h-4 w-4 text-slate-300 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <input
                  placeholder="ST-A3K9M or admin@company.com"
                  disabled={isSubmitting || isRedirecting}
                  autoComplete="username"
                  className="flex-1 bg-transparent text-sm text-slate-900
                    placeholder:text-slate-300 focus:outline-none font-normal"
                  {...register("identifier", {
                    required: "Required",
                  })}
                />
              </div>
              {errors.identifier && (
                <p className="text-xs text-red-400 pl-1 font-normal">
                  {errors.identifier.message}
                </p>
              )}
            </div>

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
                <svg
                  className="h-4 w-4 text-slate-300 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  disabled={isSubmitting || isRedirecting}
                  autoComplete="current-password"
                  className="flex-1 bg-transparent text-sm text-slate-900
                    placeholder:text-slate-300 focus:outline-none font-normal"
                  {...register("password", {
                    required: "Required",
                    minLength: { value: 6, message: "Min 6 characters" },
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

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting || isRedirecting}
                className="w-full py-3.5 rounded-xl text-sm font-semibold
                           bg-slate-900 hover:bg-slate-800 text-white
                           shadow-lg shadow-slate-200
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-200
                           flex items-center justify-center gap-2"
              >
                {isSubmitting || isRedirecting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isRedirecting ? "Redirecting..." : "Signing in..."}
                  </>
                ) : (
                  <>
                    Continue
                    <span className="text-slate-400 group-hover:text-slate-300 transition-colors">
                      →
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-slate-400 font-medium">
                New here?
              </span>
            </div>
          </div>

          <Link href="/register" className="block">
            <button
              type="button"
              className="w-full py-3.5 rounded-xl text-sm font-semibold
                         border-2 border-slate-200 bg-white text-slate-700
                         hover:border-slate-300 hover:bg-slate-50
                         transition-all duration-200
                         flex items-center justify-center gap-2"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              Register Company
            </button>
          </Link>

          <p className="text-xs text-slate-300 mt-8 text-center font-normal">
            Credentials are provided by your administrator
          </p>
        </div>
      </div>
    </div>
  );
}
