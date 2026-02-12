"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { api, getFullUrl } from "@/services/api";
import { ArrowLeft, ArrowRight, Bed, Bath, Car, Search, ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCoverflow } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { motion, AnimatePresence } from "framer-motion";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

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

    // Internal filters state
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

            setFloorplans(plansData.data);
            setAvailableOptions(filtersData as any);
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

    const handlePlanSelect = (plan: any) => {
        setSelectedPlan(plan);
    };

    const handleNext = () => {
        if (selectedPlan) {
            onSelect(selectedPlan);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column: Floorplans Slider */}
            <div className="flex-grow lg:w-2/3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[600px]">

                {/* Header & Filters */}
                <div className="flex flex-wrap items-end justify-between gap-4 mb-8 pb-4 border-b border-gray-100">
                    <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight uppercase">Floorplans</h2>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 mb-1">Width selected:</span>
                            <div className="relative">
                                <select
                                    value={localFilters.width}
                                    onChange={(e) => handleFilterChange("width", e.target.value)}
                                    className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-1.5 px-3 pr-8 rounded leading-tight focus:outline-none focus:border-black text-sm w-32"
                                >
                                    <option value="">Any</option>
                                    {availableOptions.widths.map(w => <option key={w} value={w}>{w}m+</option>)}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <ChevronRight size={14} className="rotate-90" />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 mb-1">Depth selected:</span>
                            <div className="relative">
                                <select
                                    value={localFilters.depth}
                                    onChange={(e) => handleFilterChange("depth", e.target.value)}
                                    className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-1.5 px-3 pr-8 rounded leading-tight focus:outline-none focus:border-black text-sm w-32"
                                >
                                    <option value="">Any</option>
                                    {availableOptions.depths.map(d => <option key={d} value={d}>{d}m+</option>)}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <ChevronRight size={14} className="rotate-90" />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 mb-1">Storeys selected:</span>
                            <div className="relative">
                                <select
                                    value={localFilters.storeys}
                                    onChange={(e) => handleFilterChange("storeys", e.target.value)}
                                    className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-1.5 px-3 pr-8 rounded leading-tight focus:outline-none focus:border-black text-sm w-32"
                                >
                                    <option value="">Any</option>
                                    {availableOptions.storeys.map(s => <option key={s} value={s}>{s === 1 ? "Single" : "Double"}</option>)}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <ChevronRight size={14} className="rotate-90" />
                                </div>
                            </div>
                        </div>

                        <button className="self-end bg-black text-white px-6 py-2 rounded text-xs font-bold uppercase tracking-wider mb-0.5 hover:bg-gray-800 transition-colors">
                            Change
                        </button>
                    </div>
                </div>

                {/* Slider */}
                {loading ? (
                    <div className="flex justify-center items-center h-[350px]">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                    </div>
                ) : filteredPlans.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[350px] text-gray-400">
                        <Search size={48} className="mb-4 opacity-20" />
                        <p>No floorplans found matching your criteria.</p>
                        <button
                            onClick={() => setLocalFilters({ width: "", depth: "", storeys: "" })}
                            className="mt-4 text-black underline font-bold text-sm"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="relative px-8 group mt-8">
                        {/* Swiper Active Slide Styling */}
                        <style jsx global>{`
                            .floorplan-swiper .swiper-slide {
                                transition: all 0.5s ease;
                                transform: scale(0.85);
                                opacity: 0.3 !important;
                                filter: grayscale(1);
                            }
                            .floorplan-swiper .swiper-slide-active {
                                transform: scale(1.05);
                                opacity: 1 !important;
                                filter: grayscale(0);
                            }
                        `}</style>

                        {/* Custom Navigation Buttons */}
                        <div
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-black text-white rounded-full cursor-pointer hover:bg-gray-800 transition-colors shadow-lg"
                            onClick={() => swiperRef.current?.slidePrev()}
                        >
                            <ChevronLeft size={20} />
                        </div>
                        <div
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-black text-white rounded-full cursor-pointer hover:bg-gray-800 transition-colors shadow-lg"
                            onClick={() => swiperRef.current?.slideNext()}
                        >
                            <ChevronRight size={20} />
                        </div>

                        <Swiper
                            onSwiper={(swiper) => {
                                swiperRef.current = swiper;
                            }}
                            modules={[Navigation, EffectCoverflow]}
                            effect={'coverflow'}
                            grabCursor={true}
                            centeredSlides={true}
                            slidesPerView={'auto'}
                            coverflowEffect={{
                                rotate: 0,
                                stretch: 0,
                                depth: 150,
                                modifier: 1.5,
                                slideShadows: false,
                            }}
                            initialSlide={0}
                            className="pb-4 floorplan-swiper"
                        >
                            {filteredPlans.map(plan => (
                                <SwiperSlide key={plan.id} className="w-[170px] sm:w-[210px]">
                                    <div className={`bg-white rounded-xl overflow-hidden h-full flex flex-col relative transition-all duration-300 border-2 ${selectedPlan?.id === plan.id ? 'border-black shadow-xl' : 'border-gray-100 shadow-sm'}`}>

                                        {/* Select Indicator */}
                                        {selectedPlan?.id === plan.id && (
                                            <div className="absolute top-0 inset-x-0 h-1 bg-black z-20"></div>
                                        )}

                                        {/* Action Button Top Right */}
                                        <div className="absolute top-2 right-2 z-10">
                                            <button
                                                onClick={() => handlePlanSelect(plan)}
                                                className={`text-[8px] font-bold px-2 py-1 rounded-full uppercase transition-all ${selectedPlan?.id === plan.id ? 'bg-black text-white' : 'bg-white text-black border border-gray-200 hover:bg-gray-50 shadow-sm'}`}
                                            >
                                                {selectedPlan?.id === plan.id ? 'Selected' : 'Select'}
                                            </button>
                                        </div>

                                        {/* Zoom/Fancy Icon */}
                                        <div className="absolute top-2 left-2 z-10">
                                            <button
                                                onClick={() => setViewingImage(getFullUrl(plan.image_url))}
                                                className="bg-white/90 backdrop-blur-sm text-black p-1 rounded-full hover:bg-white shadow-sm transition-all"
                                                title="View Large"
                                            >
                                                <ZoomIn size={12} />
                                            </button>
                                        </div>

                                        {/* Image Area */}
                                        <div className="relative h-36 bg-white p-3 pt-10">
                                            <div className="relative w-full h-full">
                                                {plan.image_url ? (
                                                    <Image
                                                        src={getFullUrl(plan.image_url)}
                                                        alt={plan.title}
                                                        fill
                                                        className="object-contain"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-gray-300">No Image</div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Content Area */}
                                        <div className="flex flex-col items-center text-center p-3 flex-grow">
                                            <h3 className="text-base font-black text-gray-900 uppercase mb-0.5 tracking-tight">{plan.title}</h3>
                                            <button
                                                onClick={() => setViewingImage(getFullUrl(plan.image_url))}
                                                className="text-gray-500 text-[8px] font-bold underline uppercase mb-3 hover:text-black tracking-widest"
                                            >
                                                View Floorplan
                                            </button>

                                            <button className="bg-gray-100 text-gray-900 text-[8px] font-black px-3 py-1 rounded-full mb-4 hover:bg-gray-200 uppercase tracking-widest transition-colors">
                                                Inclusions
                                            </button>

                                            {/* Icons */}
                                            <div className="flex items-center gap-4 mb-4 text-gray-900">
                                                <div className="flex flex-col items-center gap-0.5">
                                                    <Bed size={14} strokeWidth={2} />
                                                    <span className="text-[10px] font-black">{plan.bedrooms}</span>
                                                </div>
                                                <div className="flex flex-col items-center gap-0.5">
                                                    <Bath size={14} strokeWidth={2} />
                                                    <span className="text-[10px] font-black">{plan.bathrooms}</span>
                                                </div>
                                                <div className="flex flex-col items-center gap-0.5">
                                                    <Car size={14} strokeWidth={2} />
                                                    <span className="text-[10px] font-black">{plan.car_spaces}</span>
                                                </div>
                                            </div>

                                            {/* Divider */}
                                            <div className="w-6 h-[1px] bg-gray-200 mb-4"></div>

                                            {/* Specs */}
                                            <div className="space-y-1 text-[9px] text-gray-500 mb-4 w-full px-1">
                                                <div className="flex justify-between items-center">
                                                    <span className="uppercase tracking-widest">Min Frontage</span>
                                                    <span className="font-black text-gray-900 text-[11px]">{plan.min_frontage}m</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="uppercase tracking-widest">Min Depth</span>
                                                    <span className="font-black text-gray-900 text-[11px]">{plan.min_depth}m</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="uppercase tracking-widest">Total Area</span>
                                                    <span className="font-black text-gray-900 text-[11px]">{plan.total_area}sq</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer / Price */}
                                        <div className="bg-gray-900 text-white py-2.5 text-center text-base font-black mt-auto tracking-tighter">
                                            ${(plan.price || 232596).toLocaleString()}
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                )}
            </div>

            {/* Right Column: Quote Summary */}
            <div className="lg:w-1/3 flex flex-col gap-6">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col min-h-[500px]">
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-8 border-b border-gray-100 pb-4">Quote Summary</h3>

                    <div className="flex-grow space-y-6">
                        {selectedPlan ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Floorplan</span>
                                        <span className="text-lg font-black text-gray-900 uppercase">{selectedPlan.title}</span>
                                    </div>
                                    <span className="font-black text-gray-900">${(selectedPlan.price || 232596).toLocaleString()}</span>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-500">Bedrooms</span>
                                        <span className="font-black">{selectedPlan.bedrooms}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-500">Bathrooms</span>
                                        <span className="font-black">{selectedPlan.bathrooms}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-500">Garages</span>
                                        <span className="font-black">{selectedPlan.car_spaces}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="text-gray-400 italic text-sm text-center mt-12 bg-gray-50 p-8 rounded-2xl border border-dashed border-gray-200">
                                Select a floorplan to view your quote summary
                            </div>
                        )}
                    </div>

                    <div className="mt-auto pt-8 border-t border-gray-100">
                        <div className="flex justify-between items-center text-2xl font-black">
                            <span className="text-gray-400 uppercase text-xs tracking-[0.2em]">Total</span>
                            <span className="text-gray-900">
                                {selectedPlan ? `$${(selectedPlan.price || 232596).toLocaleString()}` : "-"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Next Step Button */}
                <button
                    disabled={!selectedPlan}
                    onClick={handleNext}
                    className={`w-full py-5 rounded-2xl font-black uppercase text-sm tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 ${selectedPlan
                        ? 'bg-black text-white hover:bg-gray-800 shadow-xl scale-[1.02]'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                        }`}
                >
                    Next Step <ArrowRight size={18} />
                </button>

                <button
                    onClick={onBack}
                    className="w-full py-4 text-gray-400 font-bold uppercase text-[10px] tracking-widest hover:text-black transition-colors flex items-center justify-center gap-2"
                >
                    ‹ Previous Step
                </button>
            </div>

            {/* Fancy Box / Lightbox Popup */}
            <AnimatePresence>
                {viewingImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setViewingImage(null)}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-12 cursor-zoom-out"
                    >
                        <motion.button
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute top-8 right-8 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X size={32} />
                        </motion.button>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full h-full max-w-6xl max-h-[80vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={viewingImage}
                                alt="Floorplan Preview"
                                fill
                                className="object-contain"
                                priority
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
