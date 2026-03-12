"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Loader2, Shield, ChevronRight, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { api, getFullUrl } from "@/services/api";
import Captcha from "@/components/Captcha";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const DEFAULT_PRIVACY_TEXT = [
    "MITRA HOMES Pty. Ltd. PRIVACY AND LEGAL STATEMENT",
    "Welcome to the Mitra Homes Pty. Ltd. website. By accessing or using this website, you agree to be bound by the following terms and conditions. If you do not accept these terms, you must refrain from using the website or any of its services.",
    "This website is provided by Mitra Homes Pty. Ltd., an Australian residential home builder based in Victoria. The content on this site is for general information purposes only and may be updated or modified at any time without notice. While we strive to ensure that all information provided is accurate and current, we do not warrant the completeness, reliability or accuracy of the content. You acknowledge that certain materials may be supplied by third parties, and Mitra Homes is not responsible for the accuracy or reliability of such content.",
    "All material displayed on the website, including but not limited to text, images, layout, branding, and underlying code, is owned or licensed by Mitra Homes and is protected by intellectual property and copyright laws. You are not permitted to reproduce, modify, distribute, or commercially exploit any part of this website without our prior written consent. Any unauthorized use may result in legal action.",
    "Your use of this website must be lawful, respectful, and in accordance with all applicable Australian laws and regulations. You must not use this site to transmit or disseminate any material that is unlawful, harmful, threatening, abusive, defamatory, obscene, or otherwise objectionable. You are solely responsible for any enquiries or submissions you make through the website, and you warrant that the information you provide is true, accurate, and complete.",
    "By submitting an enquiry, form, or request via our online platform, you consent to Mitra Homes contacting you using the details you provided. While we aim to respond promptly, the submission of an enquiry does not constitute the formation of a contractual relationship. Any information you provide, including contact details, may be used in accordance with our Privacy Policy to process your request and provide relevant updates or promotional material. You may opt out of such communications at any time.",
    "The website may contain links to other websites or content operated by third parties. These links are provided for your convenience only. Mitra Homes does not endorse or approve the content of any third party sites and is not responsible for their accuracy, reliability, or privacy practices. Accessing third-party websites is done at your own risk.",
    "Mitra Homes disclaims, to the maximum extent permitted by law, all warranties and conditions relating to the website and its content, including implied warranties of merchantability, fitness for a particular purpose, or non-infringement. We are not liable for any loss or damage (including consequential loss) arising from your use of the website or reliance on its content. This includes, without limitation, any issues caused by technical errors, viruses, unauthorized access to your data, or inaccuracies in third-party information.",
    "You agree to indemnify Mitra Homes Pty. Ltd. and its officers, employees, and agents against any liability, loss, damage, cost, or expense arising from your use of this website or from your breach of these terms.",
    "These Terms & Conditions are governed by the laws of Victoria, Australia. Any disputes arising in connection with this website or these terms shall be subject to the non-exclusive jurisdiction of the courts of Victoria and any applicable tribunals.",
    "Mitra Homes reserves the right to amend these terms at any time by publishing the updated version on this website. Your continued use of the website following any changes constitutes your acceptance of those updates."
];

