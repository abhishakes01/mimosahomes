"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ChevronRight, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { api, getFullUrl } from "@/services/api";

const PARTNER_LOGOS = [
    { name: "A&L Windows", url: "" },
    { name: "AllGreen", url: "" },
    { name: "Alpine Truss", url: "" },
    { name: "ARC", url: "" },
    { name: "Arki", url: "" },
    { name: "ARX", url: "" },
    { name: "Austral Bricks", url: "" },
    { name: "B&D", url: "" },
    { name: "Beaumont Tiles", url: "" },
    { name: "Colorbond", url: "" },
    { name: "Gainsborough", url: "" },
    { name: "Haymes Paint", url: "" },
    { name: "James Hardie", url: "" },
    { name: "Laminex", url: "" },
    { name: "Monier", url: "" },
    { name: "Omega", url: "" },
    { name: "Origin", url: "" },
    { name: "PGH Bricks", url: "" },
    { name: "RACV", url: "" },
    { name: "Siniat", url: "" },
    { name: "Smeg", url: "" },
    { name: "Stegbar", url: "" }
];

export default function PartnersPage() {
    const [pageData, setPageData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const data: any = await api.getPageBySlug('partners');
                setPageData(data.content);
            } catch (error) {
                console.error("Failed to fetch page data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPage();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="animate-spin text-[#0897b1]" size={64} />
            </div>
        );
    }

    const content = pageData || {};
    const heroImage = content.heroImage
        ? getFullUrl(content.heroImage)
        : "https://images.unsplash.com/photo-1522071823991-b51829980aa8?q=80&w=2070&auto=format&fit=crop";

    const partners = (content.partners && content.partners.length > 0)
        ? content.partners.map((p: any) => ({ ...p, url: p.url ? getFullUrl(p.url) : "" }))
        : PARTNER_LOGOS;

    const heroTitle = content.heroTitle || "OUR PARTNERS";
    const heroSubtitle = content.heroSubtitle || "Working with industry leaders to deliver excellence.";
    const introText = content.introText || "At Mitra Homes, we take great pride in our partnerships. We collaborate with the most trusted names in the industry to ensure that every home we build meets our exacting standards of quality, innovation, and design.";

    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <img
                    src={heroImage}
                    alt="Mitra Homes Partners"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 text-center text-white px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-7xl font-extrabold uppercase tracking-tight italic"
                    >
                        {heroTitle}
                    </motion.h1>
                    {heroSubtitle && (
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl md:text-2xl text-white/80 mt-4 max-w-2xl mx-auto font-medium"
                        >
                            {heroSubtitle}
                        </motion.p>
                    )}
                </div>

                {/* Breadcrumbs */}
                <div className="absolute bottom-8 left-8 z-10 hidden md:flex items-center gap-2 text-white/80 text-xs font-bold uppercase tracking-widest">
                    <Link href="/" className="hover:text-white transition-colors">Mitra Homes</Link>
                    <ChevronRight size={14} className="text-mimosa-gold" />
                    <span className="text-white">Partners</span>
                </div>
            </section>

            {/* Intro Section */}
            <section className="py-20 bg-gray-50/50">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto text-center"
                    >
                        <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-medium italic">
                            "{introText}"
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Partners Logo Grid Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 md:gap-20">
                        {partners.map((partner: any, index: number) => (
                            <motion.div
                                key={partner.name || index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: (index % 5) * 0.1 }}
                                className="group flex flex-col items-center justify-center transition-all duration-500 hover:scale-110"
                            >
                                <div className="h-24 w-full relative flex items-center justify-center p-4">
                                    {partner.url ? (
                                        <div className="relative w-full h-full">
                                            <img
                                                src={partner.url}
                                                alt={partner.name}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center rounded-2xl border border-gray-100 shadow-sm group-hover:border-mimosa-gold transition-colors">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 text-center px-2">{partner.name}</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
