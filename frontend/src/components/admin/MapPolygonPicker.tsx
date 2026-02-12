"use client";

import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Polygon, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import { Trash2, Undo, Search } from "lucide-react";

// Fix Leaflet marker icon issue in Next.js
if (typeof window !== "undefined") {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });
}

interface MapPolygonPickerProps {
    initialPoints?: [number, number][];
    onChange: (points: [number, number][]) => void;
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

function GridClickHandler({ onAddPoint }: { onAddPoint: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onAddPoint(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

export default function MapPolygonPicker({ initialPoints = [], onChange }: MapPolygonPickerProps) {
    const [isClient, setIsClient] = useState(false);
    const [points, setPoints] = useState<[number, number][]>(initialPoints);
    const [center, setCenter] = useState<[number, number]>([-37.8136, 144.9631]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        setIsClient(true);
        if (initialPoints.length > 0) {
            setPoints(initialPoints);
            setCenter(initialPoints[0]);
        }
    }, [initialPoints]);

    const handleSearch = async (e: React.FormEvent | React.MouseEvent | React.KeyboardEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                setCenter([parseFloat(lat), parseFloat(lon)]);
            } else {
                alert("Location not found");
            }
        } catch (error) {
            console.error("Search failed:", error);
            alert("Search failed. Please try again.");
        } finally {
            setIsSearching(false);
        }
    };

    const handleAddPoint = (lat: number, lng: number) => {
        const newPoints = [...points, [lat, lng] as [number, number]];
        setPoints(newPoints);
        onChange(newPoints);
    };

    const handleUndo = () => {
        const newPoints = points.slice(0, -1);
        setPoints(newPoints);
        onChange(newPoints);
    };

    const handleClear = () => {
        setPoints([]);
        onChange([]);
    };

    if (!isClient) {
        return (
            <div className="w-full h-96 bg-gray-100 rounded-2xl flex items-center justify-center border border-gray-200">
                <p className="text-gray-400 text-sm">Loading map...</p>
            </div>
        );
    }

    return (
        <div className="relative w-full h-96 rounded-2xl overflow-hidden border border-gray-200 shadow-sm z-0">


            <MapContainer
                center={center}
                zoom={10}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapUpdater center={center} />

                {/* Draw the polygon if we have points */}
                {points.length > 0 && (
                    <Polygon positions={points} pathOptions={{ color: '#FCD34D', weight: 4, fillOpacity: 0.4 }} />
                )}

                {/* Draw markers for each point */}
                {points.map((point, idx) => (
                    <Marker key={idx} position={point} />
                ))}

                <GridClickHandler onAddPoint={handleAddPoint} />
            </MapContainer>

            {/* Search Bar */}
            <div className="absolute top-4 left-4 z-[1000] w-64">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch(e);
                            }
                        }}
                        className="w-full pl-4 pr-10 py-2 bg-white/90 backdrop-blur-sm border border-gray-300 rounded-xl shadow-md text-sm outline-none focus:ring-2 focus:ring-mimosa-dark/50"
                    />
                    <button
                        type="button"
                        onClick={(e) => handleSearch(e)}
                        disabled={isSearching}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-mimosa-dark"
                    >
                        {isSearching ? (
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-mimosa-dark rounded-full animate-spin" />
                        ) : (
                            <Search size={16} />
                        )}
                    </button>
                </div>
            </div>

            {/* Controls */}
            <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
                <button
                    type="button"
                    onClick={handleUndo}
                    disabled={points.length === 0}
                    className="p-3 bg-white text-gray-700 rounded-xl shadow-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    title="Undo last point"
                >
                    <Undo size={20} />
                </button>
                <button
                    type="button"
                    onClick={handleClear}
                    disabled={points.length === 0}
                    className="p-3 bg-white text-red-500 rounded-xl shadow-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    title="Clear all points"
                >
                    <Trash2 size={20} />
                </button>
            </div>

            <div className="absolute bottom-4 left-4 z-[400] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg text-xs font-medium text-gray-600">
                Click on the map to draw the service area polygon.
            </div>
        </div>
    );
}
