"use client";

import { useState } from "react";
// Dynamic imports for Map components to avoid SSR issues
import dynamic from "next/dynamic";
import LandDetailsForm from "@/components/quote/LandDetailsForm";
import ProgressSteps from "@/components/quote/ProgressSteps";

const RegionSelector = dynamic(() => import("@/components/quote/RegionSelector"), {
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0796b1]"></div></div>
});

const FloorPlanSelector = dynamic(() => import("@/components/quote/FloorPlanSelector"), {
    loading: () => <div className="h-96 w-full flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div></div>
});

const FacadeSelector = dynamic(() => import("@/components/quote/FacadeSelector"), {
    loading: () => <div className="h-96 w-full flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div></div>
});

const ColoursSelector = dynamic(() => import("@/components/quote/ColoursSelector"), {
    loading: () => <div className="h-96 w-full flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div></div>
});

const UpgradesSelector = dynamic(() => import("@/components/quote/UpgradesSelector"), {
    loading: () => <div className="h-96 w-full flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div></div>
});

const QuoteSummary = dynamic(() => import("@/components/quote/QuoteSummary"), {
    ssr: false,
    loading: () => <div className="h-96 w-full flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div></div>
});

export default function CreateQuotePage() {
    const [selectedRegion, setSelectedRegion] = useState<any>(null);
    const [step, setStep] = useState<"REGION" | "DETAILS" | "FLOORPLAN" | "FACADE" | "COLOURS" | "UPGRADES" | "SUMMARY">("REGION");
    const [landFilters, setLandFilters] = useState<any>({ width: "", depth: "", storeys: "", name: "" });
    const [selectedFloorPlan, setSelectedFloorPlan] = useState<any>(null);

    const [selectedFacade, setSelectedFacade] = useState<any>(null);
    const [selectedColours, setSelectedColours] = useState<any>(null);
    const [selectedUpgrades, setSelectedUpgrades] = useState<any[]>([]);

    const handleRegionSelect = (region: any) => {
        setSelectedRegion(region);
        setStep("DETAILS");
    };

    const handleLandDetailsNext = (data: any) => {
        console.log("Land Details Submitted:", data);
        setLandFilters({
            width: data.landWidth,
            depth: data.landDepth,
            storeys: data.storeys,
            name: data.name,
            lotNumber: data.lotNumber,
            estateName: data.estateName,
            suburb: data.suburb,
            preferredLocation: data.preferredLocation
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
        setStep("COLOURS");
    };

    const handleColoursSelect = (colours: any) => {
        console.log("Colours Selected:", colours);
        setSelectedColours(colours);
        setStep("UPGRADES");
    };

    const handleUpgradesSelect = (upgrades: any[]) => {
        console.log("Upgrades Selected:", upgrades);
        setSelectedUpgrades(upgrades);
        setStep("SUMMARY");
    };

    return (
        <div className="min-h-[calc(100vh-80px)] relative bg-gray-50 flex flex-col">

            {/* Progress Steps Header */}
            <ProgressSteps currentStep={step === "REGION" ? 1 : step === "DETAILS" ? 1 : step === "FLOORPLAN" ? 2 : step === "FACADE" ? 3 : step === "COLOURS" ? 4 : step === "UPGRADES" ? 5 : 6} />

            {step === "REGION" && (
                <RegionSelector onSelect={handleRegionSelect} />
            )}

            <div className="flex-grow max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {step === "DETAILS" && (
                    <div className="animate-in fade-in duration-500">
                        {/* Selected Region Display */}
                        <div className="mb-8 flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                            <span>Region: <span className="text-gray-900">{selectedRegion?.name || "None"}</span></span>
                            <span className="text-gray-300">—</span>
                            <button
                                onClick={() => setStep("REGION")}
                                className="text-[#0796b1] hover:underline font-black italic lowercase tracking-normal"
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

                {step === "COLOURS" && selectedFacade && (
                    <div className="animate-in fade-in duration-500">
                        <ColoursSelector
                            selectedFacade={selectedFacade}
                            selectedFloorPlan={selectedFloorPlan}
                            onBack={() => setStep("FACADE")}
                            onSelect={handleColoursSelect}
                        />
                    </div>
                )}

                {step === "UPGRADES" && (
                    <div className="animate-in fade-in duration-500">
                        <UpgradesSelector
                            selectedFloorPlan={selectedFloorPlan}
                            selectedFacade={selectedFacade}
                            selectedColours={selectedColours}
                            onBack={() => setStep("COLOURS")}
                            onSelect={handleUpgradesSelect}
                        />
                    </div>
                )}

                {step === "SUMMARY" && (
                    <div className="animate-in fade-in duration-500">
                        <QuoteSummary
                            selectedRegion={selectedRegion}
                            landDetails={landFilters}
                            selectedFloorPlan={selectedFloorPlan}
                            selectedFacade={selectedFacade}
                            selectedColours={selectedColours}
                            selectedUpgrades={selectedUpgrades}
                            onBack={() => setStep("UPGRADES")}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
