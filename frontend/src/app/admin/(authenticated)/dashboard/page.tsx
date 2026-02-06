import { ArrowUpRight, Users, Home, TrendingUp, DollarSign } from "lucide-react";

export default function AdminDashboard() {
    const stats = [
        { title: "Total Enquiries", value: "1,248", change: "+12.5%", icon: Users, color: "bg-blue-50 text-blue-600" },
        { title: "Active Design Listings", value: "45", change: "+4", icon: Home, color: "bg-orange-50 text-orange-600" },
        { title: "House & Land Packages", value: "128", change: "-2", icon: Map, color: "bg-green-50 text-green-600" },
        { title: "Avg. Sale Price", value: "$485k", change: "+5.2%", icon: DollarSign, color: "bg-purple-50 text-purple-600" },
    ];

    const recentEnquiries = [
        { name: "Sarah Jenkins", email: "sarah.j@gmail.com", type: "V Collection Quote", status: "New", time: "2 mins ago" },
        { name: "Michael Chen", email: "m.chen@outlook.com", type: "Display Home Tour", status: "Contacted", time: "1 hour ago" },
        { name: "David Miller", email: "dave.miller@yahoo.com", type: "H&L Package Enquiry", status: "New", time: "3 hour ago" },
        { name: "Emma Wilson", email: "emma.w@gmail.com", type: "General Enquiry", status: "Resolved", time: "1 day ago" },
    ];

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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Enquiries Table */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-bold text-lg text-gray-800">Recent Enquiries</h3>
                        <button className="text-sm text-mimosa-gold font-bold hover:text-yellow-600">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Name</th>
                                    <th className="px-6 py-4 font-semibold">Type</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold text-right">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {recentEnquiries.map((enquiry, i) => (
                                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{enquiry.name}</div>
                                            <div className="text-gray-400 text-xs">{enquiry.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 font-medium">{enquiry.type}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${enquiry.status === "New" ? "bg-green-100 text-green-700" :
                                                    enquiry.status === "Contacted" ? "bg-blue-100 text-blue-700" :
                                                        "bg-gray-100 text-gray-600"
                                                }`}>
                                                {enquiry.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-400">{enquiry.time}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions / Notices */}
                <div className="bg-mimosa-dark text-white rounded-2xl shadow-xl overflow-hidden relative">
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
                </div>
            </div>
        </div>
    );
}

// Helper mock icon for map since it was missing in imports
function Map({ size, className }: { size?: number, className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
            <line x1="8" y1="2" x2="8" y2="18"></line>
            <line x1="16" y1="6" x2="16" y2="22"></line>
        </svg>
    )
}
