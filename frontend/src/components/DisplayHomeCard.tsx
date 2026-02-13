"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ChevronLeft, MapPin, Phone, Mail, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getFullUrl } from "@/services/api";

export default function DisplayHomeCard({ home, index, isOffice }: { home: any, index: number, isOffice?: boolean }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Collect all unique images: Facade image + Linked Facade images
    const images = isOffice ? [] : [
        home.facade?.image_url,
        ...(home.floorplan?.facades?.map((f: any) => f.image_url) || [])
    ].filter(Boolean);

    const uniqueImages = Array.from(new Set(images));

    const nextImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % uniqueImages.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + uniqueImages.length) % uniqueImages.length);
    };

    const googleMapsUrl = `${process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL || 'https://www.google.com/maps/search/?api=1&query='}${encodeURIComponent(home.address)}`;

    if (isOffice) {
        return (
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group bg-[#0a3a4a] rounded-[24px] overflow-hidden shadow-sm flex flex-col h-full min-h-[600px]"
            >
                <div className="p-12 flex flex-col items-center justify-center flex-grow text-center pb-0">
                    <div className="w-24 h-24 mb-6 relative">
                        <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
                            <path d="M50 5 L10 40 L10 90 L40 90 L40 60 L60 60 L60 90 L90 90 L90 40 Z" fill="none" stroke="currentColor" strokeWidth="4" />
                            <text x="50" y="65" textAnchor="middle" fontSize="12" fontWeight="bold" className="italic">m</text>
                        </svg>
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Mitra</h2>
                        <h3 className="text-xl font-bold text-white uppercase tracking-[0.2em] opacity-80">HOMES</h3>
                    </div>
                </div>

                <div className="p-8 pb-4 text-center">
                    <h3 className="text-2xl font-black text-white mb-1 leading-tight">{home.title}</h3>
                    <p className="text-[11px] font-bold text-white/60">{home.address}</p>
                </div>

                <div className="p-8 pt-0">
                    <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#08a2be]">OPENING HOURS</h4>
                                <p className="text-[11px] font-bold text-gray-700 italic">Open Monday - Friday 9am - 5pm</p>
                            </div>

                            <div className="space-y-1">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#08a2be]">CONTACT</h4>
                                <div className="space-y-1">
                                    <p className="text-[11px] font-black text-gray-900">General enquiries</p>
                                    <p className="text-[11px] font-bold text-gray-500">P: {home.agent_phone}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4">
                            <a
                                href={googleMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] font-black uppercase tracking-widest text-[#0a3a4a] hover:text-[#08a2be] transition-colors"
                            >
                                Get Directions
                            </a>
                            <Link
                                href="/office-location"
                                className="py-2.5 px-6 bg-[#0a3a4a] rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-black transition-all shadow-lg"
                            >
                                View Display
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    const getSuburb = (address: string) => {
        if (!address) return '';
        const parts = address.split(',');
        if (parts.length >= 2) {
            return parts[1].trim(); // Assuming "Street, Suburb, State Postcode"
        }
        return '';
    };

    const suburb = getSuburb(home.address);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full min-h-[600px]"
        >
            {/* Image Slider */}
            <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentImageIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-full relative"
                    >
                        {uniqueImages.length > 0 ? (
                            <Image
                                src={getFullUrl(uniqueImages[currentImageIndex])}
                                alt={home.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Green NEW Badge */}
                <div className="absolute top-0 left-0">
                    <div className="bg-[#2eb039] text-white px-4 py-1.5 text-[11px] font-black uppercase tracking-widest italic rounded-br-2xl shadow-lg">
                        NEW
                    </div>
                </div>

                {/* 1 of 3 counter */}
                {uniqueImages.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        {currentImageIndex + 1} of {uniqueImages.length}
                    </div>
                )}

                {/* Slider Controls */}
                {uniqueImages.length > 1 && (
                    <>
                        <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-[#08a2be] transition-all opacity-0 group-hover:opacity-100">
                            <ChevronLeft size={18} />
                        </button>
                        <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-[#08a2be] transition-all opacity-0 group-hover:opacity-100">
                            <ChevronRight size={18} />
                        </button>
                    </>
                )}

                {/* Overlay text on image like screenshot */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-white text-[10px] font-black uppercase tracking-widest italic leading-none">
                        {home.floorplan?.title} {home.floorplan?.total_area ? `- ${Math.round(home.floorplan.total_area / 9.29)} sq` : ''}
                    </p>
                    <p className="text-white/70 text-[9px] font-bold uppercase tracking-widest mt-1">
                        {home.facade?.title}
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="p-8 flex flex-col flex-grow">
                <div className="mb-6">
                    <h3 className="text-2xl font-black text-gray-900 leading-tight group-hover:text-[#08a2be] transition-colors flex flex-col">
                        <span className="uppercase italic">{home.title}</span>
                        {suburb && <span className="text-[#08a2be] text-lg font-bold">{suburb}</span>}
                    </h3>
                    <p className="text-[11px] font-bold text-gray-400 mt-2">{home.address}</p>
                </div>

                <div className="space-y-6 flex-grow">
                    <div className="space-y-1">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-[#08a2be]">OPENING HOURS</h4>
                        <div className="text-[11px] font-bold text-gray-700 leading-relaxed">
                            <p>Open Monday - Wednesday 12pm - 5pm</p>
                            <p>Saturday - Sunday 11am - 5pm or by appointment</p>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-[#08a2be]">CONTACT</h4>
                        <div className="space-y-2">
                            <div>
                                <p className="text-[11px] font-black text-gray-900">{home.agent_name || 'Maan'}</p>
                                <p className="text-[11px] font-bold text-gray-500">P: {home.agent_phone || '0433 061 889'}</p>
                            </div>
                            {home.agent_name2 && (
                                <div>
                                    <p className="text-[11px] font-black text-gray-900">{home.agent_name2}</p>
                                    <p className="text-[11px] font-bold text-gray-500">P: {home.agent_phone2}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-6 mt-auto">
                    <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-black uppercase tracking-widest text-[#0a3a4a] hover:text-[#08a2be] transition-colors"
                    >
                        Get Directions
                    </a>
                    <Link
                        href={`/display-homes/${home.id}`}
                        className="py-3 px-8 bg-[#0a3a4a] rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-black transition-all shadow-lg shadow-[#0a3a4a]/20"
                    >
                        View Display
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
