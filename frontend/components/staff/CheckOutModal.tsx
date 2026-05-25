// components/staff/CheckOutModal.tsx
"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (latitude: number, longitude: number) => Promise<void>;
  isLocating?: boolean;
}

export default function CheckOutModal({
  open,
  onClose,
  onConfirm,
  isLocating = false,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setLoading(true);
    setError("");

    try {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser");
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          try {
            await onConfirm(latitude, longitude);
            setError("");
            onClose();
          } catch (err) {
            setError("Failed to check out. Please try again.");
          } finally {
            setLoading(false);
          }
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
          setError(errorMsg);
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } catch (error) {
      setError("Failed to get location. Please try again.");
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-xs text-slate-400 tracking-widest uppercase mb-1">
                Confirm Check Out
              </p>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Ready to leave?
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-slate-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <p className="text-sm text-slate-500 text-center mb-4">
            We&lsquo;ll record your check-out time and location.
          </p>

          {(loading || isLocating) && (
            <div className="flex items-center justify-center gap-2 mt-3 text-xs text-slate-500">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Getting your location...</span>
            </div>
          )}

          {error && (
            <p className="text-xs text-red-400 text-center mt-3">{error}</p>
          )}

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200
                         text-sm font-medium text-slate-600
                         hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading || isLocating}
              className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-700
                         text-white text-sm font-semibold
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors flex items-center justify-center gap-2"
            >
              {loading || isLocating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Check Out →"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
