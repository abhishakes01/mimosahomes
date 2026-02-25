"use client";

import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { Loader2 } from "lucide-react";
import InclusionsTemplate from "@/components/InclusionsTemplate";

// Standard fallbacks if DB is empty
const V_FALLBACK_CATEGORIES = [
    {
        id: "structural",
        title: "Structural Foundations",
        items: [
            "Slab / Foundations: 'M' Class 20Mpa concrete engineer designed waffle pod slab",
            "Site Excavation: Up to 400m2 land size - excavation and soil removal",
            "Service Installations: Underground power, water, gas, electricity (single phase)",
            "Warranties: 7-year structural warranty, 6-month maintenance period",
            "Termite Protection: Termite management system to all pipe penetrations",
            "Frame: MGP 10 pine 90mm wall frames and engineered designed roof trusses",
            "External Cladding: Bricks with natural colour rolled mortar joints (Single Storey)",
            "Roofing Material: Concrete roof tiles or Colorbond steel roof options",
            "Windows: Powder coated aluminum double glazed awning/sliding windows",
            "Garage: Colorbond sectional panel door with remote control handsets"
        ]
    },
    {
        id: "internal",
        title: "Internal Detailing",
        items: [
            "2440mm nominal ceiling height",
            "75mm cove cornices throughout",
            "67mm x 18mm skirtings and architraves",
            "Lever handle internal door furniture",
            "White cushion door stops",
            "Premium paint finish to walls and ceilings"
        ]
    },
    {
        id: "kitchen",
        title: "Kitchen & Laundry",
        items: [
            "Laminate finish base and overhead cabinets",
            "20mm stone benchtops from standard range",
            "Stainless steel 900mm cooktop and canopy rangehead",
            "Stainless steel 600mm under bench oven",
            "Double bowl stainless steel sink with drainer",
            "45 liter stainless steel laundry trough with cabinet"
        ]
    },
    {
        id: "bathroom",
        title: "Bathroom & Ensuite",
        items: [
            "Laminate finish vanities with 20mm stone benchtops",
            "Polished edge mirrors above vanities",
            "Vitreous china wash basins",
            "Dual flush vitreous china toilets",
            "Classic acrylic bathtub (design specific)",
            "Handheld shower rail and mixer tapware"
        ]
    }
];

export default function VInclusionsPage() {
    const [pageData, setPageData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data: any = await api.getPageBySlug('v-collection-standard-inclusions');
                setPageData(data);
            } catch (error) {
                console.error("Failed to fetch page data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-10 h-10 animate-spin text-[#0897b1]" />
            </div>
        );
    }

    const content = pageData?.content || {};
    const categories = content.categories && content.categories.length > 0
        ? content.categories.map((c: any, idx: number) => ({ ...c, id: c.id || `cat-${idx}` }))
        : V_FALLBACK_CATEGORIES;

    return (
        <InclusionsTemplate
            collectionName="V Collection"
            heroImage={content.heroImage || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"}
            categories={categories}
            bottomTitle={content.bottomTitle}
            bottomSubtitle={content.bottomSubtitle}
        />
    );
}
