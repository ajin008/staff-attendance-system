"use client";

import { useState } from "react";
import { Mood } from "@/src/types";
import MoodSelector from "./MoodSelector";
import { Loader2, X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (mood: Mood) => Promise<void>;
}

export default function CheckOutModal({ open, onClose, onConfirm }: Props) {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    if (!selectedMood) {
      setError("Please select your mood before checking out");
      return;
    }
    setLoading(true);
    try {
      await onConfirm(selectedMood);
      setSelectedMood(null);
      setError("");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-xs text-slate-400 tracking-widest uppercase mb-1">
                Before you go
              </p>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                How was your day?
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-slate-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mood Selector */}
          <MoodSelector selected={selectedMood} onSelect={setSelectedMood} />

          {/* Error */}
          {error && (
            <p className="text-xs text-red-400 text-center mt-3">{error}</p>
          )}

          {/* Actions */}
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
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-700
                         text-white text-sm font-semibold
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Checking out...
                </>
              ) : (
                "Check Out →"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
