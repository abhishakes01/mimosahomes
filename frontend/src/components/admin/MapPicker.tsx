"use client";

import { useEffect, useMemo, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";

// Fix Leaflet marker icon issue globally once
if (typeof window !== "undefined") {
    import("leaflet").then((L) => {
        const Leaflet = L.default || L;
        // @ts-ignore
        delete Leaflet.Icon.Default.prototype._getIconUrl;
        Leaflet.Icon.Default.mergeOptions({
            iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
            iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
            shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
        });
    });
}

interface MapPickerProps {
    initialLat: number;
    initialLng: number;
    onSelect: (lat: number, lng: number) => void;
}

function MapUpdater({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        if (map && !isNaN(center[0]) && !isNaN(center[1])) {
            map.setView(center, map.getZoom());
        }
    }, [center, map]);
    return null;
}

function MapClickHandler({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onSelect(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

export default function MapPicker({ initialLat, initialLng, onSelect }: MapPickerProps) {
    const center = useMemo(() => {
        const lat = !isNaN(initialLat) ? initialLat : -37.8136;
        const lng = !isNaN(initialLng) ? initialLng : 144.9631;
        return [lat, lng] as [number, number];
    }, [initialLat, initialLng]);

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
