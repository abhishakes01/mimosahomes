"use client";

import { useState, useEffect } from "react";
import { Star, CheckCircle, Plus, MessageSquare } from "lucide-react";
import { api } from "@/services/api";
import ReviewForm from "./ReviewForm";
import Modal from "./Modal";

const STATIC_REVIEWS = [
    {
        title: "Great experience so far",
        content: "We have recently started our build with Mitra Homes. My partner and I have been dealing with the sales team who have been absolutely amazing. They have gone above and beyond to help us get our dream home started.",
        author: "Rachael & Daniel",
        location: "Melbourne, VIC"
    },
    {
        title: "First Home Buyer Support",
        content: "Being a first home buyer, I was very nervous about the whole process. Mitra Homes have been fantastic in guiding me through every step. The fixed price contract gave me huge peace of mind.",
        author: "Christopher S.",
        location: "Tarneit, VIC"
    },
    {
        title: "Professional and Quality",
        content: "Sales consultant was very helpful and informative. He helped us to choose the right floor plan to suit our block. The quality of the display homes was what originally sold us.",
        author: "Sandeep K.",
        location: "Craigieburn, VIC"
    }
];

export default function Testimonials() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const data: any = await api.getApprovedReviews();
            if (data && data.length > 0) {
                setReviews(data);
            } else {
                setReviews(STATIC_REVIEWS.map(r => ({ ...r, id: Math.random(), comment: r.content, name: r.author, rating: 5 })));
            }
        } catch (error) {
            console.error("Failed to fetch reviews", error);
            setReviews(STATIC_REVIEWS.map(r => ({ ...r, id: Math.random(), comment: r.content, name: r.author, rating: 5 })));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    return (
        <section className="py-24 bg-white overflow-hidden relative">
            <div className="absolute top-0 left-0 w-64 h-64 bg-mimosa-gold/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-mimosa-gold/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
                    <div className="space-y-4 text-center md:text-left">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-mimosa-dark italic tracking-tight uppercase leading-none">
                            What Our Customers <br /> <span className="text-mimosa-gold">Have to Say</span>
                        </h2>
                        <div className="flex items-center justify-center md:justify-start gap-4">
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} fill="#E8B04F" stroke="none" size={20} />)}
                            </div>
                            <span className="text-gray-400 text-sm font-bold uppercase tracking-widest">4.8 / 5.0 Rating</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowForm(true)}
                        className="group relative flex items-center gap-3 bg-mimosa-dark text-white px-8 py-5 rounded-full font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-[0_10px_30px_rgba(0,0,0,0.1)] active:scale-95"
                    >
                        <div className="w-8 h-8 bg-mimosa-gold rounded-full flex items-center justify-center group-hover:rotate-90 transition-transform">
                            <Plus size={18} className="text-white" />
                        </div>
                        Write a Review
                    </button>
                </div>

                {/* Reviews Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {reviews.map((review) => (
                        <div key={review.id} className="group bg-white p-10 rounded-[40px] shadow-[0_15px_50px_-15px_rgba(0,0,0,0.05)] border border-gray-50 hover:border-mimosa-gold/20 hover:shadow-2xl transition-all duration-500 relative flex flex-col min-h-[350px]">
                            <div className="absolute top-8 right-10 opacity-10 group-hover:opacity-20 transition-opacity">
                                <MessageSquare size={60} fill="#E8B04F" className="text-mimosa-gold" />
                            </div>

                            <div className="flex items-center gap-1 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} fill={i < review.rating ? "#E8B04F" : "#E2E8F0"} stroke="none" size={16} />
                                ))}
                            </div>

                            <h3 className="font-extrabold text-xl text-gray-900 mb-4 h-14 line-clamp-2 uppercase italic tracking-tight leading-tight group-hover:text-mimosa-gold transition-colors">
                                {review.title || (review.rating >= 4 ? "Excellent Service" : "My Experience")}
                            </h3>

                            <p className="text-gray-500 text-lg leading-relaxed mb-8 flex-grow italic font-medium">
                                "{review.comment || review.content}"
                            </p>

                            <div className="pt-8 border-t border-gray-50 flex items-center justify-between mt-auto">
                                <div className="space-y-1">
                                    <span className="block font-black text-gray-900 text-sm uppercase tracking-tight">{review.name || review.author}</span>
                                    <span className="block text-gray-400 text-xs font-bold uppercase tracking-widest">{review.location || "Verified Client"}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] text-green-600 font-black uppercase tracking-widest bg-green-50 px-3 py-1.5 rounded-full">
                                    <CheckCircle size={14} /> Verified
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Review Form Modal */}
            <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Share Your Journey">
                <ReviewForm
                    onSuccess={() => {
                        // Keep open for success message, then maybe close after delay
                        setTimeout(() => {
                            setShowForm(false);
                            fetchReviews();
                        }, 3000);
                    }}
                    onClose={() => setShowForm(false)}
                />
            </Modal>
        </section>
    );
}
