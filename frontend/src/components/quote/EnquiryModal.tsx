"use client";

import { useState } from "react";
import { X, Send, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/services/api";
import Captcha from "@/components/Captcha";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface EnquiryModalProps {
    onClose: () => void;
    quoteData: any;
}

export default function EnquiryModal({ onClose, quoteData }: EnquiryModalProps) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        captcha: ""
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Include full quote summary in the enquiry
            const payload = {
                ...formData,
                type: "QUOTE_BUILDER",
                subject: `New Build Quote Request: ${quoteData.floorplan?.name} - ${quoteData.facade?.name}`,
                message: JSON.stringify(quoteData, null, 2), // Send as JSON for parsing or text for viewing
                metadata: quoteData
            };

            await api.createEnquiry(payload);
            setSubmitted(true);
            setTimeout(() => {
                onClose();
            }, 3000);
        } catch (error) {
            console.error("Enquiry failed", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden p-8 lg:p-12"
            >
                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 text-gray-400 hover:text-black transition-colors"
                >
                    <X size={24} />
                </button>

                {!submitted ? (
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 leading-tight uppercase italic mb-2">
                                Get In <span className="text-gray-900 underline decoration-gray-200">Touch</span>
                            </h2>
                            <p className="text-gray-500 font-medium">
                                Fill in your details below and our team will contact you with your final quote and floorplans.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.firstName}
                                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-black transition-colors placeholder:text-gray-300"
                                        placeholder="John"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.lastName}
                                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-black transition-colors placeholder:text-gray-300"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-black transition-colors placeholder:text-gray-300"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end pb-2">
                                <Captcha />
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Enter Code</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.captcha}
                                        onChange={e => setFormData({ ...formData, captcha: e.target.value })}
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-black transition-colors placeholder:text-gray-300"
                                        placeholder="Type code..."
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-300 text-white font-black uppercase italic tracking-tighter py-5 rounded-2xl shadow-xl shadow-gray-100 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Submit Quote Request
                                        <Send size={20} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="py-12 flex flex-col items-center text-center space-y-6 animate-in zoom-in duration-500">
                        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500">
                            <CheckCircle2 size={64} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 leading-tight uppercase italic mb-2">
                                Request <span className="text-green-500">Sent!</span>
                            </h2>
                            <p className="text-gray-500 font-medium">
                                Thank you {formData.firstName}. Your quote request has been sent to our team. We'll be in touch shortly!
                            </p>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
