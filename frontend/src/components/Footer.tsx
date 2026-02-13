"use client";

import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter, MapPin, Phone, Mail, ArrowRight } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-black text-white pt-20 pb-10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <div className="text-2xl font-black tracking-tighter uppercase text-white">
                            MITRA<span className="text-mimosa-gold font-extralight ml-1">HOMES</span>
                        </div>
                        <p className="text-gray-400 leading-relaxed text-sm">
                            Building quality homes for Australian families. We pride ourselves on craftsmanship, design excellence, and customer satisfaction.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Instagram, Linkedin, Twitter].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all text-gray-400">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
                        <ul className="space-y-3">
                            {["Home Designs", "House & Land", "Display Homes", "Promotions", "Contact"].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-gray-400 hover:text-mimosa-gold transition-colors flex items-center text-sm group">
                                        <ArrowRight size={14} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="text-mimosa-gold shrink-0 mt-0.5" size={18} />
                                <span className="text-gray-400">123 Example Street,<br />Melbourne VIC 3000</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="text-mimosa-gold shrink-0" size={18} />
                                <a href="tel:1300646672" className="text-gray-400 hover:text-white transition-colors">1300 646 672</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="text-mimosa-gold shrink-0" size={18} />
                                <a href="mailto:info@mitrahomes.com.au" className="text-gray-400 hover:text-white transition-colors">info@mitrahomes.com.au</a>
                            </li>
                        </ul>
                    </div>

                    {/* Policies */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Legal</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="#" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                            <li><Link href="#" className="text-gray-400 hover:text-white">Terms & Conditions</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
                    <p>© {new Date().getFullYear()} Mitra Homes. All rights reserved.</p>
                    <p>Melbourne's Premier New Home Builder</p>
                </div>
            </div>
        </footer>
    );
}
