// components/admin/profile/BranchManager.tsx
"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  Plus,
  Trash2,
  X,
  Navigation,
  Loader2,
  ServerIcon,
} from "lucide-react";
import { MapPicker } from "@/components/register/MapPicker";
import { useGeolocation } from "@/src/hooks/useGeolocation";
import { useBranchManager } from "@/src/hooks/profile/useBranchManager";
import { type Branch } from "@/src/services/profile.service";

interface BranchManagerProps {
  initialBranches: Branch[];
}

export default function BranchManager({ initialBranches }: BranchManagerProps) {
  const {
    branches,
    setBranches,
    isSaving,
    handleAddBranchAtomically,
    handleRemoveBranchAtomically,
  } = useBranchManager(initialBranches);

  // Keep state synced when root profile updates data frames
  useEffect(() => {
    setBranches(initialBranches);
  }, [initialBranches, setBranches]);

  const [isAddingBranch, setIsAddingBranch] = useState<boolean>(false);
  const { getCurrentPosition } = useGeolocation();

  const [newBranch, setNewBranch] = useState({
    name: "",
    lat: null as number | null,
    lng: null as number | null,
  });

  const handleGetCurrentLocation = async (
    e: React.MouseEvent
  ): Promise<void> => {
    e.preventDefault();
    try {
      const position = await getCurrentPosition();
      setNewBranch((prev) => ({
        ...prev,
        lat: position.latitude,
        lng: position.longitude,
      }));
    } catch (error) {
      // Handled internally by hook telemetry
    }
  };

  const handleCommitAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!newBranch.name || newBranch.lat === null || newBranch.lng === null)
      return;

    const success = await handleAddBranchAtomically({
      name: newBranch.name,
      latitude: newBranch.lat,
      longitude: newBranch.lng,
    });

    if (success) {
      setNewBranch({ name: "", lat: null, lng: null });
      setIsAddingBranch(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Loading Overlay */}
      {isSaving && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg shadow-lg">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-xs font-medium">Saving changes...</span>
          </div>
        </div>
      )}

      {/* Existing Branches Section */}
      {branches.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-slate-900 rounded-full" />
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Registered Branches ({branches.length})
            </label>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {branches.map((branch, index) => (
              <div
                key={branch.id || index}
                className="group flex items-center justify-between p-3 rounded-lg bg-slate-50/50 border border-slate-200 hover:border-slate-300 hover:bg-white transition-all duration-200"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 group-hover:border-slate-300 transition-colors">
                    <MapPin className="h-4 w-4 text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {branch.name}
                    </p>
                    <p className="text-[11px] font-mono text-slate-400 truncate">
                      {branch.latitude?.toFixed(6)}° N,{" "}
                      {branch.longitude?.toFixed(6)}° E
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemoveBranchAtomically(index, branch.id);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 opacity-0 group-hover:opacity-100 hover:text-rose-600 hover:bg-rose-50 transition-all focus:outline-none"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Branch Section */}
      {!isAddingBranch ? (
        <button
          type="button"
          onClick={() => setIsAddingBranch(true)}
          className="w-full py-3.5 rounded-lg border-2 border-dashed border-slate-300 text-sm font-medium bg-slate-50/30 text-slate-600 hover:border-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 group"
        >
          <Plus className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
          <span>Add New Branch Location</span>
        </button>
      ) : (
        <div className="space-y-5 p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-slate-100 rounded-lg">
                <Navigation className="h-4 w-4 text-slate-700" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">
                  Configure Branch Location
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Set the geographical coordinates for this branch
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsAddingBranch(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Branch Name Input */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-1 bg-slate-400 rounded-full" />
              Branch Identifier
            </label>
            <input
              type="text"
              placeholder="e.g., Corporate Headquarters, Downtown Hub"
              value={newBranch.name}
              onChange={(e) =>
                setNewBranch({ ...newBranch, name: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/20 bg-white transition-all"
            />
          </div>

          {/* Map Section with GPS Button */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <span className="w-1 h-1 bg-slate-400 rounded-full" />
                Geographic Coordinates
              </label>
              {/* <button
                type="button"
                onClick={handleGetCurrentLocation}
                className="text-[11px] font-medium text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1"
              >
                <Navigation className="h-3 w-3" />
                <span>Use Current Location</span>
              </button> */}
            </div>
            <div className="rounded-lg overflow-hidden border-none ">
              <MapPicker
                onLocationSelect={(lat, lng) =>
                  setNewBranch({ ...newBranch, lat, lng })
                }
                selectedLocation={
                  newBranch.lat && newBranch.lng
                    ? { lat: newBranch.lat, lng: newBranch.lng }
                    : undefined
                }
                height="320px"
              />
            </div>

            {/* Selected Coordinates Display */}
            {newBranch.lat && newBranch.lng && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg ">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-mono text-emerald-700">
                  {newBranch.lat.toFixed(6)}° N, {newBranch.lng.toFixed(6)}° E
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingBranch(false)}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCommitAdd}
              disabled={
                !newBranch.name ||
                newBranch.lat === null ||
                newBranch.lng === null ||
                isSaving
              }
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              <span>Register Branch</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
