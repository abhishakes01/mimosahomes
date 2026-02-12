"use client";

import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";

// Removed top-level L import to prevent SSR issues

interface MapPickerProps {
    initialLat: number;
    initialLng: number;
    onSelect: (lat: number, lng: number) => void;
}

// Internal component to handle map movement
function MapUpdater({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        if (map) {
            map.setView(center, map.getZoom());
        }
    }, [center, map]);
    return null;
}

// Internal component to handle map clicks
function MapClickHandler({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onSelect(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

export default function MapPicker({ initialLat, initialLng, onSelect }: MapPickerProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        (async () => {
            const L = (await import("leaflet")).default;
            // Fix Leaflet marker icon issue
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
                iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
                shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
            });
        })();
    }, []);

    if (!isClient) {
        return (
            <div className="w-full h-64 bg-gray-100 rounded-2xl flex items-center justify-center border border-gray-200">
                <p className="text-gray-400 text-sm">Loading map...</p>
            </div>
        );
    }

    const center: [number, number] = [initialLat || -37.8136, initialLng || 144.9631];

    return (
        <div className="w-full h-64 rounded-2xl overflow-hidden border border-gray-200 shadow-sm relative z-0">
            <MapContainer
                center={center}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={center} draggable={false} />
                <MapUpdater center={center} />
                <MapClickHandler onSelect={onSelect} />
            </MapContainer>
        </div>
    );
}
