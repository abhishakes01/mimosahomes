"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Car, Maximize, ArrowRight, Search, SlidersHorizontal, ChevronRight, ChevronLeft, Loader2, X } from "lucide-react"; // Added Loader2 and X
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
    collection?: 'V_Collection' | 'M_Collection';
}

interface Facade {
    id: string;
    title: string;
    image_url: string;
    floorplans?: FloorPlan[];
    width?: number; // Optional width for facade
}

// Listing interface removed as it's no longer used for this page's main data

// Main Content Component that uses searchParams
function NewHomeDesignsContent() {
    // State
    const [listings, setListings] = useState<FloorPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Navigation
    const searchParams = useSearchParams();
    const router = useRouter();

    // Filters State
    const [selectedCollection, setSelectedCollection] = useState<string | null>(searchParams.get('collections'));
    const [selectedStorey, setSelectedStorey] = useState<string[]>([]);
    const [selectedBeds, setSelectedBeds] = useState<number[]>([]);
    const [sizeRange, setSizeRange] = useState<[number, number]>([14, 60]);
    const [selectedWidth, setSelectedWidth] = useState<number | null>(null);
    const [sortBy, setSortBy] = useState("size-desc");
    const [searchTerm, setSearchTerm] = useState("");
    const [virtualTourOnly, setVirtualTourOnly] = useState(false);
    const [pageData, setPageData] = useState<any>(null);

    useEffect(() => {
        const fetchPageData = async () => {
            try {
                const data = await api.getPageBySlug('new-home-designs');
                setPageData(data);
            } catch (err) {
                console.error("Failed to fetch page data:", err);
            }
        };
        fetchPageData();
    }, []);

    // Sync from URL
    useEffect(() => {
        const collection = searchParams.get('collections');
        if (collection) {
            setSelectedCollection(collection);
        }

        const storeysParam = searchParams.get('storeys');
        if (storeysParam) {
            setSelectedStorey(storeysParam.split(','));
        }

        const bedsParam = searchParams.get('beds');
        if (bedsParam) {
            setSelectedBeds(bedsParam.split(',').map(Number));
        }

        const widthParam = searchParams.get('width');
        if (widthParam) {
            setSelectedWidth(Number(widthParam));
        }
    }, [searchParams]);

    // Update URL when collection changes
    const handleCollectionChange = (collection: string | null) => {
        setSelectedCollection(collection);
        const params = new URLSearchParams(searchParams.toString());
        if (collection) {
            params.set('collections', collection);
        } else {
            params.delete('collections');
        }
        router.push(`?${params.toString()}`, { scroll: false });
    };

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
                setError("Failed to load new home designs. Please try again.");
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
            linkedFacades: facades,
            collection: floorplan.collection
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

        // Collection Filter
        if (selectedCollection) {
            const mappedCollection = selectedCollection === 'v-collection' ? 'V_Collection' : 'M_Collection';
            if (home.collection !== mappedCollection) return false;
        }

        // Search Term Filter
        if (searchTerm && !home.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;

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
            <section className="relative h-[60vh] flex items-center overflow-hidden">
                <Image
                    src={getFullUrl(pageData?.content?.heroImage) || "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop"}
                    alt="New Home Designs"
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter italic leading-none mb-6">
                            New Home<br className="md:hidden" /> Designs
                        </h1>
                        <p className="text-xl text-white/80 font-medium max-w-xl italic mx-auto mt-6">
                            Explore our range of stunning <span className="text-[#0897b1] border-b-2 border-[#0897b1]">new home designs</span>.
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-[1440px] mx-auto pt-12 pb-24">
                {/* Filter Section */}
                <div className="container mx-auto px-4 mb-8">
                    <div className="bg-[#e5e7eb] rounded-xl shadow-sm p-6 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
                            {/* Left Side Filters */}
                            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Search and Virtual Tours */}
                                <div className="space-y-4">
                                    <div className="relative">
                                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Search</h3>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="text"
                                                placeholder="Search for 'Indigo'"
                                                className="w-full pl-10 pr-4 py-2 text-black bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0897b1]"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                </div>

                                {/* Placeholder for balance if needed */}
                                <div className="hidden md:block"></div>

                                {/* Storeys */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Storeys</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {["Single", "Double"].map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => toggleStorey(type)}
                                                className={`py-3 px-4 bg-white rounded-lg border transition-all flex flex-col items-center justify-center gap-2 ${selectedStorey.includes(type)
                                                    ? `border-[${PRIMARY_COLOR}] shadow-[0_0_0_2px_#0897b1]`
                                                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                                                    }`}
                                                style={{
                                                    borderColor: selectedStorey.includes(type) ? PRIMARY_COLOR : undefined,
                                                }}
                                            >
                                                {type === "Single" ? (
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                                                ) : (
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" /><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 5-2 2.5 2 4 2 1 1 1 1" /><path d="M2 21h20" /><path d="M7 8v5" /><path d="M17 8v5" /><path d="M7 4h10" /><path d="m3 11 9-7 9 7" /></svg>
                                                )}
                                                <span className="font-bold text-xs uppercase">{type}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Bedrooms */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Bedrooms</h3>
                                    <div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden divide-x divide-gray-200">
                                        {[3, 4, 5].map((num) => (
                                            <button
                                                key={num}
                                                onClick={() => toggleBeds(num)}
                                                className={`flex-1 py-3 transition-all ${selectedBeds.includes(num)
                                                    ? `bg-[${PRIMARY_COLOR}] text-white font-bold`
                                                    : "text-gray-600 hover:bg-gray-50"
                                                    }`}
                                                style={{
                                                    backgroundColor: selectedBeds.includes(num) ? PRIMARY_COLOR : undefined,
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
                                        <h3 className="text-sm font-semibold text-gray-900">Home Size ( sq )</h3>
                                    </div>
                                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                                        <div className="flex justify-between mb-2 text-[10px] font-bold uppercase text-gray-500">
                                            <span>Min <span className="text-[#0897b1] ml-2 font-black">{sizeRange[0]}sq</span></span>
                                            <span>Max <span className="text-[#0897b1] ml-2 font-black">{sizeRange[1]}sq</span></span>
                                        </div>
                                        <DoubleRangeSlider
                                            min={14}
                                            max={60}
                                            value={sizeRange}
                                            onChange={setSizeRange}
                                            primaryColor={PRIMARY_COLOR}
                                        />
                                    </div>
                                </div>

                                {/* Lot Width */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Lot Width (m)</h3>
                                    <div className="grid grid-cols-4 gap-2 bg-white p-4 rounded-lg border border-gray-200">
                                        {[8.5, 10, 10.5, 12, 12.5, 14, 16].map((width) => (
                                            <button
                                                key={width}
                                                onClick={() => setSelectedWidth(selectedWidth === width ? null : width)}
                                                className={`px-1 py-2 text-xs font-bold transition-all rounded ${selectedWidth === width
                                                    ? "bg-[#0897b1] text-white"
                                                    : "text-gray-600 hover:bg-gray-50"
                                                    }`}
                                            >
                                                {width}m
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Collections */}
                            <div className="lg:col-span-4 space-y-4">
                                <div className="flex items-baseline justify-between mb-2">
                                    <h3 className="text-sm font-semibold text-gray-900">Collections</h3>
                                    <button
                                        onClick={() => {
                                            setSelectedCollection(null);
                                            setSelectedStorey([]);
                                            setSelectedBeds([]);
                                            setSizeRange([14, 60]);
                                            setSelectedWidth(null);
                                            setSearchTerm("");
                                            setVirtualTourOnly(false);
                                            router.push('/new-home-designs');
                                        }}
                                        className="text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-[#0897b1] border-b border-gray-400 hover:border-[#0897b1] transition-all"
                                    >
                                        Clear All
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-4 h-[calc(100%-2rem)] min-h-[160px]">
                                    {/* V Collection */}
                                    <button
                                        onClick={() => handleCollectionChange(selectedCollection === 'v-collection' ? null : 'v-collection')}
                                        className={`group relative rounded-xl overflow-hidden border-2 transition-all ${selectedCollection === 'v-collection'
                                            ? "border-[#0897b1] shadow-lg scale-[1.02]"
                                            : "border-transparent opacity-90 hover:opacity-100"
                                            }`}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#0897b1] to-[#067a8e] flex flex-col items-center justify-center gap-2">
                                            <div className="relative w-12 h-12 border-2 border-white flex items-center justify-center transform rotate-45">
                                                <span className="text-white text-2xl font-black -rotate-45">V</span>
                                            </div>
                                            <span className="text-white text-[8px] font-black tracking-widest uppercase">Collection</span>
                                        </div>
                                    </button>

                                    {/* M Collection */}
                                    <button
                                        onClick={() => handleCollectionChange(selectedCollection === 'm-collection' ? null : 'm-collection')}
                                        className={`group relative rounded-xl overflow-hidden border-2 transition-all ${selectedCollection === 'm-collection'
                                            ? "border-[#0897b1] shadow-lg scale-[1.02]"
                                            : "border-transparent opacity-90 hover:opacity-100"
                                            }`}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#9ca3af] to-gray-500 flex flex-col items-center justify-center gap-2">
                                            <div className="relative w-12 h-12 border-2 border-white flex items-center justify-center">
                                                <span className="text-white text-2xl font-black">M</span>
                                            </div>
                                            <span className="text-white text-[8px] font-black tracking-widest uppercase">Collection</span>
                                        </div>
                                    </button>
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

export default function DisplayHomes() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-[#0897b1] animate-spin" />
            </div>
        }>
            <NewHomeDesignsContent />
        </Suspense>
    );
}
