"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, Menu, X, Phone, Calculator, ChevronDown, DollarSign } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
    {
        name: "New Home Designs",
        href: "/new-home-designs",
        dropdown: true as any
    },
    {
        name: "House & Land",
        href: "/house-land-packages",
        dropdown: [
            {
                title: "House and Land Packages",
                href: "/house-land-packages",
                image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop",
                description: "Perfectly paired value"
            },
            {
                title: "Homes for Sale",
                href: "/display-home-for-sale",
                image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2000&auto=format&fit=crop",
                description: "Luxury ready to move in"
            }
        ]
    },
    {
        name: "Display Homes",
        href: "/display-homes",
        dropdown: [
            {
                title: "Display Home Locations",
                href: "/display-homes",
                image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
                description: "Visit our stunning displays"
            },
            {
                title: "Display Home for Sale",
                href: "/display-home-for-sale",
                image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop",
                description: "Display Home for Sale"
            }
        ]
    },
    {
        name: "Building with us",
        href: "#",
        dropdown: true as any // Handled by specialized logic in the component
    },
];

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleMouseEnter = (name: string) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setActiveDropdown(name);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setActiveDropdown(null);
        }, 300);
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-sm shadow-md py-2" : "bg-gradient-to-b from-black/80 to-transparent py-4"
                }`}
        >
            <div className="w-full px-4 lg:px-8">
                {/* Top Bar (Hidden on Mobile) */}
                <div className={`hidden lg:flex justify-end items-center gap-6 mb-2 text-sm font-medium transition-opacity ${isScrolled ? "opacity-0 h-0 overflow-hidden" : "opacity-100 text-white/90"}`}>
                    <Link href="/quote/create" className="hover:text-mimosa-gold transition-colors flex items-center gap-2">
                        <Calculator size={14} /> Build a Quote
                    </Link>
                    <a href="tel:1300646672" className="hover:text-mimosa-gold transition-colors flex items-center gap-2">
                        <Phone size={14} /> 1300 646 672
                    </a>
                </div>

                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-4 group ">
                        <div className={`relative transition-all duration-300 flex items-center justify-center ${isScrolled ? "h-12 w-12" : "h-16 w-16"}`}>
                            <img
                                src="/logo.png?v=1.1"
                                alt="Mitra Home"
                                className={`object-contain w-full h-full transition-all duration-300 ${!isScrolled ? "brightness-0 invert" : ""}`}
                            />
                        </div>
                        <span className={`font-bold transition-all duration-300 tracking-tight uppercase -mt-2 leading-none ${isScrolled ? "text-xl text-gray-900" : "text-2xl text-white"}`}>
                            Mitra Home
                        </span>
                    </Link>

                    {/* Right Side: Navigation and Actions */}
                    <div className="hidden lg:flex items-center gap-12 ml-auto">
                        <nav className="flex items-center gap-8 h-full">
                            {NAV_ITEMS.map((item) => (
                                <div
                                    key={item.name}
                                    className="relative group h-full flex items-center"
                                    onMouseEnter={() => item.dropdown && handleMouseEnter(item.name)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <Link
                                        href={item.href}
                                        className={`text-[13px] font-bold hover:text-mimosa-gold transition-colors uppercase tracking-wider flex items-center gap-1.5 py-4 ${isScrolled ? "text-gray-800" : "text-white"
                                            }`}
                                    >
                                        {item.name}
                                        {item.dropdown && <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === item.name ? "rotate-180" : ""}`} />}
                                    </Link>

                                    {/* Mega Menu Dropdown */}
                                    <AnimatePresence>
                                        {item.dropdown && activeDropdown === item.name && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 15 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 15 }}
                                                transition={{ duration: 0.2, ease: "easeOut" }}
                                                className={`absolute top-full pt-2 w-[1000px] z-[60] ${["House & Land", "Display Homes", "Building with us"].includes(item.name) ? "right-0" : "right-1/2 translate-x-1/2"}`}
                                            >
                                                <div className="bg-white rounded-[24px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.25)] overflow-hidden">
                                                    {item.name === "New Home Designs" ? (
                                                        <div className="flex">
                                                            {/* Side Navigation */}
                                                            <div className="w-[200px] bg-gray-50/50 p-8 border-r border-gray-100">
                                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-8 block">
                                                                    New Home Designs
                                                                </span>
                                                                <div className="space-y-4">
                                                                    {[
                                                                        { title: "All Home Designs", href: "/new-home-designs" },
                                                                        { title: "Ebook", href: "/ebook" },
                                                                        { title: "Facades", href: "/facades" },
                                                                        { title: "Photo Gallery", href: "/photo-gallery" }
                                                                    ].map((link) => (
                                                                        <Link
                                                                            key={link.title}
                                                                            href={link.href}
                                                                            className="text-gray-600 hover:text-mimosa-gold text-sm font-bold transition-all block"
                                                                        >
                                                                            {link.title}
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {/* Collection Cards */}
                                                            <div className="flex-1 flex p-8 gap-8">
                                                                {/* V-Collection Card */}
                                                                <div className="flex-1 flex flex-col rounded-2xl border border-gray-100 overflow-hidden shadow-sm group/v hover:shadow-xl transition-all duration-500">
                                                                    <div className="bg-[#0793ad] py-8 flex flex-col items-center justify-center gap-2 group-hover/v:py-10 transition-all duration-500">
                                                                        <div className="relative w-16 h-16 border-4 border-white flex items-center justify-center transform rotate-45">
                                                                            <span className="text-white text-3xl font-black -rotate-45">V</span>
                                                                        </div>
                                                                        <span className="text-white text-[10px] font-black tracking-[0.3em] uppercase mt-2">Collection</span>
                                                                    </div>
                                                                    <div className="p-8 flex flex-col items-center text-center flex-1">
                                                                        <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6">
                                                                            Quality homes made affordable, with essential inclusions combined with functional floorplans designed to meet your everyday needs.
                                                                        </p>
                                                                        <div className="w-full space-y-4 mb-8">
                                                                            <div className="flex items-center justify-center gap-3 py-3 border-y border-gray-50">
                                                                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#0793ad]">
                                                                                    <DollarSign size={16} />
                                                                                </div>
                                                                                <span className="text-[13px] font-bold text-gray-700">Homes starting from $199,900</span>
                                                                            </div>
                                                                            <div className="flex items-center justify-center gap-3">
                                                                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#0793ad]">
                                                                                    <Search size={16} />
                                                                                </div>
                                                                                <span className="text-[13px] font-bold text-gray-700">8.5m - 14m Lot Frontage</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex gap-4 mb-8">
                                                                            <Link href="/v-collection/standard-inclusions" className="text-[11px] font-bold text-gray-800 hover:text-mimosa-gold underline underline-offset-4">Standard Inclusions</Link>
                                                                            <Link href="/v-collection/offers" className="text-[11px] font-bold text-gray-800 hover:text-mimosa-gold underline underline-offset-4">Current Offers</Link>
                                                                        </div>
                                                                        <div className="grid grid-cols-2 gap-3 w-full mt-auto">
                                                                            <Link href="/quote/create" className="bg-[#0793ad] hover:bg-[#067a8e] text-white text-[10px] font-black py-4 rounded-full transition-all tracking-widest uppercase flex items-center justify-center">
                                                                                Build a Quote
                                                                            </Link>
                                                                            <Link href="/new-home-designs?collections=v-collection" className="border-2 border-[#0793ad] text-[#0793ad] hover:bg-[#0793ad] hover:text-white text-[10px] font-black py-4 rounded-full transition-all tracking-widest uppercase flex items-center justify-center">
                                                                                View Designs
                                                                            </Link>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* M-Collection Card */}
                                                                <div className="flex-1 flex flex-col rounded-2xl border border-gray-100 overflow-hidden shadow-sm group/m hover:shadow-xl transition-all duration-500">
                                                                    <div className="bg-[#9ca3af] py-8 flex flex-col items-center justify-center gap-2 group-hover/m:py-10 transition-all duration-500">
                                                                        <div className="relative w-16 h-16 border-4 border-white flex items-center justify-center">
                                                                            <span className="text-white text-3xl font-black">M</span>
                                                                        </div>
                                                                        <span className="text-white text-[10px] font-black tracking-[0.3em] uppercase mt-2">Collection</span>
                                                                    </div>
                                                                    <div className="p-8 flex flex-col items-center text-center flex-1">
                                                                        <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6">
                                                                            Discover our beautifully designed floorplans and upgraded homes for those looking for a little more.
                                                                        </p>
                                                                        <div className="w-full space-y-4 mb-8">
                                                                            <div className="flex items-center justify-center gap-3 py-3 border-y border-gray-50">
                                                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                                                                    <Calculator size={16} />
                                                                                </div>
                                                                                <span className="text-[13px] font-bold text-gray-700">Style & comfort without the luxury price tag</span>
                                                                            </div>
                                                                            <div className="flex items-center justify-center gap-3">
                                                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                                                                    <Search size={16} />
                                                                                </div>
                                                                                <span className="text-[13px] font-bold text-gray-700">10.5m - 16m Lot Frontage</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex gap-4 mb-8">
                                                                            <Link href="/m-collection/standard-inclusions" className="text-[11px] font-bold text-gray-800 hover:text-mimosa-gold underline underline-offset-4">Standard Inclusions</Link>
                                                                            <Link href="/m-collection/offers" className="text-[11px] font-bold text-gray-800 hover:text-mimosa-gold underline underline-offset-4">Current Offers</Link>
                                                                        </div>
                                                                        <div className="grid grid-cols-2 gap-3 w-full mt-auto">
                                                                            <Link href="/display-homes" className="bg-[#9ca3af] hover:bg-gray-600 text-white text-[10px] font-black py-4 rounded-full transition-all tracking-widest uppercase flex items-center justify-center">
                                                                                View Display Homes
                                                                            </Link>
                                                                            <Link href="/new-home-designs?collections=m-collection" className="border-2 border-[#9ca3af] text-[#9ca3af] hover:bg-[#9ca3af] hover:text-white text-[10px] font-black py-4 rounded-full transition-all tracking-widest uppercase flex items-center justify-center">
                                                                                View Designs
                                                                            </Link>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : item.name === "House & Land" ? (
                                                        <div className="flex">
                                                            {/* Visual Cards */}
                                                            <div className="flex-1 flex p-8 gap-8">
                                                                <Link href="/house-land-packages" className="flex-1 group/hl relative h-80 rounded-2xl overflow-hidden">
                                                                    <Image
                                                                        src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop"
                                                                        alt="House & Land Packages"
                                                                        fill
                                                                        className="object-cover group-hover/hl:scale-110 transition-transform duration-700"
                                                                    />
                                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                                                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                                                        <h4 className="text-white text-2xl font-black uppercase italic leading-none mb-2">Packages</h4>
                                                                        <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">Perfectly paired value</p>
                                                                        <div className="mt-4 flex items-center gap-2 text-[#0793ad] text-[10px] font-black uppercase tracking-widest opacity-0 group-hover/hl:opacity-100 transition-all translate-y-4 group-hover/hl:translate-y-0">
                                                                            View All Packages <span className="text-lg">→</span>
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                                <Link href="/display-home-for-sale" className="flex-1 group/hl relative h-80 rounded-2xl overflow-hidden">
                                                                    <Image
                                                                        src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2000&auto=format&fit=crop"
                                                                        alt="Homes for Sale"
                                                                        fill
                                                                        className="object-cover group-hover/hl:scale-110 transition-transform duration-700"
                                                                    />
                                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                                                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                                                        <h4 className="text-white text-2xl font-black uppercase italic leading-none mb-2">Ready Built</h4>
                                                                        <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">Luxury ready to move in</p>
                                                                        <div className="mt-4 flex items-center gap-2 text-[#0793ad] text-[10px] font-black uppercase tracking-widest opacity-0 group-hover/hl:opacity-100 transition-all translate-y-4 group-hover/hl:translate-y-0">
                                                                            Explore Homes <span className="text-lg">→</span>
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    ) : item.name === "Display Homes" ? (
                                                        <div className="flex">
                                                            {/* Visual Cards */}
                                                            <div className="flex-1 flex p-8 gap-8">
                                                                <Link href="/display-homes" className="flex-1 group/dh relative h-80 rounded-2xl overflow-hidden">
                                                                    <Image
                                                                        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
                                                                        alt="Display Home Locations"
                                                                        fill
                                                                        className="object-cover group-hover/dh:scale-110 transition-transform duration-700"
                                                                    />
                                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                                                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                                                        <h4 className="text-white text-2xl font-black uppercase italic leading-none mb-2">Locations</h4>
                                                                        <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">Visit our stunning displays</p>
                                                                        <div className="mt-4 flex items-center gap-2 text-[#0793ad] text-[10px] font-black uppercase tracking-widest opacity-0 group-hover/dh:opacity-100 transition-all translate-y-4 group-hover/dh:translate-y-0">
                                                                            Find a Location <span className="text-lg">→</span>
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                                <Link href="/display-home-for-sale" className="flex-1 group/dh relative h-80 rounded-2xl overflow-hidden">
                                                                    <Image
                                                                        src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop"
                                                                        alt="Display Home For Sale"
                                                                        fill
                                                                        className="object-cover group-hover/dh:scale-110 transition-transform duration-700"
                                                                    />
                                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                                                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                                                        <h4 className="text-white text-2xl font-black uppercase italic leading-none mb-2">Display Home For Sale</h4>
                                                                        <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">Find your dream home</p>
                                                                        <div className="mt-4 flex items-center gap-2 text-[#0793ad] text-[10px] font-black uppercase tracking-widest opacity-0 group-hover/dh:opacity-100 transition-all translate-y-4 group-hover/dh:translate-y-0">
                                                                            Explore Homes <span className="text-lg">→</span>
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    ) : item.name === "Building with us" ? (
                                                        <div className="flex">
                                                            {/* Side Navigation */}
                                                            <div className="w-[200px] bg-gray-50/50 p-8 border-r border-gray-100">
                                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-8 block">
                                                                    Building with us
                                                                </span>
                                                                <div className="space-y-4">
                                                                    {[
                                                                        { title: "About Us", href: "/about-us" },
                                                                        { title: "50 Year Structural Warranty", href: "/50-year-structural-warranty" },
                                                                        { title: "Procedure", href: "/procedure" },
                                                                        { title: "MPORIUM", href: "/mporium" },
                                                                        { title: "Partners", href: "/partners" }
                                                                    ].map((link) => (
                                                                        <Link
                                                                            key={link.title}
                                                                            href={link.href}
                                                                            className="text-gray-600 hover:text-mimosa-gold text-sm font-bold transition-all flex items-center gap-3 group/link"
                                                                        >
                                                                            <span className="w-1 h-1 bg-gray-200 rounded-full group-hover/link:bg-mimosa-gold transition-all" />
                                                                            {link.title}
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {/* Visual Block */}
                                                            <div className="flex-1 p-8">
                                                                <Link href="/mporium" className="group/mp relative h-80 rounded-2xl overflow-hidden block">
                                                                    <Image
                                                                        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
                                                                        alt="MPORIUM"
                                                                        fill
                                                                        className="object-cover group-hover/mp:scale-110 transition-transform duration-700"
                                                                    />
                                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                                                    <div className="absolute inset-0 p-12 flex flex-col justify-end">
                                                                        <h4 className="text-white text-3xl font-black uppercase italic leading-none mb-4">MPORIUM</h4>
                                                                        <p className="text-white/70 text-sm font-bold uppercase tracking-[0.3em] mb-6">Selection Center</p>
                                                                        <div className="flex items-center gap-3 text-[#0793ad] text-xs font-black uppercase tracking-widest opacity-0 group-hover/mp:opacity-100 transition-all translate-y-4 group-hover/mp:translate-y-0">
                                                                            Discover MPORIUM <span className="text-xl">→</span>
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex gap-6">
                                                            {Array.isArray(item.dropdown) && item.dropdown.map((subItem: any) => (
                                                                <Link
                                                                    key={subItem.title}
                                                                    href={subItem.href}
                                                                    className="flex-1 group/item relative h-64 rounded-[16px] overflow-hidden"
                                                                >
                                                                    <Image
                                                                        src={subItem.image}
                                                                        alt={subItem.title}
                                                                        fill
                                                                        className="object-cover group-hover/item:scale-110 transition-transform duration-700"
                                                                    />
                                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                                                                    <div className="absolute inset-0 p-8 flex flex-col justify-end text-center">
                                                                        <h4 className="text-white text-xl font-black uppercase tracking-tighter italic leading-none mb-2">
                                                                            {subItem.title}
                                                                        </h4>
                                                                        <p className="text-white/70 text-[10px] font-bold uppercase tracking-[0.2em]">
                                                                            {subItem.description}
                                                                        </p>
                                                                    </div>
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </nav>


                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            <button className={`p-2 transition-colors ${isScrolled ? "text-gray-800 hover:text-mimosa-gold" : "text-white hover:text-mimosa-gold"}`}>
                                <Search size={20} />
                            </button>
                            <a
                                href="tel:1300646672"
                                className={`flex items-center gap-2 px-5 py-2 font-bold rounded-full transition-all tracking-tight uppercase text-xs ${isScrolled
                                    ? "bg-mimosa-dark text-white hover:bg-black shadow-lg"
                                    : "bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20"
                                    }`}
                            >
                                <Phone size={14} />
                                <span>1300 MITRA</span>
                            </a>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className={`lg:hidden p-2 ${isScrolled ? "text-mimosa-dark" : "text-white"}`}
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <Menu size={28} />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "tween", duration: 0.3 }}
                        className="fixed inset-0 bg-white z-50 flex flex-col"
                    >
                        <div className="flex items-center justify-between p-6 border-b">
                            <div className="flex items-center gap-3">
                                <img
                                    src="/logo.png?v=1.1"
                                    alt="Mitra Home"
                                    className="h-10 w-10 object-contain"
                                />
                                <span className="text-xl font-bold text-gray-900 tracking-tight uppercase">Mitra Home</span>
                            </div>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2 text-gray-400 hover:text-mimosa-dark"
                            >
                                <X size={28} />
                            </button>
                        </div>
                        <nav className="flex flex-col p-6 gap-6 overflow-y-auto">
                            {[
                                { name: "New Home Designs", href: "/new-home-designs" },
                                { name: "Display Homes", href: "/display-homes" },
                                { name: "House & Land", href: "/house-land-packages" },
                                // { name: "Facades", href: "#" },
                                { name: "Build a Quote", href: "/quote/create" }
                            ].map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-xl font-medium text-gray-800 hover:text-mimosa-gold"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className="mt-8">
                                <a
                                    href="tel:1300646672"
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-mimosa-gold text-white font-semibold rounded-lg"
                                >
                                    <Phone size={20} />
                                    <span>1300 646 672</span>
                                </a>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
