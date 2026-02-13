"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const PARTNER_LOGOS = [
    { name: "A&L Windows", url: "https://placehold.co/400x200/white/005a8f?text=A%26L+Windows" },
    { name: "AllGreen", url: "https://placehold.co/400x200/white/005a8f?text=AllGreen" },
    { name: "Alpine Truss", url: "https://placehold.co/400x200/white/005a8f?text=Alpine+Truss" },
    { name: "ARC", url: "https://placehold.co/400x200/white/005a8f?text=ARC" },
    { name: "Arki", url: "https://placehold.co/400x200/white/005a8f?text=Arki" },
    { name: "ARX", url: "https://placehold.co/400x200/white/005a8f?text=ARX" },
    { name: "Austral Bricks", url: "https://placehold.co/400x200/white/005a8f?text=Austral+Bricks" },
    { name: "B&D", url: "https://placehold.co/400x200/white/005a8f?text=B%26D" },
    { name: "Beaumont Tiles", url: "https://placehold.co/400x200/white/005a8f?text=Beaumont+Tiles" },
    { name: "Colorbond", url: "https://placehold.co/400x200/white/005a8f?text=Colorbond" },
    { name: "Gainsborough", url: "https://placehold.co/400x200/white/005a8f?text=Gainsborough" },
    { name: "Haymes Paint", url: "https://placehold.co/400x200/white/005a8f?text=Haymes+Paint" },
    { name: "James Hardie", url: "https://placehold.co/400x200/white/005a8f?text=James+Hardie" },
    { name: "Laminex", url: "https://placehold.co/400x200/white/005a8f?text=Laminex" },
    { name: "Monier", url: "https://placehold.co/400x200/white/005a8f?text=Monier" },
    { name: "Omega", url: "https://placehold.co/400x200/white/005a8f?text=Omega" },
    { name: "Origin", url: "https://placehold.co/400x200/white/005a8f?text=Origin" },
    { name: "PGH Bricks", url: "https://placehold.co/400x200/white/005a8f?text=PGH+Bricks" },
    { name: "RACV", url: "https://placehold.co/400x200/white/005a8f?text=RACV" },
    { name: "Siniat", url: "https://placehold.co/400x200/white/005a8f?text=Siniat" },
    { name: "Smeg", url: "https://placehold.co/400x200/white/005a8f?text=Smeg" },
    { name: "Stegbar", url: "https://placehold.co/400x200/white/005a8f?text=Stegbar" }
];

// Placeholder logos array to fill up the grid like the screenshot
const PLACEHOLDERS = Array.from({ length: 18 }).map((_, i) => ({
    name: `Partner ${i + 1}`,
    url: ""
}));

export default function PartnersPage() {
    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1522071823991-b51829980aa8?q=80&w=2070&auto=format&fit=crop"
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
                        PARTNERS
                    </motion.h1>
                </div>

                {/* Breadcrumbs */}
                <div className="absolute bottom-8 left-8 z-10 hidden md:flex items-center gap-2 text-white/80 text-xs font-bold uppercase tracking-widest">
                    <Link href="/" className="hover:text-white transition-colors">Mitra Homes</Link>
                    <ChevronRight size={14} className="text-mimosa-gold" />
                    <span className="text-white">Partners</span>
                </div>
            </section>

            {/* Partners Logo Grid Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 md:gap-20">
                        {PARTNER_LOGOS.map((partner, index) => (
                            <motion.div
                                key={partner.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: (index % 5) * 0.1 }}
                                className="group flex flex-col items-center justify-center transition-all duration-500 hover:scale-110"
                            >
                                <div className="h-20 w-full relative flex items-center justify-center p-4">
                                    {partner.url ? (
                                        <div className="relative w-full h-full">
                                            <img
                                                src={partner.url}
                                                alt={partner.name}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-full h-full bg-gray-50 flex items-center justify-center rounded-lg border border-gray-100">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{partner.name}</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}

                        {/* More placeholders to match the screenshot density */}
                        {PLACEHOLDERS.map((partner, index) => (
                            <motion.div
                                key={`placeholder-${index}`}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: (index % 5) * 0.1 + 0.3 }}
                                className="group flex flex-col items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 hover:scale-110"
                            >
                                <div className="h-20 w-full relative flex items-center justify-center p-6 bg-gray-50/50 rounded-xl border border-gray-50 opacity-40 group-hover:opacity-100 transition-opacity">
                                    <div className="w-full h-2 bg-gray-100 rounded-full" />
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
