"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { api, getFullUrl } from "@/services/api";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectCoverflow } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { motion, AnimatePresence } from "framer-motion";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';

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
            // Fetch facades for this floorplan based on stories
            const data: any = await api.getFacades({
                limit: 100,
                is_active: true, // Only show active facades in the quote builder
                stories: selectedFloorPlan.stories // Filter by selected floorplan's stories
            });

            // Set facades (data.data is the array from our controller)
            setFacades(data.data || []);
        } catch (error) {
            console.error("Failed to load facades", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (facade: any) => {
        setSelectedFacade(facade);
    };

    const handleNext = () => {
        if (selectedFacade) {
            onSelect(selectedFacade);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column: Facades Slider */}
            <div className="flex-grow lg:w-2/3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[500px]">

                {/* Header */}
                <div className="flex items-end justify-between gap-4 mb-8 pb-4 border-b border-gray-100">
                    <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight uppercase">Facades</h2>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest px-4 py-1.5 bg-gray-50 rounded-full border border-gray-100">
                        Compatible with {selectedFloorPlan.title}
                    </p>
                </div>

                {/* Slider */}
                {loading ? (
                    <div className="flex justify-center items-center h-[350px]">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                    </div>
                ) : facades.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[350px] text-gray-400">
                        <X size={48} className="mb-4 opacity-10" />
                        <p className="font-bold uppercase tracking-widest text-[10px]">No compatible facades found.</p>
                        <button
                            onClick={onBack}
                            className="mt-4 text-black underline font-black text-[10px] uppercase tracking-[0.2em]"
                        >
                            Change Floorplan
                        </button>
                    </div>
                ) : (
                    <div className="relative px-8 group mt-8">
                        {/* Swiper Active Slide Styling */}
                        <style jsx global>{`
                            .facade-swiper .swiper-slide {
                                transition: all 0.5s ease;
                                transform: scale(0.85);
                                opacity: 0.3 !important;
                                filter: grayscale(1);
                            }
                            .facade-swiper .swiper-slide-active {
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
                            className="pb-4 facade-swiper"
                        >
                            {facades.map(facade => (
                                <SwiperSlide key={facade.id} className="w-[200px] sm:w-[240px]">
                                    <div className={`bg-white rounded-xl overflow-hidden h-full flex flex-col relative transition-all duration-300 border-2 ${selectedFacade?.id === facade.id ? 'border-black shadow-xl' : 'border-gray-100 shadow-sm'}`}>

                                        {/* Select Indicator */}
                                        {selectedFacade?.id === facade.id && (
                                            <div className="absolute top-0 inset-x-0 h-1 bg-black z-20"></div>
                                        )}

                                        {/* Action Button Top Right */}
                                        <div className="absolute top-2 right-2 z-10">
                                            <button
                                                onClick={() => handleSelect(facade)}
                                                className={`text-[8px] font-bold px-2 py-1 rounded-full uppercase transition-all ${selectedFacade?.id === facade.id ? 'bg-black text-white' : 'bg-white text-black border border-gray-100 hover:bg-gray-50 shadow-sm'}`}
                                            >
                                                {selectedFacade?.id === facade.id ? 'Selected' : 'Select'}
                                            </button>
                                        </div>

                                        {/* Zoom/Fancy Icon */}
                                        <div className="absolute top-2 left-2 z-10">
                                            <button
                                                onClick={() => setViewingImage(getFullUrl(facade.image_url))}
                                                className="bg-white/90 backdrop-blur-sm text-black p-1 rounded-full hover:bg-white shadow-sm transition-all"
                                                title="View Large"
                                            >
                                                <ZoomIn size={12} />
                                            </button>
                                        </div>

                                        {/* Image Area */}
                                        <div className="relative h-48 bg-white p-3 pt-10">
                                            <div className="relative w-full h-full">
                                                {facade.image_url ? (
                                                    <Image
                                                        src={getFullUrl(facade.image_url)}
                                                        alt={facade.title}
                                                        fill
                                                        className="object-contain"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-gray-300">No Image</div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Content Area */}
                                        <div className="flex flex-col items-center text-center p-4 flex-grow">
                                            <h3 className="text-base font-black text-gray-900 uppercase mb-0.5 tracking-tight">{facade.title}</h3>
                                            <button
                                                onClick={() => setViewingImage(getFullUrl(facade.image_url))}
                                                className="text-gray-500 text-[8px] font-bold underline uppercase mb-3 hover:text-black tracking-widest"
                                            >
                                                View Facade
                                            </button>

                                            <button className="bg-gray-100 text-gray-900 text-[8px] font-black px-4 py-1.5 rounded-full mb-4 hover:bg-gray-200 uppercase tracking-widest transition-colors">
                                                Inclusions
                                            </button>

                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-auto">
                                                Included in Price
                                            </div>
                                        </div>

                                        {/* Footer / Status */}
                                        <div className="bg-gray-900 text-white py-2.5 text-center text-[10px] font-black mt-auto tracking-widest uppercase">
                                            {selectedFacade?.id === facade.id ? 'Slected' : 'Available'}
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
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col min-h-[400px]">
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-8 border-b border-gray-100 pb-4">Quote Summary</h3>

                    <div className="flex-grow space-y-8">
                        {/* Floorplan Info */}
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Floorplan</span>
                                <span className="text-sm font-black text-gray-900 uppercase">{selectedFloorPlan.title}</span>
                            </div>
                            <span className="font-black text-gray-900 text-sm">${(selectedFloorPlan.price || 232596).toLocaleString()}</span>
                        </div>

                        {/* Facade Info */}
                        {selectedFacade ? (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex justify-between items-start border-t border-gray-50 pt-6"
                            >
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Facade</span>
                                    <span className="text-sm font-black text-gray-900 uppercase">{selectedFacade.title}</span>
                                </div>
                                <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Included</span>
                            </motion.div>
                        ) : (
                            <div className="text-gray-400 italic text-[11px] text-center mt-12 bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-200">
                                Select a facade to update your summary
                            </div>
                        )}
                    </div>

                    <div className="mt-auto pt-8 border-t border-gray-100">
                        <div className="flex justify-between items-center text-2xl font-black">
                            <span className="text-gray-400 uppercase text-xs tracking-[0.2em]">Subtotal</span>
                            <span className="text-gray-900">
                                ${(selectedFloorPlan.price || 232596).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Next Step Button */}
                <button
                    disabled={!selectedFacade}
                    onClick={handleNext}
                    className={`w-full py-5 rounded-2xl font-black uppercase text-sm tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 ${selectedFacade
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
                                alt="Facade Preview"
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
