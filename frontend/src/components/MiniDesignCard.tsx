"use client";

import Image from "next/image";
import { Bed, Bath, Car, ArrowRightLeft, Maximize } from "lucide-react";
import Link from "next/link";
import { getFullUrl } from "@/services/api";

interface MiniDesignCardProps {
    design: any;
}

export default function MiniDesignCard({ design }: MiniDesignCardProps) {
    const floorplan = design.floorplan || {};
    const facade = design.facade || {};
    const mainImage = facade.image_url || "/placeholder-home.jpg";

    return (
        <Link
            href={`/display-homes/${design.slug || design.id}`}
            className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
            <div className="p-4 flex justify-between items-start">
                <div>
                    <h3 className="text-sm font-black text-gray-900 uppercase italic leading-none">{design.title}</h3>
                    <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tight">Facade: <span className="text-[#08a2be]">{facade.title || 'Standard'}</span></p>
                </div>
                <div className="w-6 h-6 rounded bg-gray-50 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
                </div>
            </div>

            <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                    src={getFullUrl(mainImage)}
                    alt={design.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            <div className="bg-gray-50 p-2 px-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-[11px] font-black text-gray-900 uppercase">
                    <div className="flex items-center gap-1.5">
                        <Bed size={13} className="text-gray-400" />
                        <span>{floorplan.bedrooms || 4}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Bath size={13} className="text-gray-400" />
                        <span>{floorplan.bathrooms || 2}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Car size={13} className="text-gray-400" />
                        <span>{floorplan.car_spaces || 2}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <ArrowRightLeft size={13} className="text-gray-400" />
                        <span>{floorplan.house_width || '14.0m'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Maximize size={13} className="text-gray-400" />
                        <span>{Math.round(floorplan.total_area / 9.29) || 25}sq</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
