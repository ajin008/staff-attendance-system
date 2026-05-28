// components/staff/CheckOutModal.tsx
"use client";

import { useState } from "react";
import { Loader2, X, AlertTriangle } from "lucide-react";

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
        setError("Your web browser does not support location services.");
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
            setError("Server communication failed. Please try again.");
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          let errorMsg = "Unable to determine your current location.";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMsg =
                "Location access denied. Please enable permission in your browser.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMsg =
                "Location data is currently unavailable from your device.";
              break;
            case error.TIMEOUT:
              errorMsg = "Location request timed out. Please try again.";
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
      setError("An unexpected error occurred while fetching coordinates.");
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Dim Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 antialiased">
        <div className="bg-white border border-slate-200 rounded-lg shadow-lg w-full max-w-md p-6 overflow-hidden">
          {/* Header Sector */}
          <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Attendance Verification
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Confirm Shift Check-Out
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-200 rounded transition-colors focus:outline-none"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Description Content */}
          <div className="space-y-3 mb-6">
            <p className="text-xs text-slate-600 leading-relaxed">
              You are completing your attendance record for today. The system
              will securely verify your current coordinates against your
              designated office branch location to log your timestamp.
            </p>
          </div>

          {/* Status Messages Area */}
          {(loading || isLocating) && (
            <div className="flex items-center gap-2 border border-slate-200 bg-slate-50 p-3 rounded text-xs font-medium text-slate-600 mb-4">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400 shrink-0" />
              <span>Acquiring browser location data...</span>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 border border-rose-200 bg-rose-50 p-3 rounded text-xs font-semibold text-rose-700 mb-4">
              <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Button Registry */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={onClose}
              className="w-full sm:w-1/3 py-2 text-xs font-bold uppercase tracking-wide
                         border border-slate-200 rounded text-slate-600
                         hover:bg-slate-50 transition-colors focus:outline-none"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading || isLocating}
              className="w-full sm:w-2/3 py-2 text-xs font-bold uppercase tracking-wide
                         bg-slate-900 text-white rounded hover:bg-black
                         disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed
                         transition-colors flex items-center justify-center gap-2 focus:outline-none"
            >
              {loading || isLocating ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving Record...</span>
                </>
              ) : (
                <span>Confirm & Check Out</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
