"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, getFullUrl } from "@/services/api";
import { Plus, Search, Filter, Edit, Trash2, MapPin, Bed, Bath, Car, ArrowUpRight, ChevronRight, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUI } from "@/context/UIContext";

export default function ListingsPage() {
    const { showAlert, showConfirm } = useUI();
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        loadListings();
    }, []);

    const loadListings = async () => {
        try {
            const data: any = await api.getListings();
            setListings(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        showConfirm({
            title: "Delete Listing",
            message: "Are you sure you want to delete this listing? This action cannot be undone.",
            confirmText: "Delete",
            onConfirm: async () => {
                try {
                    await api.deleteListing(id, "mock-token");
                    loadListings();
                    showAlert("Success", "Listing deleted successfully", "success");
                } catch (err) {
                    showAlert("Error", "Failed to delete listing", "error");
                }
            }
        });
    };

    const filteredListings = listings.filter(l =>
        l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-20">
            {/* Stats & Tools */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Packages</p>
                    <h2 className="text-4xl font-bold text-gray-900">{listings.length}</h2>
                </div>
                <div className="md:col-span-3 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative w-full">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Find by address or property name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-mimosa-dark/30 rounded-2xl transition-all outline-none font-medium"
                        />
                    </div>
                    <button className="px-6 py-4 bg-gray-50 text-gray-600 rounded-2xl font-bold hover:bg-gray-100 transition-colors flex items-center gap-2 whitespace-nowrap">
                        <Filter size={18} /> Filters
                    </button>
                </div>
            </div>

            {/* Enhanced Table / Card List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-40 animate-pulse">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mb-4" />
                    <div className="h-4 w-48 bg-gray-200 rounded-full" />
                </div>
            ) : (
                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black border-b border-gray-100">
                            <tr>
                                <th className="px-8 py-6">Property Design</th>
                                <th className="px-8 py-6">Classification</th>
                                <th className="px-8 py-6">Investment</th>
                                <th className="px-8 py-6">Configuration</th>
                                <th className="px-8 py-6">Availability</th>
                                <th className="px-8 py-6 text-right">Settings</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-sm">
                            <AnimatePresence>
                                {filteredListings.map((listing, idx) => (
                                    <motion.tr
                                        key={listing.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="hover:bg-gray-50/50 transition-colors group"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100">
                                                    {listing.images && listing.images.length > 0 ? (
                                                        <img
                                                            src={getFullUrl(typeof listing.images[0] === 'string' ? listing.images[0] : listing.images[0].url)}
                                                            className="w-full h-full object-cover"
                                                            alt=""
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                            <ImageIcon size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900 text-base tracking-tight mb-0.5">{listing.title}</div>
                                                    <div className="text-gray-400 text-xs flex items-center gap-1 font-medium">
                                                        <MapPin size={12} className="text-gray-400" /> {listing.address}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="capitalize bg-mimosa-dark text-white text-[10px] font-black tracking-widest px-3 py-1.5 rounded-lg shadow-sm">
                                                {listing.type.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="font-black text-gray-900 text-lg">
                                                <span className="text-gray-400 text-sm mr-1">$</span>
                                                {Number(listing.price).toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4 text-gray-500 font-bold">
                                                <span className="flex items-center gap-1.5"><Bed size={16} className="text-gray-300" /> {listing.bedrooms}</span>
                                                <span className="flex items-center gap-1.5"><Bath size={16} className="text-gray-300" /> {listing.bathrooms}</span>
                                                <span className="flex items-center gap-1.5"><Car size={16} className="text-gray-300" /> {listing.cars}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${listing.status === 'available' ? 'bg-green-500' :
                                                    listing.status === 'sold' ? 'bg-red-500' :
                                                        'bg-orange-500'
                                                    }`} />
                                                <span className={`text-[10px] font-black tracking-widest uppercase ${listing.status === 'available' ? 'text-green-600' :
                                                    listing.status === 'sold' ? 'text-red-600' :
                                                        'text-orange-600'
                                                    }`}>
                                                    {listing.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0 translate-x-4">
                                                <Link
                                                    href={`/admin/designs/${listing.id}`}
                                                    className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-black hover:border-black hover:shadow-lg rounded-xl transition-all"
                                                >
                                                    <Edit size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(listing.id)}
                                                    className="p-3 bg-white border border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-100 hover:shadow-lg hover:shadow-red-500/10 rounded-xl transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                                <div className="w-px h-6 bg-gray-100 mx-2" />
                                                <button className="p-3 text-gray-400 hover:bg-black hover:text-white rounded-xl transition-all">
                                                    <ArrowUpRight size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                                {filteredListings.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-32 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                                    <Search size={32} className="text-gray-200" />
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900 mb-1">No property designs found</h3>
                                                <p className="text-gray-400 max-w-xs mx-auto">Try adjusting your search terms or filters to find what you're looking for.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
