"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { api, getFullUrl } from "@/services/api";
import { ArrowRight, ChevronLeft, ChevronRight, X, ZoomIn, Search, Info, Share2 } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { motion, AnimatePresence } from "framer-motion";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface FacadeSelectorProps {
    selectedFloorPlan: any;
    onBack: () => void;
    onSelect: (facade: any) => void;
}

export default function FacadeSelector({ selectedFloorPlan, onBack, onSelect }: FacadeSelectorProps) {
    const [facades, setFacades] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFacade, setSelectedFacade] = useState<any>(null);
    const [viewingImage, setViewingImage] = useState<string | null>(null);
    const swiperRef = useRef<SwiperType>(null);

    useEffect(() => {
        if (selectedFloorPlan) {
            loadData();
        }
    }, [selectedFloorPlan]);

    const loadData = async () => {
        try {
            setLoading(true);
            const data: any = await api.getFacades({
                limit: 100,
                is_active: true,
                stories: selectedFloorPlan.stories
            });
            const facadeList = data.data || [];
            setFacades(facadeList);

            if (facadeList.length > 0) {
                setSelectedFacade(facadeList[0]);
            }
        } catch (error) {
            console.error("Failed to load facades", error);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (selectedFacade) {
            onSelect(selectedFacade);
        }
    };

    const floorplanTitle = selectedFloorPlan?.title || "Unknown Floorplan";
    const basePrice = selectedFloorPlan?.price || 0;

    return (
        <div className="flex flex-col gap-10">
            <style jsx global>{`
                .facade-swiper .swiper-slide {
                    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                    opacity: 0.4;
                    transform: scale(0.85);
                }
                .facade-swiper .swiper-slide-active {
                    opacity: 1;
                    transform: scale(1);
                }
                .facade-swiper .swiper-slide-prev,
                .facade-swiper .swiper-slide-next {
                    opacity: 0.6;
                    transform: scale(0.9);
                    z-index: 10;
                }
            `}</style>

            {/* Top Row: Browser and Summary */}
            <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-stretch">

                {/* Left: Facade Browser */}
                <div className="flex-grow w-full lg:w-[68%] bg-white rounded-[24px] md:rounded-[32px] border border-gray-100 p-4 md:p-8 flex flex-col min-h-[500px] md:min-h-[700px] shadow-sm overflow-hidden">

                    {/* Header: Title */}
                    <div className="mb-4 md:mb-8 md:px-4">
                        <h2 className="text-xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter">SELECT YOUR FACADE</h2>
                        <p className="text-[10px] md:text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Available for {floorplanTitle}</p>
                    </div>

                    {/* Carousel Area */}
                    <div className="relative flex-grow flex items-center justify-center py-6 md:py-10 overflow-hidden">
                        {loading ? (
                            <div className="flex justify-center items-center h-48 md:h-64">
                                <div className="animate-spin rounded-full h-8 w-8 md:h-10 md:w-10 border-b-2 border-[#0796b1]"></div>
                            </div>
                        ) : (
                            <div className="relative w-full h-full flex items-center justify-center">
                                {/* Navigation Arrows - Hidden on Mobile */}
                                <button
                                    onClick={() => swiperRef.current?.slidePrev()}
                                    className="absolute left-2 md:left-4 z-[50] w-10 h-10 md:w-12 md:h-12 bg-[#0796b1] text-white rounded-full hidden md:flex items-center justify-center shadow-xl hover:scale-110 active:scale-90 transition-all cursor-pointer"
                                    aria-label="Previous facade"
                                >
                                    <ChevronLeft size={24} strokeWidth={3} />
                                </button>

                                <Swiper
                                    onSwiper={(swiper) => { swiperRef.current = swiper; }}
                                    onSlideChange={(swiper) => setSelectedFacade(facades[swiper.activeIndex])}
                                    modules={[Navigation]}
                                    mousewheel={false}
                                    centeredSlides={true}
                                    slidesPerView={1.1}
                                    breakpoints={{
                                        768: { slidesPerView: 1.4 }
                                    }}
                                    spaceBetween={10}
                                    className="w-full !overflow-visible facade-swiper"
                                >
                                    {facades.map(facade => {
                                        const isSelected = selectedFacade?.id === facade.id;
                                        return (
                                            <SwiperSlide key={facade.id} className="h-full">
                                                <div
                                                    onClick={() => setSelectedFacade(facade)}
                                                    className={`mx-auto bg-white border-2 rounded-[24px] md:rounded-[32px] transition-all duration-700 cursor-pointer overflow-hidden flex flex-col h-full min-h-[350px] md:min-h-[550px] max-w-[800px] ${isSelected
                                                        ? 'border-[#0796b1] shadow-[0_20px_40px_-10px_rgba(7,150,177,0.3)]'
                                                        : 'border-gray-100 hover:border-gray-200'
                                                        }`}
                                                >
                                                    {/* Top: Image Area */}
                                                    <div className="flex-1 relative bg-white p-4 md:p-8 group overflow-hidden border-b border-gray-50 flex items-center justify-center min-h-[250px] md:min-h-[350px]">
                                                        <div className="absolute top-4 left-4 md:top-6 md:left-8 z-10 flex gap-2">
                                                            <div className="w-8 h-8 md:w-10 md:h-10 bg-[#0796b1] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all cursor-zoom-in"
                                                                onClick={(e) => { e.stopPropagation(); setViewingImage(getFullUrl(facade.image_url)); }}
                                                            >
                                                                <ZoomIn size={20} />
                                                            </div>
                                                        </div>

                                                        {isSelected && (
                                                            <div className="absolute top-4 right-4 md:top-6 md:right-8 z-10">
                                                                <span className="bg-[#0796b1] text-white px-3 md:px-4 py-1.5 rounded-lg text-[8px] md:text-[10px] font-black uppercase tracking-widest shadow-lg">
                                                                    SELECTED
                                                                </span>
                                                            </div>
                                                        )}

                                                        <div className="relative w-full h-full min-h-[200px] md:min-h-[300px]">
                                                            <Image
                                                                src={getFullUrl(facade.image_url)}
                                                                alt={facade.title}
                                                                fill
                                                                className="object-cover rounded-[16px] md:rounded-[24px]"
                                                                priority
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Bottom: Details Area */}
                                                    <div className="p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 bg-white">
                                                        <div className="text-center md:text-left">
                                                            <h3 className="text-xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter leading-none">{facade.title}</h3>
                                                            <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest mt-2">Premium Facade Option</p>
                                                        </div>

                                                        <div className="flex items-center gap-6">
                                                            <div className="text-center md:text-right">
                                                                <span className="text-xl md:text-3xl font-black text-[#0796b1] italic tracking-tighter leading-none">
                                                                    {facade.price === 0 || !facade.price ? "Included" : `+$${facade.price.toLocaleString()}`}
                                                                </span>
                                                                <p className="text-[8px] md:text-[9px] font-black text-gray-300 uppercase tracking-widest mt-1">Investment Amount</p>
                                                            </div>
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
                                    aria-label="Next facade"
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
                            {/* Base Structure */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black text-[#0796b1] uppercase tracking-[0.4em] border-b border-gray-50 pb-2">FLOORPLAN</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-[10px] md:text-[11px]">
                                        <span className="font-bold text-gray-500 uppercase tracking-widest">{floorplanTitle}</span>
                                        <span className="font-bold text-gray-900">${basePrice.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Facade Section */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black text-[#0796b1] uppercase tracking-[0.4em] border-b border-gray-50 pb-2">FACADE</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-[10px] md:text-[11px]">
                                        <span className="font-bold text-gray-500 uppercase tracking-widest">Selection: <span className="text-gray-900">{selectedFacade?.title || "None"}</span></span>
                                        <span className="font-bold text-gray-900">${(selectedFacade?.price || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] md:text-[11px] pt-1 border-t border-gray-50 pt-2">
                                        <span className="font-bold text-gray-900 uppercase tracking-widest">Subtotal:</span>
                                        <span className="font-black text-[#0796b1]">${(basePrice + (selectedFacade?.price || 0)).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Total Area */}
                            <div className="pt-4 md:pt-12 flex justify-end items-center gap-4 md:gap-6">
                                <span className="text-lg md:text-xl font-black text-gray-900 uppercase tracking-tighter italic">TOTAL:</span>
                                <span className="text-3xl md:text-5xl font-black text-[#0796b1] tracking-tighter italic">
                                    ${Math.round(basePrice + (selectedFacade?.price || 0)).toLocaleString()}
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
                        {selectedFacade && (
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
                        disabled={!selectedFacade}
                        className={`px-12 md:px-20 py-4 md:py-5 rounded-[24px] md:rounded-[32px] font-black uppercase text-xs md:text-sm tracking-[0.3em] flex items-center gap-4 md:gap-6 transition-all shadow-2xl active:scale-95 ${selectedFacade
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
