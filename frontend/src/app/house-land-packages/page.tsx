"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Loader2, Grid as GridIcon, Map as MapIcon, ChevronDown, Bed, Bath, Car, Maximize, SlidersHorizontal, X, ChevronRight, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { api, getFullUrl } from "@/services/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReadyBuiltCard from "@/components/ReadyBuiltCard";

// Main Content Component that uses searchParams
function HouseLandPackagesContent() {
    const searchParams = useSearchParams();
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters State
    const [collection, setCollection] = useState<string | null>(null);
    const [beds, setBeds] = useState<string | null>(null);
    const [baths, setBaths] = useState<string | null>(null);
    const [priceRange, setPriceRange] = useState(1500000);
    const [lotSizeRange, setLotSizeRange] = useState(1000);
    const [houseSizeRange, setHouseSizeRange] = useState(500);
    const [selectedSuburbs, setSelectedSuburbs] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState("Recently Added");
    const [pageData, setPageData] = useState<any>(null);

    useEffect(() => {
        const fetchPageData = async () => {
            try {
                const data = await api.getPageBySlug('house-land-packages');
                setPageData(data);
            } catch (err) {
                console.error("Failed to fetch page data:", err);
            }
        };
        fetchPageData();
    }, []);

    const suburbs = Array.from(new Set(listings.map(l => {
        const parts = l.address?.split(',');
        return parts && parts.length >= 2 ? parts[1].trim() : null;
    }).filter(Boolean))) as string[];

    // Sync from URL
    useEffect(() => {
        const collectionParam = searchParams.get('collection');
        if (collectionParam) setCollection(collectionParam);

        const bedsParam = searchParams.get('beds');
        if (bedsParam) setBeds(bedsParam);

        const bathsParam = searchParams.get('baths');
        if (bathsParam) setBaths(bathsParam);

        const priceParam = searchParams.get('price');
        if (priceParam) setPriceRange(parseInt(priceParam));

        const lotSizeParam = searchParams.get('lotSize');
        if (lotSizeParam) setLotSizeRange(parseInt(lotSizeParam));

        const houseSizeParam = searchParams.get('houseSize');
        if (houseSizeParam) setHouseSizeRange(parseInt(houseSizeParam));
    }, [searchParams]);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                setLoading(true);
                const response: any = await api.getListings({ type: 'house_land', limit: 100 });
                setListings(response.data || []);
            } catch (err) {
                console.error("Failed to fetch packages:", err);
                setError("Failed to load packages.");
            } finally {
                setLoading(false);
            }
        };
        fetchPackages();
    }, []);

    const filteredListings = listings.filter(item => {
        if (collection && item.collection !== collection) return false;
        if (beds && beds !== '5+') {
            if (item.floorplan?.bedrooms !== parseInt(beds)) return false;
        } else if (beds === '5+') {
            if ((item.floorplan?.bedrooms || 0) < 5) return false;
        }
        if (baths && item.floorplan?.bathrooms !== parseInt(baths)) return false;
        if (item.price > priceRange) return false;
        if (item.land_size > lotSizeRange) return false;
        if (item.building_size > houseSizeRange) return false;

        if (selectedSuburbs.length > 0) {
            const suburb = item.address?.split(',')[1]?.trim();
            if (!selectedSuburbs.includes(suburb)) return false;
        }

        return true;
    }).sort((a, b) => {
        if (sortBy === "Price (Low to High)") return (a.price || 0) - (b.price || 0);
        if (sortBy === "Price (High to Low)") return (b.price || 0) - (a.price || 0);
        return 0; // Default: Recently Added (already sorted by API usually)
    });

    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
                <Image
                    src={getFullUrl(pageData?.content?.heroImage) || "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop"}
                    alt="House & Land Packages"
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter italic leading-none mb-4"
                    >
                        House and Land <br className="hidden md:block" /> Packages
                    </motion.h1>
                    <div className="w-24 h-1 bg-[#0897b1] mx-auto rounded-full" />
                </div>
            </section>

            <div className="container mx-auto px-6 py-12">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Sidebar Filters - Placeholder */}
                    <aside className="w-full lg:w-[320px] shrink-0 space-y-8">
                        <div className="bg-gray-50 rounded-[32px] p-8 border border-gray-100 shadow-sm sticky top-32">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-black text-[#1a3a4a] uppercase italic">Filters</h2>
                                <button className="text-[10px] font-black uppercase tracking-widest text-[#0897b1] hover:underline">Clear All</button>
                            </div>

                            {/* Collection Toggle */}
                            <div className="space-y-4 mb-8">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Collection</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setCollection(collection === 'V_Collection' ? null : 'V_Collection')}
                                        className={`py-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${collection === 'V_Collection' ? 'border-[#0897b1] bg-white shadow-lg' : 'border-gray-200 bg-transparent opacity-50'}`}
                                    >
                                        <div className="w-8 h-8 relative">
                                            <Image src="/v-logo.png" alt="V" fill className="object-contain" />
                                        </div>
                                        <span className="text-[10px] font-black">V COLLECTION</span>
                                    </button>
                                    <button
                                        onClick={() => setCollection(collection === 'M_Collection' ? null : 'M_Collection')}
                                        className={`py-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${collection === 'M_Collection' ? 'border-[#0897b1] bg-white shadow-lg' : 'border-gray-200 bg-transparent opacity-50'}`}
                                    >
                                        <div className="w-8 h-8 relative">
                                            <Image src="/m-logo.png" alt="M" fill className="object-contain" />
                                        </div>
                                        <span className="text-[10px] font-black">M COLLECTION</span>
                                    </button>
                                </div>
                            </div>

                            {/* Beds / Baths */}
                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Beds</label>
                                    <div className="flex items-center gap-2">
                                        {[3, 4, '5+'].map(num => (
                                            <button
                                                key={String(num)}
                                                onClick={() => setBeds(beds === String(num) ? null : String(num))}
                                                className={`w-10 h-10 rounded-lg border-2 font-bold text-xs transition-all ${beds === String(num) ? 'border-[#0897b1] bg-[#0897b1] text-white' : 'border-gray-200 text-gray-400'}`}
                                            >
                                                {num}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Baths</label>
                                    <div className="flex items-center gap-2">
                                        {[2, 3].map(num => (
                                            <button
                                                key={num}
                                                onClick={() => setBaths(baths === String(num) ? null : String(num))}
                                                className={`w-10 h-10 rounded-lg border-2 font-bold text-xs transition-all ${baths === String(num) ? 'border-[#0897b1] bg-[#0897b1] text-white' : 'border-gray-200 text-gray-400'}`}
                                            >
                                                {num}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* House Size Slider */}
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">House Size (sq)</label>
                                    <span className="text-xs font-bold text-[#1a3a4a]">Up to {houseSizeRange}m²</span>
                                </div>
                                <input
                                    type="range"
                                    min="100"
                                    max="500"
                                    value={houseSizeRange}
                                    onChange={(e) => setHouseSizeRange(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0897b1]"
                                />
                                <div className="flex justify-between text-[8px] font-black text-gray-300 uppercase tracking-widest">
                                    <span>100m²</span>
                                    <span>500m²</span>
                                </div>
                            </div>

                            {/* Lot Size Slider */}
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Lot Size (sq)</label>
                                    <span className="text-xs font-bold text-[#1a3a4a]">Up to {lotSizeRange}m²</span>
                                </div>
                                <input
                                    type="range"
                                    min="200"
                                    max="1000"
                                    value={lotSizeRange}
                                    onChange={(e) => setLotSizeRange(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0897b1]"
                                />
                                <div className="flex justify-between text-[8px] font-black text-gray-300 uppercase tracking-widest">
                                    <span>200m²</span>
                                    <span>1000m²</span>
                                </div>
                            </div>

                            {/* Price Slider */}
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Price</label>
                                    <span className="text-xs font-bold text-[#1a3a4a]">Max ${priceRange.toLocaleString()}</span>
                                </div>
                                <input
                                    type="range"
                                    min="400000"
                                    max="2000000"
                                    step="10000"
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0897b1]"
                                />
                                <div className="flex justify-between text-[8px] font-black text-gray-300 uppercase tracking-widest">
                                    <span>$400k</span>
                                    <span>$2m</span>
                                </div>
                            </div>

                            {/* Region / Suburb */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Region</label>
                                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                    {suburbs.map(suburb => (
                                        <label key={suburb} className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={selectedSuburbs.includes(suburb)}
                                                onChange={(e) => {
                                                    if (e.target.checked) setSelectedSuburbs([...selectedSuburbs, suburb]);
                                                    else setSelectedSuburbs(selectedSuburbs.filter(s => s !== suburb));
                                                }}
                                                className="w-4 h-4 rounded border-2 border-gray-200 text-[#0897b1] focus:ring-[#0897b1] transition-all"
                                            />
                                            <span className="text-[11px] font-bold text-gray-500 group-hover:text-[#1a3a4a] transition-all uppercase">{suburb}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-grow">
                        {/* Toolbar */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                            <h2 className="text-xl font-black text-[#1a3a4a] italic uppercase tracking-tighter">
                                {filteredListings.length} Packages Found
                            </h2>
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sort By</span>
                                <select
                                    className="bg-white border-2 border-gray-100 rounded-xl px-4 py-2 text-sm font-bold text-[#1a3a4a] outline-none focus:border-[#0897b1] transition-all"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option>Recently Added</option>
                                    <option>Price (Low to High)</option>
                                    <option>Price (High to Low)</option>
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-24">
                                <Loader2 className="animate-spin text-[#0897b1] mb-4" size={48} />
                                <p className="text-gray-400 font-black uppercase tracking-widest italic text-sm">Fetching Packages...</p>
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 p-12 rounded-[32px] text-center border-2 border-dashed border-red-100">
                                <p className="text-red-500 font-bold italic">{error}</p>
                            </div>
                        ) : filteredListings.length === 0 ? (
                            <div className="bg-gray-50 p-24 rounded-[32px] text-center border-2 border-dashed border-gray-200">
                                <p className="text-gray-400 font-bold italic">No packages found matching your criteria.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-12">
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {filteredListings.map((listing) => (
                                        <ReadyBuiltCard key={listing.id} listing={listing} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                <div className="flex items-center justify-center gap-2 pt-12">
                                    <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all">
                                        <ChevronLeft size={20} />
                                    </button>
                                    {[1, 2, 3, 4, 5].map(page => (
                                        <button
                                            key={page}
                                            className={`w-10 h-10 rounded-full text-xs font-black transition-all ${page === 1 ? 'bg-[#1a3a4a] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-100'}`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <span className="text-gray-300 font-bold px-2">...</span>
                                    <button className="w-10 h-10 rounded-full text-xs font-black text-gray-400 hover:bg-gray-100">99</button>
                                    <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all">
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            <Footer />
        </main>
    );
}

export default function HouseLandPackagesPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-[#0897b1] animate-spin" />
            </div>
        }>
            <HouseLandPackagesContent />
        </Suspense>
    );
}
