"use client";

import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { Loader2 } from "lucide-react";
import OffersTemplate from "@/components/OffersTemplate";

// Standard fallbacks if DB is empty
const M_FALLBACK_OFFERS = [
    {
        id: "steel-roof-m",
        title: "Upgrade to a Roof made from Colorbond Steel for $3,190!",
        description: "Build a single storey home with Mimosa Homes and receive an upgrade to a roof made from Colorbond Steel for $3,190!",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
        ctaText: "Learn More",
        ctaLink: "/contact",
        badge: "Exclusive Offer"
    },
    {
        id: "double-storey-upgrade",
        title: "Free Upgrade to a Roof made from Colorbond Steel",
        description: "Build a double storey home with Mimosa Homes and receive a free upgrade to a roof made from Colorbond Steel at no extra cost!",
        image: "https://images.unsplash.com/photo-1600585154526-990dcea4d4d9?q=80&w=2070&auto=format&fit=crop",
        ctaText: "View Offer",
        ctaLink: "/contact",
    },
    {
        id: "electrified",
        title: "M Electrified",
        description: "Go all electric in your brand new Mimosa Home. Join the sustainable future with our M Electrified package.",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
        ctaText: "Learn More",
        ctaLink: "/contact",
    },
    {
        id: "added-value",
        title: "More at no extra cost",
        description: "Up to $42,688 worth of FREE upgrades. Enjoy all these inclusions to your M Collection home for no extra cost!",
        image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=2074&auto=format&fit=crop",
        ctaText: "Read More",
        ctaLink: "/contact",
    }
];

export default function MOffersPage() {
    const [pageData, setPageData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data: any = await api.getPageBySlug('m-collection-offers');
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
        : M_FALLBACK_OFFERS;

    return (
        <OffersTemplate
            collectionName="M Collection"
            heroImage={content.heroImage || "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop"}
            offers={offers}
            heroSubtitle={content.heroSubtitle}
        />
    );
}
