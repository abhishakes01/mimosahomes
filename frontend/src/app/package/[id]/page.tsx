"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api, getFullUrl } from "@/services/api";
import { motion } from "framer-motion";
import {
    Bed, Bath, Car, Maximize, MapPin,
    Download, User, Phone, Mail, ChevronRight,
    Home, CheckCircle2, ImageIcon
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PackageDetailsPage() {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();

    const [listing, setListing] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        if (id) {
            loadListing();
        }
    }, [id]);

    const loadListing = async () => {
        try {
            const data = await api.getListing(id);
            setListing(data);
        } catch (err) {
            console.error("Failed to load listing:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-12 h-12 border-4 border-[#005a8f] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!listing) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
                <h1 className="text-2xl font-black text-gray-900 uppercase italic mb-4">Listing Not Found</h1>
                <Link href="/display-home-for-sale" className="text-[#005a8f] font-bold uppercase tracking-widest text-sm hover:underline">
                    Back to Listings
                </Link>
            </div>
        );
    }

    const floorplan = listing.floorplan || {};
    const facade = listing.facade || {};
    const mainImage = listing.images?.[0] || facade.image_url || "/placeholder-home.jpg";
    const highlights = Array.isArray(listing.highlights) ? listing.highlights : [];

    return (
        <main className="min-h-screen bg-white pb-20">
            <Header />
            {/* Hero Section */}
            <div className="relative w-full h-[50vh] min-h-[400px] overflow-hidden">
                <img
                    src={getFullUrl(mainImage)}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Breadcrumbs */}
                <div className="absolute bottom-10 left-0 w-full">
                    <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center gap-2 text-white text-[10px] uppercase tracking-widest font-black italic">
                        <Link href="/" className="hover:text-mimosa-gold transition-colors">Mimosa</Link>
                        <ChevronRight size={12} className="text-mimosa-gold" />
                        <Link href="/display-home-for-sale" className="hover:text-mimosa-gold transition-colors">House and Land Packages</Link>
                        <ChevronRight size={12} className="text-mimosa-gold" />
                        <span className="opacity-70">{listing.address}</span>
                    </div>
                </div>
            </div>

            {/* Info Bar */}
            <div className="bg-[#005a8f] text-white">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-4 flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-8">
                        <div className="bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded border border-white/20">
                            <span className="text-[10px] font-black uppercase tracking-widest italic">
                                {listing.collection === "V_Collection" ? "V COLLECTION" : "M COLLECTION"}
                            </span>
                        </div>
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-2 group cursor-pointer">
                                <ImageIcon size={20} className="text-white/60 group-hover:text-white transition-colors" />
                                <Bed size={20} className="text-white" />
                                <span className="text-lg font-black tracking-tighter italic leading-none">{floorplan.bedrooms || 4}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Bath size={20} className="text-white" />
                                <span className="text-lg font-black tracking-tighter italic leading-none">{floorplan.bathrooms || 2}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Car size={20} className="text-white" />
                                <span className="text-lg font-black tracking-tighter italic leading-none">{floorplan.car_spaces || 2}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                    {/* Left Column: Details */}
                    <div className="lg:col-span-7 space-y-12">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-[#005a8f] uppercase italic leading-[0.9] tracking-tighter mb-4">
                                {listing.title}
                            </h1>
                            <div className="flex items-center gap-2 text-gray-500 font-medium italic">
                                <MapPin size={18} className="text-mimosa-gold" />
                                <span>{listing.address}</span>
                            </div>
                        </div>

                        <div className="prose prose-blue max-w-none">
                            <p className="text-gray-600 leading-relaxed font-medium">
                                {listing.description || "No description available for this property."}
                            </p>
                        </div>

                        {highlights.length > 0 && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-black text-gray-900 uppercase italic tracking-tight">Home Highlights:</h3>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                                    {highlights.map((item: string, idx: number) => (
                                        <li key={idx} className="flex items-start gap-3 group">
                                            <div className="w-1.5 h-1.5 rounded-full bg-mimosa-gold mt-2 group-hover:scale-125 transition-transform" />
                                            <span className="text-gray-600 text-sm font-medium">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}


                        <div className="space-y-6 pt-8 border-t border-gray-100">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 text-sm font-medium">
                                <div className="flex items-center justify-between pr-8 border-r border-gray-100">
                                    <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Builder:</span>
                                    <span className="text-gray-900">{listing.builder_name || "Mimosa Homes"} - {listing.title}</span>
                                </div>
                                <div className="flex items-center justify-between pl-8">
                                    <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Bedrooms:</span>
                                    <span className="text-gray-900">{floorplan.bedrooms || 4} | Living: {floorplan.living_areas || 3} | Bathrooms: {floorplan.bathrooms || 2} | Garage: {floorplan.car_spaces || 2}</span>
                                </div>
                                <div className="flex items-center justify-between pr-8 border-r border-gray-100">
                                    <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Outdoor:</span>
                                    <span className="text-gray-900">{listing.outdoor_features || "Covered alfresco and landscaped gardens"}</span>
                                </div>
                                <div className="flex items-center justify-between pl-8">
                                    <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Status:</span>
                                    <span className="text-gray-900 uppercase font-black italic">{listing.status === 'sold' ? 'Sold' : 'Available'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-10">
                            <div className="flex items-baseline gap-4">
                                <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Price:</span>
                                <span className="text-3xl font-black text-[#005a8f] tracking-tighter italic">
                                    {listing.status === 'sold' ? 'SOLD' : (listing.price ? `$${Number(listing.price).toLocaleString()}+` : "TBA")}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 max-w-sm gap-4">
                                <div>
                                    <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest block mb-1">Land Size:</span>
                                    <span className="text-gray-900 font-black tracking-tighter italic">{listing.land_size || 540}m²</span>
                                </div>
                                <div>
                                    <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest block mb-1">Building Size:</span>
                                    <span className="text-gray-900 font-black tracking-tighter italic">{listing.building_size || 207.6}sq</span>
                                </div>
                            </div>
                        </div>

                        {/* Sold Banner as in screenshot */}
                        {listing.status === 'sold' && (
                            <div className="bg-[#005a8f] py-6 px-12 inline-block -ml-12 md:ml-0 md:rounded-r-full shadow-2xl">
                                <span className="text-white font-black text-6xl uppercase tracking-widest italic">SOLD</span>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Floorplan & Contact */}
                    <div className="lg:col-span-5 space-y-10">
                        <div className="flex items-center gap-4">
                            <button className="flex-1 bg-[#005a8f] text-white py-3.5 rounded-lg font-black uppercase text-[10px] tracking-widest hover:bg-[#004a75] transition-all shadow-xl">
                                DOWNLOAD BROCHURE
                            </button>
                            <button className="flex-1 bg-[#005a8f] text-white py-3.5 rounded-lg font-black uppercase text-[10px] tracking-widest hover:bg-[#004a75] transition-all shadow-xl">
                                CONTACT AGENT
                            </button>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                            <div className="relative aspect-[3/4] w-full">
                                {floorplan.image_url ? (
                                    <img
                                        src={getFullUrl(floorplan.image_url)}
                                        alt="Floorplan"
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold uppercase tracking-widest italic text-xs">
                                        Floorplan Coming Soon
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Agent Card */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center gap-6 max-w-sm ml-auto">
                            <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                {listing.agent_image ? (
                                    <img src={getFullUrl(listing.agent_image)} alt={listing.agent_name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <User size={32} />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h4 className="font-black text-gray-900 uppercase tracking-tight italic leading-none mb-1">
                                    {listing.agent_name || "Matthew Grant"}
                                </h4>
                                <div className="space-y-1">
                                    <a href={`mailto:${listing.agent_email || 'matthew@mimosahomes.com.au'}`} className="text-[10px] font-bold text-gray-500 hover:text-mimosa-gold block">
                                        E: {listing.agent_email || "matthew@mimosahomes.com.au"}
                                    </a>
                                    <a href={`tel:${listing.agent_phone || '0415915511'}`} className="text-[10px] font-bold text-gray-500 hover:text-mimosa-gold block">
                                        P: {listing.agent_phone || "0415915511"}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* CTA Section */}
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 mt-32">
                <div className="bg-[#005a8f] rounded-[40px] p-12 md:p-20 relative overflow-hidden flex flex-col items-center text-center">
                    <div className="relative z-10 max-w-2xl">
                        <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none mb-6">
                            Ready to start your building journey?
                        </h2>
                        <p className="text-white/80 font-medium italic mb-10">
                            Our team is here to help you every step of the way. Get in touch today to discuss your new home design.
                        </p>
                        <Link href="/contact" className="bg-white text-[#005a8f] px-12 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:bg-gray-100 transition-all shadow-2xl">
                            CONTACT US
                        </Link>
                    </div>
                    {/* Abstract background elements */}
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 transform translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-white/5 -skew-x-12 transform -translate-x-1/2" />
                </div>
            </div>

            <Footer />
        </main >
    );
}
