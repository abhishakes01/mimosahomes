"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Bed, Bath, Car, Maximize, ChevronDown, MapPin, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { getFullUrl } from "@/services/api";

interface ReadyBuiltCardProps {
    listing: any;
}

export default function ReadyBuiltCard({ listing }: ReadyBuiltCardProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [showFloorplan, setShowFloorplan] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const floorplan = listing.floorplan || {};
    const facade = listing.facade || {};
    const mainImage = listing.images?.[0] || facade.image_url || "/placeholder-home.jpg";

    const isSold = listing.status === "sold";

    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-[0_5px_20px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col group transition-all duration-500 hover:shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
            {/* Top: Image Section */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={getFullUrl(mainImage)}
                    alt={listing.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {isSold && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur-md px-8 py-2 rounded-full shadow-xl">
                            <span className="text-gray-900 font-black uppercase text-xl tracking-tighter italic">SOLD</span>
                        </div>
                    </div>
                )}

                {/* Status Badges */}
                <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest text-gray-900 shadow-sm border border-gray-100">
                        {listing.collection === "V_Collection" ? "V COLLECTION" : "M COLLECTION"}
                    </span>
                </div>
            </div>

            {/* Middle Content */}
            <div className="p-6 flex-grow space-y-4">
                <div className="text-center space-y-1">
                    <span className="text-[10px] font-bold text-mimosa-gold uppercase tracking-[0.2em]">Floorplan</span>
                    <h3 className="text-xl font-extrabold text-gray-900 uppercase tracking-tight italic">{listing.title}</h3>
                </div>

                <div className="flex items-center justify-center gap-2 text-gray-500 text-sm font-medium text-center italic">
                    <MapPin size={14} className="text-mimosa-gold flex-shrink-0" />
                    <span>{listing.address}</span>
                </div>

                {/* Icon Bar */}
                <div className="grid grid-cols-4 gap-2 pt-4 border-t border-gray-100">
                    {[
                        { icon: Bed, val: floorplan.bedrooms || 4 },
                        { icon: Bath, val: floorplan.bathrooms || 2 },
                        { icon: Car, val: floorplan.car_spaces || 2 },
                        { icon: Maximize, val: `${floorplan.total_area || 0}m²` },
                    ].map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-1 group/icon">
                            <item.icon size={18} className="text-gray-400 group-hover/icon:text-mimosa-gold transition-colors" />
                            <span className="text-xs font-black text-gray-900">{item.val}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-6 pt-0 space-y-4">
                <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price</span>
                    <p className="text-2xl font-black text-[#005a8f] tracking-tighter">
                        {isSold ? "SOLD" : (listing.price ? `$${isMounted ? Number(listing.price).toLocaleString() : listing.price}+` : "TBA")}
                    </p>
                </div>

                <div className="space-y-3">
                    <Link
                        href={`/package/${listing.id}`}
                        className="w-full bg-[#005a8f] text-white py-3 rounded-lg font-black uppercase text-xs tracking-widest hover:bg-[#004a75] transition-all shadow-lg flex items-center justify-center"
                    >
                        View package
                    </Link>

                    <button
                        onClick={() => setShowFloorplan(true)}
                        className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#005a8f] hover:text-mimosa-gold transition-colors"
                    >
                        <ChevronDown size={14} />
                        View Floorplan
                    </button>
                </div>
            </div>

            {/* Large Floorplan Modal */}
            <AnimatePresence>
                {showFloorplan && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowFloorplan(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            className="relative w-full max-w-4xl max-h-[95vh] bg-white rounded-3xl shadow-2xl overflow-y-auto p-6 md:p-8 flex flex-col items-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setShowFloorplan(false)}
                                className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-900 z-10"
                            >
                                <X size={20} />
                            </button>

                            <div className="text-center mb-6">
                                <span className="text-[10px] font-bold text-mimosa-gold uppercase tracking-[0.3em] mb-1 block">Floorplan</span>
                                <h2 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">{listing.title}</h2>
                                <p className="text-gray-400 text-xs mt-2 font-medium">{listing.address}</p>
                            </div>

                            <div className="w-full flex items-center justify-center bg-gray-50 rounded-2xl p-4 md:p-6 mb-6">
                                {floorplan.image_url ? (
                                    <img
                                        src={getFullUrl(floorplan.image_url)}
                                        alt={`${listing.title} Floorplan`}
                                        className="max-w-full max-h-[55vh] object-contain"
                                    />
                                ) : (
                                    <div className="py-20 text-gray-300 font-bold uppercase tracking-widest italic text-xs">Floorplan coming soon</div>
                                )}
                            </div>

                            {/* Info Bar in Modal */}
                            <div className="grid grid-cols-4 gap-4 md:gap-10 pt-6 border-t border-gray-100 w-full max-w-xl">
                                {[
                                    { icon: Bed, val: floorplan.bedrooms || 4, label: "Beds" },
                                    { icon: Bath, val: floorplan.bathrooms || 2, label: "Baths" },
                                    { icon: Car, val: floorplan.car_spaces || 2, label: "Cars" },
                                    { icon: Maximize, val: `${floorplan.total_area || 0}m²`, label: "Size" },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex flex-col items-center gap-1">
                                        <item.icon size={20} className="text-mimosa-gold mb-1" />
                                        <span className="text-base font-black text-gray-900 tracking-tighter leading-none">{item.val}</span>
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
