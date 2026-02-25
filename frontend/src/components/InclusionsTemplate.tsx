"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CollectionHero from "@/components/CollectionHero";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InclusionCategory {
    id: string;
    title: string;
    items: string[];
}

interface InclusionsTemplateProps {
    collectionName: string;
    heroImage: string;
    categories: InclusionCategory[];
    bottomTitle?: string;
    bottomSubtitle?: string;
}

export default function InclusionsTemplate({ collectionName, heroImage, categories, bottomTitle, bottomSubtitle }: InclusionsTemplateProps) {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const PRIMARY_COLOR = "#0897b1";

    useEffect(() => {
        if (categories && categories.length > 0 && !activeCategory) {
            setActiveCategory(categories[0].id);
        }
    }, [categories]);

    const activeContent = categories.find(c => c.id === activeCategory);

    return (
        <main className="min-h-screen bg-white">
            <Header />

            <CollectionHero
                title={`${collectionName} Standard Inclusions`}
                backgroundImage={heroImage}
                breadcrumbs={[
                    { label: `${collectionName} Standard Inclusions` }
                ]}
            />

            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 max-w-6xl">
                    <p className="text-center text-gray-500 font-medium max-w-2xl mx-auto mb-16 italic">
                        {bottomSubtitle || "Mimosa Homes prides itself on creating homes that are ready to live in and with our standard inclusions we make that a reality."}
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Sidebar Navigation */}
                        <div className="lg:col-span-3">
                            <div className="sticky top-24 space-y-1">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveCategory(cat.id)}
                                        className={`w-full text-left px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat.id
                                            ? 'bg-[#0897b1] text-white shadow-lg scale-105 z-10'
                                            : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                    >
                                        {cat.title}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="lg:col-span-9 bg-gray-50 rounded-3xl p-8 md:p-12 border border-gray-100 min-h-[500px]">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeCategory}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h2 className="text-2xl font-black text-gray-900 uppercase italic mb-8 border-b-2 border-[#0897b1] pb-4 inline-block">
                                        {activeContent?.title}
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                        {activeContent?.items.map((item, index) => (
                                            <div key={index} className="flex items-start gap-4">
                                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0897b1]/10 flex items-center justify-center mt-1">
                                                    <Check size={14} className="text-[#0897b1]" />
                                                </div>
                                                <p className="text-gray-600 text-sm leading-relaxed font-medium">
                                                    {item}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="mt-20 p-8 border border-gray-100 rounded-3xl bg-gray-50 text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] leading-loose">
                        DISCLAIMER: Mimosa Homes reserves the right to change or substitute suppliers, model &/or type of any product of equal quality without notice. The standard inclusions relate to our base house price and specific house display options may incur additional costs. Please ask your sales consultant for further information.
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
