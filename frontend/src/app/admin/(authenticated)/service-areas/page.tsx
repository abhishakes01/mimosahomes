"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/services/api";
import { Plus, Search, Edit, Trash2, Map } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUI } from "@/context/UIContext";
import Pagination from "@/components/Pagination";

export default function ServiceAreasPage() {
    const { showAlert, showConfirm } = useUI();
    const [serviceAreas, setServiceAreas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Pagination state (client-side for now as API returns all)
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        loadServiceAreas();
    }, []);

    const loadServiceAreas = async () => {
        setLoading(true);
        try {
            const data: any = await api.getServiceAreas();
            setServiceAreas(data);
        } catch (err) {
            console.error(err);
            showAlert("Error", "Failed to load service areas", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        showConfirm({
            title: "Delete Service Area",
            message: "Are you sure you want to delete this service area?",
            confirmText: "Delete",
            type: "error",
            onConfirm: async () => {
                try {
                    await api.deleteServiceArea(id, "mock-token");
                    loadServiceAreas();
                    showAlert("Success", "Service area deleted successfully", "success");
                } catch (err) {
                    showAlert("Error", "Failed to delete service area", "error");
                }
            }
        });
    };

    const filteredAreas = serviceAreas.filter(area =>
        area.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Client-side pagination logic
    const totalPages = Math.ceil(filteredAreas.length / itemsPerPage);
    const currentData = filteredAreas.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Service Areas</h2>
                    <p className="text-gray-400 text-sm mt-1">Manage delivery and service locations</p>
                </div>
                <Link
                    href="/admin/service-areas/create"
                    className="bg-mimosa-dark text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-black transition-all shadow-xl"
                >
                    <Plus size={20} /> New Area
                </Link>
            </div>

            {/* Stats & Search */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Areas</p>
                    <h2 className="text-4xl font-bold text-gray-900">{serviceAreas.length}</h2>
                </div>
                <div className="md:col-span-3 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="relative w-full">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search service areas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-mimosa-dark/30 rounded-2xl transition-all outline-none font-medium"
                        />
                    </div>
                </div>
            </div>

            {/* List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-40 animate-pulse">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mb-4" />
                    <div className="h-4 w-48 bg-gray-200 rounded-full" />
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50/50 text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black border-b border-gray-100">
                                <tr>
                                    <th className="px-8 py-6">Area Name</th>
                                    <th className="px-8 py-6">Status</th>
                                    <th className="px-8 py-6">Last Updated</th>
                                    <th className="px-8 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-sm">
                                <AnimatePresence>
                                    {currentData.map((area, idx) => (
                                        <motion.tr
                                            key={area.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="hover:bg-gray-50/50 transition-colors group"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                                                        <Map size={20} />
                                                    </div>
                                                    <span className="font-bold text-gray-900">{area.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${area.is_active ? 'bg-green-500' : 'bg-gray-300'}`} />
                                                    <span className={`text-[10px] font-black tracking-widest uppercase ${area.is_active ? 'text-green-600' : 'text-gray-400'}`}>
                                                        {area.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-gray-500">
                                                {new Date(area.updatedAt || area.updated_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0 translate-x-4">
                                                    <Link
                                                        href={`/admin/service-areas/${area.id}`}
                                                        className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-black hover:border-black hover:shadow-lg rounded-xl transition-all"
                                                    >
                                                        <Edit size={18} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(area.id)}
                                                        className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-100 hover:shadow-lg hover:shadow-red-500/10 rounded-xl transition-all"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                    {filteredAreas.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-32 text-center">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                                        <Map size={32} className="text-gray-200" />
                                                    </div>
                                                    <h3 className="text-lg font-bold text-gray-900 mb-1">No service areas found</h3>
                                                    <p className="text-gray-400 max-w-xs mx-auto">Create a new service area to get started.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
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
