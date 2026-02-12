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
                    {/* Centered Brand Name */}
                    <Link href="/" className="text-3xl font-bold tracking-tight text-gray-900 uppercase">
                        Mitra's Homes
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
