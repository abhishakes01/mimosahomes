"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Car, Maximize, ArrowRight, Search, SlidersHorizontal, ChevronRight, ChevronLeft, Loader2 } from "lucide-react"; // Added Loader2
import { motion, AnimatePresence } from "framer-motion";
import { api, getFullUrl } from "../../services/api"; // Import API
import DisplayHomeRow from "@/components/DisplayHomeRow";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DoubleRangeSlider from "@/components/DoubleRangeSlider";

// Type definitions based on backend models
interface FloorPlan {
    id: string;
    title: string;
    image_url: string;
    total_area: string | number;
    stories: number;
    bedrooms: number;
    bathrooms: number;
    car_spaces: number;
    min_frontage: string | number;
    ground_floor_area?: string | number;
    first_floor_area?: string | number;
    facades?: Facade[];
    price?: string | number;
}

interface Facade {
    id: string;
    title: string;
    image_url: string;
    floorplans?: FloorPlan[];
    width?: number; // Optional width for facade
}

// Listing interface removed as it's no longer used for this page's main data

export default function DisplayHomes() {
    // State
    const [listings, setListings] = useState<FloorPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters State
    const [selectedStorey, setSelectedStorey] = useState<string[]>([]);
    const [selectedBeds, setSelectedBeds] = useState<number[]>([]);
    const [sizeRange, setSizeRange] = useState<[number, number]>([14, 60]);
    const [selectedWidth, setSelectedWidth] = useState<number | null>(null);
    const [sortBy, setSortBy] = useState("size-desc");

    // Fetch Data
    useEffect(() => {
        const fetchListings = async () => {
            try {
                setLoading(true);
                // Fetch ALL floor plans (limit 100 for now to "show all")
                const response: any = await api.getFloorPlans({ limit: 100 });

                // Handle data
                const data = response.data || [];
                setListings(data);
            } catch (err: any) {
                console.error("Failed to fetch floor plans:", err);
                setError("Failed to load display homes. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, []);

    // Helper to get formatted data
    const getListingData = (listing: FloorPlan) => {
        // "listing" is now a FloorPlan object
        const floorplan = listing;

        const name = floorplan.title;
        const size = floorplan.total_area || 0;
        const sqm = floorplan.total_area ? Number(floorplan.total_area) : 0;
        // Convert to squares approx if needed, but UI seems to use 'sq' as squares (~9.29m2) OR just raw sqm depending on region.
        // Typically in Aus: 1 square = 9.29 sqm.
        // If total_area is 400 sqm -> ~43 squares.

        // Storeys: 1 -> Single, >1 -> Double
        const storeys = floorplan.stories === 1 ? "Single" : "Double";

        const beds = floorplan.bedrooms || 0;
        const baths = floorplan.bathrooms || 0;
        const cars = floorplan.car_spaces || 0;
        const width = floorplan.min_frontage ? Number(floorplan.min_frontage) : 0;

        // Price isn't always on floorplan, but if it is:
        const price = floorplan.price
            ? (typeof floorplan.price === 'number' ? `$${floorplan.price.toLocaleString()}` : `$${floorplan.price}`)
            : "TBA";

        // Facades
        const facades = floorplan.facades || [];

        // Image logic: Use first facade if available, else floorplan image ?? metadata?
        // Actually, usually we want a facade image as the main "Hero".
        // If no facades, fallback to a placeholder or floorplan image?
        // User asked: "where you render he home image will render all the availbel facade for that floor plan"

        const firstFacade = facades[0];
        const facadeImage = firstFacade?.image_url
            ? getFullUrl(firstFacade.image_url)
            : "/placeholder-home.jpg";

        const facadeImageRaw = firstFacade?.image_url;

        // Floorplan image
        const floorplanImage = floorplan.image_url ? getFullUrl(floorplan.image_url) : null;

        // Linked facades - essentially ALL facades attached to this floorplan
        const linkedFacades = facades;

        return {
            id: floorplan.id,
            name,
            size, // Raw value from DB
            sqm,
            storeys,
            beds,
            baths,
            cars,
            width,
            price,
            facadeImage,
            facadeImageRaw,
            floorplanImage,
            linkedFacades
        };
    };

    // Filter Logic... (unchanged)
    const toggleStorey = (storey: string) => {
        setSelectedStorey(prev =>
            prev.includes(storey) ? prev.filter(s => s !== storey) : [...prev, storey]
        );
    };

    const toggleBeds = (beds: number) => {
        setSelectedBeds(prev =>
            prev.includes(beds) ? prev.filter(b => b !== beds) : [...prev, beds]
        );
    };

    const filteredHomes = listings.map(getListingData).filter(home => {
        if (selectedStorey.length > 0 && !selectedStorey.includes(home.storeys)) return false;
        if (selectedBeds.length > 0 && !selectedBeds.includes(home.beds)) return false;

        // Size Range Logic: Assuming slider is for Squares (e.g. 14sq - 60sq)
        // Convert homesize (sqm) to squares for comparison: sqm / 9.29
        const homeSquares = home.sqm / 9.29;
        if (homeSquares < sizeRange[0] || homeSquares > sizeRange[1]) return false;

        if (selectedWidth && home.width < selectedWidth) return false; // Min width check usually

        return true;
    }).sort((a, b) => {
        if (sortBy === "size-desc") return b.sqm - a.sqm;
        if (sortBy === "size-asc") return a.sqm - b.sqm;
        return 0;
    });

    const PRIMARY_COLOR = "#0897b1";

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-gray-400" size={48} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col gap-4">
                <p className="text-red-500 font-medium">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Header */}
            <Header />

            {/* Banner Section */}
            <div className="relative h-[40vh] min-h-[300px] flex items-center justify-center bg-gray-900 overflow-hidden">
                <Image
                    src="/images/hero-bg.jpg" // You might want to use a specific generic banner image here, or the same as home
                    alt="Display Homes"
                    fill
                    className="object-cover opacity-50"
                    priority
                />
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Display Homes</h1>
                    <p className="text-lg text-gray-200 max-w-2xl mx-auto">
                        Explore our range of stunning display homes across Melbourne.
                    </p>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto pt-12 pb-24">
                {/* Filter Section */}
                <div className="container mx-auto px-4 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                            {/* Storeys */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-4">Storeys</h3>
                                <div className="flex gap-4">
                                    {["Single", "Double"].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => toggleStorey(type)}
                                            className={`flex-1 py-3 px-4 rounded-lg border transition-all flex flex-col items-center justify-center gap-2 ${selectedStorey.includes(type)
                                                ? `bg-[${PRIMARY_COLOR}]/10 border-[${PRIMARY_COLOR}] text-[${PRIMARY_COLOR}] font-medium`
                                                : "border-gray-200 text-gray-600 hover:border-gray-300"
                                                }`}
                                            style={{
                                                backgroundColor: selectedStorey.includes(type) ? `${PRIMARY_COLOR}15` : undefined,
                                                borderColor: selectedStorey.includes(type) ? PRIMARY_COLOR : undefined,
                                                color: selectedStorey.includes(type) ? PRIMARY_COLOR : undefined
                                            }}
                                        >
                                            {/* Simple SVG Icons for House Types */}
                                            {type === "Single" ? (
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                                            ) : (
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" /><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 5-2 2.5 2 4 2 1 1 1 1" /><path d="M2 21h20" /><path d="M7 8v5" /><path d="M17 8v5" /><path d="M7 4h10" /><path d="m3 11 9-7 9 7" /></svg>
                                            )}
                                            <span>{type}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Bedrooms */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-4">Bedrooms</h3>
                                <div className="flex gap-2">
                                    {[3, 4, 5].map((num) => (
                                        <button
                                            key={num}
                                            onClick={() => toggleBeds(num)}
                                            className={`flex-1 py-3 rounded-lg border transition-all ${selectedBeds.includes(num)
                                                ? `font-medium`
                                                : "border-gray-200 text-gray-600 hover:border-gray-300"
                                                }`}
                                            style={{
                                                backgroundColor: selectedBeds.includes(num) ? `${PRIMARY_COLOR}15` : undefined,
                                                borderColor: selectedBeds.includes(num) ? PRIMARY_COLOR : undefined,
                                                color: selectedBeds.includes(num) ? PRIMARY_COLOR : undefined
                                            }}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Home Size */}
                            <div>
                                <div className="flex justify-between mb-4">
                                    <h3 className="text-sm font-semibold text-gray-900">Home Size (sq)</h3>
                                </div>
                                <div className="px-2 pt-2">
                                    <DoubleRangeSlider
                                        min={14}
                                        max={60}
                                        value={sizeRange}
                                        onChange={setSizeRange}
                                        primaryColor={PRIMARY_COLOR}
                                    />
                                    <div className="flex justify-between mt-3 text-xs font-medium text-gray-500">
                                        <span>{sizeRange[0]}sq</span>
                                        <span>{sizeRange[1]}sq</span>
                                    </div>
                                </div>
                            </div>

                            {/* Lot Width */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-4">Lot Width (m)</h3>
                                <div className="flex flex-wrap gap-2">
                                    {[8.5, 10, 10.5, 12, 12.5, 14, 16].map((width) => (
                                        <button
                                            key={width}
                                            onClick={() => setSelectedWidth(selectedWidth === width ? null : width)}
                                            className={`px-3 py-1.5 text-sm rounded-md border transition-all ${selectedWidth === width
                                                ? "font-medium"
                                                : "border-gray-200 text-gray-600 hover:border-gray-300"
                                                }`}
                                            style={{
                                                backgroundColor: selectedWidth === width ? `${PRIMARY_COLOR}15` : undefined,
                                                borderColor: selectedWidth === width ? PRIMARY_COLOR : undefined,
                                                color: selectedWidth === width ? PRIMARY_COLOR : undefined
                                            }}
                                        >
                                            {width}m
                                        </button>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Sorting */}
                <div className="container mx-auto px-4 mb-6 flex justify-end">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-600">Sort By:</span>
                        <select
                            className="text-sm border-gray-200 rounded-md py-1.5 pl-3 pr-8 focus:ring-0 focus:border-gray-300"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="size-desc">House Size (Large - Small)</option>
                            <option value="size-asc">House Size (Small - Large)</option>
                        </select>
                    </div>
                </div>

                {/* Listings */}
                <div className="container mx-auto px-4 space-y-6">
                    {filteredHomes.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No display homes found matching your criteria.
                        </div>
                    ) : (
                        filteredHomes.map((home) => (
                            <DisplayHomeRow key={home.id} home={home} primaryColor={PRIMARY_COLOR} />
                        ))
                    )}
                </div>
            </div>

            <Footer />
        </main >
    );
}
