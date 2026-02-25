"use client";

import { ChevronRight, Play, Clock, MapPin, Phone, Loader2, Maximize2, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { api, getFullUrl } from "@/services/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";

export default function PhotoGalleryPage() {
    const [images, setImages] = useState<{ url: string; title: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchGalleryImages = async () => {
            try {
                setLoading(true);
                // Fetch all listings to gather images
                const response: any = await api.getListings({ limit: 100 });
                const allListings = response.data || [];

                // Extract images from each listing
                // The user specified "house images" not facades or floorplans
                // listings.images is a JSONB array of strings/URLs
                const flattenedImages: { url: string; title: string }[] = [];

                allListings.forEach((listing: any) => {
                    if (listing.images && Array.isArray(listing.images)) {
                        listing.images.forEach((img: string) => {
                            if (img) {
                                flattenedImages.push({
                                    url: img,
                                    title: listing.title || "Mimosa Home"
                                });
                            }
                        });
                    }
                });

                // Remove duplicates if any (by URL)
                const uniqueImages = Array.from(new Map(flattenedImages.map(img => [img.url, img])).values());

                setImages(uniqueImages);
            } catch (err) {
                console.error("Failed to fetch gallery images:", err);
                setError("Failed to load photo gallery.");
            } finally {
                setLoading(false);
            }
        };

        fetchGalleryImages();
    }, []);

    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="relative h-[55vh] min-h-[400px] flex items-center justify-center overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop"
                    alt="Photo Gallery Hero"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter italic leading-none mb-6"
                    >
                        Photo Gallery
                    </motion.h1>
                    <div className="w-24 h-1 bg-[#0793ad] mx-auto rounded-full" />
                </div>

                {/* Breadcrumbs matching Mporium style */}
                <div className="absolute bottom-8 left-8 z-10 hidden md:flex items-center gap-2 text-white/80 text-xs font-bold uppercase tracking-widest">
                    <Link href="/" className="hover:text-white transition-colors">Mitra Homes</Link>
                    <ChevronRight size={14} className="text-[#0793ad]" />
                    <span className="text-white">Photo Gallery</span>
                </div>
            </section>

            {/* Gallery Grid */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24">
                            <Loader2 className="animate-spin text-[#0793ad] mb-6" size={64} />
                            <p className="text-gray-400 font-black uppercase tracking-[0.3em] italic text-sm">Curating Gallery...</p>
                        </div>
                    ) : error ? (
                        <div className="max-w-2xl mx-auto bg-red-50 p-12 rounded-[40px] text-center border-2 border-dashed border-red-100">
                            <p className="text-red-500 font-bold italic">{error}</p>
                        </div>
                    ) : images.length === 0 ? (
                        <div className="max-w-2xl mx-auto bg-gray-50 p-24 rounded-[40px] text-center border-2 border-dashed border-gray-200">
                            <p className="text-gray-400 font-bold italic italic">No images found in listings.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {images.map((img, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index % 3 * 0.1 }}
                                    className="group relative aspect-[4/3] rounded-[32px] overflow-hidden bg-gray-100 cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500"
                                    onClick={() => setSelectedImage(img.url)}
                                >
                                    <img
                                        src={getFullUrl(img.url)}
                                        alt={img.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button
                            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
                            onClick={() => setSelectedImage(null)}
                        >
                            <X size={48} strokeWidth={1} />
                        </button>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-6xl w-full h-full flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={getFullUrl(selectedImage)}
                                alt="Gallery View"
                                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </main>
    );
}
