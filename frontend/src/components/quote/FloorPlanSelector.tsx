"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { api, getFullUrl } from "@/services/api";
import { Bed, Bath, Car, Search, X, ZoomIn, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Mousewheel } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface FloorPlanSelectorProps {
    filters: {
        width: string;
        depth: string;
        storeys: string;
    };
    onBack: () => void;
    onSelect: (floorplan: any) => void;
}

export default function FloorPlanSelector({ filters, onBack, onSelect }: FloorPlanSelectorProps) {
    const [floorplans, setFloorplans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [viewingImage, setViewingImage] = useState<string | null>(null);
    const swiperRef = useRef<SwiperType>(null);

    const [localFilters, setLocalFilters] = useState(filters);
    const [availableOptions, setAvailableOptions] = useState<{ widths: number[], depths: number[], storeys: number[] }>({ widths: [], depths: [], storeys: [] });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [plansData, filtersData] = await Promise.all([
                api.getFloorPlans({ limit: 100 }) as Promise<any>,
                api.getFloorPlanFilters()
            ]);

            const data = plansData.data || [];
            setFloorplans(data);
            setAvailableOptions(filtersData as any);

            if (data.length > 0) {
                setSelectedPlan(data[0]);
            }
        } catch (error) {
            console.error("Failed to load floorplans", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (field: string, value: string) => {
        setLocalFilters(prev => ({ ...prev, [field]: value }));
    };

    const filteredPlans = floorplans.filter(plan => {
        const matchWidth = !localFilters.width || (plan.min_frontage <= parseFloat(localFilters.width));
        const matchDepth = !localFilters.depth || (plan.min_depth <= parseFloat(localFilters.depth));
        const matchStoreys = !localFilters.storeys || (plan.stories == parseInt(localFilters.storeys));
        return matchWidth && matchDepth && matchStoreys;
    });

    const handleNext = () => {
        if (selectedPlan) {
            onSelect(selectedPlan);
        }
    };

    return (
        <div className="flex flex-col gap-8 w-full">

            {/* Top Row: Browser and Summary */}
            <div className="flex flex-col lg:flex-row gap-8 items-stretch">

                {/* Left: Floorplan Browser */}
                <div className="flex-grow lg:w-[68%] bg-white rounded-[32px] border border-gray-100 p-8 flex flex-col min-h-[700px] shadow-sm overflow-hidden">

                    {/* Header: Title & Dropdowns */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 px-4">
                        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">FLOORPLANS</h2>

                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-gray-400">Width selected:</span>
                                <select
                                    value={localFilters.width}
                                    onChange={(e) => handleFilterChange("width", e.target.value)}
                                    className="bg-white border-2 border-gray-100 rounded-xl px-4 py-2 text-[10px] font-black uppercase outline-none focus:border-[#0796b1] transition-all"
                                >
                                    <option value="">Any</option>
                                    {availableOptions.widths.map(w => <option key={w} value={w}>{w}m+</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-gray-400">Depth selected:</span>
                                <select
                                    value={localFilters.depth}
                                    onChange={(e) => handleFilterChange("depth", e.target.value)}
                                    className="bg-white border-2 border-gray-100 rounded-xl px-4 py-2 text-[10px] font-black uppercase outline-none focus:border-[#0796b1] transition-all"
                                >
                                    <option value="">Any</option>
                                    {availableOptions.depths.map(d => <option key={d} value={d}>{d}m+</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-gray-400">Storeys selected:</span>
                                <select
                                    value={localFilters.storeys}
                                    onChange={(e) => handleFilterChange("storeys", e.target.value)}
                                    className="bg-white border-2 border-gray-100 rounded-xl px-4 py-2 text-[10px] font-black uppercase outline-none focus:border-[#0796b1] transition-all"
                                >
                                    <option value="">Any</option>
                                    {availableOptions.storeys.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <button className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest mt-4 hover:bg-black transition-all">
                                CHANGE
                            </button>
                        </div>
                    </div>

                    {/* Carousel Area */}
                    <div className="relative flex-grow flex items-center justify-center py-10 overflow-hidden">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0796b1]"></div>
                            </div>
                        ) : filteredPlans.length === 0 ? (
                            <div className="text-center py-20 grayscale opacity-20">
                                <Search size={64} className="mx-auto mb-4" />
                                <p className="font-black uppercase tracking-widest">No matching plans</p>
                            </div>
                        ) : (
                            <div className="relative w-full h-full flex items-center justify-center">
                                {/* Navigation Arrows */}
                                <button
                                    onClick={() => swiperRef.current?.slidePrev()}
                                    className="absolute left-0 z-[20] w-14 h-14 bg-[#0796b1] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-90 transition-all cursor-pointer"
                                >
                                    <ChevronLeft size={28} strokeWidth={3} />
                                </button>

                                <Swiper
                                    onSwiper={(swiper) => { swiperRef.current = swiper; }}
                                    modules={[Navigation, Mousewheel]}
                                    mousewheel={true}
                                    centeredSlides={true}
                                    slidesPerView={1}
                                    spaceBetween={30}
                                    className="w-full !overflow-visible"
                                >
                                    {filteredPlans.map(plan => {
                                        const isSelected = selectedPlan?.id === plan.id;
                                        return (
                                            <SwiperSlide key={plan.id} className="h-full">
                                                <div
                                                    onClick={() => setSelectedPlan(plan)}
                                                    className={`mx-auto bg-white border-2 rounded-[32px] transition-all duration-700 cursor-pointer overflow-hidden flex flex-col md:flex-row h-full min-h-[480px] ${isSelected
                                                        ? 'border-[#0796b1] shadow-[0_35px_60px_-15px_rgba(7,150,177,0.3)]'
                                                        : 'border-gray-100 hover:border-gray-200'
                                                        }`}
                                                >
                                                    {/* Left Half: Technical Drawing */}
                                                    <div className="flex-1 relative bg-white p-8 group overflow-hidden border-r border-gray-50 flex items-center justify-center">
                                                        <div className="absolute top-6 left-8 z-10">
                                                            <div className="w-10 h-10 bg-[#0796b1] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all cursor-zoom-in"
                                                                onClick={(e) => { e.stopPropagation(); setViewingImage(getFullUrl(plan.image_url)); }}
                                                            >
                                                                <ZoomIn size={20} />
                                                            </div>
                                                        </div>

                                                        <div className="relative w-full h-[350px]">
                                                            <Image
                                                                src={getFullUrl(plan.image_url)}
                                                                alt={plan.title}
                                                                fill
                                                                className="object-contain"
                                                                priority
                                                            />
                                                        </div>

                                                        {/* Bottom Center Logic Marker */}
                                                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-40">
                                                            <div className="w-[1px] h-6 bg-[#0796b1] mb-2" />
                                                            <div className="flex gap-2">
                                                                <div className="w-2 h-2 border border-[#0796b1] rotate-45" />
                                                                <div className="w-2 h-2 border border-[#0796b1] rotate-45 bg-[#0796b1]" />
                                                                <div className="w-2 h-2 border border-[#0796b1] rotate-45" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Right Half: Details */}
                                                    <div className="w-full md:w-[40%] p-10 flex flex-col justify-center gap-10 relative">
                                                        {isSelected && (
                                                            <button
                                                                className="absolute top-6 right-8 bg-[#0796b1] text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-cyan-900/10"
                                                                onClick={(e) => { e.stopPropagation(); }}
                                                            >
                                                                UNSELECT
                                                            </button>
                                                        )}

                                                        <div className="text-center space-y-4">
                                                            <h3 className="text-4xl font-black text-gray-900 uppercase tracking-tighter leading-none">{plan.title}</h3>
                                                            <button className="text-[#0796b1] text-[10px] font-black uppercase tracking-widest underline underline-offset-8 decoration-2 hover:text-cyan-700 transition-all">
                                                                View Floorplan
                                                            </button>
                                                            <div className="pt-2">
                                                                <button className="bg-[#0796b1] text-white px-10 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-cyan-900/20 hover:bg-cyan-700 transition-all">
                                                                    INCLUSIONS
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Icons Stack */}
                                                        <div className="flex flex-col items-center gap-6 py-8 border-t border-b border-gray-100">
                                                            <div className="flex items-center gap-4">
                                                                <Bed size={24} className="text-[#0796b1]" strokeWidth={2.5} />
                                                                <span className="text-3xl font-black text-gray-900 tracking-tighter">4</span>
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                <Bath size={24} className="text-[#0796b1]" strokeWidth={2.5} />
                                                                <span className="text-3xl font-black text-gray-900 tracking-tighter">2</span>
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                <Car size={24} className="text-[#0796b1]" strokeWidth={2.5} />
                                                                <span className="text-3xl font-black text-gray-900 tracking-tighter">2</span>
                                                            </div>
                                                        </div>

                                                        {/* Footnotes */}
                                                        <div className="space-y-3 text-center">
                                                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Min Frontage: <span className="text-gray-900">{plan.min_frontage}m</span></p>
                                                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Min Depth: <span className="text-gray-900">{plan.min_depth}m</span></p>
                                                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Total Area: <span className="text-gray-900">{plan.total_area}sq</span></p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                        );
                                    })}
                                </Swiper>

                                <button
                                    onClick={() => swiperRef.current?.slideNext()}
                                    className="absolute right-0 z-[20] w-14 h-14 bg-[#0796b1] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-90 transition-all cursor-pointer"
                                >
                                    <ChevronRight size={28} strokeWidth={3} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Selection Hub Summary */}
                <div className="lg:w-[32%] flex flex-col gap-6">
                    <div className="bg-white rounded-[32px] border border-gray-100 p-10 shadow-2xl space-y-12 min-h-[600px]">
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">QUOTE SUMMARY</h2>

                        <div className="space-y-10">
                            {/* Floorplan Section */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black text-[#0796b1] uppercase tracking-[0.4em] border-b border-gray-50 pb-2">FLOORPLAN</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-[11px]">
                                        <span className="font-bold text-gray-500 uppercase tracking-widest">Floorplan Name: <span className="text-gray-900">{selectedPlan?.title || "Unknown"}</span></span>
                                        <span className="font-bold text-gray-900">${(selectedPlan?.price || 232596).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[11px] pt-1">
                                        <span className="font-bold text-gray-900 uppercase tracking-widest">Subtotal:</span>
                                        <span className="font-black text-[#0796b1]">${(selectedPlan?.price || 232596).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Total Area */}
                            <div className="pt-12 flex justify-end items-center gap-6">
                                <span className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">TOTAL:</span>
                                <span className="text-5xl font-black text-[#0796b1] tracking-tighter italic">
                                    ${Math.round(selectedPlan?.price || 232596).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pr-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-[#0796b1] text-white px-8 py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-cyan-900/10 hover:bg-cyan-700 transition-all"
                        >
                            RESTART QUOTE
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Nav Section */}
            <div className="flex flex-col items-center gap-6 py-12 relative overflow-visible">
                <div className="relative group">
                    <AnimatePresence>
                        {selectedPlan && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute top-[-55px] left-1/2 -translate-x-1/2 bg-[#0796b1] text-white px-8 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] whitespace-nowrap shadow-xl"
                            >
                                To continue building your quote, please press this button
                                <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0796b1] rotate-45" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        onClick={handleNext}
                        disabled={!selectedPlan}
                        className={`px-24 py-7 rounded-[32px] font-black uppercase text-sm tracking-[0.3em] flex items-center gap-6 transition-all shadow-2xl active:scale-95 ${selectedPlan
                            ? 'bg-gray-900 text-white hover:bg-black shadow-gray-900/40 hover:-translate-y-1'
                            : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                            }`}
                    >
                        NEXT STEP <ChevronRight size={24} strokeWidth={4} />
                    </button>
                </div>

                <button
                    onClick={onBack}
                    className="text-[#0796b1] font-black uppercase text-[10px] tracking-[0.4em] hover:opacity-80 transition-all underline underline-offset-8 decoration-2"
                >
                    &lt; GO BACK
                </button>
            </div>

            {/* Global Lightbox */}
            <AnimatePresence>
                {viewingImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setViewingImage(null)}
                        className="fixed inset-0 z-[200] bg-gray-900/95 backdrop-blur-2xl flex items-center justify-center p-20"
                    >
                        <button className="absolute top-10 right-10 text-white bg-white/10 p-5 rounded-full hover:bg-white/20 transition-all">
                            <X size={36} />
                        </button>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full h-full max-w-7xl bg-white rounded-[56px] overflow-hidden p-16 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={viewingImage}
                                alt="High Resolution Detail"
                                fill
                                className="object-contain p-12"
                                priority
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
