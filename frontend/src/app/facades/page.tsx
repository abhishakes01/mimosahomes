"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, ChevronRight, Home, Layout, Maximize2, X, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api, getFullUrl } from "@/services/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function FacadesPage() {
    const [facades, setFacades] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedFacadeId, setSelectedFacadeId] = useState<string | null>(null);

    // Filters
    const [collection, setCollection] = useState<string>('All');
    const [storeys, setStoreys] = useState<number | null>(null);
    const [selectedWidths, setSelectedWidths] = useState<string[]>([]);
    const [pageData, setPageData] = useState<any>(null);

    useEffect(() => {
        const fetchPageData = async () => {
            try {
                const data = await api.getPageBySlug('facades');
                setPageData(data);
            } catch (err) {
                console.error("Failed to fetch page data:", err);
            }
        };
        fetchPageData();
    }, []);

    const lotWidths = ["8.5m", "10m", "10.5m", "12m", "12.5m", "13m", "14m", "16m"];

    useEffect(() => {
        const fetchFacades = async () => {
            try {
                setLoading(true);
                const response: any = await api.getFacades({ limit: 100 });
                setFacades(response.data || []);
            } catch (err) {
                console.error("Failed to fetch facades:", err);
                setError("Failed to load facades gallery.");
            } finally {
                setLoading(false);
            }
        };
        fetchFacades();
    }, []);

    const toggleWidth = (width: string) => {
        if (selectedWidths.includes(width)) {
            setSelectedWidths(selectedWidths.filter(w => w !== width));
        } else {
            setSelectedWidths([...selectedWidths, width]);
        }
    };

    const filteredFacades = facades.filter(facade => {
        // Filter by collection (V_Collection vs M_Collection)
        if (storeys && facade.stories !== storeys) return false;

        if (selectedWidths.length > 0) {
            // Normalize width for comparison (e.g. "14.00" -> "14m")
            const facadeWidth = `${Math.round(parseFloat(facade.width))}m`;
            if (!selectedWidths.includes(facadeWidth)) return false;
        }

        // Mapping typical collection names to my internal filter
        if (collection !== 'All') {
            const isVCollection = facade.title?.toUpperCase().includes('V-') || facade.title?.toUpperCase().includes('V COLLECTION');
            if (collection === 'V_Collection' && !isVCollection) return false;
            if (collection === 'M_Collection' && isVCollection) return false;
        }

        return true;
    });

    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    // MJ Badge Component
    const CollectionBadge = ({ type }: { type: 'V' | 'MJ' }) => (
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border border-white/20 shadow-lg ${type === 'V' ? 'bg-[#f47e20]' : 'bg-[#1a3a4a]'}`}>
            <span className="text-white text-lg font-black leading-none italic">{type}</span>
        </div>
    );

    const selectedFacade = facades.find(f => f.id === selectedFacadeId);

    // Inline Detail Section Component
    const FacadeDetails = ({ facade }: { facade: any }) => (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="col-span-full bg-gray-50 rounded-[32px] overflow-hidden my-8 border border-gray-200"
        >
            <div className="p-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div>
                        <h2 className="text-5xl md:text-6xl font-black text-[#1a3a4a] uppercase italic tracking-tighter leading-none mb-4">
                            {facade?.title}
                        </h2>
                        <div className="flex items-center gap-3 text-lg font-bold text-gray-500 uppercase italic">
                            <Layout size={20} className="text-[#0897b1]" />
                            <span>{facade?.width}m Lot Width</span>
                        </div>
                    </div>
                    <button className="px-12 py-5 bg-[#0a3a4a] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-2xl flex items-center gap-3">
                        Enquire Now
                    </button>
                </div>

                <div className="space-y-8">
                    <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-[#0897b1]">Available Home Designs</h4>
                    <div className="flex flex-wrap gap-4">
                        {facade?.floorplans?.length > 0 ? (
                            facade.floorplans.map((fp: any) => (
                                <Link
                                    key={fp.id}
                                    href={`/new-home-designs/${fp.slug || fp.id}`}
                                    className="px-8 py-4 bg-white border border-gray-200 rounded-xl text-xs font-black text-[#1a3a4a] hover:bg-[#1a3a4a] hover:text-white transition-all uppercase tracking-wider shadow-sm"
                                >
                                    {fp.title}
                                </Link>
                            ))
                        ) : (
                            ["Saba 331", "Saba 310", "Beechworth 328", "Saba 260", "Mornington 282", "Mandurah 326", "Clarendon 328", "Beaconsfield 329"].map(name => (
                                <button
                                    key={name}
                                    className="px-8 py-4 bg-white border border-gray-200 rounded-xl text-xs font-black text-[#1a3a4a] hover:bg-[#1a3a4a] hover:text-white transition-all uppercase tracking-wider shadow-sm"
                                >
                                    {name}
                                </button>
                            ))
                        )}
                    </div>
                </div>

                <p className="mt-12 text-[9px] text-gray-400 font-bold max-w-4xl leading-loose uppercase tracking-widest opacity-60">
                    Facade images are to be used as a guide only, may depict upgrade options and may not be house specific. Facade details such as entry doors, render, window sizing & placement may vary between house types and sizes. Concrete driveway, Landscaping and Fencing is not included. Please obtain house specific drawings from your New Home Consultant to assist you in making your facade choice.
                </p>
            </div>
        </motion.div>
    );

    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
                <Image
                    src={getFullUrl(pageData?.content?.heroImage) || "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=100&w=2000"}
                    alt="Facades"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter italic leading-none mb-6">
                            Facades
                        </h1>
                        <p className="text-xl text-white/80 font-medium max-w-xl italic mx-auto mt-6">
                            Discover the perfect <span className="text-[#0897b1] border-b-2 border-[#0897b1]">external design</span> for your new home with our gallery of stunning facades.
                        </p>
                    </motion.div>
                </div>

                {/* Breadcrumbs */}
                <div className="absolute bottom-8 left-8 z-10 hidden md:flex items-center gap-2 text-white/80 text-xs font-bold uppercase tracking-widest">
                    <Link href="/" className="hover:text-white transition-colors">Mitra Homes</Link>
                    <ChevronRight size={14} className="text-[#0897b1]" />
                    <span className="text-white">Facades</span>
                </div>
            </section>

            {/* Filter Section */}
            <section className="bg-gray-100 py-12 px-6">
                <div className="container mx-auto max-w-6xl bg-white rounded-3xl p-8 shadow-sm">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Collections */}
                        <div>
                            <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-6">Collections</h3>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setCollection(collection === 'V_Collection' ? 'All' : 'V_Collection')}
                                    className={`flex-1 group relative h-24 rounded-2xl overflow-hidden transition-all ${collection === 'V_Collection' ? 'ring-4 ring-[#f47e20] ring-offset-2' : 'opacity-60 grayscale hover:grayscale-0 hover:opacity-100'}`}
                                >
                                    <div className="absolute inset-0 bg-[#f47e20]" />
                                    <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
                                        <div className="w-10 h-10 mb-1 relative">
                                            <Image src="/v-logo.png" alt="V" fill className="object-contain brightness-0 invert" />
                                        </div>
                                        <span className="text-[10px] font-black tracking-tight leading-none uppercase">V Collection</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setCollection(collection === 'M_Collection' ? 'All' : 'M_Collection')}
                                    className={`flex-1 group relative h-24 rounded-2xl overflow-hidden transition-all ${collection === 'M_Collection' ? 'ring-4 ring-[#1a3a4a] ring-offset-2' : 'opacity-60 grayscale hover:grayscale-0 hover:opacity-100'}`}
                                >
                                    <div className="absolute inset-0 bg-[#1a3a4a]" />
                                    <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
                                        <div className="w-10 h-10 mb-1 relative">
                                            <Image src="/m-logo.png" alt="M" fill className="object-contain brightness-0 invert" />
                                        </div>
                                        <span className="text-[10px] font-black tracking-tight leading-none uppercase">M Collection</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Storeys */}
                        <div>
                            <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-6">Storeys</h3>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setStoreys(storeys === 1 ? null : 1)}
                                    className={`flex-1 h-24 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${storeys === 1 ? 'border-[#0897b1] bg-white shadow-lg' : 'border-gray-100 bg-gray-50/50 text-gray-400'}`}
                                >
                                    <Home size={28} className={storeys === 1 ? 'text-[#0897b1]' : ''} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Single</span>
                                </button>
                                <button
                                    onClick={() => setStoreys(storeys === 2 ? null : 2)}
                                    className={`flex-1 h-24 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${storeys === 2 ? 'border-[#0897b1] bg-white shadow-lg' : 'border-gray-100 bg-gray-50/50 text-gray-400'}`}
                                >
                                    <div className="relative">
                                        <Home size={28} className={storeys === 2 ? 'text-[#0897b1]' : ''} />
                                        <Home size={28} className={`absolute -top-1.5 -right-1.5 opacity-40 scale-75 ${storeys === 2 ? 'text-[#0897b1]' : ''}`} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">Double</span>
                                </button>
                            </div>
                        </div>

                        {/* Lot Width */}
                        <div className="relative">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400">Lot Width (m)</h3>
                                <button
                                    onClick={() => setSelectedWidths([])}
                                    className="text-[9px] font-black uppercase tracking-widest text-[#0897b1] hover:underline"
                                >
                                    Reset
                                </button>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {lotWidths.map(width => (
                                    <button
                                        key={width}
                                        onClick={() => toggleWidth(width)}
                                        className={`py-2 text-[10px] font-bold rounded-lg transition-all ${selectedWidths.includes(width) ? 'bg-[#1a3a4a] text-white' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                                    >
                                        {width}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button className="px-8 py-3 bg-[#0a3a4a] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl">
                            Enquire
                        </button>
                    </div>
                </div>
            </section>

            {/* Facade Grid */}
            <section className="py-24 px-6">
                <div className="container mx-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24">
                            <Loader2 className="animate-spin text-[#0897b1] mb-4" size={48} />
                            <p className="text-gray-400 font-black uppercase tracking-widest italic text-sm">Loading Gallery...</p>
                        </div>
                    ) : filteredFacades.length === 0 ? (
                        <div className="text-center py-24 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
                            <p className="text-gray-400 font-bold italic">No facades found matching your selection.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                            {filteredFacades.reduce((acc: any[], facade, index) => {
                                const isSelected = selectedFacadeId === facade.id;

                                // Group into rows of 3 (for lg screens)
                                // To make the expansion truly inline, we render the facade card,
                                // and then if it's selected, we render the details view.
                                // In CSS grid, col-span-full will span the whole row automatically,
                                // pushing subsequent items down naturally if we don't use 'contents'

                                acc.push(
                                    <div key={facade.id} className="flex flex-col">
                                        <div className="group">
                                            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-lg bg-gray-100 mb-6">
                                                <Image
                                                    src={getFullUrl(facade.image_url) || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000"}
                                                    alt={facade.title}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                                <div className="absolute top-4 right-4">
                                                    <CollectionBadge type={facade.title?.toUpperCase().includes('V-') ? 'V' : 'MJ'} />
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        setLightboxImage(getFullUrl(facade.image_url));
                                                    }}
                                                    className="absolute bottom-4 right-4 p-2 bg-black/40 backdrop-blur-md text-white rounded-lg hover:bg-[#0897b1] transition-all cursor-pointer z-10"
                                                >
                                                    <Maximize2 size={16} />
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between gap-4">
                                                <div>
                                                    <h3 className="text-lg font-black text-[#1a3a4a] uppercase italic leading-tight">{facade.title}</h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <div className="flex items-center gap-1">
                                                            <div className="w-3 h-3 flex flex-col gap-0.5 opacity-40">
                                                                <div className="h-[2px] w-full bg-[#1a3a4a]" />
                                                                <div className="h-[2px] w-full bg-[#1a3a4a]" />
                                                            </div>
                                                            <span className="text-[11px] font-black text-gray-500 uppercase">{Math.round(facade.width)}M</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="shrink-0 flex gap-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            setSelectedFacadeId(isSelected ? null : facade.id);
                                                        }}
                                                        className={`px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${isSelected ? 'bg-[#0a3a4a] text-white shadow-lg' : 'border-2 border-[#0a3a4a] text-[#0a3a4a] hover:bg-[#0a3a4a] hover:text-white'}`}
                                                    >
                                                        {isSelected ? "Close" : "View Details"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );

                                if (isSelected) {
                                    acc.push(
                                        <div key={`details-${facade.id}`} className="col-span-1 md:col-span-2 lg:col-span-3 w-full">
                                            <AnimatePresence mode="wait">
                                                <FacadeDetails facade={facade} />
                                            </AnimatePresence>
                                        </div>
                                    );
                                }

                                return acc;
                            }, [])}
                        </div>
                    )}
                </div>
            </section>

            {/* Lightbox / Fancybox Overlay */}
            <AnimatePresence>
                {lightboxImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-6 md:p-12"
                        onClick={() => setLightboxImage(null)}
                    >
                        <button
                            className="absolute top-8 right-8 text-white/60 hover:text-white transition-colors"
                            onClick={() => setLightboxImage(null)}
                        >
                            <X size={40} />
                        </button>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-6xl aspect-[16/9] shadow-2xl rounded-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={lightboxImage}
                                alt="Facade Preview"
                                fill
                                className="object-contain"
                                priority
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </main>
    );
}
