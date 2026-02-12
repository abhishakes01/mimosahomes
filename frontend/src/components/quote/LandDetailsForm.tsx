"use client";

import { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { api } from "@/services/api";

interface FilterOptions {
    widths: number[];
    depths: number[];
    storeys: number[];
}

interface LandDetailsFormProps {
    onNext?: (data: any) => void;
    onBack?: () => void;
}

export default function LandDetailsForm({ onNext, onBack }: LandDetailsFormProps) {
    const [hasLand, setHasLand] = useState<boolean | null>(false);
    const [files, setFiles] = useState<File[]>([]);
    const [filters, setFilters] = useState<FilterOptions>({ widths: [], depths: [], storeys: [] });
    const [loadingFilters, setLoadingFilters] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        lotNumber: "",
        estateName: "",
        suburb: "",
        landWidth: "",
        landDepth: "",
        storeys: "",
        preferredLocation: ""
    });

    useEffect(() => {
        fetchFilters();
    }, []);

    const fetchFilters = async () => {
        try {
            const data: any = await api.getFloorPlanFilters();
            setFilters(data);
        } catch (error) {
            console.error("Failed to load filters", error);
        } finally {
            setLoadingFilters(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        // Validation: "Any" (empty string) is now a valid option, so we allow proceeding.
        // If we needed to enforce a specific selection, we would check here.

        console.log("Proceeding with:", formData);
        if (onNext) {
            onNext(formData);
        }
    };

    const renderDropdowns = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Land Width <span className="text-red-500">*</span></label>
                <select
                    value={formData.landWidth}
                    onChange={(e) => handleChange("landWidth", e.target.value)}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors appearance-none"
                >
                    <option value="">Any</option>
                    {filters.widths.map(w => <option key={w} value={w}>{w}m+</option>)}
                </select>
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Land Depth <span className="text-red-500">*</span></label>
                <select
                    value={formData.landDepth}
                    onChange={(e) => handleChange("landDepth", e.target.value)}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors appearance-none"
                >
                    <option value="">Any</option>
                    {filters.depths.map(d => <option key={d} value={d}>{d}m+</option>)}
                </select>
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Storeys <span className="text-red-500">*</span></label>
                <select
                    value={formData.storeys}
                    onChange={(e) => handleChange("storeys", e.target.value)}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors appearance-none"
                >
                    <option value="">Any</option>
                    {filters.storeys.map(s => <option key={s} value={s}>{s === 1 ? "Single" : "Double"} Storey</option>)}
                </select>
            </div>
        </div>
    );

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-4xl mx-auto">
            {/* Step 1: Do you have land? */}
            <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-tight">Do you have land?</h3>
                <div className="flex gap-4">
                    <button
                        onClick={() => setHasLand(true)}
                        className={`px-8 py-3 rounded-md font-bold text-sm transition-all uppercase ${hasLand === true
                            ? "bg-black text-white shadow-lg shadow-gray-500/30"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        Yes
                    </button>
                    <button
                        onClick={() => setHasLand(false)}
                        className={`px-8 py-3 rounded-md font-bold text-sm transition-all uppercase ${hasLand === false
                            ? "bg-black text-white shadow-lg shadow-gray-500/30"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        No
                    </button>
                </div>
            </div>

            {/* Step 2: Form Fields */}
            {hasLand === true && (
                <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    <h4 className="text-gray-900 font-bold uppercase tracking-wider text-sm mb-6">Build Your Quote</h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Lot Number</label>
                            <input
                                type="text"
                                placeholder="Type Lot Number"
                                value={formData.lotNumber}
                                onChange={(e) => handleChange("lotNumber", e.target.value)}
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Estate Name</label>
                            <input
                                type="text"
                                placeholder="Type Estate Name"
                                value={formData.estateName}
                                onChange={(e) => handleChange("estateName", e.target.value)}
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Suburb</label>
                            <input
                                type="text"
                                placeholder="Type Suburb"
                                value={formData.suburb}
                                onChange={(e) => handleChange("suburb", e.target.value)}
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
                            />
                        </div>
                    </div>

                    {renderDropdowns()}

                    <div className="mt-8">
                        <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2 mb-2">
                            Please provide any relevant land documentation
                            <span className="text-black cursor-help" title="Upload distinct plans, engineering, etc.">ⓘ</span>
                        </label>
                        <div className="flex items-center gap-4">
                            <label className="cursor-pointer bg-white border border-gray-900 text-gray-900 px-8 py-3 rounded-lg font-bold text-sm uppercase hover:bg-gray-50 transition-colors">
                                Upload Files
                                <input type="file" multiple className="hidden" onChange={handleFileChange} />
                            </label>
                            <span className="text-gray-400 text-sm italic">
                                {files.length > 0 ? `${files.length} file(s) selected` : "No files currently uploaded"}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {hasLand === false && (
                <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    <h4 className="text-gray-900 font-bold uppercase tracking-wider text-sm mb-6">Continue to Build Your Quote</h4>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Preferred Build Location</label>
                        <input
                            type="text"
                            placeholder="Type Estate/Suburb"
                            value={formData.preferredLocation}
                            onChange={(e) => handleChange("preferredLocation", e.target.value)}
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
                        />
                    </div>

                    {renderDropdowns()}
                </div>
            )}

            {(hasLand === true || hasLand === false) && (
                <div className="mt-12 flex justify-between items-center">
                    <button
                        onClick={onBack}
                        className="text-gray-400 font-bold uppercase text-[10px] tracking-widest hover:text-black transition-colors"
                    >
                        ‹ Previous Step
                    </button>
                    <button
                        onClick={handleNext}
                        className="bg-gray-900 text-white px-8 py-3 rounded-lg font-bold uppercase flex items-center gap-2 hover:bg-black transition-colors"
                    >
                        Next Step <span className="text-white">›</span>
                    </button>
                </div>
            )}
        </div>
    );
}
