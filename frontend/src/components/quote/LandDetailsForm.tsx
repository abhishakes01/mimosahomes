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
    const [fileError, setFileError] = useState<string | null>(null);

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/avif", "application/pdf"];

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

    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            
            // Validate Size
            const oversizedFiles = selectedFiles.filter(file => file.size > MAX_FILE_SIZE);
            if (oversizedFiles.length > 0) {
                setFileError(`Some files exceed the 10MB limit: ${oversizedFiles.map(f => f.name).join(", ")}`);
                setFiles([]);
                e.target.value = "";
                return;
            }

            // Validate Type
            const invalidTypeFiles = selectedFiles.filter(file => !ALLOWED_TYPES.includes(file.type));
            if (invalidTypeFiles.length > 0) {
                setFileError(`Disallowed file types selected. Only images and PDFs are allowed.`);
                setFiles([]);
                e.target.value = "";
                return;
            }

            setFileError(null);
            setFiles(selectedFiles);
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = async () => {
        if (fileError) {
            return;
        }

        if (onNext) {
            setIsUploading(true);
            setFileError(null);
            try {
                let uploadedUrls: string[] = [];
                if (files.length > 0) {
                    const uploadPromises = files.map(file => api.uploadFile(file, 'land-docs'));
                    const results = await Promise.all(uploadPromises);
                    uploadedUrls = results.map(r => (r as any).url);
                }
                onNext({ ...formData, landFiles: uploadedUrls });
            } catch (error: any) {
                console.error("File upload failed", error);
                // Extract clean message from Error object
                const msg = error.message || "Failed to upload land documentation. Please try again.";
                setFileError(msg.replace("Upload failed: ", ""));
            } finally {
                setIsUploading(false);
            }
        }
    };

    return (
        <div className="flex flex-col gap-6 md:gap-10">
            {/* Main Layout Area */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Left Side: Form Card */}
                <div className="flex-grow w-full lg:w-[65%] bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 lg:p-12">
                    <div className="space-y-8 md:space-y-10">
                        {/* Land Question */}
                        <div className="space-y-4">
                            <h2 className="text-lg md:text-xl font-black text-gray-900 uppercase tracking-tight">Do you have land?</h2>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => setHasLand(true)}
                                    className={`flex-1 md:flex-none px-6 md:px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all ${hasLand === true
                                        ? "bg-[#0796b1] text-white shadow-lg shadow-cyan-900/20"
                                        : "bg-gray-200 text-gray-500 hover:bg-gray-300"
                                        }`}
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={() => setHasLand(false)}
                                    className={`flex-1 md:flex-none px-6 md:px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all ${hasLand === false
                                        ? "bg-[#0796b1] text-white shadow-lg shadow-cyan-900/20"
                                        : "bg-gray-200 text-gray-400 hover:bg-gray-300"
                                        }`}
                                >
                                    No
                                </button>
                            </div>
                        </div>

                        {/* Title Section */}
                        <div className="pt-2 md:pt-4">
                            <h3 className="text-[10px] font-black text-[#0796b1] uppercase tracking-[0.2em] mb-6 md:mb-8">
                                {hasLand ? "Build Your Quote" : "Continue to Build Your Quote"}
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                {hasLand ? (
                                    <>
                                        {/* Lot Number */}
                                        <div className="space-y-2 md:space-y-3">
                                            <label className="text-[9px] md:text-[10px] font-black text-gray-900 uppercase tracking-widest">Lot Number</label>
                                            <input
                                                type="text"
                                                placeholder="Type Lot Number"
                                                value={formData.lotNumber}
                                                onChange={(e) => handleChange("lotNumber", e.target.value)}
                                                className="w-full bg-white border border-gray-200 rounded-xl p-3 md:p-4 text-sm focus:outline-none focus:border-[#0796b1] transition-all"
                                            />
                                        </div>
                                        {/* Estate Name */}
                                        <div className="space-y-2 md:space-y-3">
                                            <label className="text-[9px] md:text-[10px] font-black text-gray-900 uppercase tracking-widest">Estate Name</label>
                                            <input
                                                type="text"
                                                placeholder="Type Estate Name"
                                                value={formData.estateName}
                                                onChange={(e) => handleChange("estateName", e.target.value)}
                                                className="w-full bg-white border border-gray-200 rounded-xl p-3 md:p-4 text-sm focus:outline-none focus:border-[#0796b1] transition-all"
                                            />
                                        </div>
                                        {/* Suburb */}
                                        <div className="space-y-2 md:space-y-3">
                                            <label className="text-[9px] md:text-[10px] font-black text-gray-900 uppercase tracking-widest">Suburb</label>
                                            <input
                                                type="text"
                                                placeholder="Type Suburb"
                                                value={formData.suburb}
                                                onChange={(e) => handleChange("suburb", e.target.value)}
                                                className="w-full bg-white border border-gray-200 rounded-xl p-3 md:p-4 text-sm focus:outline-none focus:border-[#0796b1] transition-all"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    /* Preferred Build Location */
                                    <div className="space-y-2 md:space-y-3 sm:col-span-2 lg:col-span-3">
                                        <label className="text-[9px] md:text-[10px] font-black text-gray-900 uppercase tracking-widest">Preferred Build Location</label>
                                        <input
                                            type="text"
                                            placeholder="Type Estate/Suburb"
                                            value={formData.preferredLocation}
                                            onChange={(e) => handleChange("preferredLocation", e.target.value)}
                                            className="w-full bg-white border border-gray-200 rounded-xl p-3 md:p-4 text-sm focus:outline-none focus:border-[#0796b1] transition-all"
                                        />
                                    </div>
                                )}

                                {/* Width Dropdown */}
                                <div className="space-y-2 md:space-y-3">
                                    <label className="text-[9px] md:text-[10px] font-black text-gray-900 uppercase tracking-widest">Land Width</label>
                                    <div className="relative">
                                        <select
                                            value={formData.landWidth}
                                            onChange={(e) => handleChange("landWidth", e.target.value)}
                                            className="w-full bg-white border border-gray-200 rounded-xl p-3 md:p-4 text-sm focus:outline-none focus:border-[#0796b1] transition-all appearance-none cursor-pointer"
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
                                <div className="space-y-2 md:space-y-3">
                                    <label className="text-[9px] md:text-[10px] font-black text-gray-900 uppercase tracking-widest">Land Depth</label>
                                    <div className="relative">
                                        <select
                                            value={formData.landDepth}
                                            onChange={(e) => handleChange("landDepth", e.target.value)}
                                            className="w-full bg-white border border-gray-200 rounded-xl p-3 md:p-4 text-sm focus:outline-none focus:border-[#0796b1] transition-all appearance-none cursor-pointer"
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
                                <div className="space-y-2 md:space-y-3">
                                    <label className="text-[9px] md:text-[10px] font-black text-gray-900 uppercase tracking-widest">Storeys</label>
                                    <div className="relative">
                                        <select
                                            value={formData.storeys}
                                            onChange={(e) => handleChange("storeys", e.target.value)}
                                            className="w-full bg-white border border-gray-200 rounded-xl p-3 md:p-4 text-sm focus:outline-none focus:border-[#0796b1] transition-all appearance-none cursor-pointer"
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
                                    <h4 className="text-[10px] md:text-[11px] font-black text-gray-900 uppercase tracking-widest">Land documentation</h4>
                                    <div className="text-[#0796b1] cursor-help transition-transform hover:scale-110">
                                        <Info size={16} />
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                                    <label className="w-full sm:w-auto text-center cursor-pointer bg-white border-2 border-gray-900 text-gray-900 px-8 md:px-10 py-3 md:py-4 rounded-xl font-black text-[10px] md:text-[11px] uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all shadow-sm">
                                        {isUploading ? "Uploading..." : "Upload Files"}
                                        <input type="file" multiple className="hidden" onChange={handleFileChange} disabled={isUploading} />
                                    </label>
                                    <span className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        {files.length > 0 ? `${files.length} Files Attached` : "No files currently uploaded"}
                                    </span>
                                </div>
                                {fileError && (
                                    <div className="text-red-500 text-[10px] font-bold uppercase tracking-wider bg-red-50 p-3 rounded-lg border border-red-100 flex items-center gap-2">
                                        <Info size={14} />
                                        <span>{fileError}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Welcome Card - Hidden on Mobile if empty */}
                <div className="lg:w-[35%] w-full h-full min-h-[100px] lg:min-h-[400px]">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 h-full relative overflow-hidden flex flex-col">
                        <h4 className="text-[10px] font-black text-[#0796b1] uppercase tracking-[0.3em] mb-4">Selection Hub</h4>
                        <div className="flex-grow flex items-center justify-center border border-dashed border-gray-100 rounded-3xl opacity-40">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Your selections will appear here</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="flex flex-col items-center gap-6 pb-12">
                {fileError && (
                    <div className="animate-in slide-in-from-bottom-2 duration-300 text-red-500 text-[11px] font-black uppercase tracking-[0.1em] bg-red-50 px-6 py-3 rounded-xl border border-red-100 flex items-center gap-3 mb-2">
                        <div className="bg-red-500 text-white rounded-full p-1">
                            <X size={12} strokeWidth={3} />
                        </div>
                        {fileError}
                    </div>
                )}

                <button
                    onClick={handleNext}
                    disabled={isUploading || !!fileError}
                    className="bg-gray-900 text-white px-10 md:px-16 py-4 md:py-5 rounded-2xl font-black uppercase text-xs md:text-sm tracking-[0.2em] flex items-center gap-4 hover:bg-black transition-all shadow-2xl shadow-gray-900/20 active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    {isUploading ? "Processing..." : "Next Step"} <ChevronRight size={20} />
                </button>

                <div className="w-full flex justify-end px-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-[#0796b1] text-white px-6 md:px-8 py-2 md:py-3 rounded-xl font-black uppercase text-[9px] md:text-[10px] tracking-widest hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-900/20"
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
