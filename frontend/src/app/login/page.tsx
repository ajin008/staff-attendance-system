"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import { loginUser } from "@/src/services/auth.service";

interface LoginForm {
  identifier: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login, user, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(user.role === "admin" ? "/admin" : "/staff");
    }
  }, [user, isLoading, router]);

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await loginUser(data);
      login(res.user);
      toast.success(`Welcome back, ${res.user.name}!`);
      router.replace(res.user.role === "admin" ? "/admin" : "/staff");
    } catch {
      toast.error("Invalid credentials.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-4 w-4 animate-spin text-slate-300" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Logo mark */}
        <div className="mb-10">
          <p className="text-xs text-slate-400 tracking-widest uppercase mb-3">
            01 — Sign In
          </p>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">
            Welcome
            <br />
            back.
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Staff · Staff ID &nbsp;✦&nbsp; Admin · Email
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Identifier */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
              Identifier
            </label>
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border
              bg-white transition-all duration-150
              ${
                errors.identifier
                  ? "border-red-300 bg-red-50"
                  : "border-slate-200 focus-within:border-slate-900 focus-within:bg-white"
              }`}
            >
              <svg
                className="h-4 w-4 text-slate-300 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <input
                placeholder="ST-A3K9M or admin@company.com"
                disabled={isSubmitting}
                autoComplete="username"
                className="flex-1 bg-transparent text-sm text-slate-900
                  placeholder:text-slate-300 focus:outline-none"
                {...register("identifier", {
                  required: "Required",
                })}
              />
            </div>
            {errors.identifier && (
              <p className="text-xs text-red-400 pl-1">
                {errors.identifier.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
              Password
            </label>
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border
              bg-slate-50 transition-all duration-150
              ${
                errors.password
                  ? "border-red-300 bg-red-50"
                  : "border-slate-200 focus-within:border-slate-900 focus-within:bg-white"
              }`}
            >
              <svg
                className="h-4 w-4 text-slate-300 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
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
                disabled={isSubmitting}
                autoComplete="current-password"
                className="flex-1 bg-transparent text-sm text-slate-900
                  placeholder:text-slate-300 focus:outline-none"
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
              <p className="text-xs text-red-400 pl-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl text-sm font-semibold
                         bg-blue-600 hover:bg-blue-700 text-white
                         shadow-lg shadow-blue-100
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-150
                         flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Continue
                  <span className="text-blue-200">→</span>
                </>
              )}
            </button>
          </div>
        </form>

        <p className="text-xs text-slate-300 mt-8 text-center">
          Credentials are provided by your administrator
        </p>
      </div>
    </div>
  );
}
