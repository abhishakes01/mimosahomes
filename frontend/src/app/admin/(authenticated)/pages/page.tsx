"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Copy, Plus, MoreVertical, Edit2, Loader2, FileText, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function PagesIndex() {
    const [pages, setPages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const staticPages = [
        { title: "About Us", slug: "about-us", description: "Manage hero image, commitments, and agency stats." },
        { title: "50 Year Structural Warranty", slug: "50-year-structural-warranty", description: "Manage warranty text, badges, and background images." },
        { title: "Procedure", slug: "procedure", description: "Manage the step-by-step building process instructions." },
        { title: "Mporium", slug: "mporium", description: "Manage the design showroom details and visual gallery." },
        { title: "Partners", slug: "partners", description: "Manage the partner logos and the hero banner." },
        { title: "Contact Us", slug: "contact", description: "Manage contact information, business hours, and location." }
    ];

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            setLoading(true);
            const data: any = await api.getPages();
            setPages(data);
        } catch (error) {
            console.error("Failed to fetch pages:", error);
            showToast("Failed to fetch page data.", "error");
        } finally {
            setLoading(false);
        }
    };

    const getModifiedDate = (slug: string) => {
        const page = pages.find(p => p.slug === slug);
        if (page && page.updatedAt) {
            return new Date(page.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
        return "Never";
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Content Pages</h1>
                    <p className="text-sm font-medium text-gray-500 mt-1">Manage the content and media of static website pages.</p>
                </div>
            </div>

            {/* Custom Toast Notification */}
            {toast && (
                <div className={`fixed bottom-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg font-medium text-sm transition-all flex items-center gap-2 ${toast.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                    {toast.type === 'success' ? (
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                    ) : (
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                    )}
                    {toast.message}
                </div>
            )}

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Configurable Pages</h2>
                </div>

                <div className="divide-y divide-gray-100 p-2">
                    {staticPages.map((page, index) => (
                        <motion.div
                            key={page.slug}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link
                                href={`/admin/pages/${page.slug}`}
                                className="group flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#1a3a4a]/5 rounded-xl flex items-center justify-center text-[#1a3a4a] group-hover:bg-[#1a3a4a] group-hover:text-white transition-colors">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 group-hover:text-[#1a3a4a] transition-colors">{page.title}</h3>
                                        <p className="text-sm text-gray-500 line-clamp-1">{page.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="hidden md:block text-right">
                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Last Modified</div>
                                        <div className="text-sm font-medium text-gray-900">{loading ? <Loader2 className="animate-spin w-4 h-4 ml-auto" /> : getModifiedDate(page.slug)}</div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-[#1a3a4a] group-hover:text-[#1a3a4a] shadow-sm transition-all group-hover:translate-x-1">
                                        <ChevronRight size={20} />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
