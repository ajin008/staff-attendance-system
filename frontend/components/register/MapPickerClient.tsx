/* eslint-disable react-hooks/set-state-in-effect */
// src/components/ui/MapPickerClient.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Search, Locate, MapPin, X, Loader2, CheckCircle2 } from "lucide-react";

interface MapPickerClientProps {
  onLocationSelect: (lat: number, lng: number) => void;
  selectedLocation?: { lat: number; lng: number };
  height?: string;
}

interface LocationMarkerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  selectedLocation?: { lat: number; lng: number };
}

const searchLocation = async (
  query: string
): Promise<{ lat: number; lng: number; name: string } | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&limit=1`
    );
    const data = await response.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        name: data[0].display_name,
      };
    }
    return null;
  } catch (error) {
    console.error("Error searching location:", error);
    return null;
  }
};

const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        }
      );
    }
  });
};

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

  useEffect(() => {
    if (selectedLocation) {
      setPosition([selectedLocation.lat, selectedLocation.lng]);
    }
  }, [selectedLocation]);

  return position === null ? null : <Marker position={position} />;
}

export default function MapPickerClient({
  onLocationSelect,
  selectedLocation,
  height = "400px",
}: MapPickerClientProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  const defaultCenter: [number, number] = [20.5937, 78.9629];

  useEffect(() => {
    const DefaultIcon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    L.Marker.prototype.options.icon = DefaultIcon;
    setIsMounted(true);
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError(null);

    try {
      const result = await searchLocation(searchQuery);
      if (result && mapRef.current) {
        mapRef.current.setView([result.lat, result.lng], 15);
        onLocationSelect(result.lat, result.lng);
        setSearchQuery("");
      } else {
        setSearchError("Location not found. Try a different search term.");
      }
    } catch (error) {
      setSearchError("Failed to search location. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleGetCurrentLocation = async () => {
    setIsGettingLocation(true);
    setLocationError(null);

    try {
      const location = await getCurrentLocation();
      if (mapRef.current) {
        mapRef.current.setView([location.lat, location.lng], 16);
        onLocationSelect(location.lat, location.lng);
      }
    } catch (error) {
      setLocationError(
        error instanceof Error
          ? error.message
          : "Unable to get your current location. Please check permissions."
      );
    } finally {
      setIsGettingLocation(false);
    }
  };

  const setMapRef = (map: L.Map) => {
    mapRef.current = map;
  };

  if (!isMounted) {
    return (
      <div
        className="bg-slate-100 animate-pulse flex items-center justify-center rounded-lg"
        style={{ height }}
      >
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400">Loading map interface...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Search Controls - Normal UI matching BranchForm */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search city, street, or landmark..."
            className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/20 bg-white transition-all"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleSearch}
          disabled={isSearching || !searchQuery.trim()}
          className="px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-all"
        >
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </button>

        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={isGettingLocation}
          className="px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          {isGettingLocation ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Locate className="h-4 w-4" />
          )}
          <span>Current</span>
        </button>
      </div>

      {/* Error Messages */}
      {(searchError || locationError) && (
        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-xs text-amber-700">
            {searchError || locationError}
          </p>
        </div>
      )}

      {/* Map Container */}
      <div className="rounded-lg overflow-hidden border border-slate-200 shadow-sm">
        <MapContainer
          center={
            selectedLocation
              ? [selectedLocation.lat, selectedLocation.lng]
              : defaultCenter
          }
          zoom={selectedLocation ? 15 : 5}
          style={{ height, width: "100%" }}
          className="z-0"
          ref={setMapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker
            onLocationSelect={onLocationSelect}
            selectedLocation={selectedLocation}
          />
        </MapContainer>

        {/* Map Footer */}
        <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-[10px] text-slate-500">
            Click anywhere on the map to set coordinates
          </span>
        </div>
      </div>

      {/* Selected Coordinates Status */}
      {selectedLocation && (
        <div className="flex items-center gap-2.5 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-semibold text-emerald-800">
              Location Selected
            </p>
            <p className="text-[11px] font-mono text-emerald-600 mt-0.5">
              {selectedLocation.lat.toFixed(6)}° N,{" "}
              {selectedLocation.lng.toFixed(6)}° E
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
