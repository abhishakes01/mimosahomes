"use client";

import { useState } from "react";
import Image from "next/image";
import { api, getFullUrl } from "@/services/api";
import { Share2, Loader2 } from "lucide-react";
import EnquiryModal from "@/components/quote/EnquiryModal";
import ShareModal from "@/components/quote/ShareModal";

interface QuoteSummaryProps {
    selectedRegion: any;
    landDetails: any;
    selectedFloorPlan: any;
    selectedFacade: any;
    selectedColours: any;
    selectedUpgrades: any[];
    onBack: () => void;
    isShared?: boolean;
}

export default function QuoteSummary({
    selectedRegion,
    landDetails,
    selectedFloorPlan,
    selectedFacade,
    selectedColours,
    selectedUpgrades,
    onBack,
    isShared = false
}: QuoteSummaryProps) {
    const [showEnquiry, setShowEnquiry] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const [shareUrl, setShareUrl] = useState("");
    const [sharing, setSharing] = useState(false);

    // Calculate Prices
    const floorPlanPrice = Math.round(selectedFloorPlan?.price || 232596);
    const facadePrice = 0; // Included in design
    const externalColoursPrice = selectedColours?.facadeScheme?.price || 500;
    const internalColoursPrice = selectedColours?.interiorScheme?.price || 395;
    const upgradesSum = (selectedUpgrades || []).reduce((sum, item) => sum + (item?.price || 0), 0);

    const promotionText = "50% Off Fixed Site Costs! T & C's Apply";

    const grandTotal = floorPlanPrice + facadePrice + externalColoursPrice + internalColoursPrice + upgradesSum;

    const handleShare = async () => {
        try {
            setSharing(true);
            const quoteData = {
                user: landDetails,
                region: selectedRegion,
                floorplan: selectedFloorPlan,
                facade: selectedFacade,
                colours: selectedColours,
                upgrades: selectedUpgrades,
                total: grandTotal
            };

            const response: any = await api.shareQuote(quoteData);
            const url = `${window.location.origin}/quote/share/${response.id}`;
            setShareUrl(url);
            setShowShare(true);
        } catch (error) {
            console.error("Error sharing quote:", error);
            alert("Failed to generate share link. Please try again.");
        } finally {
            setSharing(false);
        }
    };

    return (
        <div className={`w-full max-w-[1800px] mx-auto animate-in fade-in duration-700 ${isShared ? "px-6" : "pb-20"}`}>
            <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 p-10 lg:p-16 flex flex-col lg:flex-row gap-16">

                {/* Left Column: Data Tables */}
                <div className="lg:w-[45%] space-y-12">
                    <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-4">QUOTE SUMMARY</h2>

                    <div className="space-y-10">
                        {/* LAND DETAILS */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-[#0796b1] uppercase tracking-[0.4em] border-b border-gray-50 pb-2">LAND DETAILS</h3>
                            <div className="space-y-2 px-1 text-[11px] font-bold text-gray-900">
                                <p>Land Width: <span className="text-gray-500">{landDetails?.width || "any"}</span></p>
                                <p>Land Depth: <span className="text-gray-500">{landDetails?.depth || "any"}</span></p>
                                <p>Region: <span className="text-gray-500">{selectedRegion?.name || "Victoria"}</span></p>
                            </div>
                        </div>

                        {/* FLOORPLAN */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-[#0796b1] uppercase tracking-[0.4em] border-b border-gray-50 pb-2">FLOORPLAN</h3>
                            <div className="space-y-3 px-1 text-[11px] font-bold">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 uppercase tracking-widest leading-tight">Floorplan Name: <span className="text-gray-900">{selectedFloorPlan?.title || "Unknown"}</span></span>
                                    <span className="text-gray-900">${floorPlanPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center pt-1 border-t border-gray-50 mt-1">
                                    <span className="text-gray-900 uppercase tracking-widest leading-none">Subtotal:</span>
                                    <span className="text-[#0796b1]">${floorPlanPrice.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* FACADE */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-[#0796b1] uppercase tracking-[0.4em] border-b border-gray-50 pb-2">FACADE</h3>
                            <div className="space-y-3 px-1 text-[11px] font-bold">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 uppercase tracking-widest leading-tight">Facade Name: <span className="text-gray-900">{selectedFacade?.title || "Unknown"}</span></span>
                                    <span className="text-[#0796b1]">Included</span>
                                </div>
                                <div className="flex justify-between items-center pt-1 border-t border-gray-50 mt-1">
                                    <span className="text-gray-900 uppercase tracking-widest leading-none">Subtotal:</span>
                                    <span className="text-[#0796b1]">Included</span>
                                </div>
                            </div>
                        </div>

                        {/* COLOUR SCHEMES */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-[#0796b1] uppercase tracking-[0.4em] border-b border-gray-50 pb-2">COLOUR SCHEMES</h3>
                            <div className="space-y-3 px-1 font-bold text-[11px]">
                                <div className="flex justify-between">
                                    <span className="text-gray-500 uppercase tracking-widest">External: <span className="text-gray-900">{selectedColours?.facadeScheme?.name || "Dawn"}</span></span>
                                    <span>${externalColoursPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 uppercase tracking-widest">Internal: <span className="text-gray-900">{selectedColours?.interiorScheme?.name || "Raven"}</span></span>
                                    <span>${internalColoursPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between pt-1 border-t border-gray-50 mt-1 pt-2">
                                    <span className="text-gray-900 uppercase tracking-widest">Subtotal:</span>
                                    <span className="text-[#0796b1]">${(externalColoursPrice + internalColoursPrice).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* UPGRADES */}
                        {(selectedUpgrades || []).length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black text-[#0796b1] uppercase tracking-[0.4em] border-b border-gray-50 pb-2">UPGRADES</h3>
                                <div className="space-y-2 px-1 max-h-32 overflow-y-auto custom-scrollbar">
                                    {selectedUpgrades.map((u, i) => (
                                        <div key={i} className="flex justify-between text-[11px] font-bold">
                                            <span className="text-gray-500 uppercase tracking-widest truncate max-w-[200px]">{u.name}</span>
                                            <span className="text-gray-900">${(u.price || 0).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between pt-1 border-t border-gray-50 mt-1 font-bold text-[11px]">
                                    <span className="text-gray-900 uppercase tracking-widest">Subtotal:</span>
                                    <span className="text-[#0796b1]">${upgradesSum.toLocaleString()}</span>
                                </div>
                            </div>
                        )}

                        {/* PROMOTION */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-[#0796b1] uppercase tracking-[0.4em] border-b border-gray-50 pb-2">PROMOTION</h3>
                            <div className="space-y-3 px-1 font-bold text-[11px]">
                                <div className="flex justify-between">
                                    <span className="text-gray-500 uppercase tracking-widest leading-relaxed">{promotionText}</span>
                                    <span className="text-[#0796b1]">Included</span>
                                </div>
                                <div className="flex justify-between pt-1 border-t border-gray-50 mt-1 pt-2">
                                    <span className="text-gray-900 uppercase tracking-widest">Subtotal:</span>
                                    <span className="text-[#0796b1]">Included</span>
                                </div>
                            </div>
                        </div>

                        {/* GRAND TOTAL */}
                        <div className="pt-10 flex justify-end items-center gap-6 border-t font-black uppercase tracking-tighter italic">
                            <span className="text-xl text-gray-900">TOTAL:</span>
                            <span className="text-5xl text-[#0796b1]">${grandTotal.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Visual Layout Render */}
                <div className="lg:w-[55%] flex flex-col gap-6">
                    {/* Top: 2/3 and 1/3 layout logic */}
                    <div className="flex flex-row gap-6 w-full">
                        {/* Floorplan Main Display */}
                        <div className="relative w-[45%] aspect-[3/4] bg-white border border-gray-100 rounded-[20px] overflow-hidden p-8 shadow-sm">
                            {selectedFloorPlan?.image_url ? (
                                <Image
                                    src={getFullUrl(selectedFloorPlan.image_url)}
                                    alt="Floorplan"
                                    fill
                                    className="object-contain p-6"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-50 animate-pulse" />
                            )}
                        </div>

                        {/* Facade + Internal Previews */}
                        <div className="w-[55%] flex flex-col gap-6">
                            <div className="relative aspect-[16/10] bg-gray-50 rounded-[20px] overflow-hidden shadow-sm">
                                {selectedFacade?.image_url ? (
                                    <Image
                                        src={getFullUrl(selectedFacade.image_url)}
                                        alt="Facade"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 animate-pulse" />
                                )}
                                <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                                    <span className="text-[8px] font-black text-white uppercase tracking-widest italic">{selectedFacade?.title || "Design"} Facade</span>
                                </div>
                            </div>

                            <div className="flex flex-row gap-6 flex-grow">
                                <div className="relative flex-grow rounded-[20px] overflow-hidden shadow-sm bg-gray-50 min-h-[140px]">
                                    {selectedColours?.facadeScheme?.image_url && (
                                        <Image
                                            src={getFullUrl(selectedColours.facadeScheme.image_url)}
                                            alt="External"
                                            fill
                                            className="object-cover"
                                        />
                                    )}
                                </div>
                                <div className="relative flex-grow rounded-[20px] overflow-hidden shadow-sm bg-gray-50 min-h-[140px]">
                                    {selectedColours?.interiorScheme?.image_url && (
                                        <Image
                                            src={getFullUrl(selectedColours.interiorScheme.image_url)}
                                            alt="Internal"
                                            fill
                                            className="object-cover"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="text-[9px] font-bold text-gray-400 leading-relaxed uppercase tracking-widest px-4 italic">
                        The smaller facade is indicative only and is there to represent the external colours chosen. Refer to your official Mitra Homes preliminary agreement for full and accurate pricing, promotions and terms and conditions. This is not an official quote.
                    </p>

                    {/* Final Action Bar */}
                    {!isShared && (
                        <>
                            <div className="mt-6 flex flex-col sm:flex-row gap-4 items-stretch">
                                <div className="flex-grow bg-white border border-gray-100 rounded-3xl p-6 flex items-center justify-center text-center shadow-sm">
                                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest leading-none">
                                        Connect now to secure your Site Costs & finalise your new quote!
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowEnquiry(true)}
                                    className="bg-[#0796b1] hover:bg-[#067d94] text-white font-black uppercase italic tracking-tighter px-14 py-6 rounded-2xl shadow-xl shadow-cyan-900/10 transition-all active:scale-95 whitespace-nowrap text-sm"
                                >
                                    Get In Touch
                                </button>
                                <button
                                    onClick={handleShare}
                                    disabled={sharing}
                                    className="p-6 bg-white border border-gray-100 text-[#0796b1] hover:bg-gray-50 rounded-2xl transition-all shadow-sm flex items-center justify-center min-w-[80px]"
                                >
                                    {sharing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Share2 size={24} />}
                                </button>
                            </div>

                            <div className="flex justify-end pr-4 mt-6">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="bg-[#0796b1] text-white px-10 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-cyan-900/10 hover:bg-cyan-700 transition-all"
                                >
                                    RESTART QUOTE
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Bottom Back Button */}
            {!isShared && (
                <div className="flex justify-center mt-12">
                    <button
                        onClick={onBack}
                        className="text-[#0796b1] font-black uppercase text-[10px] tracking-[0.4em] hover:opacity-80 transition-all underline underline-offset-8 decoration-2"
                    >
                        &lt; GO BACK
                    </button>
                </div>
            )}

            {/* Enquiry Modal */}
            {showEnquiry && (
                <EnquiryModal
                    onClose={() => setShowEnquiry(false)}
                    quoteData={{
                        user: landDetails,
                        region: selectedRegion,
                        floorplan: selectedFloorPlan,
                        facade: selectedFacade,
                        colours: selectedColours,
                        upgrades: selectedUpgrades,
                        total: grandTotal
                    }}
                />
            )}

            {/* Share Modal */}
            <ShareModal
                isOpen={showShare}
                onClose={() => setShowShare(false)}
                shareUrl={shareUrl}
            />
        </div>
    );
}
