"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Home,
    Users,
    Settings,
    FileText,
    LogOut,
    Map,
    BadgePercent,
    Bell,
    Search,
    Layers,
    Ruler,
    Menu,
    X
} from "lucide-react";


export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Responsive initial state
    useEffect(() => {
        if (window.innerWidth >= 1024) {
            setIsSidebarOpen(true);
        }
    }, []);

    // Close sidebar on small screens when route changes
    useEffect(() => {
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        }
    }, [pathname]);

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
        { icon: Ruler, label: "Floor Plans", href: "/admin/floor-plans" },
        { icon: Layers, label: "Facades", href: "/admin/facades" },
        { icon: Home, label: "House Designs", href: "/admin/designs" },
        // { icon: Map, label: "House & Land", href: "/admin/packages" },
        // { icon: BadgePercent, label: "Promotions", href: "/admin/promotions" },
        { icon: Users, label: "Enquiries", href: "/admin/enquiries" },
        { icon: Map, label: "Service Areas", href: "/admin/service-areas" },
        { icon: FileText, label: "Content Pages", href: "/admin/pages" },
        { icon: Settings, label: "Settings", href: "/admin/settings" },
    ];

    const getPageTitle = () => {
        const item = menuItems.find(item => pathname.startsWith(item.href));
        return item ? item.label : "Dashboard";
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-inter text-gray-900 overflow-x-hidden">
            {/* Overlay for mobile sidebar */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[55] lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={`fixed left-0 top-0 h-screen w-72 bg-white border-r border-gray-100 z-[60] flex flex-col transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}>
                {/* Logo */}
                <div className="p-8 border-b border-gray-100 bg-mimosa-dark flex items-center justify-start gap-3">
                    <div className="relative h-10 w-10">
                        <img
                            src="/logo.png?v=1.1"
                            alt="Mitra Admin"
                            className="object-contain w-full h-full brightness-0 invert"
                        />
                    </div>
                    <span className="text-white font-bold text-xl -mt-2 tracking-tight">Mitra Home</span>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all group ${isActive
                                    ? "bg-mimosa-dark text-white shadow-lg shadow-mimosa-dark/10"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                <item.icon size={20} className={isActive ? "text-white" : "text-gray-400 group-hover:text-gray-900"} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-gray-50 m-4 bg-gray-50 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-mimosa-dark text-white flex items-center justify-center font-bold shadow-sm">
                        AD
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <h4 className="text-sm font-bold text-gray-900 truncate">Admin User</h4>
                        <p className="text-[10px] text-gray-500 truncate">admin@mimosahomes.com.au</p>
                    </div>
                    <button className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg">
                        <LogOut size={18} />
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 bg-gray-50 min-h-screen ${isSidebarOpen ? "lg:ml-72" : "lg:ml-0"}`}>
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
                    <div className="flex items-center gap-4 lg:gap-8">
                        {/* Burger Button - Always visible now */}
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">{getPageTitle()}</h2>
                        <div className="hidden md:flex items-center bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 w-80">
                            <Search size={16} className="text-gray-400 mr-2" />
                            <input type="text" placeholder="Global search..." className="bg-transparent border-none text-sm outline-none w-full" />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-gray-400 hover:text-mimosa-dark transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-black rounded-full border-2 border-white" />
                        </button>
                        <Link href="/admin/designs/create" className="px-6 py-2.5 bg-mimosa-dark text-white text-sm font-bold rounded-full hover:bg-black transition-all shadow-lg shadow-black/10 transform hover:scale-[1.02]">
                            + New Design
                        </Link>
                    </div>
                </header>

                <div className="py-8 px-2 lg:px-4 w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
