// src/hooks/useGeolocation.ts
"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

interface GeolocationState {
  loading: boolean;
  error: string | null;
  latitude: number | null;
  longitude: number | null;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    loading: false,
    error: null,
    latitude: null,
    longitude: null,
  });

  const getCurrentPosition = useCallback((): Promise<{
    latitude: number;
    longitude: number;
  }> => {
    return new Promise((resolve, reject) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      if (!navigator.geolocation) {
        const errorMsg = "Geolocation is not supported by your browser";
        setState((prev) => ({ ...prev, loading: false, error: errorMsg }));
        reject(new Error(errorMsg));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setState({
            loading: false,
            error: null,
            latitude,
            longitude,
          });
          resolve({ latitude, longitude });
        },
        (error) => {
          let errorMsg = "Unable to get your location";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMsg =
                "Location permission denied. Please enable location access.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMsg = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMsg = "Location request timed out.";
              break;
          }

          setState((prev) => ({ ...prev, loading: false, error: errorMsg }));
          reject(new Error(errorMsg));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }, []);

  return {
    ...state,
    getCurrentPosition,
  };
};
