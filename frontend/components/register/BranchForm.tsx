// src/components/ui/BranchForm.tsx
"use client";

import { useState } from "react";
import { MapPin, Plus, Trash2, X } from "lucide-react";
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
    <div className="space-y-4">
      {/* Existing Branches */}
      {branches.length > 0 && (
        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.15em]">
            Added Branches ({branches.length})
          </label>
          <div className="space-y-2">
            {branches.map((branch, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {branch.name}
                    </p>
                    <p className="text-[10px] font-mono text-slate-400">
                      {branch.latitude.toFixed(6)},{" "}
                      {branch.longitude.toFixed(6)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveBranch(index)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Branch Button */}
      {!isAddingBranch ? (
        <button
          type="button"
          onClick={() => setIsAddingBranch(true)}
          className="w-full py-3 rounded-xl border-2 border-dashed border-slate-200 
                     text-sm font-medium text-slate-500 hover:border-emerald-300 
                     hover:text-emerald-600 hover:bg-emerald-50/30
                     transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Branch
        </button>
      ) : (
        <div className="space-y-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-slate-700">New Branch</h4>
            <button
              type="button"
              onClick={() => setIsAddingBranch(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Branch Name */}
          <div>
            <input
              type="text"
              placeholder="Branch name (e.g., 'Head Office', 'Downtown')"
              value={newBranch.name}
              onChange={(e) =>
                setNewBranch({ ...newBranch, name: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 
                       text-sm text-slate-900 placeholder:text-slate-300
                       focus:outline-none focus:border-slate-900"
            />
          </div>

          {/* Location Picker */}
          <div className="space-y-2">
            <p className="text-xs text-slate-500">
              Click on map to set branch location
            </p>
            <MapPicker
              onLocationSelect={(lat, lng) => {
                setNewBranch({ ...newBranch, lat, lng });
              }}
              selectedLocation={
                newBranch.lat && newBranch.lng
                  ? { lat: newBranch.lat, lng: newBranch.lng }
                  : undefined
              }
              height="250px"
            />
            {newBranch.lat && newBranch.lng && (
              <div className="flex items-center gap-2 text-xs text-emerald-600">
                <MapPin className="h-3 w-3" />
                <span className="font-mono">
                  {newBranch.lat.toFixed(6)}, {newBranch.lng.toFixed(6)}
                </span>
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
            className="w-full py-2.5 rounded-lg text-sm font-medium
                       bg-slate-900 text-white hover:bg-slate-800
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200"
          >
            Add Branch
          </button>
        </div>
      )}
    </div>
  );
};
