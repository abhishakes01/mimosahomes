"use client";

import { useState, useEffect, useRef } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { getFullUrl } from "@/services/api";

interface Option {
    label: string;
    value: string;
    image?: string;
    subLabel?: string;
}

interface MultiSelectProps {
    options: Option[];
    selectedValues: string[];
    onChange: (values: string[]) => void;
    placeholder?: string;
    label?: string;
}

export default function MultiSelect({ options, selectedValues, onChange, placeholder = "Select...", label }: MultiSelectProps) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleSelection = (value: string) => {
        const newSelected = selectedValues.includes(value)
            ? selectedValues.filter(v => v !== value)
            : [...selectedValues, value];
        onChange(newSelected);
    };

    const removeSelection = (e: React.MouseEvent, value: string) => {
        e.stopPropagation();
        onChange(selectedValues.filter(v => v !== value));
    };

    const selectedOptions = options.filter(opt => selectedValues.includes(opt.value));

    return (
        <div className="relative" ref={containerRef}>
            {label && <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">{label}</label>}

            <div
                className={`min-h-[56px] px-4 py-3 bg-gray-50 border border-transparent rounded-2xl cursor-pointer flex items-center justify-between hover:bg-white hover:border-mimosa-dark/30 transition-all ${open ? 'bg-white border-mimosa-dark/30' : ''}`}
                onClick={() => setOpen(!open)}
            >
                <div className="flex flex-wrap gap-2">
                    {selectedValues.length === 0 && (
                        <span className="text-gray-400">{placeholder}</span>
                    )}
                    {selectedOptions.map((opt) => (
                        <span key={opt.value} className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-white border border-gray-200 shadow-sm text-gray-700">
                            {opt.image && (
                                <img src={getFullUrl(opt.image)} alt="" className="w-5 h-5 rounded object-cover mr-2" />
                            )}
                            {opt.label}
                            <div
                                role="button"
                                onClick={(e) => removeSelection(e, opt.value)}
                                className="ml-2 hover:text-red-500 text-gray-400 transition-colors"
                            >
                                <X size={14} />
                            </div>
                        </span>
                    ))}
                </div>
                <ChevronsUpDown className="text-gray-400 shrink-0 ml-2" size={20} />
            </div>

            {open && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl max-h-80 overflow-auto p-2">
                    {options.length === 0 ? (
                        <div className="p-4 text-sm text-gray-500 text-center">No options available</div>
                    ) : (
                        options.map((opt) => (
                            <div
                                key={opt.value}
                                className={`px-4 py-3 rounded-xl cursor-pointer flex items-center justify-between mb-1 transition-all ${selectedValues.includes(opt.value)
                                        ? 'bg-mimosa-gold/10 text-mimosa-dark font-bold'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                onClick={() => toggleSelection(opt.value)}
                            >
                                <div className="flex items-center gap-3">
                                    {opt.image && (
                                        <img src={getFullUrl(opt.image)} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                                    )}
                                    <div className="flex flex-col">
                                        <span>{opt.label}</span>
                                        {opt.subLabel && <span className="text-[10px] text-gray-400 font-normal uppercase tracking-wider">{opt.subLabel}</span>}
                                    </div>
                                </div>
                                {selectedValues.includes(opt.value) && (
                                    <div className="w-6 h-6 bg-mimosa-dark text-white rounded-full flex items-center justify-center">
                                        <Check size={14} />
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
