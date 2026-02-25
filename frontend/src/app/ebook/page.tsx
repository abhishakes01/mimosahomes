"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { api, getFullUrl } from "@/services/api";
import EbookModal from "@/components/EbookModal";

export default function EbookPage() {
    const [pageData, setPageData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [modalData, setModalData] = useState<{ isOpen: boolean; collection: string; pdfUrl: string }>({
        isOpen: false,
        collection: "",
        pdfUrl: ""
    });

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const data: any = await api.getPageBySlug('ebook');
                setPageData(data.content);
            } catch (error) {
                console.error("Failed to fetch ebook page data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPage();
    }, []);

    const content = pageData || {};
    const heroImage = content.heroImage
        ? getFullUrl(content.heroImage)
        : "https://images.unsplash.com/photo-1560185063-cf8261358fd4?q=80&w=2070&auto=format&fit=crop";

    const ebooks = [
        {
            id: "v-collection",
            title: "V Collection",
            subtitle: content.vSubtitle || "HOME COLLECTION",
            edition: "EDITION 1",
            accentColor: "#f39200",
            logo: "V",
            bgImage: "https://www.transparenttextures.com/patterns/dark-matter.png",
            pdfUrl: content.vCollectionPdf ? getFullUrl(content.vCollectionPdf) : ""
        },
        {
            id: "m-collection",
            title: "M Collection",
            subtitle: content.mSubtitle || "HOME COLLECTION",
            edition: "EDITION 1",
            accentColor: "#0793ad",
            logo: "M",
            bgImage: "https://www.transparenttextures.com/patterns/carbon-fibre.png",
            pdfUrl: content.mCollectionPdf ? getFullUrl(content.mCollectionPdf) : ""
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="animate-spin text-[#0897b1]" size={64} />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-white font-outfit">
            <Header />

            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <img
                    src={heroImage}
                    alt="Ebook Hero"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60" />
                <div className="relative z-10 text-center text-white px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter italic leading-none"
                    >
                        {content.heroTitle || "EBOOK"}
                    </motion.h1>
                    <div className="w-24 h-1 bg-[#0793ad] mx-auto rounded-full mt-6" />
                </div>

                {/* Breadcrumbs matching Mporium style */}
                <div className="absolute bottom-8 left-8 z-10 hidden md:flex items-center gap-2 text-white/80 text-xs font-bold uppercase tracking-widest">
                    <Link href="/" className="hover:text-white transition-colors">Mitra Homes</Link>
                    <ChevronRight size={14} className="text-[#0793ad]" />
                    <span className="text-white">EBOOK</span>
                </div>
            </section>

            {/* Collection Selection Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                        {ebooks.map((ebook, index) => (
                            <motion.div
                                key={ebook.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="group"
                            >
                                <div className="text-center mb-6">
                                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-1">{ebook.title}</h3>
                                    <div className="w-8 h-0.5 bg-gray-200 mx-auto group-hover:bg-[#0793ad] transition-colors duration-500" />
                                </div>

                                <div
                                    className="relative aspect-[3/4] rounded-[24px] overflow-hidden shadow-2xl transition-all duration-700 bg-[#1a1a1a] cursor-pointer"
                                    onClick={() => setModalData({ isOpen: true, collection: ebook.title, pdfUrl: ebook.pdfUrl })}
                                >
                                    {/* Ebook Mockup Design */}
                                    <div className="absolute inset-0 p-12 flex flex-col items-center justify-between text-white text-center">
                                        <div
                                            className="absolute inset-0 opacity-20"
                                            style={{ backgroundImage: `url(${ebook.bgImage})` }}
                                        />

                                        {/* Top Logo */}
                                        <div className="relative z-10 w-24 h-24 border-2 border-white/20 rounded-lg flex items-center justify-center mb-4">
                                            <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                                <div className="w-full h-full border-2 border-white/10 rotate-45" />
                                            </div>
                                            <span className="text-5xl font-black italic tracking-tighter" style={{ color: ebook.accentColor }}>{ebook.logo}</span>
                                            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-white/40" />
                                        </div>

                                        {/* Center Text */}
                                        <div className="relative z-10 flex flex-col items-center">
                                            <h4 className="text-3xl font-black uppercase tracking-tighter italic leading-none mb-2">
                                                HOME <span className="text-white/60">COLLECTION</span>
                                            </h4>
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-[1px] bg-white/20" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-[#0793ad]">MITRA HOMES</span>
                                                <div className="w-6 h-[1px] bg-white/20" />
                                            </div>
                                        </div>

                                        {/* Bottom Edition */}
                                        <div className="relative z-10">
                                            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/30">{ebook.edition}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <EbookModal
                isOpen={modalData.isOpen}
                onClose={() => setModalData({ ...modalData, isOpen: false })}
                collection={modalData.collection}
                pdfUrl={modalData.pdfUrl}
            />

            <Footer />
        </main>
    );
}
