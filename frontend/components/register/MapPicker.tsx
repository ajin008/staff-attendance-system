// src/components/ui/MapPicker.tsx
"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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
  height = "300px",
}: MapPickerProps) => {
  const defaultCenter: [number, number] = [20.5937, 78.9629]; // Center of India

  return (
    <div className="rounded-xl overflow-hidden border border-slate-200">
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
      <div className="p-2 bg-slate-50 text-[10px] font-mono text-slate-400 text-center">
        Click anywhere on the map to set branch location
      </div>
    </div>
  );
};
