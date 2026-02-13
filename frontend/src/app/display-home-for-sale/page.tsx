"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Search, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/services/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReadyBuiltCard from "@/components/ReadyBuiltCard";
import DoubleRangeSlider from "@/components/DoubleRangeSlider";

export default function ReadyBuiltPage() {
    // State
    const [isMounted, setIsMounted] = useState(false);
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Filters State
    const [collection, setCollection] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [storeys, setStoreys] = useState<number | null>(null);
    const [bedrooms, setBedrooms] = useState<number[]>([]);
    const [sizeRange, setSizeRange] = useState<[number, number]>([14, 60]);
    const [lotRange, setLotRange] = useState<[number, number]>([250, 800]);
    const [priceRange, setPriceRange] = useState<[number, number]>([450000, 1200000]);
    const [regions, setRegions] = useState<string[]>([]);

    const fetchListings = async () => {
        try {
            setLoading(true);
            const params: any = {
                type: 'ready_built',
                page,
                limit: 9,
            };

            if (collection) params.collection = collection;
            if (storeys) params.storeys = storeys;
            // The current backend getAllListings supports type, collection, min_price, max_price, beds
            if (priceRange[0] > 450000) params.min_price = priceRange[0];
            if (priceRange[1] < 1200000) params.max_price = priceRange[1];
            if (bedrooms.length > 0) params.beds = Math.min(...bedrooms); // Backend uses beds >= min

            const response: any = await api.getListings(params);
            setListings(response.data || []);
            setTotal(response.total || 0);
            setTotalPages(response.totalPages || 1);
        } catch (err: any) {
            console.error("Failed to fetch listings:", err);
            setError("Failed to load listings. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setIsMounted(true);
        fetchListings();
    }, [page, collection, storeys, bedrooms, priceRange]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchListings();
    };

    const toggleBedrooms = (num: number) => {
        setBedrooms(prev =>
            prev.includes(num) ? prev.filter(b => b !== num) : [...prev, num]
        );
    };

    const toggleRegion = (reg: string) => {
        setRegions(prev =>
            prev.includes(reg) ? prev.filter(r => r !== reg) : [...prev, reg]
        );
    };

    const clearFilters = () => {
        setCollection(null);
        setSearch("");
        setStoreys(null);
        setBedrooms([]);
        setSizeRange([14, 60]);
        setLotRange([250, 800]);
        setPriceRange([450000, 1200000]);
        setRegions([]);
        setPage(1);
    };

    const PRIMARY_COLOR = "#0897b1";

    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="relative h-[45vh] flex items-center justify-center overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop"
                    alt="Ready Built Homes"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 text-center text-white px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-7xl font-extrabold uppercase tracking-tight italic"
                    >
                        READY BUILT HOMES FOR SALE
                    </motion.h1>
                </div>

                {/* Breadcrumbs */}
                <div className="absolute bottom-8 left-8 z-10 hidden md:flex items-center gap-2 text-white/80 text-xs font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-1">
                        <img src="/icon.png" alt="Mimosa" className="w-4 h-4 invert brightness-0" />
                        <span className="ml-1 tracking-[0.2em]">MIMOSA</span>
                    </div>
                    <ChevronRight size={14} className="text-mimosa-gold" />
                    <span className="text-white">READY BUILT HOMES FOR SALE</span>
                </div>
            </section>

            <section className="py-20 bg-gray-50/30">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row gap-12">

                        {/* Sidebar Filters */}
                        <div className="lg:w-[320px] flex-shrink-0 space-y-10">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 italic">Collections</h3>
                                <button onClick={clearFilters} className="text-[10px] font-bold text-mimosa-gold uppercase tracking-widest border-b border-mimosa-gold/30 hover:border-mimosa-gold transition-colors">Clear All</button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setCollection("V_Collection")}
                                    className={`aspect-square flex flex-col items-center justify-center rounded-xl border-2 transition-all group ${collection === "V_Collection" ? "bg-mimosa-gold border-mimosa-gold" : "bg-white border-gray-100 hover:border-mimosa-gold/30"}`}
                                >
                                    <div className={`text-4xl font-black italic ${collection === "V_Collection" ? "text-white" : "text-mimosa-gold"}`}>V</div>
                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${collection === "V_Collection" ? "text-white/80" : "text-gray-400"}`}>Collection</span>
                                </button>
                                <button
                                    onClick={() => setCollection("M_Collection")}
                                    className={`aspect-square flex flex-col items-center justify-center rounded-xl border-2 transition-all group ${collection === "M_Collection" ? "bg-gray-400 border-gray-400" : "bg-white border-gray-100 hover:border-gray-400/30"}`}
                                >
                                    <div className={`text-4xl font-black italic ${collection === "M_Collection" ? "text-white" : "text-gray-400"}`}>M</div>
                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${collection === "M_Collection" ? "text-white/80" : "text-gray-400"}`}>Collection</span>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-900 italic">Search By Suburb or Estate</h3>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search for an estate, suburb or house design"
                                        className="w-full bg-white border border-gray-100 rounded-lg px-4 py-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-mimosa-gold/20 transition-all text-gray-800 placeholder:text-gray-300"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-900 italic">Storeys</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setStoreys(1)}
                                        className={`py-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${storeys === 1 ? "bg-mimosa-gold/5 border-mimosa-gold text-mimosa-gold" : "bg-white border-gray-100 text-gray-400 hover:border-mimosa-gold/30"}`}
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                                        <span className="text-[10px] font-black uppercase tracking-widest">Single</span>
                                    </button>
                                    <button
                                        onClick={() => setStoreys(2)}
                                        className={`py-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${storeys === 2 ? "bg-mimosa-gold/5 border-mimosa-gold text-mimosa-gold" : "bg-white border-gray-100 text-gray-400 hover:border-mimosa-gold/30"}`}
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" /><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 5-2 2.5 2 4 2 1 1 1 1" /><path d="M2 21h20" /><path d="M7 8v5" /><path d="M17 8v5" /><path d="M7 4h10" /><path d="m3 11 9-7 9 7" /></svg>
                                        <span className="text-[10px] font-black uppercase tracking-widest">Double</span>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-900 italic">Bedrooms</h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {[3, 4, 5].map((num) => (
                                        <button
                                            key={num}
                                            onClick={() => toggleBedrooms(num)}
                                            className={`py-3 rounded-lg border-2 transition-all text-sm font-black italic ${bedrooms.includes(num) ? "bg-mimosa-gold/5 border-mimosa-gold text-mimosa-gold" : "bg-white border-gray-100 text-gray-400 hover:border-mimosa-gold/30"}`}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-900 italic">Home Size ( sq )</h3>
                                <DoubleRangeSlider min={14} max={60} value={sizeRange} onChange={setSizeRange} primaryColor={PRIMARY_COLOR} />
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-mimosa-gold">
                                    <span>{sizeRange[0]}sq</span>
                                    <span>{sizeRange[1]}sq</span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-900 italic">Lot Size ( m2 )</h3>
                                <DoubleRangeSlider min={250} max={800} value={lotRange} onChange={setLotRange} primaryColor={PRIMARY_COLOR} />
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-mimosa-gold">
                                    <span>{lotRange[0]}m2</span>
                                    <span>{lotRange[1]}m2</span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-900 italic">Price</h3>
                                <DoubleRangeSlider min={450000} max={1200000} value={priceRange} onChange={setPriceRange} primaryColor={PRIMARY_COLOR} />
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-mimosa-gold">
                                    <span>${isMounted ? priceRange[0].toLocaleString() : priceRange[0]}</span>
                                    <span>${isMounted ? priceRange[1].toLocaleString() : priceRange[1]}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-900 italic">Region</h3>
                                <div className="space-y-3">
                                    {["West", "North", "Geelong", "South East"].map((reg) => (
                                        <label key={reg} className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 accent-mimosa-gold border-gray-200 rounded"
                                                checked={regions.includes(reg)}
                                                onChange={() => toggleRegion(reg)}
                                            />
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-mimosa-gold transition-colors">{reg}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Main Grid Area */}
                        <div className="flex-grow space-y-12">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-40 gap-4">
                                    <Loader2 className="animate-spin text-mimosa-gold" size={40} />
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Loading Ready Built Homes...</p>
                                </div>
                            ) : error ? (
                                <div className="text-center py-40 space-y-6">
                                    <p className="text-red-500 font-bold italic">{error}</p>
                                    <button onClick={fetchListings} className="px-8 py-3 bg-[#005a8f] text-white rounded-lg font-black uppercase text-xs tracking-widest">Retry</button>
                                </div>
                            ) : listings.length === 0 ? (
                                <div className="text-center py-40 border-2 border-dashed border-gray-100 rounded-3xl">
                                    <p className="text-gray-400 font-black uppercase text-xs tracking-widest">No matching homes found</p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                                        {listings.map((item) => (
                                            <ReadyBuiltCard key={item.id} listing={item} />
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex items-center justify-center gap-4 pt-12">
                                            {Array.from({ length: totalPages }).map((_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setPage(i + 1)}
                                                    className={`w-10 h-10 rounded-lg font-black transition-all ${page === i + 1 ? "bg-mimosa-gold text-white shadow-lg shadow-mimosa-gold/20" : "bg-white text-gray-400 border border-gray-100 hover:border-mimosa-gold/30"}`}
                                                >
                                                    {i + 1}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
