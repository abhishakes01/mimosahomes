"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation"; // Added useRouter
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
    X,
    MessageSquare,
    Book
} from "lucide-react";


export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile drawer / Desktop visibility
    const [isCollapsed, setIsCollapsed] = useState(false); // Desktop mini mode
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState<{ name?: string, email?: string } | null>(null);

    // Auth Check
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            router.replace('/admin/login');
        } else {
            try {
                const user = JSON.parse(userStr);
                setUserData(user);
                setIsAuthorized(true);
            } catch (e) {
                console.error("Failed to parse user data", e);
                router.replace('/admin/login');
            }
        }
        setIsLoading(false);
    }, [pathname, router]);

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

    const handleLogout = () => {
        localStorage.removeItem('user');
        router.push('/admin/login');
    };

    const toggleSidebar = () => {
        if (window.innerWidth >= 1024) {
            setIsCollapsed(!isCollapsed);
        } else {
            setIsSidebarOpen(!isSidebarOpen);
        }
    };

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
        { icon: MessageSquare, label: "Reviews", href: "/admin/reviews" },
        { icon: Ruler, label: "Floor Plans", href: "/admin/floor-plans" },
        { icon: Layers, label: "Facades", href: "/admin/facades" },
        { icon: Home, label: "House Designs", href: "/admin/designs" },
        { icon: BadgePercent, label: "Upgrades", href: "/admin/upgrades" },
        { icon: Users, label: "Enquiries", href: "/admin/enquiries" },
        { icon: Map, label: "Service Areas", href: "/admin/service-areas" },
        // { icon: Book, label: "Ebooks", href: "/admin/pages/ebook" },
        { icon: FileText, label: "Content Pages", href: "/admin/pages" },
        { icon: Settings, label: "Settings", href: "/admin/settings" },
    ];

    const getPageTitle = () => {
        const item = menuItems.find(item => pathname.startsWith(item.href));
        return item ? item.label : "Dashboard";
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border-4 border-mimosa-dark border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAuthorized) {
        return null; // Don't render anything while redirecting
    }

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
            <aside className={`fixed left-0 top-0 h-screen w-72 bg-white border-r border-gray-100 z-[60] flex flex-col transition-all duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-0 lg:border-none"
                } ${isCollapsed ? "lg:w-20" : "lg:w-72"}`}>

                {/* Logo */}
                <div className={`p-6 border-b border-gray-100 bg-mimosa-dark flex items-center transition-all duration-300 ${isCollapsed ? "lg:justify-center lg:p-4" : "justify-start gap-3 p-8"}`}>
                    <div className="relative h-8 w-8 flex-shrink-0">
                        <img
                            src="/logo.png?v=1.1"
                            alt="Mitra Admin"
                            className="object-contain w-full h-full brightness-0 invert"
                        />
                    </div>
                    <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`text-white font-bold text-xl -mt-1 tracking-tight whitespace-nowrap ${isCollapsed ? "lg:hidden" : "block"}`}
                    >
                        Mitra Home
                    </motion.span>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto py-8 px-3 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                title={isCollapsed ? item.label : ""}
                                className={`flex items-center rounded-xl font-medium transition-all group relative ${isCollapsed ? "lg:justify-center lg:p-3" : "gap-3 px-4 py-3.5"} ${isActive
                                    ? "bg-mimosa-dark text-white shadow-lg shadow-mimosa-dark/10"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                <item.icon size={22} className={`flex-shrink-0 ${isActive ? "text-white" : "text-gray-400 group-hover:text-gray-900"}`} />
                                <motion.span
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`whitespace-nowrap ${isCollapsed ? "lg:hidden" : "block"}`}
                                >
                                    {item.label}
                                </motion.span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile */}
                <div className={`border-t border-gray-50 bg-gray-50 rounded-2xl flex items-center gap-3 transition-all duration-300 ${isCollapsed ? "lg:m-2 lg:p-2 lg:justify-center" : "m-4 p-4"}`}>
                    <div className="w-10 h-10 flex-shrink-0 rounded-full bg-mimosa-dark text-white flex items-center justify-center font-bold shadow-sm">
                        {userData?.name ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'AD'}
                    </div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`flex-1 overflow-hidden ${isCollapsed ? "lg:hidden" : "block"}`}
                    >
                        <h4 className="text-sm font-bold text-gray-900 truncate">{userData?.name || 'Admin User'}</h4>
                        <p className="text-[10px] text-gray-500 truncate">{userData?.email || 'admin@mitrahomes.com.au'}</p>
                    </motion.div>
                    <button
                        onClick={handleLogout}
                        className={`text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg flex-shrink-0 ${isCollapsed ? "lg:hidden" : "block"}`}
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 bg-gray-50 min-h-screen ${isSidebarOpen ? (isCollapsed ? "lg:ml-20" : "lg:ml-72") : "lg:ml-0"}`}>
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
                    <div className="flex items-center gap-4 lg:gap-8">
                        <button
                            onClick={toggleSidebar}
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">{getPageTitle()}</h2>
                        <div className="hidden md:flex items-center bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 w-64 lg:w-80">
                            <Search size={16} className="text-gray-400 mr-2" />
                            <input type="text" placeholder="Global search..." className="bg-transparent border-none text-sm outline-none w-full" />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 lg:gap-6">
                        <button className="relative p-2 text-gray-400 hover:text-mimosa-dark transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-black rounded-full border-2 border-white" />
                        </button>
                        <Link href="/admin/designs/create" className="px-4 lg:px-6 py-2.5 bg-mimosa-dark text-white text-[10px] lg:text-sm font-bold rounded-full hover:bg-black transition-all shadow-lg shadow-black/10 transform hover:scale-[1.02] whitespace-nowrap">
                            + New Design
                        </Link>
                    </div>
                </header>

                <div className="py-8 px-4 lg:px-6 w-full max-w-[1600px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
