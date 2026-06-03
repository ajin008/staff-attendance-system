// src/hooks/useRoleGuard.ts
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export const useRoleGuard = (requiredRole: "admin" | "staff") => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== requiredRole) {
      router.replace(user.role === "admin" ? "/admin" : "/staff");
    }
  }, [user, isLoading, requiredRole, router]);
};
