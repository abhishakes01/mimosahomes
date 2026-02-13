"use client";

import { useState, useEffect, useRef } from "react";

interface DoubleRangeSliderProps {
    min: number;
    max: number;
    value: [number, number];
    onChange: (value: [number, number]) => void;
    primaryColor?: string;
}

export default function DoubleRangeSlider({
    min,
    max,
    value,
    onChange,
    primaryColor = "#0897b1"
}: DoubleRangeSliderProps) {
    const [minVal, setMinVal] = useState(value[0]);
    const [maxVal, setMaxVal] = useState(value[1]);
    const minValRef = useRef(value[0]);
    const maxValRef = useRef(value[1]);
    const range = useRef<HTMLDivElement>(null);

    // Convert to percentage
    const getPercent = (value: number) => Math.round(((value - min) / (max - min)) * 100);

    // Update state when props change
    useEffect(() => {
        setMinVal(value[0]);
        setMaxVal(value[1]);
        minValRef.current = value[0];
        maxValRef.current = value[1];
    }, [value]);

    // Update range width and position
    useEffect(() => {
        const minPercent = getPercent(minVal);
        const maxPercent = getPercent(maxValRef.current);

        if (range.current) {
            range.current.style.left = `${minPercent}%`;
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [minVal, min, max]);

    useEffect(() => {
        const minPercent = getPercent(minValRef.current);
        const maxPercent = getPercent(maxVal);

        if (range.current) {
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [maxVal, min, max]);

    // Handlers
    const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.min(Number(event.target.value), maxVal - 1);
        setMinVal(value);
        minValRef.current = value;
        onChange([value, maxVal]);
    };

    const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(Number(event.target.value), minVal + 1);
        setMaxVal(value);
        maxValRef.current = value;
        onChange([minVal, value]);
    };

    return (
        <div className="relative w-full h-8 flex items-center">
            <input
                type="range"
                min={min}
                max={max}
                value={minVal}
                onChange={handleMinChange}
                className="absolute w-full h-0 z-[3] outline-none pointer-events-none appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:shadow-md"
                style={{
                    // Dynamic styling for thumb border color is tricky with standard CSS/Tailwind classes efficiently
                    // So we rely on default styles or global CSS, but here we can try to inject style
                }}
            />
            <input
                type="range"
                min={min}
                max={max}
                value={maxVal}
                onChange={handleMaxChange}
                className="absolute w-full h-0 z-[4] outline-none pointer-events-none appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:shadow-md"
            />

            {/* Slider Track and Range */}
            <div className="relative w-full h-2 rounded-full bg-gray-200 z-[1]">
                <div
                    ref={range}
                    className="absolute h-full rounded-full z-[2]"
                    style={{ backgroundColor: primaryColor }}
                />
            </div>

            {/* Inline Styles for Thumbs to use Primary Color */}
            <style jsx>{`
                input[type='range']::-webkit-slider-thumb {
                    border-color: ${primaryColor};
                }
                input[type='range']::-moz-range-thumb {
                    border-color: ${primaryColor};
                }
            `}</style>
        </div>
    );
}
