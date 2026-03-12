"use strict";
import Link from "next/link";
import React from "react";

export default function QuoteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            {/* Custom Header for Quote Builder */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-center relative">
                    {/* Center Logo and Brand Name */}
                    <Link href="/" className="flex items-center gap-5 group py-2">
                        <div className="relative w-14 h-14 flex mt-3 items-center justify-center transition-transform duration-300 group-hover:scale-110">
                            <img
                                src="/logo.png?v=1.1"
                                alt="Mitra's Homes"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <span className="text-4xl font-black tracking-tighter text-gray-900 uppercase italic leading-none flex items-center h-full">
                            Mitra's Homes
                        </span>
                    </Link>

                    {/* Optional: Close/Exit button could go here */}
                </div>
            </header>

            <main>
                {children}
            </main>
        </div>
    );
}