export default function PrivacyPolicyPage() {
    const [pageData, setPageData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        suburb: "",
        message: "",
        captcha: ""
    });
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const data: any = await api.getPageBySlug('privacy-policy');
                setPageData(data);
            } catch (error) {
                console.error("Failed to fetch privacy policy", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPage();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhoneChange = (value: string | undefined) => {
        setFormData({ ...formData, phone: value || "" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setStatus(null);
        try {
            await api.createEnquiry({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                type: "general", // Fixed: Backend enum only accepts specific values
                message: `[Privacy Policy Enquiry]\nBuild Suburb: ${formData.suburb}\n\n${formData.message}`,
                captcha: formData.captcha
            });
            setStatus({ message: "Thank you! Your enquiry has been sent.", type: "success" });
            setFormData({ name: "", email: "", phone: "", suburb: "", message: "", captcha: "" });
        } catch (error: any) {
            setStatus({ message: error.message || "Failed to send enquiry. Please try again.", type: "error" });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="animate-spin text-[#0897b1]" size={64} />
            </div>
        );
    }

    const content = pageData?.content || {};
    const heroImage = content.heroImage
        ? getFullUrl(content.heroImage)
        : "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop";

    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="relative h-[45vh] flex items-center justify-center overflow-hidden">
                <Image
                    src={heroImage}
                    alt="Privacy Policy"
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />
                <div className="relative z-10 text-center text-white px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-extrabold uppercase tracking-tight italic"
                    >
                        {content.heroTitle || "Privacy Policy"}
                    </motion.h1>
                </div>

                {/* Breadcrumbs */}
                <div className="absolute bottom-6 left-8 z-10 hidden md:flex items-center gap-2 text-white/80 text-[10px] font-black uppercase tracking-[0.2em]">
                    <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                        MITRA
                    </Link>
                    <ChevronRight size={12} className="text-mimosa-gold mt-[1px]" />
                    <span className="text-white">Privacy Policy</span>
                </div>
            </section>

            {/* Main Content Area */}
            <section className="py-20 lg:py-28 bg-[#fcfcfc]">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">

                        {/* Legal Text (Left) */}
                        <div className="lg:col-span-8">
                            <div className="space-y-10">
                                {content.sections && content.sections.length > 0 ? (
                                    content.sections.map((section: any, index: number) => (
                                        <div key={index} className="space-y-5">
                                            {section.title && (
                                                <h2 className="text-xl md:text-2xl font-black text-[#1a3a4a] uppercase tracking-tight italic flex items-center gap-3">
                                                    <span className="w-10 h-[2px] bg-mimosa-gold"></span>
                                                    {section.title}
                                                </h2>
                                            )}
                                            <div className="text-gray-600 leading-relaxed text-[15px] font-medium whitespace-pre-line">
                                                {section.content}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="space-y-8">
                                        {DEFAULT_PRIVACY_TEXT.map((paragraph, idx) => (
                                            <p key={idx} className={idx === 0 ? "text-lg font-black text-[#1a3a4a] mb-2" : "text-gray-600 leading-relaxed text-[15px] font-medium"}>
                                                {paragraph}
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Enquiry Sidebar (Right) */}
                        <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
                            <div className="bg-white rounded-[32px] p-8 lg:p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100">
                                <h3 className="text-2xl font-black text-[#1a3a4a] uppercase tracking-tight italic mb-2">Enquire Now</h3>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-8 flex items-center gap-2">
                                    Fill in the form or call us on <a href="tel:1300646672" className="text-[#0897b1] hover:underline">1300 646 672</a>
                                </p>
                                <form onSubmit={handleSubmit}>
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Full Name*</label>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                placeholder="e.g. John Doe"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full bg-[#fcfcfc] border border-gray-100 rounded-lg px-5 py-3.5 text-sm !text-gray-900 focus:bg-white focus:border-[#0897b1] outline-none transition-all font-medium placeholder:text-gray-300"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Email Address*</label>
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                placeholder="e.g. john@example.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full bg-[#fcfcfc] border border-gray-100 rounded-lg px-5 py-3.5 text-sm !text-gray-900 focus:bg-white focus:border-[#0897b1] outline-none transition-all font-medium placeholder:text-gray-300"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Phone Number*</label>
                                            <div className="phone-input-sidebar-v2">
                                                <PhoneInput
                                                    international
                                                    defaultCountry="AU"
                                                    placeholder="Enter phone"
                                                    value={formData.phone}
                                                    onChange={handlePhoneChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Build Suburb*</label>
                                            <input
                                                type="text"
                                                name="suburb"
                                                required
                                                placeholder="Where are you building?"
                                                value={formData.suburb}
                                                onChange={handleChange}
                                                className="w-full bg-[#fcfcfc] border border-gray-100 rounded-lg px-5 py-3.5 text-sm !text-gray-900 focus:bg-white focus:border-[#0897b1] outline-none transition-all font-medium placeholder:text-gray-300"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Your Question / Description*</label>
                                            <textarea
                                                name="message"
                                                rows={4}
                                                required
                                                placeholder="Please provide details about your enquiry..."
                                                value={formData.message}
                                                onChange={handleChange}
                                                className="w-full bg-[#fcfcfc] border border-gray-100 rounded-lg px-5 py-4 text-sm !text-gray-900 focus:bg-white focus:border-[#0897b1] outline-none transition-all font-medium resize-none placeholder:text-gray-300 min-h-[100px]"
                                            />
                                        </div>

                                        <div className="pt-4 border-t border-gray-50 mt-4">

                                            <div className="space-y-4">
                                                <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100/50">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Security Verification</p>
                                                    <div className="captcha-container-v2 shadow-sm">
                                                        <Captcha />
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Enter Captcha Code*</label>
                                                    <input
                                                        type="text"
                                                        name="captcha"
                                                        required
                                                        placeholder="Type the 4-digit code"
                                                        value={formData.captcha}
                                                        onChange={handleChange}
                                                        className="w-full bg-[#fcfcfc] border border-gray-100 rounded-lg px-5 py-3.5 text-sm !text-gray-900 focus:bg-white focus:border-[#0897b1] outline-none transition-all font-medium placeholder:text-gray-300"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {status && (
                                        <div className={`mt-6 text-xs font-bold p-3 rounded-lg ${status.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                                            {status.message}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full bg-[#1a3a4a] hover:bg-[#152e3b] text-white rounded-xl py-5 text-xs font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-[#1a3a4a]/10 mt-8 flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {submitting ? (
                                            <Loader2 className="animate-spin" size={16} />
                                        ) : (
                                            <>
                                                SUBMIT
                                                <Send size={14} className="mt-[-2px]" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <Footer />

            <style jsx global>{`
                .phone-input-sidebar-v2 {
                    width: 100%;
                }
                .phone-input-sidebar-v2 .PhoneInput {
                    background: #f9f9f9;
                    border: 1px solid #f3f4f6;
                    border-radius: 0.5rem;
                    padding: 1rem 1.25rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                .phone-input-sidebar-v2 .PhoneInput:focus-within {
                    background: white;
                    border-color: #0897b1;
                    box-shadow: 0 0 0 1px #0897b1;
                }
                .phone-input-sidebar-v2 .PhoneInputInput {
                    background: transparent;
                    border: none;
                    outline: none;
                    font-size: 0.875rem;
                    font-weight: 500;
                    width: 100%;
                    color: #111827;
                }
                .phone-input-sidebar-v2 .PhoneInputCountryIcon {
                    width: 28px;
                    height: 20px;
                    border-radius: 2px;
                    overflow: hidden;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                }
                .captcha-container-v2 {
                    background: white;
                    padding: 8px;
                    border-radius: 8px;
                    display: inline-block;
                    border: 1px solid #f3f4f6;
                }
                .captcha-container-v2 > div {
                    scale: 0.9;
                    transform-origin: left center;
                }
            `}</style>
        </main>
    );
}
