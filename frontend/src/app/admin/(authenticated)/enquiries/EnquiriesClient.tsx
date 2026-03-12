"use client";

import { useEffect, useState } from "react";
import { api, getFullUrl } from "@/services/api";
import { Search, Filter, Mail, Phone, Calendar, CheckCircle, Clock, FileText, Image as ImageIcon, ExternalLink, X, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function EnquiriesClient() {
    const [enquiries, setEnquiries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedFile, setSelectedFile] = useState<string | null>(null);

    useEffect(() => {
        loadEnquiries();
    }, []);

    const loadEnquiries = async () => {
        try {
            // In real app use token
            const data: any = await api.getEnquiries("mock-token");
            setEnquiries(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            await api.updateEnquiryStatus(id, newStatus, "mock-token");
            // Optimistic update
            setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
        } catch (err) {
            alert("Failed to update status");
        }
    };

    const filteredEnquiries = enquiries.filter(e =>
        filterStatus === "all" ? true : e.status === filterStatus
    );

    const getFileIcon = (url: string) => {
        const ext = url.split('.').pop()?.toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'].includes(ext || '')) {
            return <ImageIcon size={18} />;
        }
        return <FileText size={18} />;
    };

    const isImage = (url: string) => {
        const ext = url.split('.').pop()?.toLowerCase();
        return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'].includes(ext || '');
    };

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    {['all', 'new', 'contacted', 'qualified', 'closed'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold capitalize whitespace-nowrap transition-colors ${filterStatus === status
                                ? 'bg-mimosa-dark text-white'
                                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search name or email..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-mimosa-gold/20 focus:border-mimosa-gold"
                    />
                </div>
            </div>

            {/* Enquiries List */}
            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="text-center py-20 text-gray-400">Loading enquiries...</div>
                ) : filteredEnquiries.length === 0 ? (
                    <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border border-gray-100">No enquiries found.</div>
                ) : (
                    filteredEnquiries.map((enquiry) => (
                        <div key={enquiry.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col lg:flex-row gap-6">

                            {/* Left: Contact Info */}
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">{enquiry.name}</h3>
                                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                                            <span className="flex items-center gap-1"><Mail size={12} /> {enquiry.email}</span>
                                            {enquiry.phone && <span className="flex items-center gap-1"><Phone size={12} /> {enquiry.phone}</span>}
                                            <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(enquiry.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${enquiry.type === 'finance' ? 'bg-purple-100 text-purple-700' :
                                            enquiry.type === 'listing_enquiry' ? 'bg-blue-100 text-blue-700' :
                                                enquiry.type === 'new-home' ? 'bg-orange-100 text-orange-700' :
                                                    enquiry.type === 'house-land' ? 'bg-green-100 text-green-700' :
                                                        enquiry.type === 'display-homes' ? 'bg-indigo-100 text-indigo-700' :
                                                            enquiry.type === 'QUOTE_BUILDER' ? 'bg-mimosa-gold shadow-sm text-mimosa-dark' :
                                                                enquiry.type === 'MPORIUM_ENQUIRY' ? 'bg-mimosa-dark text-white' :
                                                                    'bg-gray-100 text-gray-600'
                                        }`}>
                                        {enquiry.type.replace('_', ' ').replace('-', ' ')}
                                    </span>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-xl text-gray-600 text-sm mt-4 relative">
                                    {/* Little triangle arrow */}
                                    <div className="absolute top-0 left-8 -mt-2 w-4 h-4 bg-gray-50 transform rotate-45 border-l border-t border-gray-50/50" />
                                    <p>"{enquiry.message}"</p>
                                    
                                    {/* Attachments Section */}
                                    {(enquiry.metadata?.landFiles?.length > 0) && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Attachments</span>
                                                <span className="h-px flex-1 bg-gray-100"></span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {enquiry.metadata.landFiles.map((file: string, idx: number) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setSelectedFile(getFullUrl(file))}
                                                        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:border-mimosa-gold hover:text-mimosa-gold transition-all shadow-sm group"
                                                    >
                                                        <span className="text-gray-400 group-hover:text-mimosa-gold transition-colors">
                                                            {getFileIcon(file)}
                                                        </span>
                                                        <span>Document {idx + 1}</span>
                                                        <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {enquiry.listing && (
                                        <div className="mt-2 pt-2 border-t border-gray-200 text-xs font-bold text-mimosa-dark">
                                            Regarding: {enquiry.listing.title} ({enquiry.listing.address})
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right: Actions */}
                            <div className="lg:w-48 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6 gap-3">
                                <label className="text-xs font-bold text-gray-400 uppercase">Current Status</label>
                                <select
                                    value={enquiry.status}
                                    onChange={(e) => handleStatusUpdate(enquiry.id, e.target.value)}
                                    className={`w-full p-2 rounded-lg text-sm font-bold border-none focus:ring-2 focus:ring-mimosa-gold ${enquiry.status === 'new' ? 'bg-green-100 text-green-700' :
                                        enquiry.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                                            enquiry.status === 'qualified' ? 'bg-purple-100 text-purple-700' :
                                                'bg-gray-100 text-gray-600'
                                        }`}
                                >
                                    <option value="new">New</option>
                                    <option value="contacted">Contacted</option>
                                    <option value="qualified">Qualified</option>
                                    <option value="closed">Closed</option>
                                </select>

                                <button className="w-full py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2">
                                    <Mail size={14} /> Email client
                                </button>
                            </div>

                        </div>
                    ))
                )}
            </div>

            {/* File Preview Modal */}
            <AnimatePresence>
                {selectedFile && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedFile(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative bg-white w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                                        {getFileIcon(selectedFile)}
                                    </div>
                                    <span className="text-sm font-bold text-gray-900 truncate max-w-xs md:max-w-md">
                                        {selectedFile.split('/').pop()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <a 
                                        href={selectedFile} 
                                        download 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 text-gray-500 hover:text-mimosa-dark hover:bg-gray-50 rounded-lg transition-all flex items-center gap-2 text-xs font-bold"
                                    >
                                        <Download size={18} />
                                        <span className="hidden sm:inline">Download</span>
                                    </a>
                                    <button
                                        onClick={() => setSelectedFile(null)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="flex-1 overflow-auto bg-gray-100 p-4 md:p-8 flex items-center justify-center">
                                {isImage(selectedFile) ? (
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        <img 
                                            src={selectedFile} 
                                            alt="Preview" 
                                            className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                                        />
                                    </div>
                                ) : (
                                    <iframe 
                                        src={`${selectedFile}#toolbar=0`} 
                                        className="w-full h-full border-none rounded-lg shadow-lg bg-white"
                                        title="PDF Preview"
                                    />
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
