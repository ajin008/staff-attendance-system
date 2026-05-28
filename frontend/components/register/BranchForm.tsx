// components/register/BranchForm.tsx
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
    <div className="space-y-4">
      {/* Existing Operational Location List Modules */}
      {branches.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Active Map Nodes ({branches.length})
            </label>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {branches.map((branch, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-md bg-white border border-slate-200/70 hover:border-slate-400 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                    <MapPin className="h-3.5 w-3.5 text-slate-700" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">
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
                  className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors focus:outline-none"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Branch Execution Module Panel */}
      {!isAddingBranch ? (
        <button
          type="button"
          onClick={() => setIsAddingBranch(true)}
          className="w-full py-3 rounded-md border border-dashed border-slate-300 text-xs font-semibold bg-white text-slate-600 hover:border-slate-900 hover:text-slate-900 hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5"
        >
          <Plus className="h-3.5 w-3.5 text-slate-400" />
          <span>Append Operational Branch</span>
        </button>
      ) : (
        <div className="space-y-4 p-4 rounded-md bg-white border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-slate-900" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-tight">
                Location Metadata parameters
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setIsAddingBranch(false)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors focus:outline-none"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Branch Label Input Wrapper */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-700 tracking-tight block uppercase">
              Location Identifier Name
            </label>
            <input
              type="text"
              placeholder="e.g., Head Office, Kochi Workspace, Cluster Alpha"
              value={newBranch.name}
              onChange={(e) =>
                setNewBranch({ ...newBranch, name: e.target.value })
              }
              className="w-full px-3 py-2 rounded-md border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 bg-white"
            />
          </div>

          {/* Dynamic Map Vector Grid Element */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-700 tracking-tight block uppercase">
              Geographic Coordinates Selection Map
            </label>
            <div className="rounded-md overflow-hidden border border-slate-200">
              <MapPicker
                onLocationSelect={(lat, lng) => {
                  setNewBranch({ ...newBranch, lat, lng });
                }}
                selectedLocation={
                  newBranch.lat && newBranch.lng
                    ? { lat: newBranch.lat, lng: newBranch.lng }
                    : undefined
                }
                height="280px"
              />
            </div>

            {newBranch.lat && newBranch.lng && (
              <div className="flex items-center gap-2 p-2 bg-emerald-50/50 rounded-md border border-emerald-100">
                <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span className="text-[10px] font-mono font-bold text-emerald-700">
                  Coordinates Indexed: {newBranch.lat.toFixed(6)},{" "}
                  {newBranch.lng.toFixed(6)}
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
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold text-white bg-[#0F0F11] hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-150"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Commit Node Parameter</span>
          </button>
        </div>
      )}
    </div>
  );
};
