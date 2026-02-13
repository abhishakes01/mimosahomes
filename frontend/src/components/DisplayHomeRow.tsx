"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bed, Bath, Car, Maximize, ArrowRight, Search, ChevronRight, ChevronLeft } from "lucide-react";
import { getFullUrl } from "@/services/api";

interface DisplayHomeRowProps {
    home: any;
    primaryColor: string;
}

export default function DisplayHomeRow({ home, primaryColor }: DisplayHomeRowProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Collect images: Main facade + Linked facades
    // storing as { url: string, title: string }
    const images = [
        { url: home.facadeImageRaw, title: home.name },
        ...(home.linkedFacades || []).filter((f: any) => f).map((f: any) => ({ url: f.image_url, title: f.title }))
    ].filter(img => img.url);

    // Deduplicate by URL
    const uniqueImages = images.filter((img, index, self) =>
        index === self.findIndex((t) => t.url === img.url)
    );

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

    const currentImage = uniqueImages[currentImageIndex];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row h-full">

                {/* Left: Details */}
                <div className="lg:w-1/3 p-6 lg:p-8 flex flex-col relative">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{home.name}</h2>
                            <div className="w-12 h-1 mt-2 mb-4" style={{ backgroundColor: primaryColor }}></div>
                        </div>
                        {/* Brand Logo/Icon Placeholder */}
                        <div className="text-gray-300">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z" /></svg>
                        </div>
                    </div>

                    <div className="space-y-6 flex-grow">
                        <div className="inline-block px-3 py-1 bg-gray-100 rounded text-sm font-semibold text-gray-600">
                            {/* Display approx squares */}
                            {Math.round(home.sqm / 9.29)} sq
                        </div>

                        <div className="grid grid-cols-5 gap-4 text-center">
                            {[
                                { icon: Bed, val: home.beds, label: "Beds" },
                                { icon: Bath, val: home.baths, label: "Baths" },
                                { icon: Car, val: home.cars, label: "Cars" },
                                { icon: ArrowRight /* Width Icon placeholder */, val: home.width, label: "Width" },
                                { icon: Maximize, val: home.sqm, label: "Size" },
                            ].map((item, idx) => (
                                <div key={idx} className="flex flex-col items-center gap-1 group">
                                    <item.icon size={20} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                                    <span className="font-bold text-gray-900">{item.val}{item.label === "Size" ? "m²" : (item.label === "Width" ? "m" : "")}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8">
                        <Link
                            href={`/new-home-designs/${home.id}`} // Assuming listings detail page exists
                            className="w-full py-3 rounded-lg text-white font-semibold transition-colors flex items-center justify-center gap-2 hover:opacity-90"
                            style={{ backgroundColor: primaryColor }}
                        >
                            See Details
                        </Link>
                    </div>
                </div>

                {/* Middle: Floorplan */}
                <div className="lg:w-1/3 border-t lg:border-t-0 lg:border-l border-b lg:border-b-0 border-gray-100 p-8 flex items-center justify-center bg-gray-50/50 relative">
                    <div className="absolute top-4 right-4 z-10">
                        <button className="p-2 bg-white rounded-full shadow-sm text-gray-400 hover:text-gray-600">
                            <Search size={18} />
                        </button>
                    </div>
                    <div className="w-full h-full relative min-h-[200px]">
                        {home.floorplanImage ? (
                            <Image
                                src={home.floorplanImage}
                                alt={`${home.name} Floorplan`}
                                fill
                                className="object-contain mix-blend-multiply opacity-80"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400 text-sm">No Floorplan Available</div>
                        )}
                    </div>
                </div>

                {/* Right: Facade Slider */}
                <div className="lg:w-1/3 relative group/facade overflow-hidden bg-gray-100 min-h-[250px] lg:min-h-0">
                    {currentImage && (
                        <Image
                            key={currentImage.url} // Key change triggers animation if we add it, or just plain switch
                            src={getFullUrl(currentImage.url)}
                            alt={currentImage.title}
                            fill
                            className="object-cover transition-transform duration-700"
                        />
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-100 transition-opacity flex items-end justify-center pb-6 pointer-events-none">
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-white font-medium flex items-center gap-2 pointer-events-auto">
                                {currentImage?.title || home.name}
                            </span>
                            {uniqueImages.length > 1 && (
                                <span className="text-[10px] text-white/80 uppercase tracking-widest">{currentImageIndex + 1} / {uniqueImages.length}</span>
                            )}
                        </div>
                    </div>

                    {/* Navigation */}
                    {uniqueImages.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/20 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-all opacity-0 group-hover/facade:opacity-100"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/20 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-all opacity-0 group-hover/facade:opacity-100"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
}
