"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, getFullUrl } from "@/services/api";
import { Plus, Search, Edit, Trash2, Image as ImageIcon, DollarSign, Ruler, Car } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloorPlansPage() {
    const [floorplans, setFloorplans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        loadFloorPlans();
    }, []);

    const loadFloorPlans = async () => {
        try {
            const data: any = await api.getFloorPlans();
            setFloorplans(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this floor plan?")) return;

        try {
            await api.deleteFloorPlan(id, "mock-token");
            loadFloorPlans();
        } catch (err) {
            alert("Failed to delete");
        }
    };

    const filteredFloorPlans = floorplans.filter(fp =>
        fp.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Floor Plans</h2>
                    <p className="text-gray-400 text-sm mt-1">Manage reusable floor plan designs</p>
                </div>
                <Link
                    href="/admin/floor-plans/create"
                    className="bg-mimosa-dark text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-black transition-all shadow-xl"
                >
                    <Plus size={20} /> New Floor Plan
                </Link>
            </div>

            {/* Stats & Search */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Floor Plans</p>
                    <h2 className="text-4xl font-bold text-gray-900">{floorplans.length}</h2>
                </div>
                <div className="md:col-span-3 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="relative w-full">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search floor plans..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-mimosa-dark/30 rounded-2xl transition-all outline-none font-medium"
                        />
                    </div>
                </div>
            </div>

            {/* Floor Plans Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-40 animate-pulse">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mb-4" />
                    <div className="h-4 w-48 bg-gray-200 rounded-full" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredFloorPlans.map((fp, idx) => (
                            <motion.div
                                key={fp.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl transition-all group"
                            >
                                {/* Image */}
                                <div className="relative aspect-[4/3] bg-gray-100">
                                    {fp.image_url ? (
                                        <img
                                            src={getFullUrl(fp.image_url)}
                                            alt={fp.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <ImageIcon size={48} />
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{fp.title}</h3>

                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Ruler size={16} className="text-gray-400" />
                                            <span>{fp.total_area || 'N/A'} sq</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Car size={16} className="text-gray-400" />
                                            <span>{fp.car_spaces || 0} cars</span>
                                        </div>
                                        {fp.price && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600 col-span-2">
                                                <DollarSign size={16} className="text-gray-400" />
                                                <span className="font-bold">${Number(fp.price).toLocaleString()}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                                        <Link
                                            href={`/admin/floor-plans/${fp.id}`}
                                            className="flex-1 px-4 py-2 bg-gray-50 hover:bg-mimosa-dark hover:text-white text-gray-700 rounded-xl font-bold text-center transition-all"
                                        >
                                            <Edit size={16} className="inline mr-2" />
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(fp.id)}
                                            className="px-4 py-2 bg-red-50 hover:bg-red-500 hover:text-white text-red-600 rounded-xl font-bold transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredFloorPlans.length === 0 && (
                        <div className="col-span-full flex flex-col items-center py-20">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                <Search size={32} className="text-gray-200" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">No floor plans found</h3>
                            <p className="text-gray-400">Create your first floor plan to get started</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
