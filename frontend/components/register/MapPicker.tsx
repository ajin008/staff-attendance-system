// src/components/ui/MapPicker.tsx
"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  selectedLocation?: { lat: number; lng: number };
  height?: string;
}

const MapPickerClient = dynamic<MapPickerProps>(
  () => import("./MapPickerClient").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
        <div
          className="bg-slate-100 animate-pulse flex items-center justify-center"
          style={{ height: "400px" }}
        >
          <div className="text-center">
            <MapPin className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-400">Loading map...</p>
          </div>
        </div>
        <div className="p-3 bg-slate-50 flex items-center justify-center gap-2 text-[11px] font-mono text-slate-500">
          <MapPin className="h-3 w-3" />
          <span>Click anywhere on the map to set branch location</span>
        </div>
      </div>
    ),
  }
);

export const MapPicker = (props: MapPickerProps) => {
  return <MapPickerClient {...props} />;
};
