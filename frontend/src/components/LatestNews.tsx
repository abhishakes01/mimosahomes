"use client";

import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/services/api";

export default function LatestNews() {
    const [newCount, setNewCount] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const res = await api.getNewFloorPlansCount();
                setNewCount(res.count);
            } catch (error) {
                console.error("Failed to fetch new floorplans count", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCount();
    }, []);

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl font-bold text-mimosa-dark mb-8">Latest News & Promotions</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-auto lg:h-[500px]">
                    {/* Main Feature */}
                    <Link href="/m-collection/standard-inclusions" className="relative rounded-2xl overflow-hidden group bg-mimosa-dark h-full min-h-[300px] block">
                        <div className="absolute inset-0 bg-blue-900/40 mix-blend-multiply z-10" />
                        <img
                            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop"
                            alt="A Better Tomorrow Starts Today"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 z-20 flex flex-col justify-center p-12">
                            <h3 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                                A BETTER <br /> TOMORROW <br /> STARTS TODAY
                            </h3>
                            <span className="self-start text-white text-sm font-bold uppercase tracking-wider border-b border-white pb-1 hover:text-white hover:border-white transition-colors mt-6">
                                M Collection Inclusions
                            </span>
                        </div>
                    </Link>

                    {/* Grid Items */}
                    <div className="grid grid-cols-2 gap-6 h-full">
                        {/* Item 1 */}
                        <Link href="/v-collection/standard-inclusions" className="bg-black rounded-2xl p-6 relative overflow-hidden flex flex-col justify-center text-white h-[240px] block border border-transparent hover:border-mimosa-gold transition-all group">
                            <h3 className="text-2xl font-bold mb-2">A BETTER <br /> TOMORROW <br /> STARTS TODAY</h3>
                            <span className="text-xs font-medium opacity-80 mt-auto group-hover:text-mimosa-gold transition-colors">V Collection Inclusions</span>
                        </Link>

                        {/* Item 2 */}
                        <div className="bg-white rounded-2xl overflow-hidden relative group h-[240px]">
                            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-end p-6">
                                <span className="text-white text-xl font-bold flex items-center gap-2">
                                    {loading ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        newCount !== null ? newCount : 3
                                    )} New Displays
                                </span>
                            </div>
                        </div>

                        {/* Item 3 */}
                        <div className="bg-[#1e3a8a] rounded-2xl p-6 relative overflow-hidden flex items-center justify-center text-center text-white h-[240px]">
                            <div>
                                <div className="w-16 h-16 mx-auto mb-4 border-2 border-white rounded-full flex items-center justify-center text-white font-bold italic">50</div>
                                <h3 className="text-lg font-bold">50 YEAR <br /> STRUCTURAL <br /> WARRANTY</h3>
                            </div>
                        </div>

                        {/* Item 4 */}
                        <Link href="/new-home-designs?storeys=2" className="bg-gray-200 rounded-2xl overflow-hidden relative group h-[240px] block">
                            <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-black/40 flex items-end p-6 group-hover:bg-black/50 transition-colors">
                                <span className="text-white text-xl font-bold leading-tight flex items-center gap-2">
                                    New Double Storey <br /> Floorplans
                                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
