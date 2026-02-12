"use client";

import { useState } from "react";
// Dynamic imports for Map components to avoid SSR issues
import dynamic from "next/dynamic";
import LandDetailsForm from "@/components/quote/LandDetailsForm";
import ProgressSteps from "@/components/quote/ProgressSteps";
// import FloorPlanSelector from "@/components/quote/FloorPlanSelector"; 

const RegionSelector = dynamic(() => import("@/components/quote/RegionSelector"), {
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div></div>
});

const FloorPlanSelector = dynamic(() => import("@/components/quote/FloorPlanSelector"), {
    loading: () => <div className="h-96 w-full flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div></div>
});

const FacadeSelector = dynamic(() => import("@/components/quote/FacadeSelector"), {
    loading: () => <div className="h-96 w-full flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div></div>
});

export default function CreateQuotePage() {
    const [selectedRegion, setSelectedRegion] = useState<any>(null);
    const [step, setStep] = useState<"REGION" | "DETAILS" | "FLOORPLAN" | "FACADE">("REGION");
    const [landFilters, setLandFilters] = useState({ width: "", depth: "", storeys: "" });
    const [selectedFloorPlan, setSelectedFloorPlan] = useState<any>(null);

    const [selectedFacade, setSelectedFacade] = useState<any>(null);

    const handleRegionSelect = (region: any) => {
        setSelectedRegion(region);
        setStep("DETAILS");
    };

    const handleLandDetailsNext = (data: any) => {
        console.log("Land Details Submitted:", data);
        setLandFilters({
            width: data.landWidth,
            depth: data.landDepth,
            storeys: data.storeys
        });
        setStep("FLOORPLAN");
    };

    const handleFloorPlanSelect = (floorplan: any) => {
        console.log("Floorplan Selected:", floorplan);
        setSelectedFloorPlan(floorplan);
        setStep("FACADE");
    };

    const handleFacadeSelect = (facade: any) => {
        console.log("Facade Selected:", facade);
        setSelectedFacade(facade);
        // Move to next step (Colours/Upgrades)
    };

    return (
        <div className="min-h-[calc(100vh-80px)] relative bg-gray-50 flex flex-col">

            {/* Progress Steps Header */}
            <ProgressSteps currentStep={step === "REGION" ? 1 : step === "DETAILS" ? 1 : step === "FLOORPLAN" ? 2 : 3} />

            {step === "REGION" && (
                <RegionSelector onSelect={handleRegionSelect} />
            )}

            <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {step === "DETAILS" && (
                    <div className="animate-in fade-in duration-500">
                        {/* Selected Region Display */}
                        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                            <span>Region: <span className="font-bold text-gray-900">{selectedRegion?.name || "None"}</span></span>
                            <button
                                onClick={() => setStep("REGION")}
                                className="text-orange-500 hover:text-orange-600 hover:underline font-medium transition-colors text-xs uppercase"
                            >
                                change
                            </button>
                        </div>

                        {/* Land Details Form */}
                        <LandDetailsForm
                            onNext={handleLandDetailsNext}
                            onBack={() => setStep("REGION")}
                        />
                    </div>
                )}

                {step === "FLOORPLAN" && (
                    <div className="animate-in fade-in duration-500">
                        <FloorPlanSelector
                            filters={landFilters}
                            onBack={() => setStep("DETAILS")}
                            onSelect={handleFloorPlanSelect}
                        />
                    </div>
                )}

                {step === "FACADE" && selectedFloorPlan && (
                    <div className="animate-in fade-in duration-500">
                        <FacadeSelector
                            selectedFloorPlan={selectedFloorPlan}
                            onBack={() => setStep("FLOORPLAN")}
                            onSelect={handleFacadeSelect}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
