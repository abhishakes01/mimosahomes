"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ChevronRight, MapPin, Phone, Mail, Clock, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { api } from "@/services/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MiniDesignCard from "@/components/MiniDesignCard";

const DisplayHomesMap = dynamic(() => import("@/components/DisplayHomesMap"), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center">Loading Map...</div>
});

export default function DisplayLocationDetails({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [listing, setListing] = useState<any>(null);
    const [locationHomes, setLocationHomes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const getSuburb = (address: string) => {
        if (!address) return '';
        const parts = address.split(',');
        return parts.length >= 2 ? parts[1].trim() : '';
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data: any = await api.getListing(id);
                setListing(data);

                // Fetch other homes in the same suburb
                const suburb = getSuburb(data.address);
                if (suburb) {
                    const allDisplays: any = await api.getListings({ type: 'display_home', limit: 100 });
                    const filtered = allDisplays.data.filter((l: any) =>
                        getSuburb(l.address).toLowerCase() === suburb.toLowerCase()
                    );
                    setLocationHomes(filtered);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="animate-spin text-[#08a2be]" size={40} />
            </div>
        );
    }

    if (!listing) return null;

    const suburb = getSuburb(listing.address);
    // Estate name often comes from title or address
    const estateName = listing.title.includes('-') ? listing.title.split('-')[0].trim() : listing.title;
    const displayName = `${estateName} - ${suburb}`;

    return (
        <main className="min-h-screen bg-white">
            <Header />

            <div className="container mx-auto px-6 py-12 pt-32">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8">
                    <Link href="/" className="hover:text-[#0a3a4a]">Home</Link>
                    <ChevronRight size={10} />
                    <Link href="/display-homes" className="hover:text-[#0a3a4a]">Display Homes</Link>
                    <ChevronRight size={10} />
                    <span className="text-[#0a3a4a]">{displayName}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                    {/* Map Section */}
                    <div className="lg:col-span-2 h-[500px] rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                        <DisplayHomesMap locations={[listing]} center={[Number(listing.latitude), Number(listing.longitude)]} />
                    </div>

                    {/* Details Section */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-4xl font-black text-[#1a3a4a] uppercase italic leading-tight mb-4">{displayName}</h1>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#08a2be] mb-1">Address</h4>
                                    <p className="text-sm font-bold text-gray-600">{listing.address}</p>
                                </div>

                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#08a2be] mb-1">Opening Hours</h4>
                                    <p className="text-sm font-bold text-gray-600">Open Saturday & Sunday 11am - 5pm</p>
                                    <p className="text-sm font-bold text-gray-600">Open Monday - Wednesday 12pm to 5pm or by appointment.</p>
                                </div>

                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#08a2be] mb-2">Contact</h4>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="space-y-0.5">
                                                <p className="text-sm font-black text-[#1a3a4a]">{listing.agent_name || 'Varinder'}</p>
                                                <p className="text-xs font-bold text-gray-500">P: {listing.agent_phone || '0433 300 773'}</p>
                                                <p className="text-xs font-bold text-gray-400 italic">E: {listing.agent_email || 'sales@mimosahomes.com.au'}</p>
                                            </div>
                                        </div>
                                        {listing.agent_name2 && (
                                            <div className="flex items-start gap-3 pt-2">
                                                <div className="space-y-0.5">
                                                    <p className="text-sm font-black text-[#1a3a4a]">{listing.agent_name2}</p>
                                                    <p className="text-xs font-bold text-gray-500">P: {listing.agent_phone2}</p>
                                                    <p className="text-xs font-bold text-gray-400 italic">E: {listing.agent_email2}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block w-full text-center py-4 bg-[#0a3a4a] text-white rounded-lg text-sm font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg"
                        >
                            Get Directions
                        </a>
                    </div>
                </div>

                {/* Listing Grid Section */}
                <div className="mt-24 pt-12 border-t border-gray-100">
                    <h2 className="text-4xl font-black text-[#1a3a4a] uppercase italic mb-8">Homes on Display</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {locationHomes.map((home, idx) => (
                            <motion.div
                                key={home.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <MiniDesignCard design={home} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
