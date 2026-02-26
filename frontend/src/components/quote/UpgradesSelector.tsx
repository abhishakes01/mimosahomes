"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { api, getFullUrl } from "@/services/api";
import { ChevronRight, ChevronDown, Check, X, ZoomIn, Info, Settings2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UpgradesSelectorProps {
    onBack: () => void;
    onSelect: (selectedUpgrades: any[]) => void;
    selectedFloorPlan: any;
    selectedFacade: any;
    selectedColours: any;
}

export default function UpgradesSelector({ onBack, onSelect, selectedFloorPlan, selectedFacade, selectedColours }: UpgradesSelectorProps) {
    const [loading, setLoading] = useState(true);
    const [groups, setGroups] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [activeGroupId, setActiveGroupId] = useState<string>("");
    const [activeCategoryId, setActiveCategoryId] = useState<string>("");
    const [selections, setSelections] = useState<Record<string, any>>({});
    const [viewingImage, setViewingImage] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [categoriesData, groupsData] = await Promise.all([
                api.getUpgradeCategories({ is_active: true }) as Promise<any[]>,
                api.getUpgradeGroups({ is_active: true }) as Promise<any[]>
            ]);

            setCategories(categoriesData);
            setGroups(groupsData);

            if (groupsData.length > 0) {
                setActiveGroupId(groupsData[0].id);
                const firstCat = categoriesData.find(c => c.group_id === groupsData[0].id);
                if (firstCat) setActiveCategoryId(firstCat.id);
            }

            // Initialize standards
            const initialSelections: Record<string, any> = {};
            categoriesData.forEach(cat => {
                const standard = cat.upgrades?.find((u: any) => u.is_standard && u.is_active);
                if (standard) initialSelections[cat.id] = standard;
            });
            setSelections(initialSelections);
        } catch (error) {
            console.error("Failed to load upgrades", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelection = (categoryId: string, upgrade: any) => {
        setSelections(prev => ({
            ...prev,
            [categoryId]: upgrade
        }));
    };

    const handleNext = () => {
        const upgradeList = Object.values(selections);
        onSelect(upgradeList);
    };

    const activeCategory = categories.find(c => c.id === activeCategoryId);
    const upgradeTotal = Object.values(selections).reduce((sum, u) => sum + (u.price || 0), 0);

    return (
        <div className="flex flex-col gap-8 w-full">

            {/* Top Row: Browser and Summary */}
            <div className="flex flex-col lg:flex-row gap-8 items-stretch">

                {/* Left: Upgrades Browser */}
                <div className="flex-grow lg:w-[68%] bg-white rounded-[40px] border border-gray-100 p-8 lg:p-12 flex flex-col min-h-[750px] shadow-sm">
                    <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-8">UPGRADES</h2>

                    <div className="flex flex-grow gap-8">
                        {/* Sidebar: Hierarchical Navigation (Groups > Categories) */}
                        <div className="w-[22%] flex-shrink-0 border-r border-gray-100 pr-4 overflow-y-auto max-h-[660px] custom-scrollbar">
                            <div className="flex flex-col gap-1.5">
                                {groups.map(group => {
                                    const isExpanded = activeGroupId === group.id;
                                    const groupCategories = categories.filter(c => c.group_id === group.id);

                                    return (
                                        <div key={group.id} className="flex flex-col">
                                            {/* Group Header */}
                                            <button
                                                onClick={() => setActiveGroupId(isExpanded ? "" : group.id)}
                                                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg transition-all ${isExpanded
                                                    ? 'bg-[#0796b1] text-white shadow-md shadow-cyan-900/10'
                                                    : 'bg-white text-gray-400 hover:text-gray-600'
                                                    }`}
                                            >
                                                <span className="text-[9.5px] font-black uppercase tracking-[0.15em]">{group.name}</span>
                                                {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                            </button>

                                            {/* Indented Categories for Active Group */}
                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden bg-gray-50/50"
                                                    >
                                                        <div className="flex flex-col py-1 pl-4">
                                                            {groupCategories.map(cat => {
                                                                const isActive = activeCategoryId === cat.id;
                                                                const isSelected = selections[cat.id] && !selections[cat.id].is_standard;

                                                                return (
                                                                    <button
                                                                        key={cat.id}
                                                                        onClick={() => setActiveCategoryId(cat.id)}
                                                                        className={`group flex items-center justify-between px-5 py-2.5 rounded-lg transition-all text-left ${isActive
                                                                            ? 'text-gray-900 font-black'
                                                                            : 'text-gray-400 hover:text-gray-600'
                                                                            }`}
                                                                    >
                                                                        <div className="flex items-center gap-2">
                                                                            {selections[cat.id] && (
                                                                                <Check size={12} className={isSelected ? 'text-[#0796b1]' : 'text-gray-300'} strokeWidth={4} />
                                                                            )}
                                                                            <span className={`text-[10px] uppercase tracking-widest ${isActive ? 'underline decoration-2 underline-offset-4' : ''}`}>
                                                                                {cat.name}
                                                                            </span>
                                                                        </div>
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Upgrade Selection Grid */}
                        <div className="w-[78%] flex-grow">
                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0796b1]"></div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {activeCategory?.upgrades?.map((upgrade: any) => {
                                        const isSelected = selections[activeCategoryId]?.id === upgrade.id;
                                        return (
                                            <div
                                                key={upgrade.id}
                                                onClick={() => handleSelection(activeCategoryId, upgrade)}
                                                className={`group relative bg-white border-2 rounded-[16px] cursor-pointer overflow-hidden transition-all duration-300 ${isSelected
                                                    ? 'border-[#0796b1] shadow-[0_15px_35px_-8px_rgba(7,150,177,0.2)]'
                                                    : 'border-gray-100 hover:border-gray-200 shadow-sm'
                                                    }`}
                                            >
                                                {/* Card Image Section - Scaled Up */}
                                                <div className="relative h-48 w-full overflow-hidden bg-gray-50">
                                                    {upgrade.image_url ? (
                                                        <Image
                                                            src={getFullUrl(upgrade.image_url)}
                                                            alt={upgrade.name}
                                                            fill
                                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full opacity-5">
                                                            <Settings2 size={40} />
                                                        </div>
                                                    )}
                                                    <div className="absolute top-3 left-3 z-10">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setViewingImage(getFullUrl(upgrade.image_url)); }}
                                                            className="w-7 h-7 bg-[#0796b1] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all"
                                                        >
                                                            <ZoomIn size={14} />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Card Bottom Label */}
                                                <div className={`px-4 py-3 min-h-[60px] flex items-center justify-between gap-3 border-t border-gray-50 transition-colors ${isSelected ? 'bg-[#0796b1] text-white' : 'bg-white'}`}>
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-[10px] font-black uppercase tracking-tight leading-tight line-clamp-2">
                                                            {upgrade.name}
                                                        </span>
                                                        <div className="flex items-center gap-1 opacity-70">
                                                            <Info size={10} className={isSelected ? 'text-white' : 'text-[#0796b1]'} />
                                                        </div>
                                                    </div>
                                                    <div className={`px-2.5 py-1 rounded-md text-[9px] font-black italic whitespace-nowrap ${isSelected ? 'bg-white/20' : 'bg-[#0796b1]/5 text-[#0796b1]'}`}>
                                                        {upgrade.price === 0 || !upgrade.price ? "Included" : `+$${upgrade.price.toLocaleString()}`}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: High Fidelity Quote Summary Hub */}
                <div className="lg:w-[32%] flex flex-col gap-6">
                    <div className="bg-white rounded-[32px] border border-gray-100 p-10 shadow-2xl space-y-10 min-h-[600px] overflow-y-auto max-h-[750px] custom-scrollbar">
                        <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">QUOTE SUMMARY</h2>

                        <div className="space-y-12">
                            {/* FLOORPLAN */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black text-[#0796b1] uppercase tracking-[0.4em] border-b border-gray-50 pb-2">FLOORPLAN</h3>
                                <div className="space-y-3 px-1">
                                    <div className="flex justify-between items-center text-[11px]">
                                        <span className="font-bold text-gray-500 uppercase tracking-widest leading-tight">Floorplan Name: <span className="text-gray-900">{selectedFloorPlan.title}</span></span>
                                        <span className="font-bold text-gray-900">${Math.round(selectedFloorPlan.price || 232596).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[11px] pt-1">
                                        <span className="font-bold text-gray-900 uppercase tracking-widest leading-none">Subtotal:</span>
                                        <span className="font-black text-[#0796b1]">${Math.round(selectedFloorPlan.price || 232596).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* FACADE */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black text-[#0796b1] uppercase tracking-[0.4em] border-b border-gray-50 pb-2">FACADE</h3>
                                <div className="space-y-3 px-1">
                                    <div className="flex justify-between items-center text-[11px]">
                                        <span className="font-bold text-gray-500 uppercase tracking-widest leading-tight">Facade Name: <span className="text-gray-900">{selectedFacade.title}</span></span>
                                        <span className="font-bold text-[#0796b1]">Included</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[11px] pt-1">
                                        <span className="font-bold text-gray-900 uppercase tracking-widest leading-none">Subtotal:</span>
                                        <span className="font-black text-[#0796b1]">Included</span>
                                    </div>
                                </div>
                            </div>

                            {/* COLOUR SCHEMES */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black text-[#0796b1] uppercase tracking-[0.4em] border-b border-gray-50 pb-2">COLOUR SCHEMES</h3>
                                <div className="space-y-3 px-1 font-bold text-[11px]">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 uppercase tracking-widest">External: <span className="text-gray-900">{selectedColours?.facadeScheme?.name || "Dawn"}</span></span>
                                        <span>${(selectedColours?.facadeScheme?.price || 500).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 uppercase tracking-widest">Internal: <span className="text-gray-900">{selectedColours?.interiorScheme?.name || "Raven"}</span></span>
                                        <span>${(selectedColours?.interiorScheme?.price || 395).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between pt-1 border-t border-gray-50 mt-1 pt-2">
                                        <span className="text-gray-900 uppercase tracking-widest">Subtotal:</span>
                                        <span className="text-[#0796b1]">${((selectedColours?.facadeScheme?.price || 500) + (selectedColours?.interiorScheme?.price || 395)).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* PROMOTION */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black text-[#0796b1] uppercase tracking-[0.4em] border-b border-gray-50 pb-2">PROMOTION</h3>
                                <div className="space-y-3 px-1 font-bold text-[11px]">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 uppercase tracking-widest leading-relaxed">50% Off Fixed Site Costs! T & C's Apply</span>
                                        <span className="text-[#0796b1]">Included</span>
                                    </div>
                                    <div className="flex justify-between pt-1 border-t border-gray-50 mt-1 pt-2">
                                        <span className="text-gray-900 uppercase tracking-widest">Subtotal:</span>
                                        <span className="text-[#0796b1]">Included</span>
                                    </div>
                                </div>
                            </div>

                            {/* TOTAL */}
                            <div className="pt-10 flex justify-end items-center gap-6 border-t-2 border-gray-100">
                                <span className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">TOTAL:</span>
                                <span className="text-5xl font-black text-[#0796b1] tracking-tighter italic leading-none">
                                    ${Math.round(
                                        (selectedFloorPlan.price || 0) +
                                        (selectedColours?.facadeScheme?.price || 500) +
                                        (selectedColours?.interiorScheme?.price || 395) +
                                        upgradeTotal
                                    ).toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pr-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-[#0796b1] text-white px-8 py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-cyan-900/10 hover:bg-cyan-700 transition-all"
                        >
                            RESTART QUOTE
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Nav Standardized */}
            <div className="flex flex-col items-center gap-6 py-12 relative overflow-visible">
                <div className="relative group">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-[-55px] left-1/2 -translate-x-1/2 bg-[#0796b1] text-white px-8 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] whitespace-nowrap shadow-xl z-20"
                    >
                        To continue building your quote, please press this button
                        <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0796b1] rotate-45" />
                    </motion.div>

                    <button
                        onClick={handleNext}
                        className="px-24 py-7 rounded-[32px] bg-gray-900 text-white hover:bg-black font-black uppercase text-sm tracking-[0.3em] flex items-center gap-6 transition-all shadow-2xl active:scale-95 shadow-gray-900/40 hover:-translate-y-1"
                    >
                        NEXT STEP <ChevronRight size={24} strokeWidth={4} />
                    </button>
                </div>

                <button
                    onClick={onBack}
                    className="text-[#0796b1] font-black uppercase text-[10px] tracking-[0.4em] hover:opacity-80 transition-all underline underline-offset-8 decoration-2"
                >
                    &lt; GO BACK
                </button>
            </div>

            {/* Global Perspective Lightbox */}
            <AnimatePresence>
                {viewingImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setViewingImage(null)}
                        className="fixed inset-0 z-[200] bg-gray-900/95 backdrop-blur-2xl flex items-center justify-center p-20"
                    >
                        <button className="absolute top-10 right-10 text-white bg-white/10 p-5 rounded-full hover:bg-white/20 transition-all">
                            <X size={36} />
                        </button>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full h-full max-w-7xl bg-white rounded-[56px] overflow-hidden p-16 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image src={viewingImage} alt="Upgrade Detail" fill className="object-contain p-12" priority />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f1f1; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #e5e5e5; }
            `}</style>
        </div>
    );
}
