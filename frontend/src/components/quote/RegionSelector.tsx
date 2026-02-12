"use client";

import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Polygon, useMap, Tooltip } from "react-leaflet";
import L from "leaflet";
import { api } from "@/services/api"; // Ensure this import is correct

// Fix Leaflet marker icon issue in Next.js (Standard fix)
if (typeof window !== "undefined") {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });
}

interface MapUpdaterProps {
    center?: [number, number];
    bounds?: L.LatLngBoundsExpression;
}

// Simplified MapUpdater
function MapUpdater({ center, bounds }: MapUpdaterProps) {
    const map = useMap();
    useEffect(() => {
        if (!map) return;

        if (bounds) {
            console.log("RegionSelector: Fitting bounds", bounds);
            // invalidateSize is important if map container size changed (e.g. valid layout)
            map.invalidateSize();
            // Using flyToBounds for smoother transition and to ensure it triggers
            map.flyToBounds(bounds, {
                padding: [50, 50],
                maxZoom: 14,
                duration: 1.5
            });
        } else if (center) {
            map.setView(center, map.getZoom());
        }
    }, [center, bounds, map]);
    return null;
}

interface RegionSelectorProps {
    onSelect: (region: any) => void;
}

export default function RegionSelector({ onSelect }: RegionSelectorProps) {
    const [isClient, setIsClient] = useState(false);
    const [serviceAreas, setServiceAreas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [mapBounds, setMapBounds] = useState<L.LatLngBoundsExpression | null>(null);
    const [debugBoundsStr, setDebugBoundsStr] = useState<string>("");

    useEffect(() => {
        setIsClient(true);
        loadServiceAreas();
    }, []);

    const loadServiceAreas = async () => {
        try {
            const data: any = await api.getServiceAreas();
            // Filter active areas only
            const activeAreas = data.filter((area: any) => area.is_active && area.coordinates && area.coordinates.length > 0);
            setServiceAreas(activeAreas);

            // Calculate bounds
            if (activeAreas.length > 0) {
                // Helper to normalize longitude to -180 to 180
                const normalizeLng = (lng: number) => {
                    return ((lng + 180) % 360 + 360) % 360 - 180;
                };

                // Ensure coordinates are numbers and flatten the array
                const allPoints: [number, number][] = activeAreas.flatMap((area: any) =>
                    area.coordinates.map((coord: any) => [
                        parseFloat(coord[0]),
                        normalizeLng(parseFloat(coord[1]))
                    ])
                );

                if (allPoints.length > 0) {
                    // Create bounds explicitly
                    const southWest = L.latLng(
                        Math.min(...allPoints.map(p => p[0])),
                        Math.min(...allPoints.map(p => p[1]))
                    );
                    const northEast = L.latLng(
                        Math.max(...allPoints.map(p => p[0])),
                        Math.max(...allPoints.map(p => p[1]))
                    );
                    const bounds = L.latLngBounds(southWest, northEast);

                    setDebugBoundsStr(`SW: ${southWest.lat.toFixed(4)}, ${southWest.lng.toFixed(4)} | NE: ${northEast.lat.toFixed(4)}, ${northEast.lng.toFixed(4)}`);
                    setMapBounds(bounds);
                }
            }
        } catch (err) {
            console.error("Failed to load service areas", err);
        } finally {
            setLoading(false);
        }
    };

    if (!isClient) return null;

    // Default center (Melbourne) - only used if no areas found
    const defaultCenter: [number, number] = [-37.8136, 144.9631];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row h-[600px] relative">

                {/* Left Panel: Welcome Message */}
                <div className="w-full md:w-1/3 p-8 md:p-12 flex flex-col justify-center bg-white z-10 relative">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">WELCOME</h2>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Start building your dream home with Mimosa Homes today. Explore our V-Collection and customize your house to suit your needs. Create a personalized quote and let us help you bring your dream home to life.
                    </p>
                    <p className="text-gray-900 font-bold text-sm uppercase tracking-wider">
                        Begin by choosing your preferred build region
                    </p>
                </div>

                {/* Right Panel: Map */}
                <div className="w-full md:w-2/3 relative h-full bg-gray-100">
                    <MapContainer
                        center={defaultCenter}
                        zoom={9}
                        scrollWheelZoom={true}
                        style={{ height: "100%", width: "100%" }}
                        className="z-0"
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" // Using CartoDB Light for a cleaner look
                        />

                        <MapUpdater center={!mapBounds ? defaultCenter : undefined} bounds={mapBounds || undefined} />

                        {serviceAreas.map((area) => {
                            // Normalize coordinates for rendering
                            const normalizedPositions = area.coordinates.map((coord: any) => [
                                parseFloat(coord[0]),
                                ((parseFloat(coord[1]) + 180) % 360 + 360) % 360 - 180
                            ]);

                            return (
                                <Polygon
                                    key={area.id}
                                    positions={normalizedPositions}
                                    pathOptions={{
                                        color: '#18181b', // zinc-900 (black-ish)
                                        fillColor: '#c2c2e9ff',
                                        fillOpacity: 0.4,
                                        weight: 2
                                    }}
                                    eventHandlers={{
                                        click: () => onSelect(area),
                                        mouseover: (e) => {
                                            const layer = e.target;
                                            layer.setStyle({ fillOpacity: 0.7, weight: 3 });
                                        },
                                        mouseout: (e) => {
                                            const layer = e.target;
                                            layer.setStyle({ fillOpacity: 0.4, weight: 2 });
                                        },
                                    }}
                                >
                                    <Tooltip sticky direction="top" offset={[0, -10]} opacity={1}>
                                        <span className="font-bold text-sm">{area.name}</span>
                                    </Tooltip>
                                </Polygon>
                            );
                        })}
                    </MapContainer>

                    {/* Loading Overlay */}
                    {loading && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-[1000]">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
