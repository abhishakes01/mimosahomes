"use client";

import Link from "next/link";
import { Search, Menu, X, Phone, Calculator } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-sm shadow-md py-2" : "bg-gradient-to-b from-black/80 to-transparent py-4"
                }`}
        >
            <div className="container mx-auto px-6">
                {/* Top Bar (Hidden on Mobile) */}
                <div className={`hidden lg:flex justify-end items-center gap-6 mb-2 text-sm font-medium transition-opacity ${isScrolled ? "opacity-0 h-0 overflow-hidden" : "opacity-100 text-white/90"}`}>
                    <a href="#" className="hover:text-mimosa-gold transition-colors flex items-center gap-2">
                        <Calculator size={14} /> Build a Quote
                    </a>
                    <a href="tel:1300646672" className="hover:text-mimosa-gold transition-colors flex items-center gap-2">
                        <Phone size={14} /> 1300 646 672
                    </a>
                </div>

                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className={`text-2xl font-black tracking-tighter uppercase ${isScrolled ? "text-mimosa-dark" : "text-white"}`}>
                            MIMOSA<span className="text-mimosa-gold font-light ml-1">HOMES</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {["New Home Designs", "Display Homes", "House & Land", "Promotions", "Facades"].map((item) => (
                            <Link
                                key={item}
                                href="#"
                                className={`text-sm font-medium hover:text-mimosa-gold transition-colors uppercase tracking-wide ${isScrolled ? "text-gray-800" : "text-white"
                                    }`}
                            >
                                {item}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="hidden lg:flex items-center gap-4">
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
                            <span>1300 MIMOSA</span>
                        </a>
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
                            <div className="text-2xl font-black text-mimosa-dark uppercase tracking-tighter">
                                MIMOSA<span className="text-mimosa-gold font-light ml-1">HOMES</span>
                            </div>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2 text-gray-400 hover:text-mimosa-dark"
                            >
                                <X size={28} />
                            </button>
                        </div>
                        <nav className="flex flex-col p-6 gap-6 overflow-y-auto">
                            {["New Home Designs", "Display Homes", "House & Land", "Promotions", "Facades", "Virtual Tours", "Build a Quote"].map((item) => (
                                <Link
                                    key={item}
                                    href="#"
                                    className="text-xl font-medium text-gray-800 hover:text-mimosa-gold"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item}
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
