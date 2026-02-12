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
        <div className="w-full bg-white border-b border-gray-200 py-4 shadow-sm mb-8">
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between overflow-x-auto scrollbar-hide">
                {steps.map((step, idx) => {
                    const isActive = step.number === currentStep;
                    const isCompleted = step.number < currentStep;

                    return (
                        <div key={step.number} className="flex items-center gap-2 min-w-fit px-4">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors border-2 ${isActive
                                    ? "bg-black border-black text-white"
                                    : isCompleted
                                        ? "bg-green-500 border-green-500 text-white"
                                        : "bg-white border-gray-300 text-gray-400"
                                    }`}
                            >
                                {isCompleted ? <Check size={16} /> : step.number}
                            </div>
                            <span
                                className={`text-sm font-bold uppercase tracking-wide whitespace-nowrap ${isActive ? "text-gray-900" : "text-gray-400"
                                    }`}
                            >
                                {step.label}
                            </span>

                            {/* Connector line (optional, simplified) */}
                            {/* {idx < steps.length - 1 && (
                                <div className="hidden md:block w-12 h-[2px] bg-gray-200 ml-4" />
                            )} */}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
