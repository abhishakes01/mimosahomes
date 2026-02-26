"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/services/api";
import QuoteSummary from "@/components/quote/QuoteSummary";
import { Loader2 } from "lucide-react";

export default function SharedQuotePage() {
    const { id } = useParams();
    const [quoteData, setQuoteData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSharedQuote = async () => {
            try {
                const response: any = await api.getSharedQuote(id as string);
                setQuoteData(response.data);
            } catch (err: any) {
                console.error("Error fetching shared quote:", err);
                setError(err.message || "Failed to load shared quote");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchSharedQuote();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-[#0796b1] animate-spin" />
            </div>
        );
    }

    if (error || !quoteData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-10">
                <div className="bg-white rounded-[40px] shadow-2xl p-16 text-center max-w-2xl w-full border border-gray-100">
                    <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-4">Quote Not Found</h2>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-sm mb-8">
                        {error || "The shared quote link may be invalid or expired."}
                    </p>
                    <a
                        href="/quote/create"
                        className="bg-[#0796b1] text-white px-10 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-cyan-900/10 hover:bg-cyan-700 transition-all inline-block"
                    >
                        Create New Quote
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <QuoteSummary
                selectedRegion={quoteData.region}
                landDetails={quoteData.user}
                selectedFloorPlan={quoteData.floorplan}
                selectedFacade={quoteData.facade}
                selectedColours={quoteData.colours}
                selectedUpgrades={quoteData.upgrades}
                onBack={() => { }} // Disabled in isShared mode
                isShared={true}
            />
        </div>
    );
}
