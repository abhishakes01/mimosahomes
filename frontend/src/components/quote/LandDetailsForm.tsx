"use client";

import { useState, useEffect } from "react";
import { Upload, X, Check, MapPin, Home, User, Scaling, ChevronRight, HelpCircle, Info } from "lucide-react";
import { api } from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

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
    const [hasLand, setHasLand] = useState<boolean | null>(true);
    const [files, setFiles] = useState<File[]>([]);
    const [filters, setFilters] = useState<FilterOptions>({ widths: [], depths: [], storeys: [] });
    const [loadingFilters, setLoadingFilters] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
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
        if (onNext) {
            onNext(formData);
        }
    };

    return (
        <div className="flex flex-col gap-10">
            {/* Main Layout Area */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Left Side: Form Card */}
                <div className="flex-grow lg:w-[65%] bg-white rounded-2xl shadow-sm border border-gray-100 p-8 lg:p-12">
                    <div className="space-y-10">
                        {/* Land Question */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Do you have land?</h2>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setHasLand(true)}
                                    className={`px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all ${hasLand === true
                                        ? "bg-[#0796b1] text-white shadow-lg shadow-cyan-900/20"
                                        : "bg-gray-200 text-gray-500 hover:bg-gray-300"
                                        }`}
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={() => setHasLand(false)}
                                    className={`px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all ${hasLand === false
                                        ? "bg-[#0796b1] text-white shadow-lg shadow-cyan-900/20"
                                        : "bg-gray-200 text-gray-400 hover:bg-gray-300"
                                        }`}
                                >
                                    No
                                </button>
                            </div>
                        </div>

                        {/* Title Section */}
                        <div className="pt-4">
                            <h3 className="text-xs font-black text-[#0796b1] uppercase tracking-[0.2em] mb-8">
                                {hasLand ? "Build Your Quote" : "Continue to Build Your Quote"}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {hasLand ? (
                                    <>
                                        {/* Lot Number */}
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Lot Number</label>
                                            <input
                                                type="text"
                                                placeholder="Type Lot Number"
                                                value={formData.lotNumber}
                                                onChange={(e) => handleChange("lotNumber", e.target.value)}
                                                className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:border-[#0796b1] transition-all"
                                            />
                                        </div>
                                        {/* Estate Name */}
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Estate Name</label>
                                            <input
                                                type="text"
                                                placeholder="Type Estate Name"
                                                value={formData.estateName}
                                                onChange={(e) => handleChange("estateName", e.target.value)}
                                                className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:border-[#0796b1] transition-all"
                                            />
                                        </div>
                                        {/* Suburb */}
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Suburb</label>
                                            <input
                                                type="text"
                                                placeholder="Type Suburb"
                                                value={formData.suburb}
                                                onChange={(e) => handleChange("suburb", e.target.value)}
                                                className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:border-[#0796b1] transition-all"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    /* Preferred Build Location */
                                    <div className="space-y-3 md:col-span-3">
                                        <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Preferred Build Location</label>
                                        <input
                                            type="text"
                                            placeholder="Type Estate/Suburb"
                                            value={formData.preferredLocation}
                                            onChange={(e) => handleChange("preferredLocation", e.target.value)}
                                            className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:border-[#0796b1] transition-all"
                                        />
                                    </div>
                                )}

                                {/* Width Dropdown */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Land Width</label>
                                    <div className="relative">
                                        <select
                                            value={formData.landWidth}
                                            onChange={(e) => handleChange("landWidth", e.target.value)}
                                            className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:border-[#0796b1] transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="">Any</option>
                                            {filters.widths.map(w => <option key={w} value={w}>{w}m+</option>)}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <ChevronRight size={16} className="rotate-90" />
                                        </div>
                                    </div>
                                </div>
                                {/* Depth Dropdown */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Land Depth</label>
                                    <div className="relative">
                                        <select
                                            value={formData.landDepth}
                                            onChange={(e) => handleChange("landDepth", e.target.value)}
                                            className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:border-[#0796b1] transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="">Any</option>
                                            {filters.depths.map(d => <option key={d} value={d}>{d}m+</option>)}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <ChevronRight size={16} className="rotate-90" />
                                        </div>
                                    </div>
                                </div>
                                {/* Storeys Dropdown */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Storeys</label>
                                    <div className="relative">
                                        <select
                                            value={formData.storeys}
                                            onChange={(e) => handleChange("storeys", e.target.value)}
                                            className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:border-[#0796b1] transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="">Any</option>
                                            {filters.storeys.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <ChevronRight size={16} className="rotate-90" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* File Upload Section - Only for YES land */}
                        {hasLand && (
                            <div className="pt-4 border-t border-gray-50 flex flex-col gap-4">
                                <div className="flex items-center gap-2">
                                    <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Please provide any relevant land documentation</h4>
                                    <div className="text-[#0796b1] cursor-help transition-transform hover:scale-110">
                                        <Info size={16} />
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <label className="cursor-pointer bg-white border-2 border-gray-900 text-gray-900 px-10 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all shadow-sm">
                                        Upload Files
                                        <input type="file" multiple className="hidden" onChange={handleFileChange} />
                                    </label>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        {files.length > 0 ? `${files.length} Files Attached` : "No files currently uploaded"}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Welcome Card */}
                <div className="lg:w-[35%] w-full space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 relative overflow-hidden flex flex-col min-h-[400px]">
                        {/* <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <span className="text-sm font-bold text-gray-900 uppercase tracking-widest block opacity-70">Welcome,</span>
                                <h3 className="text-4xl font-black text-gray-900 uppercase tracking-tighter italic leading-none">{formData.name || "Guest"}</h3>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full border-2 border-gray-100 flex items-center justify-center text-gray-300">
                                    <User size={32} />
                                </div>
                                <button className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 hover:text-[#0796b1] hover:underline underline-offset-4">
                                    Edit Details
                                </button>
                            </div>
                        </div> */}

                        {/* <div className="mt-12 space-y-4">
                            <h4 className="text-[11px] font-black text-[#0796b1] uppercase tracking-[0.3em]">Saved Quotes</h4>
                            <div className="p-8 border border-dashed border-gray-100 rounded-[32px] flex flex-col items-center justify-center opacity-40">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No Saved Quotes</span>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="flex flex-col items-center gap-6 pb-12">
                <button
                    onClick={handleNext}
                    className="bg-gray-900 text-white px-16 py-6 rounded-2xl font-black uppercase text-sm tracking-[0.2em] flex items-center gap-4 hover:bg-black transition-all shadow-2xl shadow-gray-900/20 active:scale-95"
                >
                    Next Step <ChevronRight size={20} />
                </button>

                <div className="w-full flex justify-end px-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-[#0796b1] text-white px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-900/20"
                    >
                        Restart Quote
                    </button>
                </div>
            </div>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
