"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Download, Eye, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/services/api";
import Captcha from "@/components/Captcha";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface EbookModalProps {
    isOpen: boolean;
    onClose: () => void;
    collection: string;
    pdfUrl: string;
}

export default function EbookModal({ isOpen, onClose, collection, pdfUrl }: EbookModalProps) {
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        suburb: "",
        collection: collection,
        subscribe: "yes",
        captcha: ""
    });

    useEffect(() => {
        if (isOpen) {
            setFormData(prev => ({
                ...prev,
                collection: collection
            }));
            setSuccess(false);
        }
    }, [isOpen, collection]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const payload = {
                ...formData,
                name: `${formData.firstName} ${formData.lastName}`,
                type: 'EBOOK_ENQUIRY',
                message: `Enquired for ${formData.collection} Ebook. Suburb: ${formData.suburb}`,
            };
            await api.createEnquiry(payload);
            setSuccess(true);

            // Trigger download/view
            if (pdfUrl) {
                window.open(pdfUrl, '_blank');
            }
        } catch (error: any) {
            console.error("Enquiry failed", error);
            alert(error.message || "Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-2xl bg-white rounded-[40px] overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-400 hover:text-gray-900 rounded-full transition-colors z-20"
                        >
                            <X size={24} />
                        </button>

                        <div className="flex flex-col md:flex-row h-full">
                            {/* Left Side - Visual/Info */}
                            <div className="md:w-5/12 bg-gray-900 p-10 flex flex-col justify-between relative overflow-hidden">
                                <div className="absolute inset-0 opacity-20">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#0793ad]/30 to-transparent" />
                                    <div className="absolute inset-0" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }} />
                                </div>

                                <div className="relative z-10">
                                    <div className="w-16 h-16 border-2 border-white/20 rounded-lg flex items-center justify-center mb-6">
                                        <span className="text-3xl font-black italic tracking-tighter text-[#0793ad]">M</span>
                                    </div>
                                    <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none mb-4">
                                        GET YOUR <br />
                                        <span className="text-[#0793ad]">FREE EBOOK</span>
                                    </h3>
                                    <p className="text-white/60 text-xs font-bold uppercase tracking-widest leading-relaxed">
                                        Explore the {collection} and start your journey towards your dream home today.
                                    </p>
                                </div>

                                <div className="relative z-10 pt-10">
                                    <div className="flex items-center gap-4 text-white/40 mb-4">
                                        <div className="w-10 h-[1px] bg-white/10" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">MITRA HOMES</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side - Form */}
                            <div className="md:w-7/12 p-10 lg:p-12">
                                {!success ? (
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">First Name*</label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={formData.firstName}
                                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                    className="w-full bg-gray-50 border border-transparent focus:border-[#0793ad] rounded-xl px-4 py-3.5 text-sm outline-none transition-all font-bold text-gray-800"
                                                    placeholder="John"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Last Name*</label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={formData.lastName}
                                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                    className="w-full bg-gray-50 border border-transparent focus:border-[#0793ad] rounded-xl px-4 py-3.5 text-sm outline-none transition-all font-bold text-gray-800"
                                                    placeholder="Doe"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number*</label>
                                            <PhoneInput
                                                international
                                                defaultCountry="AU"
                                                placeholder="Enter phone number"
                                                value={formData.phone}
                                                onChange={(value) => setFormData({ ...formData, phone: value || "" })}
                                                className="phone-input-custom"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address*</label>
                                            <input
                                                required
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-gray-50 border border-transparent focus:border-[#0793ad] rounded-xl px-4 py-3.5 text-sm outline-none transition-all font-bold text-gray-800"
                                                placeholder="john@example.com"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Build Suburb*</label>
                                            <input
                                                required
                                                type="text"
                                                value={formData.suburb}
                                                onChange={(e) => setFormData({ ...formData, suburb: e.target.value })}
                                                className="w-full bg-gray-50 border border-transparent focus:border-[#0793ad] rounded-xl px-4 py-3.5 text-sm outline-none transition-all font-bold text-gray-800"
                                                placeholder="e.g. Melbourne"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Which ebook would you like?*</label>
                                            <div className="grid grid-cols-2 gap-4">
                                                {['V Collection', 'M Collection'].map((choice) => (
                                                    <button
                                                        key={choice}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, collection: choice })}
                                                        className={`px-4 py-3 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${formData.collection === choice
                                                            ? 'border-[#0793ad] bg-[#0793ad]/5 text-[#0793ad]'
                                                            : 'border-transparent bg-gray-50 text-gray-400 hover:bg-gray-100'
                                                            }`}
                                                    >
                                                        {choice}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="py-2">
                                            <Captcha />
                                            <input
                                                required
                                                type="text"
                                                value={formData.captcha}
                                                onChange={(e) => setFormData({ ...formData, captcha: e.target.value })}
                                                className="w-full bg-gray-50 border border-transparent focus:border-[#0793ad] rounded-xl px-4 py-3.5 text-sm outline-none transition-all font-bold text-gray-800 mt-2"
                                                placeholder="Enter the code above"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full bg-[#0793ad] text-white py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] hover:bg-[#067a8f] transition-all shadow-xl shadow-[#0793ad]/20 flex items-center justify-center gap-3 disabled:opacity-50"
                                        >
                                            {submitting ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
                                            {submitting ? "Processing..." : "Submit & Download"}
                                        </button>
                                    </form>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center py-20">
                                        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-8">
                                            <Check size={40} />
                                        </div>
                                        <h3 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter mb-4">THANK YOU!</h3>
                                        <p className="text-gray-500 text-sm font-bold uppercase tracking-widest leading-relaxed mb-10 max-w-xs mx-auto">
                                            Your enquiry has been received. Your download should have started automatically.
                                        </p>
                                        <div className="flex flex-col gap-4 w-full">
                                            <button
                                                onClick={() => window.open(pdfUrl, '_blank')}
                                                className="flex items-center justify-center gap-3 bg-gray-900 text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all"
                                            >
                                                <Eye size={18} />
                                                View Ebook Again
                                            </button>
                                            <button
                                                onClick={onClose}
                                                className="text-gray-400 hover:text-gray-900 text-[10px] font-black uppercase tracking-widest transition-colors"
                                            >
                                                Back to Collections
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
