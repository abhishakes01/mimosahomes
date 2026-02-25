"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchWidget() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("designs");
    const [storeys, setStoreys] = useState("Any Storey");
    const [bedrooms, setBedrooms] = useState("Any");
    const [lotWidth, setLotWidth] = useState("Any Width");

    const handleSearch = () => {
        const params = new URLSearchParams();

        if (storeys !== "Any Storey") {
            params.set("storeys", storeys === "Single Storey" ? "Single" : "Double");
        }

        if (bedrooms !== "Any") {
            // Extract the number from strings like "3 Bedrooms" or "5+ Bedrooms"
            const match = bedrooms.match(/\d+/);
            if (match) {
                params.set("beds", match[0]);
            }
        }

        if (lotWidth !== "Any Width") {
            // Extract the number from strings like "10.5m+"
            const match = lotWidth.match(/(\d+\.?\d*)/);
            if (match) {
                params.set("width", match[0]);
            }
        }

        const baseUrl = activeTab === "designs" ? "/new-home-designs" : "/house-land-packages";
        router.push(`${baseUrl}?${params.toString()}`);
    };

    return (
        <div className="bg-white rounded-lg shadow-2xl max-w-5xl mx-auto -mt-8 relative z-30 p-2">
            {/* Tabs */}
            <div className="flex gap-1 mb-2 px-2 pt-2">
                <button
                    onClick={() => setActiveTab("designs")}
                    className={`px-6 py-2 text-sm font-bold rounded-t-lg transition-colors ${activeTab === "designs"
                        ? "text-mimosa-dark border-b-2 border-mimosa-dark"
                        : "text-gray-500 hover:text-mimosa-dark"
                        }`}
                >
                    View Home Designs
                </button>
                <button
                    onClick={() => setActiveTab("packages")}
                    className={`px-6 py-2 text-sm font-bold rounded-t-lg transition-colors ${activeTab === "packages"
                        ? "text-mimosa-dark border-b-2 border-mimosa-dark"
                        : "text-gray-500 hover:text-mimosa-dark"
                        }`}
                >
                    House & Land Packages
                </button>
            </div>

            <div className="bg-white p-4 rounded-b-lg flex flex-col md:flex-row gap-4 items-center">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 w-full">
                    {/* Storeys */}
                    <div className="relative">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Storeys</label>
                        <select
                            value={storeys}
                            onChange={(e) => setStoreys(e.target.value)}
                            className="w-full p-2 border-b border-gray-200 font-semibold text-mimosa-dark focus:outline-none focus:border-mimosa-dark bg-transparent"
                        >
                            <option>Any Storey</option>
                            <option>Single Storey</option>
                            <option>Double Storey</option>
                        </select>
                    </div>

                    {/* Bedrooms */}
                    <div className="relative">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Bedrooms</label>
                        <select
                            value={bedrooms}
                            onChange={(e) => setBedrooms(e.target.value)}
                            className="w-full p-2 border-b border-gray-200 font-semibold text-mimosa-dark focus:outline-none focus:border-mimosa-dark bg-transparent"
                        >
                            <option>Any</option>
                            <option>3 Bedrooms</option>
                            <option>4 Bedrooms</option>
                            <option>5+ Bedrooms</option>
                        </select>
                    </div>

                    {/* Lot Width */}
                    <div className="relative">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Lot Width (m)</label>
                        <select
                            value={lotWidth}
                            onChange={(e) => setLotWidth(e.target.value)}
                            className="w-full p-2 border-b border-gray-200 font-semibold text-mimosa-dark focus:outline-none focus:border-mimosa-dark bg-transparent"
                        >
                            <option>Any Width</option>
                            <option>10.5m+</option>
                            <option>12.5m+</option>
                            <option>14m+</option>
                            <option>16m+</option>
                        </select>
                    </div>
                </div>

                <button
                    onClick={handleSearch}
                    className="bg-mimosa-dark hover:bg-black text-white p-4 rounded-lg transition-colors flex items-center justify-center min-w-[60px]"
                >
                    <Search size={24} />
                </button>
            </div>
        </div>
    );
}
