"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { api, getFullUrl } from "@/services/api";
import { Bed, Bath, Car, Search, X, ZoomIn, ChevronLeft, ChevronRight, Info, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCoverflow } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

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
    const [viewingPDF, setViewingPDF] = useState(false);
    const [inclusionsPdfUrl, setInclusionsPdfUrl] = useState("");
    const swiperRef = useRef<SwiperType>(null);

    const [localFilters, setLocalFilters] = useState(filters);
    const [availableOptions, setAvailableOptions] = useState<{ widths: number[], depths: number[], storeys: number[] }>({ widths: [], depths: [], storeys: [] });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [plansData, filtersData, settingsData] = await Promise.all([
                api.getFloorPlans({ limit: 100 }) as Promise<any>,
                api.getFloorPlanFilters(),
                api.getSettings("mock-token") as Promise<any>
            ]);

            const data = plansData.data || [];
            setFloorplans(data);
            setAvailableOptions(filtersData as any);
            setInclusionsPdfUrl(settingsData.inclusions_pdf_url || "");

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
            <style jsx global>{`
                .floorplan-swiper .swiper-slide {
                    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                    opacity: 0.4;
                    transform: scale(0.85);
                }
                .floorplan-swiper .swiper-slide-active {
                    opacity: 1;
                    transform: scale(1);
                }
                .floorplan-swiper .swiper-slide-prev,
                .floorplan-swiper .swiper-slide-next {
                    opacity: 0.6;
                    transform: scale(0.9);
                    z-index: 10;
                }
            `}</style>

            {/* Top Row: Browser and Summary */}
            <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-stretch">

                {/* Left: Floorplan Browser */}
                <div className="flex-grow w-full lg:w-[68%] bg-white rounded-[24px] md:rounded-[32px] border border-gray-100 p-4 md:p-8 flex flex-col min-h-[500px] md:min-h-[700px] shadow-sm overflow-hidden">

                    {/* Header: Title & Dropdowns */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4 md:mb-8 md:px-4">
                        <h2 className="text-xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter">FLOORPLANS</h2>

                        <div className="flex flex-wrap items-center gap-3 md:gap-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-[8px] md:text-[10px] font-bold text-gray-400">Width:</span>
                                <select
                                    value={localFilters.width}
                                    onChange={(e) => handleFilterChange("width", e.target.value)}
                                    className="bg-white border-2 border-gray-100 rounded-lg md:rounded-xl px-2 md:px-4 py-1.5 md:py-2 text-[9px] md:text-[10px] font-black uppercase outline-none focus:border-[#0796b1] transition-all"
                                >
                                    <option value="">Any</option>
                                    {availableOptions.widths.map(w => <option key={w} value={w.toString()}>{w}m+</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[8px] md:text-[10px] font-bold text-gray-400">Depth:</span>
                                <select
                                    value={localFilters.depth}
                                    onChange={(e) => handleFilterChange("depth", e.target.value)}
                                    className="bg-white border-2 border-gray-100 rounded-lg md:rounded-xl px-2 md:px-4 py-1.5 md:py-2 text-[9px] md:text-[10px] font-black uppercase outline-none focus:border-[#0796b1] transition-all"
                                >
                                    <option value="">Any</option>
                                    {availableOptions.depths.map(d => <option key={d} value={d.toString()}>{d}m+</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[8px] md:text-[10px] font-bold text-gray-400">Storeys:</span>
                                <select
                                    value={localFilters.storeys}
                                    onChange={(e) => handleFilterChange("storeys", e.target.value)}
                                    className="bg-white border-2 border-gray-100 rounded-lg md:rounded-xl px-2 md:px-4 py-1.5 md:py-2 text-[9px] md:text-[10px] font-black uppercase outline-none focus:border-[#0796b1] transition-all"
                                >
                                    <option value="">Any</option>
                                    {availableOptions.storeys.map(s => <option key={s} value={s.toString()}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Carousel Area */}
                    <div className="relative flex-grow flex items-center justify-center py-6 md:py-10 overflow-hidden">
                        {loading ? (
                            <div className="flex justify-center items-center h-48 md:h-64">
                                <div className="animate-spin rounded-full h-8 w-8 md:h-10 md:w-10 border-b-2 border-[#0796b1]"></div>
                            </div>
                        ) : filteredPlans.length === 0 ? (
                            <div className="text-center py-10 md:py-20 grayscale opacity-20">
                                <Search size={48} className="mx-auto mb-4" />
                                <p className="text-xs md:text-sm font-black uppercase tracking-widest">No matching plans</p>
                            </div>
                        ) : (
                            <div className="relative w-full h-full flex items-center justify-center">
                                {/* Navigation Arrows - Hidden on Mobile */}
                                <button
                                    onClick={() => swiperRef.current?.slidePrev()}
                                    className="absolute left-2 md:left-4 z-[50] w-10 h-10 md:w-12 md:h-12 bg-[#0796b1] text-white rounded-full hidden md:flex items-center justify-center shadow-xl hover:scale-110 active:scale-90 transition-all cursor-pointer"
                                >
                                    <ChevronLeft size={24} strokeWidth={3} />
                                </button>

                                <Swiper
                                    onSwiper={(swiper) => { swiperRef.current = swiper; }}
                                    onSlideChange={(swiper) => setSelectedPlan(filteredPlans[swiper.activeIndex])}
                                    modules={[Navigation]}
                                    mousewheel={false}
                                    centeredSlides={true}
                                    slidesPerView={1.1}
                                    breakpoints={{
                                        768: { slidesPerView: 1.4 }
                                    }}
                                    spaceBetween={10}
                                    className="w-full !overflow-visible floorplan-swiper"
                                >
                                    {filteredPlans.map(plan => {
                                        const isSelected = selectedPlan?.id === plan.id;
                                        return (
                                            <SwiperSlide key={plan.id} className="h-full">
                                                <div
                                                    onClick={() => setSelectedPlan(plan)}
                                                    className={`mx-auto bg-white border-2 rounded-[24px] md:rounded-[32px] transition-all duration-700 cursor-pointer overflow-hidden flex flex-col md:flex-row h-full min-h-[350px] md:min-h-[500px] max-w-[800px] ${isSelected
                                                        ? 'border-[#0796b1] shadow-[0_20px_40px_-10px_rgba(7,150,177,0.3)]'
                                                        : 'border-gray-100 hover:border-gray-200'
                                                        }`}
                                                >
                                                    {/* Left Half: Technical Drawing */}
                                                    <div className="flex-1 relative bg-white p-4 md:p-8 group overflow-hidden border-b md:border-b-0 md:border-r border-gray-50 flex items-center justify-center min-h-[200px] md:min-h-0">
                                                        <div className="absolute top-4 left-4 md:top-6 md:left-8 z-10">
                                                            <div className="w-8 h-8 md:w-10 md:h-10 bg-[#0796b1] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all cursor-zoom-in"
                                                                onClick={(e) => { e.stopPropagation(); setViewingImage(getFullUrl(plan.image_url)); }}
                                                            >
                                                                <ZoomIn size={20} />
                                                            </div>
                                                        </div>

                                                        <div className="relative w-full h-[180px] md:h-[300px]">
                                                            <Image
                                                                src={getFullUrl(plan.image_url)}
                                                                alt={plan.title}
                                                                fill
                                                                className="object-contain"
                                                                priority
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Right Half: Details */}
                                                    <div className="w-full md:w-[42%] p-6 md:p-10 flex flex-col justify-center gap-4 md:gap-6 relative bg-white">
                                                        {isSelected && (
                                                            <div className="absolute top-4 right-4 md:top-6 md:right-8">
                                                                <span className="bg-[#0796b1] text-white px-3 md:px-4 py-1 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest shadow-lg">
                                                                    SELECTED
                                                                </span>
                                                            </div>
                                                        )}

                                                        <div className="text-center space-y-2 md:space-y-4 pt-2">
                                                            <h3 className="text-xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter leading-none">{plan.title}</h3>
                                                            <div className="flex flex-wrap justify-center gap-3">
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); setViewingImage(getFullUrl(plan.image_url)); }}
                                                                    className="text-[#0796b1] text-[8px] md:text-[10px] font-black uppercase tracking-widest underline underline-offset-4 md:underline-offset-8 decoration-2 hover:text-cyan-700 transition-all cursor-pointer"
                                                                >
                                                                    View Floorplan
                                                                </button>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); setViewingPDF(true); }}
                                                                    className="text-[#0796b1] text-[8px] md:text-[10px] font-black uppercase tracking-widest underline underline-offset-4 md:underline-offset-8 decoration-2 hover:text-cyan-700 transition-all cursor-pointer"
                                                                >
                                                                    View Inclusions
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Icons Stack */}
                                                        <div className="flex items-center justify-center gap-4 md:gap-6 py-4 border-t border-b border-gray-50">
                                                            <div className="flex flex-col items-center gap-1">
                                                                <Bed size={24} className="text-[#0796b1]" strokeWidth={2.5} />
                                                                <span className="text-sm md:text-xl font-black text-gray-900 tracking-tighter">{plan.bedrooms}</span>
                                                            </div>
                                                            <div className="flex flex-col items-center gap-1">
                                                                <Bath size={24} className="text-[#0796b1]" strokeWidth={2.5} />
                                                                <span className="text-sm md:text-xl font-black text-gray-900 tracking-tighter">{plan.bathrooms}</span>
                                                            </div>
                                                            <div className="flex flex-col items-center gap-1">
                                                                <Car size={24} className="text-[#0796b1]" strokeWidth={2.5} />
                                                                <span className="text-sm md:text-xl font-black text-gray-900 tracking-tighter">{plan.car_spaces}</span>
                                                            </div>
                                                        </div>

                                                        {/* Footnotes */}
                                                        <div className="space-y-1 md:space-y-2 text-center text-[8px] md:text-[10px]">
                                                            <p className="font-black text-gray-400 uppercase tracking-widest leading-none">Min Frontage: <span className="text-gray-900">{plan.min_frontage}m</span></p>
                                                            <p className="font-black text-gray-400 uppercase tracking-widest leading-none">Min Depth: <span className="text-gray-900">{plan.min_depth}m</span></p>
                                                        </div>

                                                        {/* Price Tag */}
                                                        <div className="mt-2 text-center">
                                                            <span className="text-xl md:text-2xl font-black text-[#0796b1] italic tracking-tighter">${Math.round(plan.price).toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                        );
                                    })}
                                </Swiper>

                                <button
                                    onClick={() => swiperRef.current?.slideNext()}
                                    className="absolute right-2 md:right-4 z-[50] w-10 h-10 md:w-12 md:h-12 bg-[#0796b1] text-white rounded-full hidden md:flex items-center justify-center shadow-xl hover:scale-110 active:scale-90 transition-all cursor-pointer"
                                >
                                    <ChevronRight size={24} strokeWidth={3} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Selection Hub Summary */}
                <div className="w-full lg:w-[32%] flex flex-col gap-6">
                    <div className="bg-white rounded-[24px] md:rounded-[32px] border border-gray-100 p-6 md:p-10 shadow-lg space-y-8 md:space-y-12 min-h-0 lg:min-h-[600px]">
                        <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tighter">SUMMARY</h2>

                        <div className="space-y-8 md:space-y-10">
                            {/* Floorplan Section */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black text-[#0796b1] uppercase tracking-[0.4em] border-b border-gray-50 pb-2">FLOORPLAN</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-[10px] md:text-[11px]">
                                        <span className="font-bold text-gray-500 uppercase tracking-widest">Name: <span className="text-gray-900 truncate max-w-[100px] md:max-w-none inline-block align-bottom">{selectedPlan?.title || "Unknown"}</span></span>
                                        <span className="font-bold text-gray-900">${(selectedPlan?.price || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] md:text-[11px] pt-1 pt-2 border-t border-gray-50">
                                        <span className="font-bold text-gray-900 uppercase tracking-widest">Subtotal:</span>
                                        <span className="font-black text-[#0796b1]">${(selectedPlan?.price || 0).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Total Area */}
                            <div className="pt-4 md:pt-12 flex justify-end items-center gap-4 md:gap-6">
                                <span className="text-lg md:text-xl font-black text-gray-900 uppercase tracking-tighter italic">TOTAL:</span>
                                <span className="text-3xl md:text-5xl font-black text-[#0796b1] tracking-tighter italic">
                                    ${Math.round(selectedPlan?.price || 0).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pr-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-[#0796b1] text-white px-6 md:px-8 py-2 md:py-3.5 rounded-xl font-black uppercase text-[9px] md:text-[10px] tracking-widest shadow-lg shadow-cyan-900/10 hover:bg-cyan-700 transition-all"
                        >
                            RESTART QUOTE
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Nav Section */}
            <div className="flex flex-col items-center gap-6 py-8 md:py-12 relative overflow-visible">
                <div className="relative group">
                    <AnimatePresence>
                        {selectedPlan && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute top-[-50px] md:top-[-55px] left-1/2 -translate-x-1/2 bg-[#0796b1] text-white px-6 md:px-8 py-2 md:py-2.5 rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] whitespace-nowrap shadow-xl z-20"
                            >
                                Press to continue building your quote
                                <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0796b1] rotate-45" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        onClick={handleNext}
                        disabled={!selectedPlan}
                        className={`px-12 md:px-20 py-4 md:py-5 rounded-[24px] md:rounded-[32px] font-black uppercase text-xs md:text-sm tracking-[0.3em] flex items-center gap-4 md:gap-6 transition-all shadow-2xl active:scale-95 ${selectedPlan
                            ? 'bg-gray-900 text-white hover:bg-black shadow-gray-900/40 hover:-translate-y-1'
                            : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                            }`}
                    >
                        NEXT STEP <ChevronRight size={24} strokeWidth={4} />
                    </button>
                </div>

                <button
                    onClick={onBack}
                    className="text-[#0796b1] font-black uppercase text-[9px] md:text-[10px] tracking-[0.4em] hover:opacity-80 transition-all underline underline-offset-4 md:underline-offset-8 decoration-2"
                >
                    &lt; GO BACK
                </button>
            </div>

            {/* Lightbox / Modals */}
            <AnimatePresence>
                {viewingImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setViewingImage(null)}
                        className="fixed inset-0 z-[200] bg-gray-900/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-20"
                    >
                        <button className="absolute top-4 right-4 md:top-10 md:right-10 text-white bg-white/10 p-3 md:p-5 rounded-full hover:bg-white/20 transition-all">
                            <X size={24} />
                        </button>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full h-full max-w-7xl bg-white rounded-[32px] md:rounded-[56px] overflow-hidden p-8 md:p-16 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={viewingImage}
                                alt="High Resolution Detail"
                                fill
                                className="object-contain p-4 md:p-12"
                                priority
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {viewingPDF && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[250] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
                    >
                        <div className="relative w-full h-full max-w-6xl bg-white rounded-[32px] md:rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
                            <div className="flex items-center justify-between p-6 md:p-8 border-b border-gray-100 bg-gray-50/50">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-[#0796b1]/10 text-[#0796b1] rounded-2xl">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-gray-900 uppercase tracking-tight italic">STANDARD <span className="text-[#0796b1]">INCLUSIONS</span></h3>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-1">Mitra Home Premium Specifications</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setViewingPDF(false)}
                                    className="p-3 bg-white border border-gray-200 rounded-full hover:bg-gray-100 transition-all shadow-sm"
                                >
                                    <X size={20} className="text-gray-400" />
                                </button>
                            </div>

                            <div className="flex-1 bg-gray-100 p-2 md:p-8 relative">
                                {inclusionsPdfUrl ? (
                                    <iframe
                                        src={`${getFullUrl(inclusionsPdfUrl)}#toolbar=0&navpanes=0`}
                                        className="w-full h-full rounded-2xl border-none bg-white shadow-inner"
                                        title="Inclusions PDF"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-center p-10 grayscale opacity-20">
                                        <FileText size={48} className="mb-4" />
                                        <p className="font-black uppercase tracking-widest italic tracking-tighter">Inclusions PDF not available</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
