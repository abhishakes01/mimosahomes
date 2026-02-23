"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ChevronRight, ShieldCheck, Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { api, getFullUrl } from "@/services/api";

const DEFAULT_STEPS = [
    {
        title: "Initial Consultation",
        description: "Meet with our experts to discuss your vision, budget, and lifestyle needs. We help you choose the perfect floorplan and site for your dream home."
    },
    {
        title: "Design & Personalisation",
        description: "Visit our Mporium showroom to select your finishes. Our designers help you personalise every detail from tiles to tapware."
    },
    {
        title: "Contracts & Approvals",
        description: "We handle all the paperwork, including fixed-price contracts, building permits, and developer approvals, so you can focus on the excitement."
    },
    {
        title: "Construction Phase",
        description: "Watch your dream come to life. We provide regular updates and multi-stage inspections to ensure the highest quality standards."
    }
];

export default function ProcedurePage() {
    const [pageData, setPageData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const data: any = await api.getPageBySlug('procedure');
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
        : "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2070&auto=format&fit=crop";

    // Default intro text if not provided in CMS
    const defaultParagraph1 = "We firmly believe in making your journey with Mitra Homes a seamless, transparent, and enjoyable experience. Our extensive expertise will ensure you remain well informed about every step, from the initial Pre-Site preparations through Construction to the After Care of your new home, so you always know what to expect and when.";
    const defaultParagraph2 = "At Mitra Homes starting your home building journey can be a scary thing, that is why we have put together an easy step by step guide to your brand new home.";

    let paragraphs = [];
    if (content.introText) {
        paragraphs = content.introText.split('\n').filter((p: string) => p.trim() !== '');
    } else {
        paragraphs = [defaultParagraph1, defaultParagraph2];
    }

    const steps = content.steps?.length > 0 ? content.steps : DEFAULT_STEPS;
    const contactTitle = content.contactTitle || "Enquire Now";
    const contactHeadline = content.contactHeadline || "Call us on";
    const contactPhone = content.phone || "1300 646 672";

    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <Image
                    src={heroImage}
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
                        {content.heroTitle || "PROCEDURE"}
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

                        <div className="flex-[1.5] space-y-24">
                            {/* Introduction */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="space-y-6"
                            >
                                {paragraphs.map((para: string, idx: number) => (
                                    <p key={idx} className="text-gray-600 text-lg leading-relaxed font-medium italic">
                                        {para}
                                    </p>
                                ))}
                            </motion.div>

                            {/* Procedure Steps */}
                            <div className="space-y-12">
                                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight italic border-l-4 border-mimosa-gold pl-6">
                                    Our Step-by-Step Guide
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {steps.map((step: any, index: number) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 30 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 }}
                                            className="bg-gray-50 p-8 rounded-[32px] border border-gray-100 relative group hover:bg-mimosa-dark transition-colors duration-500"
                                        >
                                            <div className="text-6xl font-black text-mimosa-gold opacity-10 group-hover:opacity-5 absolute top-4 right-8 transition-opacity italic">
                                                {index + 1 < 10 ? `0${index + 1}` : index + 1}
                                            </div>
                                            <div className="relative z-10 space-y-4">
                                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-white uppercase italic tracking-tight">
                                                    {step.title}
                                                </h3>
                                                <p className="text-gray-600 group-hover:text-white/70 text-sm leading-relaxed">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Form Area */}
                        <div className="flex-1">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-2xl border border-gray-100 shadow-[0_10px_50px_rgba(0,0,0,0.05)] p-10 sticky top-32"
                            >
                                <h3 className="text-3xl font-extrabold text-gray-900 mb-2 italic tracking-tight uppercase">{contactTitle}</h3>
                                <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em] mb-10 font-bold">
                                    {contactHeadline} <a href={`tel:${contactPhone.replace(/\s+/g, '')}`} className="text-mimosa-gold font-black">{contactPhone}</a>
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
