"use client";

import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { Loader2 } from "lucide-react";
import OffersTemplate from "@/components/OffersTemplate";

// Standard fallbacks if DB is empty
const V_FALLBACK_OFFERS = [
    {
        id: "steel-roof",
        title: "Free Upgrade to a Roof made from Colorbond Steel!",
        description: "Build a V Collection Double Storey home with Mimosa Homes and receive a free upgrade to a roof made from Colorbond Steel at no extra cost!",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
        ctaText: "View Offer",
        ctaLink: "/contact",
        badge: "Limited Time Only"
    },
    {
        id: "award-winner",
        title: "Build with a HIA Award Winning Builder",
        description: "Home to the 2021 HIA Victorian Display Home of the Year. Designed to blend livability and functionality whilst featuring all the luxurious inclusions that make a house a home.",
        image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2000&auto=format&fit=crop",
        ctaText: "View Home",
        ctaLink: "/display-homes",
    }
];

export default function VOffersPage() {
    const [pageData, setPageData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data: any = await api.getPageBySlug('v-collection-offers');
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
    const offers = content.offers && content.offers.length > 0
        ? content.offers.map((o: any, idx: number) => ({
            id: o.id || `offer-${idx}`,
            title: o.title,
            description: o.description,
            image: o.image,
            ctaText: o.linkText || "View Details",
            ctaLink: o.linkUrl || "/contact",
            badge: o.badge
        }))
        : V_FALLBACK_OFFERS;

    return (
        <OffersTemplate
            collectionName="V Collection"
            heroImage={content.heroImage || "https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?q=80&w=2070&auto=format&fit=crop"}
            offers={offers}
            heroSubtitle={content.heroSubtitle}
        />
    );
}
