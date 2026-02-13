"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, Menu, X, Phone, Calculator, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
    { name: "New Home Designs", href: "/new-home-designs" },
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
        name: "House & Land",
        href: "/house-land",
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
                                                <div className="bg-white rounded-[24px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.25)] overflow-hidden p-8">
                                                    {item.name === "Building with us" ? (
                                                        <div className="flex gap-12">
                                                            {/* Left Side: Links */}
                                                            <div className="w-[300px]">
                                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 block border-b border-gray-100 pb-2">
                                                                    Building with us
                                                                </span>
                                                                <div className="flex flex-col gap-4">
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
                                                                            className="text-gray-600 hover:text-mimosa-gold text-sm font-bold transition-colors flex items-center gap-2 group/link"
                                                                        >
                                                                            <span className="w-1.5 h-1.5 bg-gray-200 rounded-full group-hover/link:bg-mimosa-gold transition-colors" />
                                                                            {link.title}
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {/* Right Side: Visual Cards */}
                                                            <div className="flex-1 flex gap-6">
                                                                {[
                                                                    {
                                                                        title: "MPORIUM",
                                                                        href: "/mporium",
                                                                        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
                                                                        description: "Selection Center"
                                                                    },
                                                                ].map((subItem) => (
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
                                { name: "House & Land", href: "/house-land" },
                                // { name: "Facades", href: "#" },
                                { name: "Virtual Tours", href: "/virtual-tours" },
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
