// components/admin/profile/BranchManager.tsx
"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  Plus,
  Trash2,
  X,
  Check,
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
    e.preventDefault(); // Stop form bubbling completely
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
    <div className="space-y-6 p-6 border border-slate-200/60 rounded-md bg-white shadow-sm relative">
      {/* Absolute layout glass block loader during atomic transaction writes */}
      {isSaving && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-xs z-50 flex items-center justify-center rounded-md">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white font-mono text-[10px] rounded-md shadow-md uppercase">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-400" />
            <span>Mutating Network Node...</span>
          </div>
        </div>
      )}

      {/* Component Header Block Layout */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <ServerIcon className="h-4 w-4 text-slate-400" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            03 — Infrastructure Branch Registry
          </h2>
        </div>
      </div>

      {/* Render Active Branches */}
      {branches.length > 0 && (
        <div className="space-y-2">
          <div className="grid grid-cols-1 gap-2">
            {branches.map((branch, index) => (
              <div
                key={branch.id || index}
                className="flex items-center justify-between p-3 rounded-md bg-slate-50/50 border border-slate-200/60 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-white border border-slate-200 flex items-center justify-center shrink-0">
                    <MapPin className="h-3.5 w-3.5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 uppercase">
                      {branch.name}
                    </p>
                    <p className="text-[10px] font-mono text-slate-400">
                      {branch.latitude?.toFixed(6)}°N ,{" "}
                      {branch.longitude?.toFixed(6)}°E
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemoveBranchAtomically(index, branch.id);
                  }}
                  className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors focus:outline-none"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Control Module Sheet Forms */}
      {!isAddingBranch ? (
        <button
          type="button"
          onClick={() => setIsAddingBranch(true)}
          className="w-full py-3 rounded-md border border-dashed border-slate-200 text-xs font-mono font-bold uppercase tracking-wider text-slate-400 hover:border-slate-900 hover:text-slate-900 bg-white transition-all flex items-center justify-center gap-2 focus:outline-none"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Append Operational Branch</span>
        </button>
      ) : (
        <div className="space-y-4 p-4 border border-slate-200 rounded-md bg-white shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wide">
              New Allocation Parameters
            </span>
            <button
              type="button"
              onClick={() => setIsAddingBranch(false)}
              className="p-1 text-slate-400 hover:text-slate-900 focus:outline-none"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">
              Location Identifier Name
            </label>
            <input
              type="text"
              placeholder="e.g., KOCHI HQ"
              value={newBranch.name}
              onChange={(e) =>
                setNewBranch({ ...newBranch, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-200 text-xs font-medium bg-white rounded-md focus:outline-none focus:border-slate-900 uppercase transition-colors"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Geofence Coordinates Select
              </label>
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                className="text-[10px] font-mono font-bold uppercase text-slate-400 hover:text-slate-900 underline"
              >
                Use GPS Telemetry
              </button>
            </div>

            <div className="border border-slate-200 rounded-md overflow-hidden bg-slate-50">
              <MapPicker
                onLocationSelect={(lat, lng) =>
                  setNewBranch({ ...newBranch, lat, lng })
                }
                selectedLocation={
                  newBranch.lat && newBranch.lng
                    ? { lat: newBranch.lat, lng: newBranch.lng }
                    : undefined
                }
                height="240px"
              />
            </div>

            {newBranch.lat && newBranch.lng && (
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-900 rounded-md text-white">
                <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span className="text-[10px] font-mono tracking-tight uppercase">
                  Matrix Resolved: {newBranch.lat.toFixed(6)} ,{" "}
                  {newBranch.lng.toFixed(6)}
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleCommitAdd}
            disabled={
              !newBranch.name ||
              newBranch.lat === null ||
              newBranch.lng === null
            }
            className="w-full py-2 text-xs font-mono font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-black rounded-md disabled:bg-slate-100 disabled:text-slate-400 transition-all flex items-center justify-center gap-2 focus:outline-none"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Deploy Branch Instantly</span>
          </button>
        </div>
      )}
    </div>
  );
}
