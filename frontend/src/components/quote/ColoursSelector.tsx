"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { api, getFullUrl } from "@/services/api";
import { ChevronRight, X, ZoomIn, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ColoursSelectorProps {
    selectedFacade: any;
    selectedFloorPlan: any;
    onBack: () => void;
    onSelect: (data: { facadeScheme: any, interiorScheme: any }) => void;
}

export default function ColoursSelector({ selectedFacade, selectedFloorPlan, onBack, onSelect }: ColoursSelectorProps) {
    const [loading, setLoading] = useState(true);
    const [facadeSchemes, setFacadeSchemes] = useState<any[]>([]);
    const [interiorSchemes, setInteriorSchemes] = useState<any[]>([]);

    // Selection State
    const [selectedFacadeScheme, setSelectedFacadeScheme] = useState<any>(null);
    const [selectedInteriorScheme, setSelectedInteriorScheme] = useState<any>(null);

    // Step State: 'facade' or 'interior'
    const [subStep, setSubStep] = useState<'facade' | 'interior'>('facade');
    const [viewingImage, setViewingImage] = useState<string | null>(null);

    useEffect(() => {
        if (selectedFacade?.id) {
            loadFacadeDetails();
        }
    }, [selectedFacade]);

    const loadFacadeDetails = async () => {
        try {
            setLoading(true);
            const data: any = await api.getFacade(selectedFacade.id);
            if (data.variants && Array.isArray(data.variants)) {
                const fSchemes = data.variants.filter((v: any) => v.type === 'facade');
                const iSchemes = data.variants.filter((v: any) => v.type === 'interior');
                setFacadeSchemes(fSchemes);
                setInteriorSchemes(iSchemes);

                // Auto-select first schemes
                if (fSchemes.length > 0) setSelectedFacadeScheme(fSchemes[0]);
                if (iSchemes.length > 0) setSelectedInteriorScheme(iSchemes[0]);
            }
        } catch (error) {
            console.error("Failed to load facade details", error);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (subStep === 'facade' && selectedFacadeScheme) {
            setSubStep('interior');
        } else if (subStep === 'interior' && selectedInteriorScheme) {
            onSelect({
                facadeScheme: selectedFacadeScheme,
                interiorScheme: selectedInteriorScheme
            });
        }
    };

    const handleBack = () => {
        if (subStep === 'interior') {
            setSubStep('facade');
        } else {
            onBack();
        }
    };

    const currentSchemes = subStep === 'facade' ? facadeSchemes : interiorSchemes;
    const currentSelection = subStep === 'facade' ? selectedFacadeScheme : selectedInteriorScheme;

    return (
        <div className="flex flex-col gap-8 w-full">

            {/* Top Row: Browser and Summary */}
            <div className="flex flex-col lg:flex-row gap-8 items-stretch">

                {/* Left: Colours Browser */}
                <div className="flex-grow lg:w-[68%] bg-white rounded-[40px] border border-gray-100 p-8 lg:p-12 flex flex-col min-h-[750px] shadow-sm">
                    <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-8 px-4">
                        {subStep === 'facade' ? 'EXTERNAL COLOURS SCHEMES' : 'INTERNAL COLOURS SCHEMES'}
                    </h2>

                    <div className="relative flex-grow">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0796b1]"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                                {currentSchemes.map(scheme => {
                                    const isSelected = currentSelection?.id === scheme.id;
                                    return (
                                        <div
                                            key={scheme.id}
                                            onClick={() => subStep === 'facade' ? setSelectedFacadeScheme(scheme) : setSelectedInteriorScheme(scheme)}
                                            className={`group relative bg-white border-2 rounded-[24px] cursor-pointer overflow-hidden transition-all duration-300 ${isSelected
                                                ? 'border-[#0796b1] shadow-[0_20px_40px_-10px_rgba(7,150,177,0.25)] scale-[1.02]'
                                                : 'border-gray-100 hover:border-gray-200'
                                                }`}
                                        >
                                            {/* Top Image Section */}
                                            <div className="relative w-full h-48 overflow-hidden">
                                                <Image
                                                    src={getFullUrl(scheme.image_url)}
                                                    alt={scheme.name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute top-4 left-4 z-10">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setViewingImage(getFullUrl(scheme.image_url)); }}
                                                        className="w-8 h-8 bg-[#0796b1] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all"
                                                    >
                                                        <ZoomIn size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Bottom Info Row */}
                                            <div className="px-5 py-4 flex justify-between items-center border-t border-gray-50">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-black text-gray-900 uppercase tracking-tight">{scheme.name}</span>
                                                    <Info size={14} className="text-[#0796b1] cursor-help" />
                                                </div>
                                                <span className="text-xs font-black text-[#0796b1]">
                                                    {scheme.price === 0 || !scheme.price ? "Included" : `+$${scheme.price.toLocaleString()}`}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Disclaimer and Info Footer */}
                    <div className="mt-12 space-y-8 px-4">
                        <p className="text-[10px] font-bold text-gray-400 text-center leading-relaxed uppercase tracking-widest px-10 md:px-20">
                            This facade render is indicative only and is only used to assist in choosing an external colour scheme. Please note this render may depict upgrades. Driveways, landscaping, blinds and fencing are not included and can be added as an upgrade.
                        </p>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-900 uppercase tracking-widest">
                            <span>Press</span>
                            <Info size={16} className="text-[#0796b1] fill-[#0796b1] text-white p-[2px] rounded-full" />
                            <span>for more information</span>
                        </div>
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
                            </div>

                            {/* Colours Section */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black text-[#0796b1] uppercase tracking-[0.4em] border-b border-gray-50 pb-2">COLOUR SCHEMES</h3>
                                <div className="space-y-3">
                                    {selectedFacadeScheme && (
                                        <div className="flex justify-between items-center text-[11px]">
                                            <span className="font-bold text-gray-500 uppercase tracking-widest">External: <span className="text-gray-900">{selectedFacadeScheme.name}</span></span>
                                            <span className="font-bold text-[#0796b1]">
                                                {selectedFacadeScheme.price > 0 ? `$${selectedFacadeScheme.price.toLocaleString()}` : 'Included'}
                                            </span>
                                        </div>
                                    )}
                                    {selectedInteriorScheme && (
                                        <div className="flex justify-between items-center text-[11px]">
                                            <span className="font-bold text-gray-500 uppercase tracking-widest">Internal: <span className="text-gray-900">{selectedInteriorScheme.name}</span></span>
                                            <span className="font-bold text-[#0796b1]">
                                                {selectedInteriorScheme.price > 0 ? `$${selectedInteriorScheme.price.toLocaleString()}` : 'Included'}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center text-[11px] pt-1 border-t border-gray-50 mt-2 pt-3">
                                        <span className="font-bold text-gray-900 uppercase tracking-widest">Subtotal:</span>
                                        <span className="font-black text-[#0796b1]">
                                            ${((selectedFacadeScheme?.price || 0) + (selectedInteriorScheme?.price || 0)).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Total Area */}
                            <div className="pt-12 flex justify-end items-center gap-6">
                                <span className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">TOTAL:</span>
                                <span className="text-5xl font-black text-[#0796b1] tracking-tighter italic">
                                    ${Math.round(
                                        (selectedFloorPlan.price || 0) +
                                        (selectedFacadeScheme?.price || 0) +
                                        (selectedInteriorScheme?.price || 0)
                                    ).toLocaleString()}
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
                        {((subStep === 'facade' && selectedFacadeScheme) || (subStep === 'interior' && selectedInteriorScheme)) && (
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
                        disabled={subStep === 'facade' ? !selectedFacadeScheme : !selectedInteriorScheme}
                        className={`px-24 py-7 rounded-[32px] font-black uppercase text-sm tracking-[0.3em] flex items-center gap-6 transition-all shadow-2xl active:scale-95 ${(subStep === 'facade' && selectedFacadeScheme) || (subStep === 'interior' && selectedInteriorScheme)
                            ? 'bg-gray-900 text-white hover:bg-black shadow-gray-900/40 hover:-translate-y-1'
                            : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                            }`}
                    >
                        {subStep === 'facade' ? 'NEXT STEP' : 'PROCEED TO UPGRADES'} <ChevronRight size={24} strokeWidth={4} />
                    </button>
                </div>

                <button
                    onClick={handleBack}
                    className="text-[#0796b1] font-black uppercase text-[10px] tracking-[0.4em] underline underline-offset-8 decoration-1 hover:decoration-2 transition-all pb-1 mb-8"
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
