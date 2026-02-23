"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Testimonials from "@/components/Testimonials";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ShieldCheck, Trophy, Clock, Star, ArrowRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { api, getFullUrl } from "@/services/api";

const DEFAULT_STATS = [
    { label: "Display Homes", value: "50+", icon: Trophy },
    { label: "Product Review", value: "4.8", icon: Star, subValue: "Average Rating" },
    { label: "Years Experience", value: "18+", icon: Clock }
];

const DEFAULT_COMMITMENTS = [
    {
        title: "Quality Construction",
        content: "We provide an exceptional quality of finish, as we only use the most reputable and reliable suppliers and tradespeople.",
        image: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=2070&auto=format&fit=crop"
    },
    {
        title: "Personalised Experience",
        content: "At Mitra Homes, we believe that every home is unique. We work closely with you to ensure your vision comes to life exactly as you imagined.",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop"
    },
    {
        title: "Transparency & Trust",
        content: "Build with confidence. We offer fixed-price contracts and clear communication at every step of the building process.",
        image: "https://images.unsplash.com/photo-1521791136064-7986c295944b?q=80&w=2070&auto=format&fit=crop"
    },
    {
        title: "Experience & Expertise",
        content: "With over 18 years in the industry, our team brings unparalleled knowledge and craftsmanship to every foundation we lay.",
        image: "https://images.unsplash.com/photo-1454165833762-0204b28c6733?q=80&w=2070&auto=format&fit=crop"
    }
];

