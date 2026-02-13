"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ChevronRight, ShieldCheck, Mail, Phone, MapPin, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ProcedurePage() {
    const [formData, setFormData] = useState({
        title: "",
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        suburb: "",
        question: "",
        subscribe: "yes"
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        alert("Thank you for your enquiry. We will get back to you soon!");
    };

    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2070&auto=format&fit=crop"
                    alt="Mitra Homes Procedure"
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 text-center text-white px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-7xl font-extrabold uppercase tracking-tight italic"
                    >
                        PROCEDURE
                    </motion.h1>
                </div>

                {/* Breadcrumbs */}
                <div className="absolute bottom-8 left-8 z-10 hidden md:flex items-center gap-2 text-white/80 text-xs font-bold uppercase tracking-widest">
                    <Link href="/" className="hover:text-white transition-colors">Mitra Homes</Link>
                    <ChevronRight size={14} className="text-mimosa-gold" />
                    <span className="text-white">Procedure</span>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row gap-16">

                        {/* Main Content Area */}
                        <div className="flex-[1.5] space-y-12">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="space-y-6"
                            >
                                <p className="text-gray-600 text-lg leading-relaxed font-medium">
                                    We firmly believe in making your journey with Mitra Homes a seamless, transparent, and enjoyable experience.
                                    Our extensive expertise will ensure you remain well informed about every step, from the initial Pre-Site preparations
                                    through Construction to the After Care of your new home, so you always know what to expect and when.
                                </p>
                                <p className="text-gray-600 text-lg leading-relaxed font-medium">
                                    At Mitra Homes starting your home building journey can be a scary thing, that is why we have put together
                                    an easy step by step guide to your brand new home.
                                </p>

                                {/* <div className="flex flex-wrap gap-4 pt-4">
                                    <button className="bg-[#f07d22] text-white px-8 py-5 rounded font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all shadow-lg min-w-[280px]">
                                        V Collection Procedure
                                    </button>
                                    <button className="bg-[#7e8e97] text-white px-8 py-5 rounded font-black uppercase text-xs tracking-widest hover:brightness-110 transition-all shadow-lg min-w-[280px]">
                                        M Collection Procedure
                                    </button>
                                </div> */}
                            </motion.div>
                        </div>

                        {/* Sidebar Form Area */}
                        <div className="flex-1">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-2xl border border-gray-100 shadow-[0_10px_50px_rgba(0,0,0,0.05)] p-10 sticky top-32"
                            >
                                <h3 className="text-3xl font-extrabold text-gray-900 mb-2 italic tracking-tight uppercase">Enquire Now</h3>
                                <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em] mb-10 font-bold">
                                    Call us on <a href="tel:1300646672" className="text-mimosa-gold font-black">1300 646 672</a>
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Title*</label>
                                            <select
                                                required
                                                className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-mimosa-gold/20 transition-all appearance-none cursor-pointer text-gray-700"
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            >
                                                <option value="">Select</option>
                                                <option value="Mr">Mr</option>
                                                <option value="Mrs">Mrs</option>
                                                <option value="Ms">Ms</option>
                                                <option value="Miss">Miss</option>
                                                <option value="Dr">Dr</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Suburb*</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-mimosa-gold/20 transition-all text-gray-800"
                                                onChange={(e) => setFormData({ ...formData, suburb: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">First Name*</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-mimosa-gold/20 transition-all text-gray-800"
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Last Name*</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-mimosa-gold/20 transition-all text-gray-800"
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Phone*</label>
                                        <input
                                            type="tel"
                                            required
                                            className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-mimosa-gold/20 transition-all text-gray-800"
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Email*</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-mimosa-gold/20 transition-all text-gray-800"
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Your Question</label>
                                        <textarea
                                            rows={4}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-mimosa-gold/20 transition-all resize-none text-gray-800"
                                            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-4 pt-2">
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sign up to stay up to date with all of our promotions, blogs and styling tips!</p>
                                        <div className="flex items-center gap-6">
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                <input
                                                    type="radio"
                                                    name="subscribe"
                                                    value="yes"
                                                    defaultChecked
                                                    className="accent-mimosa-gold"
                                                    onChange={(e) => setFormData({ ...formData, subscribe: e.target.value })}
                                                />
                                                <span className="text-xs font-bold text-gray-600 group-hover:text-mimosa-gold transition-colors">Yes</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                <input
                                                    type="radio"
                                                    name="subscribe"
                                                    value="no"
                                                    className="accent-mimosa-gold"
                                                    onChange={(e) => setFormData({ ...formData, subscribe: e.target.value })}
                                                />
                                                <span className="text-xs font-bold text-gray-600 group-hover:text-mimosa-gold transition-colors">No</span>
                                            </label>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-[#005a8f] text-white py-4 rounded-lg font-black uppercase text-xs tracking-[0.2em] hover:bg-[#004a75] transition-all shadow-xl mt-4"
                                    >
                                        Submit
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
