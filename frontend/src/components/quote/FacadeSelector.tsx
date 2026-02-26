"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { api, getFullUrl } from "@/services/api";
import { ArrowRight, ChevronLeft, ChevronRight, X, ZoomIn, Search, Info } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Mousewheel } from 'swiper/modules';
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

            {/* Main Selection Area */}
            <div className="flex flex-col lg:flex-row gap-8 items-stretch">

                {/* Left Column: Facades Browser */}
                <div className="flex-grow lg:w-[68%] bg-white rounded-[40px] border border-gray-100 p-8 flex flex-col min-h-[700px] shadow-sm overflow-hidden">
                    <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-8 px-4">FACADES</h2>

                    <div className="relative flex-grow flex items-center justify-center py-10 overflow-hidden">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0796b1]"></div>
                            </div>
                        ) : (
                            <div className="relative w-full h-full flex items-center justify-center">
                                {/* Navigation Arrows */}
                                <button
                                    onClick={() => swiperRef.current?.slidePrev()}
                                    className="absolute left-4 z-[50] w-12 h-12 bg-[#0796b1] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-90 transition-all cursor-pointer"
                                >
                                    <ChevronLeft size={24} strokeWidth={3} />
                                </button>

                                <Swiper
                                    onSwiper={(swiper) => { swiperRef.current = swiper; }}
                                    onSlideChange={(swiper) => setSelectedFacade(facades[swiper.activeIndex])}
                                    modules={[Navigation, Mousewheel]}
                                    mousewheel={true}
                                    centeredSlides={true}
                                    slidesPerView={1.4}
                                    spaceBetween={20}
                                    className="w-full !overflow-visible facade-swiper"
                                >
                                    {facades.map(facade => {
                                        const isSelected = selectedFacade?.id === facade.id;
                                        return (
                                            <SwiperSlide key={facade.id} className="h-full">
                                                <div
                                                    onClick={() => setSelectedFacade(facade)}
                                                    className={`mx-auto bg-white border-2 rounded-[32px] transition-all duration-700 cursor-pointer overflow-hidden flex flex-col h-full min-h-[480px] max-w-[800px] ${isSelected
                                                        ? 'border-[#0796b1] shadow-[0_35px_60px_-15px_rgba(7,150,177,0.3)]'
                                                        : 'border-gray-100 hover:border-gray-200'
                                                        }`}
                                                >
                                                    {/* Facade Image Container */}
                                                    <div className="relative w-full flex-grow group">
                                                        <Image
                                                            src={getFullUrl(facade.image_url)}
                                                            alt={facade.title}
                                                            fill
                                                            className="object-cover"
                                                            priority
                                                        />

                                                        {/* Top UI Elements */}
                                                        <div className="absolute top-6 left-6 z-10">
                                                            <button
                                                                className="w-10 h-10 bg-[#0796b1] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all"
                                                                onClick={(e) => { e.stopPropagation(); setViewingImage(getFullUrl(facade.image_url)); }}
                                                            >
                                                                <ZoomIn size={20} />
                                                            </button>
                                                        </div>

                                                        {isSelected && (
                                                            <div className="absolute top-6 right-6 z-10">
                                                                <button
                                                                    className="bg-[#0796b1] text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg"
                                                                    onClick={(e) => { e.stopPropagation(); }}
                                                                >
                                                                    UNSELECT
                                                                </button>
                                                            </div>
                                                        )}

                                                        {/* Bottom Info Bar - Re-styled to match screenshot logic */}
                                                        <div className="absolute bottom-0 left-0 right-0 bg-[#0796b1] text-white flex justify-between items-center px-10 py-6 transform transition-transform group-hover:scale-[1.01]">
                                                            <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">{facade.title}</h3>
                                                            <span className="text-2xl font-black italic tracking-tighter leading-none opacity-90">
                                                                {facade.price === 0 || !facade.price ? "Included" : `+$${facade.price.toLocaleString()}`}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                        );
                                    })}
                                </Swiper>

                                <button
                                    onClick={() => swiperRef.current?.slideNext()}
                                    className="absolute right-4 z-[50] w-12 h-12 bg-[#0796b1] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-90 transition-all cursor-pointer"
                                >
                                    <ChevronRight size={24} strokeWidth={3} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Design Note Disclaimer */}
                    <div className="mt-4 px-10 text-center pb-4">
                        <p className="text-[9px] font-bold text-gray-400 leading-relaxed uppercase tracking-widest px-10 md:px-20">
                            This facade render is indicative only. Please note this render may depict upgrades. Driveways, landscaping, blinds and fencing are not included and can be added as an upgrade.
                        </p>
                    </div>
                </div>

                {/* Right Column: Quote Summary Hub */}
                <div className="lg:w-[32%] flex flex-col gap-6">
                    <div className="bg-white rounded-[32px] border border-gray-100 p-10 shadow-2xl space-y-12 min-h-[600px]">
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">QUOTE SUMMARY</h2>

                        <div className="space-y-10">
                            {/* Floorplan Section */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black text-[#0796b1] uppercase tracking-[0.4em] border-b border-gray-50 pb-2">FLOORPLAN</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-[11px]">
                                        <span className="font-bold text-gray-500 uppercase tracking-widest">Floorplan Name: <span className="text-gray-900">{selectedFloorPlan.title}</span></span>
                                        <span className="font-bold text-gray-900">${(selectedFloorPlan.price || 232596).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[11px] pt-1">
                                        <span className="font-bold text-gray-900 uppercase tracking-widest">Subtotal:</span>
                                        <span className="font-black text-[#0796b1]">${(selectedFloorPlan.price || 232596).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Facade Section */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black text-[#0796b1] uppercase tracking-[0.4em] border-b border-gray-50 pb-2">FACADE</h3>
                                {selectedFacade ? (
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-[11px]">
                                            <span className="font-bold text-gray-500 uppercase tracking-widest">Facade Name: <span className="text-gray-900">{selectedFacade.title}</span></span>
                                            <span className="font-bold text-[#0796b1]">Included</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[11px] pt-1">
                                            <span className="font-bold text-gray-900 uppercase tracking-widest">Subtotal:</span>
                                            <span className="font-black text-[#0796b1]">Included</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-6 border border-dashed border-gray-100 rounded-2xl text-center opacity-40">
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Selection pending</p>
                                    </div>
                                )}
                            </div>

                            {/* Total Area */}
                            <div className="pt-12 flex justify-end items-center gap-6">
                                <span className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">TOTAL:</span>
                                <span className="text-5xl font-black text-[#0796b1] tracking-tighter italic">
                                    ${Math.round(selectedFloorPlan.price || 232596).toLocaleString()}
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
                        {selectedFacade && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute top-[-55px] left-1/2 -translate-x-1/2 bg-[#0796b1] text-white px-8 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] whitespace-nowrap shadow-xl z-20"
                            >
                                To continue building your quote, please press this button
                                <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0796b1] rotate-45" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        onClick={handleNext}
                        disabled={!selectedFacade}
                        className={`px-24 py-7 rounded-[32px] font-black uppercase text-sm tracking-[0.3em] flex items-center gap-6 transition-all shadow-2xl active:scale-95 ${selectedFacade
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
