"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, getFullUrl } from "@/services/api";
import { Upload, Save, ArrowLeft } from "lucide-react";
import { useUI } from "@/context/UIContext";

export default function CreateFacadePage() {
    const router = useRouter();
    const { showAlert } = useUI();
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [floorplans, setFloorplans] = useState<any[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        title: "",
        width: "",
        image_url: "",
        is_active: false,
        stories: 1,
        floorplan_ids: [] as string[]
    });

    useEffect(() => {
        loadFloorPlans();
    }, []);

    const loadFloorPlans = async () => {
        try {
            const data: any = await api.getFloorPlans();
            setFloorplans(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e: any) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFloorPlanToggle = (id: string) => {
        setFormData(prev => ({
            ...prev,
            floorplan_ids: prev.floorplan_ids.includes(id)
                ? prev.floorplan_ids.filter(fpId => fpId !== id)
                : [...prev.floorplan_ids, id]
        }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const data = await api.uploadFile(file, "facades");
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
            await api.createFacade(formData, "mock-token");
            router.push("/admin/facades");
        } catch (err) {
            showAlert("Error", "Failed to create facade. Please check your inputs.", "error");
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto pb-20 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">New Facade</h2>
                    <p className="text-gray-400 text-sm mt-1">Create a facade and assign floor plans</p>
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
                        {saving ? "Saving..." : <><Save size={18} /> Save Facade</>}
                    </button>
                </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Facade Details</h3>

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
                            placeholder="e.g., Modern Facade A"
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Width (meters)</label>
                        <input
                            type="number"
                            step="0.01"
                            name="width"
                            value={formData.width}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-mimosa-dark/30 rounded-2xl px-5 py-4 text-gray-900 transition-all outline-none"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Stories</label>
                        <select
                            name="stories"
                            value={formData.stories}
                            onChange={(e) => setFormData(prev => ({ ...prev, stories: parseInt(e.target.value) }))}
                            className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-mimosa-dark/30 rounded-2xl px-5 py-4 text-gray-900 transition-all outline-none"
                        >
                            <option value={1}>Single Story</option>
                            <option value={2}>Double Story</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-transparent hover:border-mimosa-dark/20 transition-all">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={formData.is_active}
                                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mimosa-dark"></div>
                        </label>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-900">Show in Quote Builder</span>
                            <span className="text-[10px] text-gray-400 font-medium">Enable to show in client flow</span>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Facade Image</label>
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
                                {uploading ? "Uploading..." : formData.image_url ? "Change Image" : "Upload Facade Image"}
                            </span>
                        </button>
                        {formData.image_url && (
                            <div className="mt-4 rounded-2xl overflow-hidden border border-gray-200">
                                <img src={getFullUrl(formData.image_url)} alt="Preview" className="w-full" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Assign Floor Plans</h3>
                <p className="text-sm text-gray-500 mb-4">Select which floor plans are compatible with this facade</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {floorplans.map(fp => (
                        <label
                            key={fp.id}
                            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center ${formData.floorplan_ids.includes(fp.id)
                                ? 'border-mimosa-dark bg-mimosa-dark/5'
                                : 'border-gray-100 hover:border-gray-200'
                                }`}
                        >
                            <input
                                type="checkbox"
                                checked={formData.floorplan_ids.includes(fp.id)}
                                onChange={() => handleFloorPlanToggle(fp.id)}
                                className="mr-3"
                            />
                            {fp.image_url && (
                                <img
                                    src={getFullUrl(fp.image_url)}
                                    alt={fp.title}
                                    className="w-48 h-32 object-cover rounded-xl mr-4"
                                />
                            )}
                            <div>
                                <span className="font-bold text-gray-900 block">{fp.title}</span>
                                <span className="text-sm text-gray-500">({fp.total_area || 'N/A'} sq)</span>
                            </div>
                        </label>
                    ))}
                </div>

                {floorplans.length === 0 && (
                    <p className="text-center text-gray-400 py-8">No floor plans available. Create floor plans first.</p>
                )}
            </div>
        </form>
    );
}
