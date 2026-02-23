"use client";

import { useState } from "react";
import { Star, Send, Loader2, X } from "lucide-react";
import { api } from "@/services/api";
import Captcha from "./Captcha";

interface ReviewFormProps {
    onSuccess?: () => void;
    onClose?: () => void;
}

export default function ReviewForm({ onSuccess, onClose }: ReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [comment, setComment] = useState("");
    const [captcha, setCaptcha] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            setError("Please select a rating");
            return;
        }

        try {
            setLoading(true);
            setError("");
            await api.submitReview({ name, email, rating, comment, captcha });
            setSubmitted(true);
            if (onSuccess) onSuccess();
        } catch (err: any) {
            setError(err.message || "Failed to submit review");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="text-center py-12 space-y-6">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                    <Star className="text-green-500" fill="currentColor" size={40} />
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-black text-gray-900 uppercase italic">Thank You!</h3>
                    <p className="text-gray-500 font-medium">Your review has been submitted successfully and is awaiting moderation.</p>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="bg-mimosa-dark text-white px-8 py-3 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-black transition-all"
                    >
                        Close
                    </button>
                )}
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
                    <X size={16} /> {error}
                </div>
            )}

            <div className="space-y-4">
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">Rate your experience</label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            onClick={() => setRating(star)}
                            className="transition-transform active:scale-90"
                        >
                            <Star
                                size={32}
                                className={`${(hover || rating) >= star ? "text-mimosa-gold" : "text-gray-200"} transition-colors`}
                                fill={(hover || rating) >= star ? "currentColor" : "none"}
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">Full Name</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-900 focus:border-mimosa-dark outline-none transition-all"
                        placeholder="John Doe"
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">Email Address</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-900 focus:border-mimosa-dark outline-none transition-all"
                        placeholder="john@example.com"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">Your Feedback</label>
                <textarea
                    required
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-900 focus:border-mimosa-dark outline-none transition-all"
                    placeholder="Tell us about your journey with Mitra Homes..."
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
                    <Captcha />
                    <div className="space-y-2">
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">Enter Code</label>
                        <input
                            type="text"
                            required
                            value={captcha}
                            onChange={(e) => setCaptcha(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-900 focus:border-mimosa-dark outline-none transition-all h-[52px]"
                            placeholder="Type the characters seen..."
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-mimosa-dark text-white py-4 rounded-xl font-black uppercase text-sm tracking-widest hover:bg-black transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" size={20} />
                    ) : (
                        <>
                            <Send size={18} />
                            Submit Review
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
