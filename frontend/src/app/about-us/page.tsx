"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Testimonials from "@/components/Testimonials";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ShieldCheck, Trophy, Clock, Star, ArrowRight } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const STATS = [
    { label: "Display Homes", value: "50+", icon: Trophy },
    { label: "Product Review", value: "4.8", icon: Star, subValue: "Average Rating" },
    { label: "Years Experience", value: "18+", icon: Clock }
];

const COMMITMENTS = [
    {
        id: "quality",
        title: "Built with Quality",
        content: "We never compromise on the quality of your home. From the foundation to the final coat of paint, our rigorous quality control ensures every detail meets our exacting standards. We use premium materials and work with trusted local trades to deliver a home that stands the test of time.",
        image: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=2070&auto=format&fit=crop",
        badge: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop"
    },
    {
        id: "style",
        title: "Built with Style",
        content: "Our designs are inspired by modern Australian living. We combine aesthetic beauty with functional layouts to create homes that are as stunning to look at as they are comfortable to live in. Our M-PORIUM selection center allows you to personalize your home with the latest trends and finishes.",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
        badge: "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: "care",
        title: "Built with Care",
        content: "Choosing to build a home is a big decision, and we're here to support you every step of the way. Our team provides personalized service and transparent communication throughout the entire journey. We treat every home as if it were our own, ensuring a stress-free and rewarding experience.",
        image: "https://images.unsplash.com/photo-1600566753190-17f0bbc2a6c3?q=80&w=2070&auto=format&fit=crop",
        badge: "https://images.unsplash.com/photo-1582408921715-18e7806365c1?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: "time",
        title: "Built on Time",
        content: "We understand that you're excited to move into your new home. That's why we emphasize efficient project management and realistic timelines. Our standardized processes and experienced supervisors keep your build on track, so you can start your new life as planned.",
        image: "https://images.unsplash.com/photo-1503387762-592dea58ef0e?q=80&w=2000&auto=format&fit=crop",
        badge: "https://images.unsplash.com/photo-1454165833767-02750801a600?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: "last",
        title: "Built to Last",
        content: "Sustainability and durability are at the heart of our construction philosophy. Beyond just meeting building codes, we focus on energy efficiency and structural integrity. Our 50-year structural warranty is a testament to the confidence we have in our workmanship.",
        image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2000&auto=format&fit=crop",
        badge: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?q=80&w=2070&auto=format&fit=crop"
    }
];

export default function AboutUsPage() {
    const [activeTab, setActiveTab] = useState("last");

    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop"
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
                                    src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop"
                                    alt="Luxury Home"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-10 -right-10 bg-mimosa-dark text-white p-10 rounded-[24px] shadow-2xl hidden md:block">
                                <p className="text-4xl font-extrabold italic">18+</p>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Years of Luxury Builders</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex-1 space-y-8"
                        >
                            <div className="space-y-4">
                                <h2 className="text-[12px] font-black text-mimosa-gold uppercase tracking-[0.3em]">Your journey to a dream home starts here</h2>
                                <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight uppercase italic">
                                    Mitra Homes is your premier building company.
                                </h3>
                            </div>
                            <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
                                <p>
                                    At Mitra Homes, we specialize in building high-quality homes with heart.
                                    Based in Melbourne's West, we've spent over 18 years perfecting the art of
                                    crafting living spaces that inspire and endure.
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        "Professional service with a focus on your needs.",
                                        "Fixed price contracts for peace of mind.",
                                        "Innovative designs suited to modern living.",
                                        "Exceptional quality control at every stage."
                                    ].map((item, i) => (
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
                        {STATS.map((stat, i) => (
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
                                Our Build with Confidence Commitment
                            </h2>
                            <p className="text-white/70 text-lg leading-relaxed max-w-2xl">
                                There is more to making a house a home than just bricks and mortar.
                                We care about how you feel about your new home design.
                            </p>
                            <p className="text-white/60 text-sm italic">
                                At Mitra Homes, our 50-year structural warranty is our promise to you.
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
                        {COMMITMENTS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest transition-all ${activeTab === tab.id
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
                                            {COMMITMENTS.find(t => t.id === activeTab)?.title}
                                        </h3>
                                        <div className="w-20 h-1.5 bg-mimosa-gold rounded-full" />
                                    </div>
                                    <p className="text-gray-600 text-xl leading-relaxed italic font-medium">
                                        {COMMITMENTS.find(t => t.id === activeTab)?.content}
                                    </p>
                                    <button className="bg-mimosa-dark text-white px-8 py-4 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-black transition-all">
                                        Learn More
                                    </button>
                                </div>

                                <div className="flex-1 relative">
                                    <div className="relative rounded-[32px] overflow-hidden shadow-2xl aspect-video scale-110 rotate-3 group overflow-hidden">
                                        <Image
                                            src={COMMITMENTS.find(t => t.id === activeTab)?.image || ""}
                                            alt="Commitment Image"
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-1000"
                                        />
                                    </div>
                                    {/* Small floating badge */}
                                    <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full border-8 border-white overflow-hidden shadow-2xl rotate-12">
                                        <Image
                                            src={COMMITMENTS.find(t => t.id === activeTab)?.badge || ""}
                                            alt="Badge"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
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
                    src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop"
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
                            Ready to Begin your Journey?
                        </h2>
                        <p className="text-xl text-white/70 max-w-2xl mx-auto italic">
                            Connect with one of our New Home Consultants today to explore your options,
                            answer any questions, and take the first step toward your dream home.
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


