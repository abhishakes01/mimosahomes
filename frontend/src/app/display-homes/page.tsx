"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Loader2, Map as MapIcon, Grid, Phone, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { api, getFullUrl } from "@/services/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DisplayHomeCard from "@/components/DisplayHomeCard";

// Dynamically import map to avoid SSR issues with Leaflet
const DisplayHomesMap = dynamic(() => import("@/components/DisplayHomesMap"), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-100 animate-pulse rounded-[32px] flex items-center justify-center text-gray-400 font-bold uppercase tracking-widest italic">Loading Map...</div>
});

const REGIONS = ["Any", "North", "South", "East", "West", "Melbourne North", "Melbourne West"];
const STOREYS = ["Any", "Single", "Double"];
const BEDS = ["Any", "3", "4", "5+"];

const OFFICE_DATA = {
    id: 'office',
    title: 'Mitra Homes Head Office',
    address: '123 Elgar Road, Derrimut, VIC, 3026',
    agent_phone: '1300 646 672',
    latitude: -37.8483, // Approximate for Derrimut
    longitude: 144.7794,
};

export default function DisplayHomesPage() {
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<"map" | "grid">("map");

    // Filters
    const [region, setRegion] = useState("Any");
    const [storey, setStorey] = useState("Any");
    const [beds, setBeds] = useState("Any");
    const [houseDesign, setHouseDesign] = useState("Any");
    const [designs, setDesigns] = useState<any[]>([]);
    const [pageData, setPageData] = useState<any>(null);

    useEffect(() => {
        const fetchPageData = async () => {
            try {
                const data = await api.getPageBySlug('display-homes');
                setPageData(data);
            } catch (err) {
                console.error("Failed to fetch page data:", err);
            }
        };
        fetchPageData();
    }, []);

    useEffect(() => {
        const fetchLevelData = async () => {
            try {
                const floorplans: any = await api.getFloorPlans({ limit: 100 });
                setDesigns(floorplans.data || []);
            } catch (e) { console.error(e); }
        };
        fetchLevelData();
    }, []);

    useEffect(() => {
        const fetchDisplayHomes = async () => {
            try {
                setLoading(true);
                // Fetch listings classified as display_home
                const response: any = await api.getListings({ type: 'display_home', limit: 100 });
                setListings(response.data || []);
            } catch (err: any) {
                console.error("Failed to fetch display homes:", err);
                setError("Failed to load display homes. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchDisplayHomes();
    }, []);

    const filteredListings = listings.filter(item => {
        if (region !== "Any" && !item.address.toLowerCase().includes(region.toLowerCase())) {
            return false;
        }
        if (storey !== "Any") {
            const storeyNum = storey === "Single" ? 1 : 2;
            if (item.floorplan?.stories !== storeyNum) return false;
        }
        if (beds !== "Any") {
            const bedsNum = parseInt(beds);
            if (beds === "5+") {
                if ((item.floorplan?.bedrooms || 0) < 5) return false;
            } else {
                if (item.floorplan?.bedrooms !== bedsNum) return false;
            }
        }
        if (houseDesign !== "Any" && item.floorplan?.id !== houseDesign) {
            return false;
        }
        return true;
    });

    const allItems = [OFFICE_DATA, ...filteredListings];

    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center overflow-hidden">
                <Image
                    src={getFullUrl(pageData?.content?.heroImage) || "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop"}
                    alt="Display Homes"
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
                            Display<br className="md:hidden" /> Homes
                        </h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-white/80 font-medium max-w-xl italic mx-auto mt-6"
                        >
                            Want to see some of our <span className="text-[#0897b1] border-b-2 border-[#0897b1]">new homes</span> in real life?
                            Then why not come and visit us at one of our display homes around Melbourne.
                        </motion.p>
                    </motion.div>
                </div>

                {/* Breadcrumbs */}
                <div className="absolute bottom-8 left-8 z-10 hidden md:flex items-center gap-2 text-white/80 text-xs font-bold uppercase tracking-widest">
                    <Link href="/" className="hover:text-white transition-colors">Mitra Homes</Link>
                    <ChevronRight size={14} className="text-[#0897b1]" />
                    <span className="text-white">Display Homes</span>
                </div>
            </section>

            {/* Filter Section */}
            <section className="relative z-20 -mt-16 container mx-auto px-6">
                <div className="bg-[#f1f5f9] rounded-[32px] p-8 md:p-12 shadow-2xl border border-white/50">
                    <div className="flex flex-col md:flex-row items-end gap-8">
                        <div className="flex-grow grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#1a3a4a]">Region</label>
                                <select
                                    className="w-full bg-white border-2 border-transparent focus:border-[#0897b1] rounded-xl px-4 py-3 text-sm font-bold text-[#1a3a4a] outline-none transition-all shadow-sm"
                                    value={region}
                                    onChange={(e) => setRegion(e.target.value)}
                                >
                                    {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#1a3a4a]">Storeys</label>
                                <select
                                    className="w-full bg-white border-2 border-transparent focus:border-[#0897b1] rounded-xl px-4 py-3 text-sm font-bold text-[#1a3a4a] outline-none transition-all shadow-sm"
                                    value={storey}
                                    onChange={(e) => setStorey(e.target.value)}
                                >
                                    {STOREYS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#1a3a4a]">House Design</label>
                                <select
                                    className="w-full bg-white border-2 border-transparent focus:border-[#0897b1] rounded-xl px-4 py-3 text-sm font-bold text-[#1a3a4a] outline-none transition-all shadow-sm"
                                    value={houseDesign}
                                    onChange={(e) => setHouseDesign(e.target.value)}
                                >
                                    <option value="Any">Any</option>
                                    {designs.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => { setRegion("Any"); setStorey("Any"); setBeds("Any"); setHouseDesign("Any"); }}
                                className="px-8 py-4 rounded-xl border-2 border-[#0897b1] text-[#0897b1] text-[11px] font-black uppercase tracking-widest hover:bg-[#0897b1] hover:text-white transition-all shadow-lg shadow-[#0897b1]/10"
                            >
                                Reset
                            </button>
                            <button className="px-8 py-4 rounded-xl bg-[#0897b1] text-white text-[11px] font-black uppercase tracking-widest hover:bg-[#07859c] transition-all shadow-lg shadow-[#0897b1]/20">
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-24 bg-[#fafbfc]">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                        <p className="text-sm font-black text-[#0a3a4a] italic">
                            {filteredListings.length} DISPLAY LOCATIONS MATCH YOUR FILTERS
                        </p>

                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex bg-white rounded-xl p-1.5 shadow-sm border border-gray-100">
                                <button
                                    onClick={() => setViewMode("map")}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === "map" ? "bg-[#0897b1] text-white shadow-lg" : "text-[#0897b1] hover:bg-gray-50 border border-transparent"
                                        }`}
                                >
                                    <MapIcon size={14} /> MAP VIEW
                                </button>
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === "grid" ? "bg-[#0897b1] text-white shadow-lg" : "text-[#0897b1] hover:bg-gray-50 border border-transparent"
                                        }`}
                                >
                                    <Grid size={14} /> GRID VIEW
                                </button>
                            </div>

                            <a
                                href="/contact"
                                className="px-10 py-4 bg-[#0a3a4a] text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-lg"
                            >
                                Contact Us
                            </a>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-40 gap-4">
                            <Loader2 className="animate-spin text-[#0897b1]" size={48} />
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic">Finding display homes...</p>
                        </div>
                    ) : (
                        <div className={`grid gap-12 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1 lg:grid-cols-12"}`}>
                            {/* Map View Layout */}
                            {viewMode === "map" ? (
                                <>
                                    <div className="lg:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[1000px] overflow-y-auto pr-4 custom-scrollbar">
                                        {allItems.map((item, idx) => (
                                            <DisplayHomeCard
                                                key={item.id}
                                                home={item}
                                                index={idx}
                                                isOffice={item.id === 'office'}
                                            />
                                        ))}
                                    </div>
                                    <div className="lg:col-span-6 h-[1000px] sticky top-8">
                                        <DisplayHomesMap locations={allItems} />
                                    </div>
                                </>
                            ) : (
                                // Grid View Layout
                                allItems.length === 0 ? (
                                    <div className="col-span-full bg-white rounded-[32px] p-24 text-center border-2 border-dashed border-gray-200">
                                        <p className="text-gray-400 text-xl font-bold italic">No display homes found matching your selection.</p>
                                    </div>
                                ) : (
                                    allItems.map((item, idx) => (
                                        <DisplayHomeCard
                                            key={item.id}
                                            home={item}
                                            index={idx}
                                            isOffice={item.id === 'office'}
                                        />
                                    ))
                                )
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Professional Background Check section style placeholder */}
            <section className="py-24 bg-[#1a3a4a] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-[#0897b1]/10 skew-x-12 translate-x-1/4" />
                <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1 space-y-6">
                        <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tight leading-tight">
                            Ready to Begin your journey?
                        </h2>
                        <p className="text-white/70 text-lg leading-relaxed italic max-w-xl">
                            Connect with one of our New Home Consultants today to explore your options,
                            answer any questions, and take the first step toward your dream home.
                        </p>
                    </div>
                    <div className="flex-shrink-0">
                        <a
                            href="tel:1300646672"
                            className="bg-white text-[#1a3a4a] px-12 py-6 rounded-full font-black uppercase text-sm tracking-widest hover:bg-[#0897b1] hover:text-white transition-all shadow-2xl flex items-center gap-4"
                        >
                            <Phone size={20} /> 1300 646 672
                        </a>
                    </div>
                </div>
            </section>

            <Footer />

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
        </main>
    );
}
