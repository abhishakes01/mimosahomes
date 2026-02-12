"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import { useUI } from "@/context/UIContext";
import nextDynamic from "next/dynamic";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";

// Dynamic import for MapPolygonPicker to avoid SSR issues with Leaflet
const MapPolygonPicker = nextDynamic(() => import("@/components/admin/MapPolygonPicker"), {
    ssr: false,
    loading: () => <div className="w-full h-96 bg-gray-100 rounded-2xl animate-pulse" />
});

export default function CreateServiceAreaClient() {
    const router = useRouter();
    const { showAlert } = useUI();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        coordinates: [] as [number, number][],
        is_active: true
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name) {
            showAlert("Required", "Please enter an area name", "error");
            return;
        }

        if (formData.coordinates.length < 3) {
            showAlert("Invalid Area", "Please draw a valid polygon area (at least 3 points)", "error");
            return;
        }

        setLoading(true);
        try {
            await api.createServiceArea(formData, "mock-token");
            showAlert("Success", "Service area created successfully", "success");
            router.push("/admin/service-areas");
        } catch (err) {
            console.error(err);
            showAlert("Error", "Failed to create service area", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/admin/service-areas"
                    className="w-10 h-10 bg-white rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-black transition-all"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">New Service Area</h1>
                    <p className="text-gray-400 text-sm">Define a new delivery or service zone</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50">
                    <div className="space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Area Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-mimosa-dark focus:ring-4 focus:ring-mimosa-dark/10 transition-all outline-none font-medium"
                                placeholder="e.g. Melbourne Metro"
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-12 h-7 rounded-full p-1 transition-all ${formData.is_active ? 'bg-green-500' : 'bg-gray-200'}`}>
                                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-all ${formData.is_active ? 'translate-x-5' : 'translate-x-0'}`} />
                                </div>
                                <input
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="hidden"
                                />
                                <span className="font-bold text-gray-700 group-hover:text-black transition-colors">Active Status</span>
                            </label>
                        </div>

                        {/* Map Picker */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Draw Area</label>
                            <MapPolygonPicker
                                onChange={(points) => setFormData({ ...formData, coordinates: points })}
                            />
                            <p className="text-xs text-gray-400 mt-2">
                                Click on the map to add points. Connect at least 3 points to form an area.
                            </p>
                        </div>
                    </div>

                    <div className="pt-8 mt-8 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-mimosa-dark text-white px-8 py-4 rounded-xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                            Create Service Area
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
