"use client";

import { Check } from "lucide-react";

const steps = [
    { number: 1, label: "Build Your Quote" },
    { number: 2, label: "Floorplan" },
    { number: 3, label: "Facade" },
    { number: 4, label: "Colours" },
    { number: 5, label: "Upgrades" },
    { number: 6, label: "Summary" },
];

interface ProgressStepsProps {
    currentStep: number;
}

export default function ProgressSteps({ currentStep }: ProgressStepsProps) {
    return (
        <div className="w-full bg-white py-6 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-4 md:gap-8 overflow-x-auto no-scrollbar">
                {steps.map((step, idx) => {
                    const isActive = step.number === currentStep;
                    const isCompleted = step.number < currentStep;

                    return (
                        <div key={step.number} className="flex items-center gap-3 min-w-fit">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all border-2 ${isActive
                                        ? "bg-[#0796b1] border-[#0796b1] text-white shadow-lg shadow-cyan-900/20"
                                        : isCompleted
                                            ? "bg-[#0796b1] border-[#0796b1] text-white"
                                            : "bg-white border-gray-200 text-gray-400"
                                    }`}
                            >
                                {isCompleted ? <Check size={18} strokeWidth={3} /> : step.number}
                            </div>
                            <span
                                className={`text-[11px] font-black uppercase tracking-widest whitespace-nowrap ${isActive ? "text-gray-900" : "text-gray-400"
                                    }`}
                            >
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
