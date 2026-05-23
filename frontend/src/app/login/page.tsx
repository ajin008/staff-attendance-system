"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
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

  // Handle redirect when user is set
  useEffect(() => {
    if (!isLoading && user && !isRedirecting) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsRedirecting(true);
      const targetPath = user.role === "admin" ? "/admin" : "/staff";
      // Use window.location for hard navigation to ensure it works
      window.location.href = targetPath;
    }
  }, [user, isLoading, isRedirecting]);

  const onSubmit = async (data: LoginForm) => {
    if (isRedirecting) return;

    try {
      console.log("HANDLE LOGIN CALLED");
      const res = await loginUser(data);

      // First update the auth context
      login(res.user);

      toast.success(`Welcome back, ${res.user.name}!`);
      console.log("login user role:", res.user.role);

      // Set redirecting flag
      setIsRedirecting(true);

      // Small delay to ensure localStorage is set
      setTimeout(() => {
        const targetPath = res.user.role === "admin" ? "/admin" : "/staff";
        window.location.href = targetPath;
      }, 50);
    } catch (err) {
      toast.error(getErrorMessage(err));
      setIsRedirecting(false);
    }
  };

  // Show loading state
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

  // If user is already logged in, don't show login form (prevent flash)
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
      {/* Left Side - Image with Pattern */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-linear-to-br from-slate-50 to-white items-center justify-center p-12">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        />

        <div className="relative z-10 w-full max-w-lg">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-slate-100 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-slate-100 rounded-full blur-3xl opacity-50"></div>
          <div className="relative">
            <Image
              src="/Team-cuate.png"
              alt="Team collaboration illustration"
              width={500}
              height={500}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500 font-medium tracking-wide">
              Attendance Management System
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Track, manage, and optimize your team&apos;s attendance
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
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
