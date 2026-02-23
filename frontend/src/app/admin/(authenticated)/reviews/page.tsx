"use client";

import { useState, useEffect } from "react";
import {
    Star,
    Trash2,
    CheckCircle,
    XCircle,
    Clock,
    Settings as SettingsIcon,
    Loader2,
    Search,
    Filter
} from "lucide-react";
import { api } from "@/services/api";

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [settings, setSettings] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("all"); // all, approved, pending

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token') || '';
            const [reviewsData, settingsData]: [any, any] = await Promise.all([
                api.admin_getAllReviews(token),
                api.getSettings(token)
            ]);
            setReviews(reviewsData);
            setSettings(settingsData);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            setUpdatingStatus(id);
            const token = localStorage.getItem('token') || '';
            await api.admin_updateReviewStatus(id, !currentStatus, token);
            setReviews(reviews.map(r => r.id === id ? { ...r, isApproved: !currentStatus } : r));
        } catch (error) {
            console.error("Failed to update status", error);
        } finally {
            setUpdatingStatus(null);
        }
    };

    const handleDeleteReview = async (id: string) => {
        if (!confirm("Are you sure you want to delete this review?")) return;
        try {
            const token = localStorage.getItem('token') || '';
            await api.admin_deleteReview(id, token);
            setReviews(reviews.filter(r => r.id !== id));
        } catch (error) {
            console.error("Failed to delete review", error);
        }
    };

    const handleToggleAutoApprove = async () => {
        try {
            const token = localStorage.getItem('token') || '';
            const currentValue = settings.autoApproveReviews === true || settings.autoApproveReviews === 'true';
            const newValue = !currentValue;
            await api.updateSetting('autoApproveReviews', newValue, token);
            setSettings({ ...settings, autoApproveReviews: newValue });
        } catch (error) {
            console.error("Failed to update setting", error);
        }
    };

    const filteredReviews = reviews.filter(r => {
        const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.comment.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === "all" ||
            (filter === "approved" && r.isApproved) ||
            (filter === "pending" && !r.isApproved);
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-mimosa-dark" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Review Management</h1>
                    <p className="text-sm text-gray-500 font-medium">Moderate and manage customer testimonials</p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                            <SettingsIcon size={18} className="text-gray-400" />
                        </div>
                        <div>
                            <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Auto-Approval</span>
                            <span className="block text-sm font-bold text-gray-900">{(settings.autoApproveReviews === true || settings.autoApproveReviews === 'true') ? "Enabled" : "Disabled"}</span>
                        </div>
                    </div>
                    <button
                        onClick={handleToggleAutoApprove}
                        className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${settings.autoApproveReviews
                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                            : "bg-green-50 text-green-600 hover:bg-green-100"
                            }`}
                    >
                        {settings.autoApproveReviews ? "Disable" : "Enable"}
                    </button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 bg-white border border-gray-100 rounded-2xl px-4 flex items-center shadow-sm">
                    <Search className="text-gray-400 mr-2" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or comment..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent border-none text-sm outline-none w-full py-4 font-medium"
                    />
                </div>
                <div className="flex bg-white border border-gray-100 rounded-2xl p-1.5 shadow-sm">
                    {["all", "pending", "approved"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === f ? "bg-mimosa-dark text-white shadow-md" : "text-gray-400 hover:text-gray-900"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Reviews Table */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-50">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Rating</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Comment</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredReviews.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center text-gray-400 font-medium">
                                        No reviews found matching your criteria
                                    </td>
                                </tr>
                            ) : (
                                filteredReviews.map((review) => (
                                    <tr key={review.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-mimosa-dark/5 text-mimosa-dark rounded-full flex items-center justify-center font-black text-sm uppercase">
                                                    {review.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <span className="block font-bold text-gray-900">{review.name}</span>
                                                    <span className="block text-xs text-gray-400 font-medium">{review.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={14} fill={i < review.rating ? "#E8B04F" : "none"} className={i < review.rating ? "text-mimosa-gold" : "text-gray-200"} />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 max-w-md">
                                            <p className="text-sm text-gray-600 line-clamp-2 italic font-medium">"{review.comment}"</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            {review.isApproved ? (
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                    <CheckCircle size={12} /> Approved
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 text-yellow-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                                    <Clock size={12} /> Pending
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleToggleStatus(review.id, review.isApproved)}
                                                    disabled={updatingStatus === review.id}
                                                    title={review.isApproved ? "Disapprove" : "Approve"}
                                                    className={`p-2 rounded-lg transition-all ${review.isApproved
                                                        ? "text-yellow-600 hover:bg-yellow-50"
                                                        : "text-green-600 hover:bg-green-50"
                                                        }`}
                                                >
                                                    {updatingStatus === review.id ? <Loader2 className="animate-spin" size={18} /> : (review.isApproved ? <XCircle size={18} /> : <CheckCircle size={18} />)}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteReview(review.id)}
                                                    title="Delete"
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
