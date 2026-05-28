/* eslint-disable react-hooks/set-state-in-effect */
// src/hooks/useProfileSettings.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  getProfileDetails,
  updateProfileDetails,
  type Branch,
  type UpdateProfileInput,
  type ProfileDetailsResponse,
} from "@/src/services/profile.service";
import { getErrorMessage } from "@/src/utils/axios";
import { triggerDashboardRefresh } from "@/src/utils/events";

export const SECTOR_OPTIONS: string[] = [
  "Technology & Software",
  "Healthcare & Clinics",
  "Education & Academics",
  "Retail & E-commerce",
  "Manufacturing & Logistics",
  "Hospitality & Food Services",
  "Finance & Banking",
];

export function useProfileSettings() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form Field States
  const [companyName, setCompanyName] = useState<string>("");
  const [sector, setSector] = useState<string>("");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [newBranchName, setNewBranchName] = useState<string>("");

  const [fullName, setFullName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const fetchProfile = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const data: ProfileDetailsResponse = await getProfileDetails();
      setCompanyName(data.organization.companyName || "");
      setSector(data.organization.sector || "");
      setBranches(data.organization.branches || []);

      setFullName(data.admin.fullName || "");
      setPhone(data.admin.phone || "");
      setEmail(data.admin.email || "");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Branch Operations
  const handleAddBranch = (): void => {
    if (!newBranchName.trim()) {
      toast.error("Branch name parameter cannot be empty");
      return;
    }

    // Configured with baseline fallback coordinate floats to fulfill the complete Branch contract structure
    const newBranch: Branch = {
      id: Date.now() * -1,
      name: newBranchName.trim(),
      latitude: 0.0,
      longitude: 0.0,
      allowedRadius: 100,
    };

    setBranches((prev) => [...prev, newBranch]);
    setNewBranchName("");
  };

  const handleUpdateBranchName = (id: number, name: string): void => {
    setBranches((prev) => prev.map((b) => (b.id === id ? { ...b, name } : b)));
  };

  const handleRemoveBranch = (id: number): void => {
    setBranches((prev) => prev.filter((b) => b.id !== id));
  };

  // Profile Save Matrix Operation
  const handleSaveProfile = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      toast.error("Pass Key Token confirmation fields do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      // Clean up local tracking IDs while mapping the arrays cleanly back into a typed explicit request shape
      const synchronizedBranches: Branch[] = branches.map((b) => ({
        id: b.id && b.id > 0 ? b.id : undefined,
        name: b.name,
        latitude: b.latitude ?? 0.0,
        longitude: b.longitude ?? 0.0,
        allowedRadius: b.allowedRadius ?? 100,
      }));

      const payload: UpdateProfileInput = {
        companyName,
        sector,
        branches: synchronizedBranches,
        fullName,
        phone,
      };

      if (password.trim()) {
        payload.password = password;
      }

      await updateProfileDetails(payload);
      toast.success("Profile parameters synchronized successfully");
      setPassword("");
      setConfirmPassword("");
      triggerDashboardRefresh();
      fetchProfile();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isLoading,
    isSubmitting,
    companyName,
    setCompanyName,
    sector,
    setSector,
    branches,
    newBranchName,
    setNewBranchName,
    fullName,
    setFullName,
    phone,
    setPhone,
    email,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    handleAddBranch,
    handleUpdateBranchName,
    handleRemoveBranch,
    handleSaveProfile,
  };
}
