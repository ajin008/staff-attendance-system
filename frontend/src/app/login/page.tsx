/* eslint-disable react-hooks/set-state-in-effect */
// app/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Loader2,
  KeyRound,
  User,
  ArrowRight,
  Building2,
} from "lucide-react";
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
      setIsRedirecting(true);

      const targetPath = user.role === "admin" ? "/admin" : "/staff";

      router.replace(targetPath);
    }
  }, [user, isLoading, isRedirecting, router]);

  const onSubmit = async (data: LoginForm) => {
    if (isRedirecting) return;

    try {
      const res = await loginUser(data);
      login(res.user);
      toast.success(`Welcome back, ${res.user.name}!`);
      setIsRedirecting(true);
      setTimeout(() => {
        const targetPath = res.user.role === "admin" ? "/admin" : "/staff";

        router.replace(targetPath);
      }, 50);
    } catch (err) {
      toast.error(getErrorMessage(err));
      setIsRedirecting(false);
    }
  };

  if (isLoading || isRedirecting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50/50 antialiased">
        <Loader2 className="h-5 w-5 animate-spin text-slate-900" />
        {isRedirecting && (
          <p className="mt-2 text-xs font-medium text-slate-400">
            Redirecting to dashboard layout...
          </p>
        )}
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50/50 antialiased">
        <Loader2 className="h-5 w-5 animate-spin text-slate-900" />
        <p className="mt-2 text-xs font-medium text-slate-400">
          Session verified. Already logged in...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex antialiased">
      {/* Left Column Aspect Surface - Dashboard Product Panel Layout */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-[#0F0F11] items-center p-12 overflow-hidden border-r border-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(#1e1e24_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />

        <div className="relative z-10 w-full max-w-sm space-y-12">
          {/* Brand Anchor Title */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white rounded-xs transform rotate-45 flex items-center justify-center shrink-0">
                <div className="w-1.5 h-1.5 bg-[#0F0F11] rounded-xs" />
              </div>
              <span className="text-sm font-bold text-white tracking-tight">
                Pulse
              </span>
            </div>
            <p className="text-[11px] font-mono font-medium text-slate-500 uppercase tracking-wider">
              Workforce Management Registry · v1.0
            </p>
          </div>

          {/* Main Context Callout Box */}
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight text-white leading-snug">
              Intelligent attendance automation built for agile operational
              layouts.
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Decouple infrastructure overhead, track clock-in sequences
              accurately, and generate precise chronological payroll sheets from
              a single unified workspace.
            </p>
          </div>

          {/* Features Inline Matrix */}
          <div className="space-y-2.5 pt-4 border-t border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0" />
              <span>Real-time location & floor map tracking</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0" />
              <span>Automated structural payroll matrix</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0" />
              <span>Department distribution metrics</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column Aspect Surface - Main Operational Login Box */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 bg-slate-50/30">
        <div className="w-full max-w-[340px] space-y-6">
          {/* Descriptive Strategic Heading */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase block">
              Authorization Node
            </span>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Sign In to Pulse
            </h1>
            <p className="text-xs font-medium text-slate-400 leading-relaxed">
              Staff identifiers use designated IDs · Administrators log in using
              email credentials.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Input Node: Identifier Column */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-700 tracking-tight block uppercase">
                Account Identifier
              </label>
              <div
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md border bg-white transition-all duration-150 ${
                  errors.identifier
                    ? "border-rose-300 focus-within:border-rose-400"
                    : "border-slate-200 focus-within:border-slate-900 focus-within:ring-0"
                }`}
              >
                <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="ST-A3K9M or admin@company.com"
                  disabled={isSubmitting || isRedirecting}
                  autoComplete="username"
                  className="flex-1 bg-transparent text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  {...register("identifier", { required: "Required field" })}
                />
              </div>
              {errors.identifier && (
                <p className="text-[11px] font-medium text-rose-600 pl-0.5">
                  {errors.identifier.message}
                </p>
              )}
            </div>

            {/* Input Node: Password Column */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-700 tracking-tight block uppercase">
                Security Password
              </label>
              <div
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md border bg-white transition-all duration-150 ${
                  errors.password
                    ? "border-rose-300 focus-within:border-rose-400"
                    : "border-slate-200 focus-within:border-slate-900 focus-within:ring-0"
                }`}
              >
                <KeyRound className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  disabled={isSubmitting || isRedirecting}
                  autoComplete="current-password"
                  className="flex-1 bg-transparent text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none tracking-wide"
                  {...register("password", {
                    required: "Required field",
                    minLength: {
                      value: 6,
                      message: "Minimum 6 required tokens",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-900 transition-colors shrink-0 focus:outline-none"
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

            {/* Verification Execution Call Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || isRedirecting}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold text-white bg-[#0F0F11] hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
              >
                {isSubmitting || isRedirecting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>
                      {isRedirecting ? "Routing Account..." : "Verifying..."}
                    </span>
                  </>
                ) : (
                  <>
                    <span>Authenticate Session</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Separation Break Section */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200/70" />
            </div>
            <div className="relative flex justify-center text-[11px] font-medium">
              <span className="px-2.5 bg-slate-50/50 text-slate-400">
                Enterprise Registry
              </span>
            </div>
          </div>

          {/* New Corporate Registration Trigger Link */}
          <Link href="/register" className="block focus:outline-none">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200 shadow-2xs"
            >
              <Building2 className="h-3.5 w-3.5 text-slate-400" />
              <span>Register New Workspace</span>
            </button>
          </Link>

          <p className="text-[10px] text-center text-slate-400 leading-normal font-medium pt-2">
            Credentials are systematically provisions handled directly by
            internal site hierarchy administrators.
          </p>
        </div>
      </div>
    </div>
  );
}