export default function AboutUsPage() {
    const [activeTab, setActiveTab] = useState(0);
    const [pageData, setPageData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const data: any = await api.getPageBySlug('about-us');
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
        : "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop";

    // Merge dynamic stats with default icons based on index
    const stats = content.stats?.length > 0
        ? content.stats.map((s: any, i: number) => ({ ...s, icon: DEFAULT_STATS[i % DEFAULT_STATS.length].icon }))
        : DEFAULT_STATS;

    const commitments = content.commitments?.length > 0 ? content.commitments : DEFAULT_COMMITMENTS;

    // Introduction Section Data
    const introImage = content.introImage ? getFullUrl(content.introImage) : "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop";
    const introBadgeText = content.introBadgeText || "18+";
    const introBadgeLabel = content.introBadgeLabel || "Years of Luxury Builders";
    const introTagline = content.introTagline || "Your journey to a dream home starts here";
    const introTitle = content.introTitle || "Mitra Homes is your premier building company.";
    const introDescription = content.introDescription || "At Mitra Homes, we specialize in building high-quality homes with heart. Based in Melbourne's West, we've spent over 18 years perfecting the art of crafting living spaces that inspire and endure.";
    const introBenefits = content.introBenefits?.length > 0 ? content.introBenefits : [
        "Professional service with a focus on your needs.",
        "Fixed price contracts for peace of mind.",
        "Innovative designs suited to modern living.",
        "Exceptional quality control at every stage."
    ];

    // Confidence Banner Data
    const confidenceTitle = content.confidenceTitle || "Our Build with Confidence Commitment";
    const confidenceDesc = content.confidenceDesc || "There is more to making a house a home than just bricks and mortar. We care about how you feel about your new home design.";
    const confidenceCheckText = content.confidenceCheckText || "At Mitra Homes, our 50-year structural warranty is our promise to you.";

    // Bottom CTA Data
    const ctaImage = content.ctaImage ? getFullUrl(content.ctaImage) : "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop";
    const ctaTitle = content.ctaTitle || "Ready to Begin your Journey?";
    const ctaDesc = content.ctaDesc || "Connect with one of our New Home Consultants today to explore your options, answer any questions, and take the first step toward your dream home.";

    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <Image
                    src={heroImage}
                    alt="Mitra Homes Interior"
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                <div className="relative z-10 text-center text-white px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-7xl font-extrabold uppercase tracking-tight italic"
                    >
                        About Us
                    </motion.h1>
                </div>
            </section>

            {/* Introduction Section */}
            <section className="py-24">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex-1 relative"
                        >
                            <div className="relative rounded-[32px] overflow-hidden shadow-2xl aspect-[4/3]">
                                <Image
                                    src={introImage}
                                    alt="Luxury Home"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-10 -right-10 bg-mimosa-dark text-white p-10 rounded-[24px] shadow-2xl hidden md:block">
                                <p className="text-4xl font-extrabold italic">{introBadgeText}</p>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">{introBadgeLabel}</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex-1 space-y-8"
                        >
                            <div className="space-y-4">
                                <h2 className="text-[12px] font-black text-mimosa-gold uppercase tracking-[0.3em]">{introTagline}</h2>
                                <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight uppercase italic">
                                    {introTitle}
                                </h3>
                            </div>
                            <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
                                <p>{introDescription}</p>
                                <ul className="space-y-4">
                                    {introBenefits.map((item: string, i: number) => (
                                        <li key={i} className="flex items-start gap-4">
                                            <div className="mt-1 w-5 h-5 rounded-full bg-mimosa-gold/10 flex items-center justify-center flex-shrink-0">
                                                <CheckCircle2 className="text-mimosa-gold" size={14} />
                                            </div>
                                            <span className="font-medium">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-3 bg-mimosa-dark text-white px-10 py-5 rounded-full font-bold uppercase text-sm tracking-widest hover:bg-black transition-all shadow-xl group"
                            >
                                Enquire Now
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-gray-50 border-y border-gray-100">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {stats.map((stat: any, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex flex-col items-center text-center space-y-2"
                            >
                                <div className="text-6xl font-extrabold text-gray-900 italic tracking-tight tabular-nums">
                                    {stat.value}
                                </div>
                                <div className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                                    {stat.label}
                                </div>
                                {stat.subValue && (
                                    <div className="text-[10px] font-bold text-mimosa-gold uppercase tracking-widest">
                                        {stat.subValue}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Confidence Banner */}
            <section className="py-24 bg-gradient-to-r from-[#0a1e27] to-[#1a3a4a] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-mimosa-gold/5 skew-x-12 translate-x-1/2" />
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="flex-1 space-y-6">
                            <h2 className="text-4xl md:text-5xl font-extrabold text-white italic tracking-tight uppercase leading-tight">
                                {confidenceTitle}
                            </h2>
                            <p className="text-white/70 text-lg leading-relaxed max-w-2xl">
                                {confidenceDesc}
                            </p>
                            <p className="text-white/60 text-sm italic">
                                {confidenceCheckText}
                            </p>
                        </div>
                        <div className="relative">
                            <div className="w-64 h-64 border-4 border-mimosa-gold/30 rounded-[40px] rotate-12 absolute inset-0 -z-10" />
                            <div className="w-64 h-64 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] flex flex-col items-center justify-center p-8 text-center rotate-3 scale-110 shadow-2xl">
                                <div className="w-20 h-20 bg-mimosa-gold/20 rounded-2xl flex items-center justify-center mb-4">
                                    <ShieldCheck className="text-mimosa-gold" size={40} />
                                </div>
                                <span className="text-white font-extrabold uppercase text-xl italic leading-none tracking-tight">
                                    Build with Confidence
                                </span>
                                <span className="text-mimosa-gold font-bold text-[10px] uppercase tracking-widest mt-2">
                                    Premium Warranty
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Commitment Tabs Section */}
            <section className="py-24">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 italic tracking-tight uppercase">
                            Our Commitment to You
                        </h2>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="flex flex-wrap justify-center gap-2 mb-12">
                        {commitments.map((tab: any, index: number) => (
                            <button
                                key={index}
                                onClick={() => setActiveTab(index)}
                                className={`px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest transition-all ${activeTab === index
                                    ? "bg-mimosa-dark text-white shadow-xl scale-105"
                                    : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                                    }`}
                            >
                                {tab.title}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="bg-gray-50 rounded-[48px] p-8 md:p-16 relative overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="flex flex-col lg:flex-row items-center gap-16"
                            >
                                <div className="flex-1 space-y-8">
                                    <div className="space-y-4">
                                        <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 italic tracking-tight uppercase leading-none">
                                            {commitments[activeTab]?.title}
                                        </h3>
                                        <div className="w-20 h-1.5 bg-mimosa-gold rounded-full" />
                                    </div>
                                    <p className="text-gray-600 text-xl leading-relaxed italic font-medium">
                                        {commitments[activeTab]?.content}
                                    </p>
                                    <Link
                                        href="/contact"
                                        className="bg-mimosa-dark text-white px-8 py-4 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-black transition-all inline-block"
                                    >
                                        Learn More
                                    </Link>
                                </div>

                                <div className="flex-1 relative">
                                    <div className="relative rounded-[32px] overflow-hidden shadow-2xl aspect-video scale-110 rotate-3 group overflow-hidden">
                                        <Image
                                            src={getFullUrl(commitments[activeTab]?.image || "")}
                                            alt="Commitment Image"
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-1000"
                                        />
                                    </div>
                                    {/* Small floating badge */}
                                    {commitments[activeTab]?.badge && (
                                        <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full border-8 border-white overflow-hidden shadow-2xl rotate-12">
                                            <Image
                                                src={getFullUrl(commitments[activeTab]?.badge || "")}
                                                alt="Badge"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <Testimonials />

            {/* Ready to Begin Section */}
            <section className="py-24 relative overflow-hidden min-h-[500px] flex items-center">
                <Image
                    src={ctaImage}
                    alt="Living Room"
                    fill
                    className="object-cover grayscale-[0.2]"
                />
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                <div className="container mx-auto px-6 relative z-10 text-center text-white space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-4"
                    >
                        <h2 className="text-4xl md:text-5xl font-extrabold uppercase italic tracking-tight leading-tight">
                            {ctaTitle}
                        </h2>
                        <p className="text-xl text-white/70 max-w-2xl mx-auto italic">
                            {ctaDesc}
                        </p>
                    </motion.div>
                    <Link
                        href="/contact"
                        className="inline-block bg-white text-mimosa-dark px-12 py-5 rounded-full font-black uppercase text-sm tracking-widest hover:bg-mimosa-gold hover:text-white transition-all shadow-2xl"
                    >
                        Get In Touch
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}


