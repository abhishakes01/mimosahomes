"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Search, Filter, Mail, Phone, Calendar, CheckCircle, Clock } from "lucide-react";

export default function EnquiriesClient() {
    const [enquiries, setEnquiries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("all");

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
                                            'bg-gray-100 text-gray-600'
                                        }`}>
                                        {enquiry.type.replace('_', ' ')}
                                    </span>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-xl text-gray-600 text-sm mt-4 relative">
                                    {/* Little triangle arrow */}
                                    <div className="absolute top-0 left-8 -mt-2 w-4 h-4 bg-gray-50 transform rotate-45 border-l border-t border-gray-50/50" />
                                    <p>"{enquiry.message}"</p>
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
        </div>
    );
}
