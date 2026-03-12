"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Send, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/services/api";
import Captcha from "@/components/Captcha";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export default function HomeLeadModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [serviceAreas, setServiceAreas] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        suburb: "",
        captcha: ""
    });

    useEffect(() => {
        const hasShown = localStorage.getItem("home_lead_shown");
        if (!hasShown) {
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 3000); // Show after 3 seconds
            return () => clearTimeout(timer);
        }
    }, []);

    useEffect(() => {
        const fetchAreas = async () => {
            try {
                const data = await api.getServiceAreas();
                setServiceAreas(data);
            } catch (err) {
                console.error("Failed to fetch service areas", err);
            }
        };
        fetchAreas();
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem("home_lead_shown", "true");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const payload = {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                phone: formData.phone,
                type: 'general',
                message: `[HOME POPUP LEAD]\nBuild Region: ${formData.suburb}`,
                captcha: formData.captcha
            };
            await api.createEnquiry(payload);
            setSuccess(true);
            localStorage.setItem("home_lead_shown", "true");
            
            // Auto close after 3 seconds on success
            setTimeout(() => {
                setIsOpen(false);
            }, 3000);
        } catch (error: any) {
            console.error("Popup enquiry failed", error);
            alert(error.message || "Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-xl bg-gradient-to-br from-[#003d5b] to-[#002d44] rounded-[40px] overflow-hidden shadow-2xl border border-white/10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all z-20"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-8 lg:p-12">
                            {!success ? (
                                <>
                                    <div className="text-center mb-8">
                                        <h3 className="text-2xl lg:text-3xl font-black text-white italic tracking-tighter uppercase leading-tight mb-3">
                                            START YOUR <br />
                                            <span className="text-mimosa-gold">DREAM JOURNEY</span>
                                        </h3>
                                        <p className="text-white/70 text-xs lg:text-sm font-medium">
                                            Build with a HIA award winning new home builder that does not compromise on quality. Contact us today.
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4 relative">
                                        <style>{`
                                            .modal-phone-input .PhoneInputCountry {
                                                background: transparent !important;
                                                border: none !important;
                                                height: 48px !important;
                                                padding: 0 0.5rem 0 1rem !important;
                                                border-radius: 0.75rem 0 0 0.75rem !important;
                                            }
                                            .modal-phone-input .PhoneInputInput {
                                                background: transparent !important;
                                                border: none !important;
                                                height: 48px !important;
                                                padding: 0 1rem 0 0 !important;
                                                border-radius: 0 0.75rem 0.75rem 0 !important;
                                                color: #111827 !important;
                                                font-weight: 700 !important;
                                                font-size: 0.875rem !important;
                                            }
                                            .modal-phone-input .PhoneInputInput:focus {
                                                box-shadow: none !important;
                                            }
                                            .modal-phone-input .PhoneInputInput::placeholder {
                                                color: #d1d5db !important;
                                                font-weight: 700 !important;
                                            }
                                        `}</style>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">First Name *</label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={formData.firstName}
                                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                    className="w-full bg-white border-none rounded-xl px-5 h-[48px] text-sm !text-gray-900 focus:ring-2 focus:ring-mimosa-gold outline-none transition-all font-bold placeholder:text-gray-300"
                                                    placeholder="First Name"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Last Name *</label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={formData.lastName}
                                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                    className="w-full bg-white border-none rounded-xl px-5 h-[48px] text-sm !text-gray-900 focus:ring-2 focus:ring-mimosa-gold outline-none transition-all font-bold placeholder:text-gray-300"
                                                    placeholder="Last Name"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Phone *</label>
                                                <div className="w-full bg-white rounded-xl h-[48px] flex items-center focus-within:ring-2 focus-within:ring-mimosa-gold transition-all overflow-hidden phone-input-custom modal-phone-input">
                                                    <PhoneInput
                                                        international
                                                        defaultCountry="AU"
                                                        placeholder="Phone"
                                                        value={formData.phone}
                                                        onChange={(value) => setFormData({ ...formData, phone: value || "" })}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Email *</label>
                                                <input
                                                    required
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full bg-white border-none rounded-xl px-5 h-[48px] text-sm !text-gray-900 focus:ring-2 focus:ring-mimosa-gold outline-none transition-all font-bold placeholder:text-gray-300"
                                                    placeholder="Email"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Build location *</label>
                                            <select
                                                required
                                                value={formData.suburb}
                                                onChange={(e) => setFormData({ ...formData, suburb: e.target.value })}
                                                className="w-full bg-white border-none rounded-xl px-5 h-[48px] text-sm !text-gray-900 focus:ring-2 focus:ring-mimosa-gold outline-none transition-all font-bold appearance-none cursor-pointer placeholder:text-gray-300"
                                            >
                                                <option value="" disabled className="text-gray-400">Select a Region</option>
                                                {serviceAreas.map((area) => (
                                                    <option key={area.id} value={area.name}>{area.name}</option>
                                                ))}
                                                {serviceAreas.length === 0 && <option value="Melbourne">Melbourne (Default)</option>}
                                            </select>
                                        </div>

                                        <div className="bg-white/5 p-5 lg:p-6 rounded-2xl border border-white/10 mt-6 shadow-inner">
                                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3 ml-1">Security Verification *</p>
                                            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 items-center">
                                                <div className="shrink-0 w-full sm:w-auto">
                                                    <Captcha hideLabel={true} hideHelp={true} className="!gap-0" />
                                                </div>
                                                <div className="w-full flex-1">
                                                    <input
                                                        required
                                                        type="text"
                                                        value={formData.captcha}
                                                        onChange={(e) => setFormData({ ...formData, captcha: e.target.value })}
                                                        className="w-full bg-white border-none rounded-xl px-5 h-[48px] text-sm !text-gray-900 focus:ring-2 focus:ring-mimosa-gold outline-none transition-all font-bold placeholder:text-gray-300"
                                                        placeholder="Enter code"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full bg-[#0897b1] text-white py-5 rounded-2xl font-black uppercase text-sm tracking-[0.2em] hover:bg-[#07859c] transition-all shadow-xl shadow-[#0897b1]/20 flex items-center justify-center gap-3 disabled:opacity-50 mt-4 group"
                                        >
                                            {submitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                                            {submitting ? "SENDING..." : "I'm Interested!"}
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <div className="text-center py-10">
                                    <div className="flex justify-center mb-6">
                                        <div className="w-20 h-20 bg-mimosa-gold/10 text-mimosa-gold rounded-full flex items-center justify-center">
                                            <CheckCircle2 size={48} />
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-4">
                                        THANK YOU!
                                    </h3>
                                    <p className="text-white/70 text-sm font-medium mb-8 max-w-sm mx-auto">
                                        Your enquiry has been received. Our team will contact you shortly to help you start your dream home journey.
                                    </p>
                                    <button
                                        onClick={handleClose}
                                        className="inline-block bg-white text-[#003d5b] px-10 py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-gray-100 transition-all"
                                    >
                                        BACK TO HOME
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
