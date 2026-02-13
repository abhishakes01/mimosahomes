"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";

// Fix for default marker icons in Leaflet with Next.js
const defaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

// Custom icon for Mimosa Homes (matching the logo style if possible)
const mimosaIcon = L.divIcon({
    className: "custom-mimosa-marker",
    html: `
        <div class="relative">
            <div class="w-10 h-10 bg-[#1a3a4a] rounded-full flex items-center justify-center border-2 border-white shadow-xl transform hover:scale-110 transition-transform">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                </svg>
            </div>
            <div class="absolute -top-1 -right-1 w-3 h-3 bg-[#0897b1] rounded-full border border-white"></div>
        </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
});

interface Location {
    id: string;
    latitude: number;
    longitude: number;
    title: string;
    address: string;
}

interface DisplayHomesMapProps {
    locations?: Location[];
    items?: Location[]; // Alias for flexibility
    activeId?: string;
    center?: [number, number];
}

function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, 12);
        }
    }, [center, map]);
    return null;
}

export default function DisplayHomesMap({ locations, items, activeId, center: customCenter }: DisplayHomesMapProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    const allLocations = locations || items || [];
    const validLocations = allLocations.filter(loc => loc && loc.latitude && loc.longitude);

    // Default center (Melbourne area)
    const melbourneCenter: [number, number] = [-37.8136, 144.9631];
    const mapCenter = customCenter
        ? customCenter
        : (validLocations.length > 0
            ? [Number(validLocations[0].latitude), Number(validLocations[0].longitude)] as [number, number]
            : melbourneCenter);

    if (!isMounted) {
        return <div className="w-full h-full min-h-[500px] bg-gray-100 rounded-[32px] animate-pulse" />;
    }

    return (
        <div className="w-full h-full min-h-[500px] rounded-[32px] overflow-hidden shadow-2xl border-4 border-white relative z-0">
            <MapContainer
                key="mimosa-display-homes-map"
                center={mapCenter}
                zoom={11}
                scrollWheelZoom={true}
                className="w-full h-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {validLocations.map((loc) => (
                    <Marker
                        key={loc.id}
                        position={[Number(loc.latitude), Number(loc.longitude)]}
                        icon={mimosaIcon}
                    >
                        <Popup className="custom-popup">
                            <div className="p-2">
                                <h3 className="font-black text-[#1a3a4a] text-sm uppercase italic mb-1">{loc.title}</h3>
                                <p className="text-[10px] text-gray-500 font-bold mb-2">{loc.address}</p>
                                <a
                                    href={`${process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL || 'https://www.google.com/maps/search/?api=1&query='}${encodeURIComponent(loc.address)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] font-black uppercase tracking-widest text-[#0897b1] hover:underline"
                                >
                                    Get Directions
                                </a>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Auto-positioning to active item or custom center */}
                {customCenter && <ChangeView center={customCenter} />}

                {activeId && validLocations.find(l => l.id === activeId) && (
                    <ChangeView
                        center={[
                            Number(validLocations.find(l => l.id === activeId)!.latitude),
                            Number(validLocations.find(l => l.id === activeId)!.longitude)
                        ]}
                    />
                )}
            </MapContainer>

            <style jsx global>{`
                .leaflet-container {
                    background: #f1f5f9;
                }
                .custom-mimosa-marker {
                    background: transparent !important;
                    border: none !important;
                }
                .custom-popup .leaflet-popup-content-wrapper {
                    border-radius: 16px;
                    padding: 4px;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
                }
                .custom-popup .leaflet-popup-tip {
                    background: white;
                }
            `}</style>
        </div>
    );
}
