// src/components/register/BranchForm.tsx
"use client";

import { useState } from "react";
import { MapPin, Plus, Trash2, X, Check } from "lucide-react";
import { MapPicker } from "./MapPicker";

interface Branch {
  name: string;
  latitude: number;
  longitude: number;
}

interface BranchFormProps {
  branches: Branch[];
  onBranchesChange: (branches: Branch[]) => void;
}

export const BranchForm = ({ branches, onBranchesChange }: BranchFormProps) => {
  const [isAddingBranch, setIsAddingBranch] = useState(false);
  const [newBranch, setNewBranch] = useState<{
    name: string;
    lat: number | null;
    lng: number | null;
  }>({
    name: "",
    lat: null,
    lng: null,
  });

  const handleAddBranch = () => {
    if (newBranch.name && newBranch.lat !== null && newBranch.lng !== null) {
      onBranchesChange([
        ...branches,
        {
          name: newBranch.name,
          latitude: newBranch.lat,
          longitude: newBranch.lng,
        },
      ]);
      setNewBranch({ name: "", lat: null, lng: null });
      setIsAddingBranch(false);
    }
  };

  const handleRemoveBranch = (index: number) => {
    onBranchesChange(branches.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Existing Branches */}
      {branches.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.15em]">
              Added Branches ({branches.length})
            </label>
            {branches.length > 0 && (
              <span className="text-[10px] text-emerald-600 font-mono">
                {branches.length} branch{branches.length !== 1 ? "es" : ""}{" "}
                configured
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 gap-3">
            {branches.map((branch, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      {branch.name}
                    </p>
                    <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                      {branch.latitude.toFixed(6)},{" "}
                      {branch.longitude.toFixed(6)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveBranch(index)}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Branch Section - Always visible but collapsible */}
      {!isAddingBranch ? (
        <button
          type="button"
          onClick={() => setIsAddingBranch(true)}
          className="w-full py-4 rounded-xl border-2 border-dashed border-slate-200 
                     text-sm font-medium text-slate-500 hover:border-emerald-300 
                     hover:text-emerald-600 hover:bg-emerald-50/30
                     transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add New Branch
        </button>
      ) : (
        <div className="space-y-5 p-5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <MapPin className="h-4 w-4 text-emerald-600" />
              </div>
              <h4 className="text-base font-semibold text-slate-700">
                New Branch Details
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setIsAddingBranch(false)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Branch Name */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-600">
              Branch Name
            </label>
            <input
              type="text"
              placeholder="e.g., 'Head Office', 'Downtown', 'Branch 1'"
              value={newBranch.name}
              onChange={(e) =>
                setNewBranch({ ...newBranch, name: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border border-slate-200 
                       text-sm text-slate-900 placeholder:text-slate-300
                       focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900
                       bg-white"
            />
          </div>

          {/* Location Picker */}
          <div className="space-y-3">
            <label className="text-xs font-medium text-slate-600">
              Branch Location
            </label>
            <MapPicker
              onLocationSelect={(lat, lng) => {
                setNewBranch({ ...newBranch, lat, lng });
              }}
              selectedLocation={
                newBranch.lat && newBranch.lng
                  ? { lat: newBranch.lat, lng: newBranch.lng }
                  : undefined
              }
              height="350px"
            />
            {newBranch.lat && newBranch.lng && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                <MapPin className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-mono text-emerald-700">
                  Selected: {newBranch.lat.toFixed(6)},{" "}
                  {newBranch.lng.toFixed(6)}
                </span>
                <Check className="h-4 w-4 text-emerald-600 ml-auto" />
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddBranch}
            disabled={
              !newBranch.name ||
              newBranch.lat === null ||
              newBranch.lng === null
            }
            className="w-full py-3 rounded-lg text-sm font-semibold
                       bg-slate-900 text-white hover:bg-slate-800
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Branch
          </button>
        </div>
      )}
    </div>
  );
};
