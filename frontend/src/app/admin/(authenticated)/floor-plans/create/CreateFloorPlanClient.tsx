"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { api, getFullUrl } from "@/services/api";
import { Upload, Save, ArrowLeft } from "lucide-react";
import { useUI } from "@/context/UIContext";

export default function CreateFloorPlanClient() {
    const router = useRouter();
    const { showAlert } = useUI();
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        title: "",
        location: "",
        min_frontage: "",
        min_depth: "",
        total_area: "",
        ground_floor_area: "",
        first_floor_area: "",
        garage_area: "",
        porch_area: "",
        alfresco_area: "",
        stories: 1,
        bedrooms: 4,
        bathrooms: 2,
        car_spaces: 1,
        price: "",
        image_url: ""
    });

    const handleChange = (e: any) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const data = await api.uploadFile(file, "floorplans");
            setFormData(prev => ({ ...prev, image_url: data.url }));
        } catch (err) {
            showAlert("Upload Failed", "There was an error uploading your file. Please try again.", "error");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            await api.createFloorPlan(formData, "mock-token");
            router.push("/admin/floor-plans");
        } catch (err) {
            showAlert("Error", "Failed to create floor plan. Please check your inputs.", "error");
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto pb-20 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">New Floor Plan</h2>
                    <p className="text-gray-400 text-sm mt-1">Create a reusable floor plan design</p>
                </div>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft size={18} className="inline mr-2" />
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-mimosa-dark text-white px-8 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-black transition-all shadow-xl disabled:opacity-50"
                    >
                        {saving ? "Saving..." : <><Save size={18} /> Save Floor Plan</>}
                    </button>
                </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Floor Plan Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Title</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-mimosa-dark/30 rounded-2xl px-5 py-4 text-gray-900 transition-all outline-none"
                            placeholder="e.g., The Hampton - Ground Floor"
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-mimosa-dark/30 rounded-2xl px-5 py-4 text-gray-900 transition-all outline-none"
                            placeholder="e.g., Ground Floor, First Floor"
                        />
                    </div>

                </div>

                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Stories</label>
                        <select
                            name="stories"
                            value={formData.stories}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-mimosa-dark/30 rounded-2xl px-5 py-4 text-gray-900 transition-all outline-none"
                        >
                            <option value={1}>Single Storey</option>
                            <option value={2}>Double Storey</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Bedrooms</label>
                        <select
                            name="bedrooms"
                            value={formData.bedrooms}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-mimosa-dark/30 rounded-2xl px-5 py-4 text-gray-900 transition-all outline-none"
                        >
                            {[3, 4, 5, 6].map(n => <option key={n} value={n}>{n} Bed</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Bathrooms</label>
                        <select
                            name="bathrooms"
                            value={formData.bathrooms}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-mimosa-dark/30 rounded-2xl px-5 py-4 text-gray-900 transition-all outline-none"
                        >
                            {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} Bath</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Car Spaces</label>
                        <select
                            name="car_spaces"
                            value={formData.car_spaces}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-mimosa-dark/30 rounded-2xl px-5 py-4 text-gray-900 transition-all outline-none"
                        >
                            <option value={1}>1 Car</option>
                            <option value={2}>2 Cars</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Min Frontage (m)</label>
                    <input
                        type="number"
                        step="0.01"
                        name="min_frontage"
                        value={formData.min_frontage}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-mimosa-dark/30 rounded-2xl px-5 py-4 text-gray-900 transition-all outline-none"
                    />
                </div>

                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Min Depth (m)</label>
                    <input
                        type="number"
                        step="0.01"
                        name="min_depth"
                        value={formData.min_depth}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-mimosa-dark/30 rounded-2xl px-5 py-4 text-gray-900 transition-all outline-none"
                    />
                </div>

                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Total Area (sq)</label>
                    <input
                        type="number"
                        step="0.01"
                        name="total_area"
                        value={formData.total_area}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-mimosa-dark/30 rounded-2xl px-5 py-4 text-gray-900 transition-all outline-none"
                    />
                </div>

                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
                    <div className="md:col-span-3">
                        <h4 className="font-bold text-gray-900">Area Analysis</h4>
                        <p className="text-xs text-gray-400">Breakdown of floor plan areas</p>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Ground Floor (sqm)</label>
                        <input
                            type="number"
                            step="0.01"
                            name="ground_floor_area"
                            value={formData.ground_floor_area}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-mimosa-dark/30 rounded-2xl px-5 py-4 text-gray-900 transition-all outline-none"
                        />
                    </div>

                    {Number(formData.stories) > 1 && (
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">First Floor (sqm)</label>
                            <input
                                type="number"
                                step="0.01"
                                name="first_floor_area"
                                value={formData.first_floor_area}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-mimosa-dark/30 rounded-2xl px-5 py-4 text-gray-900 transition-all outline-none"
                            />
                        </div>
                    )}

                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Garage (sqm)</label>
                        <input
                            type="number"
                            step="0.01"
                            name="garage_area"
                            value={formData.garage_area}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-mimosa-dark/30 rounded-2xl px-5 py-4 text-gray-900 transition-all outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Porch (sqm)</label>
                        <input
                            type="number"
                            step="0.01"
                            name="porch_area"
                            value={formData.porch_area}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-mimosa-dark/30 rounded-2xl px-5 py-4 text-gray-900 transition-all outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Alfresco (sqm)</label>
                        <input
                            type="number"
                            step="0.01"
                            name="alfresco_area"
                            value={formData.alfresco_area}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-mimosa-dark/30 rounded-2xl px-5 py-4 text-gray-900 transition-all outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Price ($)</label>
                    <input
                        type="number"
                        step="0.01"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-mimosa-dark/30 rounded-2xl px-5 py-4 text-gray-900 transition-all outline-none"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Floor Plan Image</label>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="w-full bg-gray-50 border border-dashed border-gray-200 hover:border-mimosa-dark rounded-2xl px-5 py-8 flex flex-col items-center justify-center gap-3 transition-all"
                    >
                        <Upload className="text-gray-400" size={32} />
                        <span className="text-gray-600 font-medium">
                            {uploading ? "Uploading..." : formData.image_url ? "Change Image" : "Upload Floor Plan Image"}
                        </span>
                    </button>
                    {formData.image_url && (
                        <div className="mt-4 rounded-2xl overflow-hidden border border-gray-200">
                            <img src={getFullUrl(formData.image_url)} alt="Preview" className="w-full" />
                        </div>
                    )}
                </div>
            </div>
        </form>

    );
}
