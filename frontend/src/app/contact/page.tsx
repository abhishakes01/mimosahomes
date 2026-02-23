"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Loader2, ChevronRight, Send } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { api, getFullUrl } from "@/services/api";
import Captcha from "@/components/Captcha";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export default function ContactPage() {
    const [pageData, setPageData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        type: "",
        message: "",
        captcha: ""
    });
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const data: any = await api.getPageBySlug('contact');
                setPageData(data.content);
            } catch (error) {
                console.error("Failed to fetch page data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPage();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await api.createEnquiry(formData);
            showToast("Thank you for your message. We will get back to you shortly!", "success");
            setFormData({ name: "", email: "", phone: "", type: "", message: "", captcha: "" });
        } catch (error: any) {
            console.error("Failed to send enquiry", error);
            showToast(error.message || "Failed to send enquiry. Please try again.", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhoneChange = (value: string | undefined) => {
        setFormData({ ...formData, phone: value || "" });
    };

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

    const email = content.email || "info@mitrahomes.com.au";
    const phone = content.phone || "1300 646 672";
    const address = content.address || "123 Example Street, Melbourne VIC 3000";

    const hours = content.hours || {
        weekdays: "9:00 AM - 5:00 PM",
        saturday: "10:00 AM - 4:00 PM",
        sunday: "Closed"
    };

    const mapUrl = (content.latitude && content.longitude)
        ? `https://maps.google.com/maps?q=${content.latitude},${content.longitude}&z=15&output=embed`
        : content.mapUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100940.186638531!2d144.88722055!3d-37.8136276!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad646b5d2ba4df7%3A0x4045675218ccd90!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus";

    return (
        <main className="min-h-screen bg-white selection:bg-mimosa-gold/20">
            <Header />

            {/* Custom Toast Notification */}
            {toast && (
                <div className={`fixed top-24 right-4 z-50 px-6 py-3 rounded-lg shadow-lg font-medium text-sm transition-all flex items-center gap-2 ${toast.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                    {toast.type === 'success' ? (
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                    ) : (
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                    )}
                    {toast.message}
                </div>
            )}

            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <img
                    src={heroImage}
                    alt="Contact Mitra Homes"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
                <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-extrabold uppercase tracking-tight italic mb-6">
                            {content.heroTitle || "GET IN TOUCH"}
                        </h1>
                        {content.heroSubtitle && (
                            <p className="text-lg md:text-xl text-white/90 font-light max-w-2xl mx-auto">
                                {content.heroSubtitle}
                            </p>
                        )}
                    </motion.div>
                </div>

                {/* Breadcrumbs */}
                <div className="absolute bottom-8 left-8 z-10 hidden md:flex items-center gap-2 text-white/80 text-xs font-bold uppercase tracking-widest">
                    <Link href="/" className="hover:text-white transition-colors">Mitra Homes</Link>
                    <ChevronRight size={14} className="text-mimosa-gold" />
                    <span className="text-white">Contact Us</span>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-24 relative z-20 -mt-10">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

                        {/* Contact Information Cards (Left Column) */}
                        <div className="lg:col-span-5 flex flex-col gap-6">

                            {/* General Info Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-[32px] p-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100"
                            >
                                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-8">
                                    {content.infoTitle || "Contact Info"}
                                </h2>

                                <div className="space-y-8">
                                    <div className="flex gap-6 group">
                                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-mimosa-gold group-hover:bg-[#1a3a4a] group-hover:text-white transition-colors shrink-0">
                                            <Phone size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Phone</p>
                                            <a href={`tel:${phone.replace(/\s+/g, '')}`} className="text-xl font-bold text-gray-900 hover:text-mimosa-gold transition-colors">{phone}</a>
                                        </div>
                                    </div>

                                    <div className="flex gap-6 group">
                                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-mimosa-gold group-hover:bg-[#1a3a4a] group-hover:text-white transition-colors shrink-0">
                                            <Mail size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Email</p>
                                            <a href={`mailto:${email}`} className="text-lg font-bold text-gray-900 hover:text-mimosa-gold transition-colors">{email}</a>
                                        </div>
                                    </div>

                                    <div className="flex gap-6 group">
                                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-mimosa-gold group-hover:bg-[#1a3a4a] group-hover:text-white transition-colors shrink-0">
                                            <MapPin size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Head Office</p>
                                            <p className="text-gray-600 leading-relaxed font-medium">{address}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Business Hours Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="bg-[#1a3a4a] rounded-[32px] p-10 text-white relative overflow-hidden"
                            >
                                {/* Decorative background element */}
                                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                                    <Clock size={120} />
                                </div>

                                <h2 className="text-2xl font-black uppercase tracking-tight mb-8 relative z-10">Business Hours</h2>

                                <div className="space-y-4 relative z-10">
                                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                        <span className="font-bold text-white/70">Monday - Friday</span>
                                        <span className="font-medium text-white">{hours.weekdays}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                        <span className="font-bold text-white/70">Saturday</span>
                                        <span className="font-medium text-white">{hours.saturday}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-white/70">Sunday</span>
                                        <span className="font-medium text-mimosa-gold">{hours.sunday}</span>
                                    </div>
                                </div>
                            </motion.div>

                        </div>

                        {/* Contact Form (Right Column) */}
                        <div className="lg:col-span-7">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-[32px] p-10 lg:p-14 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100 h-full"
                            >
                                <div className="mb-10">
                                    <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-3">
                                        {content.formTitle || "Send us a message"}
                                    </h2>
                                    <p className="text-gray-500 font-medium">
                                        {content.formSubtitle || "Fill out the form below and our team will get back to you within 24 hours."}
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-4 block">Full Name *</label>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-gray-900 focus:bg-white focus:border-[#1a3a4a] focus:ring-4 focus:ring-[#1a3a4a]/10 outline-none transition-all font-medium"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-4 block">Phone Number *</label>
                                            <PhoneInput
                                                international
                                                defaultCountry="AU"
                                                placeholder="Enter phone number"
                                                value={formData.phone}
                                                onChange={handlePhoneChange}
                                                className="phone-input-custom"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-4 block">Email Address *</label>
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-gray-900 focus:bg-white focus:border-[#1a3a4a] focus:ring-4 focus:ring-[#1a3a4a]/10 outline-none transition-all font-medium"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-4 block">I'm interested in</label>
                                            <select
                                                name="type"
                                                value={formData.type}
                                                onChange={handleChange}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-gray-900 focus:bg-white focus:border-[#1a3a4a] focus:ring-4 focus:ring-[#1a3a4a]/10 outline-none transition-all font-medium appearance-none"
                                            >
                                                <option value="">Select an option...</option>
                                                <option value="new-home">Building a New Home</option>
                                                <option value="house-land">House & Land Packages</option>
                                                <option value="display-homes">Display Homes</option>
                                                <option value="general">General Enquiry</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-4 block">Your Message</label>
                                        <textarea
                                            name="message"
                                            rows={5}
                                            required
                                            value={formData.message}
                                            onChange={handleChange}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-3xl px-6 py-5 text-gray-900 focus:bg-white focus:border-[#1a3a4a] focus:ring-4 focus:ring-[#1a3a4a]/10 outline-none transition-all font-medium resize-none"
                                            placeholder="How can we help you?"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                                        <Captcha />
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-4 block">Enter Captcha Code *</label>
                                            <input
                                                type="text"
                                                name="captcha"
                                                required
                                                value={formData.captcha}
                                                onChange={handleChange}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-gray-900 focus:bg-white focus:border-[#1a3a4a] focus:ring-4 focus:ring-[#1a3a4a]/10 outline-none transition-all font-medium"
                                                placeholder="Type code here..."
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full bg-mimosa-gold hover:bg-[#d49925] text-white rounded-2xl px-8 py-5 text-sm font-black uppercase tracking-widest transition-all shadow-lg shadow-mimosa-gold/20 flex items-center justify-center gap-3 disabled:opacity-70"
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="animate-spin" size={20} />
                                                <span>Sending...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Send Message</span>
                                                <Send size={18} />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </motion.div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Full Width Map Section */}
            <section className="h-[500px] w-full bg-gray-100 relative">
                <iframe
                    src={mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="grayscale hover:grayscale-0 transition-all duration-700"
                    title="Mitra Homes Office Location"
                />
            </section>

            <Footer />
        </main>
    );
}
