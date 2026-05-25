// src/components/ui/MapPicker.tsx
"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";

// Fix for default markers in Leaflet with Next.js
const DefaultIcon = L.icon({
  iconUrl: "/marker-icon.png",
  iconRetinaUrl: "/marker-icon-2x.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  selectedLocation?: { lat: number; lng: number };
  height?: string;
}

interface LocationMarkerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  selectedLocation?: { lat: number; lng: number };
}

function LocationMarker({
  onLocationSelect,
  selectedLocation,
}: LocationMarkerProps) {
  const [position, setPosition] = useState<[number, number] | null>(
    selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : null
  );

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onLocationSelect(lat, lng);
    },
  });

  return position === null ? null : <Marker position={position} />;
}

export const MapPicker = ({
  onLocationSelect,
  selectedLocation,
  height = "400px",
}: MapPickerProps) => {
  const defaultCenter: [number, number] = [20.5937, 78.9629]; // Center of India

  return (
    <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
      <MapContainer
        center={
          selectedLocation
            ? [selectedLocation.lat, selectedLocation.lng]
            : defaultCenter
        }
        zoom={5}
        style={{ height, width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker
          onLocationSelect={onLocationSelect}
          selectedLocation={selectedLocation}
        />
      </MapContainer>
      <div className="p-3 bg-slate-50 flex items-center justify-center gap-2 text-[11px] font-mono text-slate-500">
        <MapPin className="h-3 w-3" />
        <span>Click anywhere on the map to set branch location</span>
      </div>
    </div>
  );
};
