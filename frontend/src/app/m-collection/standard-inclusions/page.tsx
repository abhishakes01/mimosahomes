"use client";

import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { Loader2 } from "lucide-react";
import InclusionsTemplate from "@/components/InclusionsTemplate";

// Standard fallbacks if DB is empty
const M_FALLBACK_CATEGORIES = [
    {
        id: "structural",
        title: "Structural & External Features",
        items: [
            "Added Value - 'H' Class 25Mpa concrete engineer designed waffle pod slab",
            "Site Excavation: Up to 700m2 land size - balanced cut and fill",
            "Window Upgrades: Added Value - Fiberglass mesh flyscreens to all openable windows",
            "Roofing Material: Concrete roof tiles or Added Value - Colorbond steel roof",
            "Gutter / Fascia / Downpipes: Colorbond gutter, fascia & downpipes",
            "Front Door: Added Value - Choice of designer front entry door handle",
            "Garage: Added Value - Colorbond motorized sectional door",
            "Alfresco/Porch Area: Plaster lined ceiling with painted finish",
            "External Cladding: Choice of bricks or Lightweight cladding (design specific)"
        ]
    },
    {
        id: "internal",
        title: "Internal Features",
        items: [
            "Added Value - 2590mm nominal ceiling height (Ground Floor)",
            "Added Value - 75mm cove cornices throughout",
            "Added Value - 67mm x 18mm skirtings and architraves",
            "Added Value - Designer lever handle door furniture",
            "Added Value - 3 coat premium paint system"
        ]
    },
    {
        id: "kitchen",
        title: "Kitchen & Laundry",
        items: [
            "Added Value - Designer laminate base and overhead cabinets",
            "Added Value - 40mm stone edge to kitchen island bench",
            "Added Value - 900mm stainless steel designer appliances",
            "Added Value - Undermount double bowl stainless steel sink",
            "Added Value - Soft close mechanisms to all drawers and doors",
            "Added Value - 800mm wide laminate laundry cabinet"
        ]
    },
    {
        id: "bathroom",
        title: "Bathroom & Ensuite",
        items: [
            "Added Value - Floating laminate vanities with 20mm stone tops",
            "Added Value - Floor to ceiling tiles in Ensuite (design specific)",
            "Added Value - Tiled shower bases to all bathrooms",
            "Added Value - Semi-frameless shower screens",
            "Added Value - Choice of black or chrome tapware"
        ]
    }
];

export default function MInclusionsPage() {
    const [pageData, setPageData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data: any = await api.getPageBySlug('m-collection-standard-inclusions');
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
        : M_FALLBACK_CATEGORIES;

    return (
        <InclusionsTemplate
            collectionName="M Collection"
            heroImage={content.heroImage || "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop"}
            categories={categories}
            bottomTitle={content.bottomTitle}
            bottomSubtitle={content.bottomSubtitle}
        />
    );
}
