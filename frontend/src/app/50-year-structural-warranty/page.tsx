"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Testimonials from "@/components/Testimonials";
import { motion } from "framer-motion";
import { ShieldCheck, Trophy, Clock, Star, ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const STATS = [
    { label: "Display Homes", value: "50+", icon: Trophy },
    { label: "Product Review", value: "4.8", icon: Star, subValue: "Average Rating" },
    { label: "Years Experience", value: "18+", icon: Clock }
];

export default function WarrantyPage() {
    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1556912173-3bb406ef7e77?q=80&w=2070&auto=format&fit=crop"
                    alt="Mitra Homes Kitchen"
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                <div className="relative z-10 text-center text-white px-4 max-w-4xl">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-extrabold uppercase tracking-tight italic leading-tight"
                    >
                        50 YEAR STRUCTURAL WARRANTY
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-6 flex items-center justify-center gap-4"
                    >
                        <div className="h-px w-12 bg-mimosa-gold" />
                        <span className="text-mimosa-gold font-bold uppercase tracking-[0.3em] text-xs">Mitra Homes Commitment</span>
                        <div className="h-px w-12 bg-mimosa-gold" />
                    </motion.div>
                </div>
            </section>

            {/* Built to Last Badge Section */}
            <section className="py-24 bg-gradient-to-b from-[#0a1e27] to-[#162d38] text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-mimosa-gold rounded-full blur-[150px]" />
                </div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
                        {/* Gold Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative w-72 h-72 md:w-96 md:h-96"
                        >
                            <div className="absolute inset-0 bg-mimosa-gold/20 rounded-full blur-2xl animate-pulse" />
                            <div className="relative w-full h-full rounded-full border-[12px] border-mimosa-gold bg-mimosa-dark flex flex-col items-center justify-center p-8 shadow-[0_0_50px_rgba(184,134,11,0.3)]">
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] md:text-xs font-extrabold uppercase tracking-[0.3em] text-mimosa-gold whitespace-nowrap">
                                    50 Year Structural Warranty
                                </div>
                                <div className="w-24 h-24 md:w-32 md:h-32 border-4 border-mimosa-gold rounded-[24px] rotate-45 flex items-center justify-center mb-4">
                                    <div className="-rotate-45 flex flex-col items-center">
                                        <div className="text-mimosa-gold font-extrabold text-4xl md:text-5xl leading-none">M</div>
                                        <div className="w-8 h-1 bg-mimosa-gold mt-1" />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <span className="block text-2xl md:text-4xl font-extrabold italic tracking-tight uppercase leading-none">Built to Last</span>
                                    <span className="block text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-mimosa-gold mt-2 px-4 py-1 border border-mimosa-gold/30 rounded-full inline-block">50 Years of Confidence</span>
                                </div>
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[8px] md:text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                    Structural Guarantee
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex-1 space-y-8"
                        >
                            <div className="space-y-4">
                                <h2 className="text-mimosa-gold font-extrabold uppercase tracking-[0.3em] text-[10px]">Built to Last</h2>
                                <h3 className="text-4xl md:text-5xl font-extrabold italic tracking-tight uppercase leading-tight">
                                    50 Years of Confidence, Built into Every Home
                                </h3>
                            </div>
                            <p className="text-white/70 text-lg leading-relaxed">
                                At Mitra Homes, we believe a great home isn't just built for today; it's built for lifetimes.
                                Our 50-year structural warranty is a reflection of the trust we place in our engineering,
                                our materials, and our master tradespeople.
                            </p>
                            <p className="text-white/60 text-base italic border-l-2 border-mimosa-gold pl-6">
                                From the slab to the frame, every structural element is meticulously inspected to ensure your
                                investment is protected for generations to come.
                            </p>
                            <button className="bg-mimosa-gold text-mimosa-dark px-10 py-5 rounded-full font-black uppercase text-xs tracking-widest hover:bg-white transition-all shadow-xl">
                                Download Warranty Guide
                            </button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Confidence Content Section */}
            <section className="py-24">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex-1 space-y-8"
                        >
                            <h3 className="text-3xl md:text-4xl font-extrabold italic tracking-tight uppercase leading-tight text-gray-900">
                                Confidence That Moves In With You
                            </h3>
                            <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                                <p>
                                    When you choose Mitra Homes to build your new home, you can rest easy knowing that everything has been
                                    meticulously thought about, down to the very smallest of details.
                                </p>
                                <p>
                                    Our commitment to quality is what makes us special. We ensure all of the homes that we build are
                                    constructed with honesty, professionalism and quality. That's why we stand by our 50-year structural warranty.
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        "Engineered concrete slabs designed specifically for your block.",
                                        "Premium Australian quality structural timber frames.",
                                        "Rigorous multi-stage inspections by independent surveyors.",
                                        "Direct access to our building supervisors during the structural phase."
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-4">
                                            <div className="mt-1 w-5 h-5 rounded-full bg-mimosa-gold/10 flex items-center justify-center flex-shrink-0">
                                                <CheckCircle2 className="text-mimosa-gold" size={14} />
                                            </div>
                                            <span className="font-medium text-gray-800">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex-1 relative"
                        >
                            <div className="relative rounded-[32px] overflow-hidden shadow-2xl aspect-[4/5] lg:aspect-[3/4]">
                                <Image
                                    src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop"
                                    alt="Luxury Kitchen Interior"
                                    fill
                                    className="object-cover"
                                />
                            </div>
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

            {/* Homeowners Spotlight Section */}
            <section className="py-24">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex-1 relative"
                        >
                            <div className="relative rounded-[32px] overflow-hidden shadow-2xl aspect-video lg:aspect-square">
                                <Image
                                    src="https://images.unsplash.com/photo-1600607687644-c7171b42398f?q=80&w=2070&auto=format&fit=crop"
                                    alt="Happy Family at Home"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex-1 space-y-8"
                        >
                            <div className="space-y-4">
                                <h2 className="text-mimosa-gold font-extrabold uppercase tracking-[0.3em] text-[10px]">Don't just take our word for it</h2>
                                <h3 className="text-3xl md:text-4xl font-extrabold italic tracking-tight uppercase leading-tight text-gray-900">
                                    Our Homeowners Say it Best
                                </h3>
                            </div>
                            <p className="text-gray-600 text-xl italic leading-relaxed font-medium">
                                "At Mitra Homes, we believe in being honest with each citizen of Melbourne about the homes that we build.
                                It's that honesty that leads to us being Melbourne's West's best home builder. We truly believe it's
                                about the people that we build for, it's about our clients and their future."
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                                    <Image
                                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop"
                                        alt="Client Avatar"
                                        width={48}
                                        height={48}
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <span className="block font-extrabold uppercase text-xs tracking-widest text-gray-900">Sarah & James Wilson</span>
                                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Proud Mitra Homeowners</span>
                                </div>
                            </div>
                        </motion.div>
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
                        Get Started
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}
