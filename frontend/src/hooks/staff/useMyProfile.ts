// src/hooks/staff/useMyProfile.ts
"use client";

import { useCallback } from "react";
import useSWR from "swr";
import { getMyProfile, ProfileData } from "../../services/staffprofile.service";
import { getErrorMessage } from "./../../utils/axios";

const MY_PROFILE_KEY = "/staff/profile/me";

export function useMyProfile() {
  const {
    data: profile = null,
    error,
    isLoading,
    mutate,
  } = useSWR<ProfileData>(MY_PROFILE_KEY, getMyProfile, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000,
  });

  const refreshProfile = useCallback(() => {
    mutate();
  }, [mutate]);

  return {
    profile,
    isLoading,
    error: error ? getErrorMessage(error) : null,
    refreshProfile,
  };
}
