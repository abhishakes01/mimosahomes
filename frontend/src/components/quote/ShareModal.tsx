"use client";

import { useState } from "react";
import { X, Copy, Send, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/services/api";

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    shareUrl: string;
}

export default function ShareModal({ isOpen, onClose, shareUrl }: ShareModalProps) {
    const [email, setEmail] = useState("");
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy!", err);
        }
    };

    const handleSendEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setSending(true);
        try {
            await api.sendQuoteEmail({ email, shareUrl });
            setSent(true);
            setTimeout(() => {
                setSent(false);
                setEmail("");
            }, 3000);
        } catch (error) {
            console.error("Failed to send email", error);
            alert("Failed to send email. Please try again.");
        } finally {
            setSending(false);
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
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden p-8 lg:p-10"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="space-y-8">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 leading-tight">
                                    Share your Quote Summary
                                </h2>
                            </div>

                            <div className="space-y-6">
                                {/* Link Copy Section */}
                                <div className="relative group">
                                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl p-4 pr-12 overflow-hidden">
                                        <span className="text-sm text-gray-500 truncate select-all">{shareUrl}</span>
                                        <button
                                            onClick={handleCopy}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-400 hover:text-[#0796b1]"
                                        >
                                            <Copy size={18} className={copied ? "text-green-500" : ""} />
                                        </button>
                                    </div>
                                    {copied && (
                                        <span className="absolute -top-6 right-2 text-[10px] font-bold text-green-500 uppercase tracking-widest animate-in fade-in slide-in-from-bottom-1">
                                            Copied!
                                        </span>
                                    )}
                                </div>

                                {/* Email Send Section */}
                                <form onSubmit={handleSendEmail} className="flex gap-2">
                                    <input
                                        type="email"
                                        required
                                        placeholder="Email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="flex-grow p-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#0796b1] transition-colors placeholder:text-gray-300 text-sm"
                                    />
                                    <button
                                        type="submit"
                                        disabled={sending || sent || !email}
                                        className="bg-[#2D2D2D] hover:bg-black disabled:bg-gray-200 text-white font-bold uppercase text-sm px-8 py-4 rounded-xl transition-all flex items-center justify-center min-w-[100px]"
                                    >
                                        {sending ? (
                                            <Loader2 size={20} className="animate-spin" />
                                        ) : sent ? (
                                            <CheckCircle2 size={20} className="text-green-400" />
                                        ) : (
                                            "SEND"
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
