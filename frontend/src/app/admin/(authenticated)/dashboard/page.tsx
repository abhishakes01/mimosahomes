"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Users, Home, TrendingUp, DollarSign, Loader2, Map } from "lucide-react";
import { api } from "@/services/api";
import Link from "next/link";

export default function AdminDashboard() {
    const [statsData, setStatsData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await api.getDashboardStats("mock-token");
                setStatsData(data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const formatPrice = (price: number) => {
        if (!price) return "$0";
        if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}m`;
        if (price >= 1000) return `$${Math.round(price / 1000)}k`;
        return `$${price}`;
    };

    const stats = [
        {
            title: "Total Enquiries",
            value: statsData?.totalEnquiries?.toLocaleString() || "0",
            change: statsData?.newEnquiries ? `${statsData.newEnquiries} new` : "0 new",
            icon: Users,
            color: "bg-blue-50 text-blue-600"
        },
        {
            title: "Active Design Listings",
            value: statsData?.activeDesignListings?.toString() || "0",
            change: "Live",
            icon: Home,
            color: "bg-orange-50 text-orange-600"
        },
        {
            title: "House & Land Packages",
            value: statsData?.houseLandPackages?.toString() || "0",
            change: "Live",
            icon: Map,
            color: "bg-green-50 text-green-600"
        },
        {
            title: "Avg. Sale Price",
            value: formatPrice(statsData?.avgPrice),
            change: "Avg",
            icon: DollarSign,
            color: "bg-purple-50 text-purple-600"
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-mimosa-gold" size={48} />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.title} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                {stat.change} <ArrowUpRight size={12} className="ml-1" />
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                        <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                    </div>
                ))}
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                {/* Enquiries Table */}
                <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-bold text-lg text-gray-800">Recent Enquiries</h3>
                        <Link href="/admin/enquiries" className="text-sm text-mimosa-gold font-bold hover:text-yellow-600">
                            View All
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Name</th>
                                    <th className="px-6 py-4 font-semibold">Interest</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {statsData?.recentEnquiries?.map((enquiry: any, i: number) => (
                                    <tr key={enquiry.id || i} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{enquiry.name}</div>
                                            <div className="text-gray-400 text-xs">{enquiry.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 font-medium capitalize">
                                            {(enquiry.type || enquiry.interest || 'General').replace('_', ' ').replace('-', ' ')}
                                            {enquiry.listing && <span className="block text-[10px] text-mimosa-gold font-bold uppercase">{enquiry.listing.title}</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${enquiry.status === "new" ? "bg-green-100 text-green-700" :
                                                enquiry.status === "contacted" ? "bg-blue-100 text-blue-700" :
                                                    "bg-gray-100 text-gray-600"
                                                }`}>
                                                {enquiry.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-400">
                                            {new Date(enquiry.createdAt || enquiry.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions / Notices */}
                {/* <div className="bg-mimosa-dark text-white rounded-2xl shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-32 bg-mimosa-gold/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                    <div className="p-8 relative z-10">
                        <h3 className="text-2xl font-bold mb-4">Admin Notices</h3>
                        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                            Scheduled maintenance for the image server is planned for this Sunday at 2:00 AM. Please ensure all new listings are uploaded before then.
                        </p>
                        <div className="p-4 bg-white/5 border border-white/10 rounded-xl mb-6">
                            <h4 className="font-bold text-mimosa-gold mb-1">New Feature Alert</h4>
                            <p className="text-xs text-gray-300">You can now tag "Featured" properties directly from the dashboard listing view.</p>
                        </div>
                        <button className="w-full py-3 bg-white text-mimosa-dark font-bold rounded-xl hover:bg-gray-200 transition-colors">
                            System Status
                        </button>
                    </div>
                </div> */}
            </div>
        </div>
    );
}


