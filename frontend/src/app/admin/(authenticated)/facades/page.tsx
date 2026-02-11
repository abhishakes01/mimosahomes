"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, getFullUrl } from "@/services/api";
import { Plus, Search, Edit, Trash2, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUI } from "@/context/UIContext";
import Pagination from "@/components/Pagination";

export default function FacadesPage() {
    const { showAlert, showConfirm } = useUI();
    const [facades, setFacades] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [limit] = useState(9); // Using 9 for a 3x3 grid

    useEffect(() => {
        loadFacades(currentPage);
    }, [currentPage]);

    const loadFacades = async (page: number) => {
        setLoading(true);
        try {
            const response: any = await api.getFacades({ page, limit });
            setFacades(response.data || []);
            setTotalItems(response.total || 0);
            setTotalPages(response.totalPages || 1);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        showConfirm({
            title: "Delete Facade?",
            message: "Are you sure you want to delete this facade? This will remove its associations with floor plans.",
            confirmText: "Delete",
            type: "error",
            onConfirm: async () => {
                try {
                    await api.deleteFacade(id, "mock-token");
                    loadFacades(currentPage);
                    showAlert("Deleted", "Facade has been removed successfully.", "success");
                } catch (err) {
                    showAlert("Delete Failed", "Failed to delete facade. Please try again.", "error");
                }
            }
        });
    };

    const filteredFacades = facades.filter(f =>
        f.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Facades</h2>
                    <p className="text-gray-400 text-sm mt-1">Manage facade designs with floor plans</p>
                </div>
                <Link
                    href="/admin/facades/create"
                    className="bg-mimosa-dark text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-black transition-all shadow-xl"
                >
                    <Plus size={20} /> New Facade
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Facades</p>
                    <h2 className="text-4xl font-bold text-gray-900">{totalItems}</h2>
                </div>
                <div className="md:col-span-3 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="relative w-full">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search facades..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-mimosa-dark/30 rounded-2xl transition-all outline-none font-medium"
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-40 animate-pulse">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mb-4" />
                    <div className="h-4 w-48 bg-gray-200 rounded-full" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredFacades.map((facade, idx) => (
                                <motion.div
                                    key={facade.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl transition-all group"
                                >
                                    <div className="relative aspect-[4/3] bg-gray-100">
                                        {facade.image_url ? (
                                            <img
                                                src={getFullUrl(facade.image_url)}
                                                alt={facade.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <ImageIcon size={48} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{facade.title}</h3>
                                        <p className="text-sm text-gray-500 mb-4">
                                            Width: {facade.width || 'N/A'}m | {facade.floorplans?.length || 0} floor plans
                                        </p>

                                        <div className="flex gap-2 pt-4 border-t border-gray-100">
                                            <Link
                                                href={`/admin/facades/${facade.id}`}
                                                className="flex-1 px-4 py-2 bg-gray-50 hover:bg-mimosa-dark hover:text-white text-gray-700 rounded-xl font-bold text-center transition-all"
                                            >
                                                <Edit size={16} className="inline mr-2" />
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(facade.id)}
                                                className="px-4 py-2 bg-red-50 hover:bg-red-500 hover:text-white text-red-600 rounded-xl font-bold transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {filteredFacades.length === 0 && (
                            <div className="col-span-full flex flex-col items-center py-20">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                    <Search size={32} className="text-gray-200" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">No facades found</h3>
                                <p className="text-gray-400">Create your first facade to get started</p>
                            </div>
                        )}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}
        </div>
    );
}
