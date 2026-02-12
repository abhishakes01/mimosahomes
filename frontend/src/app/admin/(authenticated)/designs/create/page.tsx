"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, getFullUrl } from "@/services/api";
import { motion } from "framer-motion";
import { MapPin, Save, CheckCircle2, Search, Home, Upload, X } from "lucide-react";
import { mapService } from "@/services/mapService";
import nextDynamic from 'next/dynamic';
const MapPicker = nextDynamic(() => import("@/components/admin/MapPicker"), { ssr: false });
import { useUI } from "@/context/UIContext";
import { useRef } from "react";


export const dynamic = 'force-dynamic';

export default function CreateListingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [facades, setFacades] = useState<any[]>([]);
    const [geocoding, setGeocoding] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        title: "",
        address: "",
        price: "",
        type: "house_land",
        status: "available",
        description: "",
        latitude: "",
        longitude: "",
        collection: "V_Collection",
        facade_id: "",
        floorplan_id: "",
        images: [] as string[]
    });

    useEffect(() => {
        loadFacades();
    }, []);

    const loadFacades = async () => {
        try {
            const data: any = await api.getFacades();
            setFacades(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updates = { ...prev, [name]: value };
            if (name === 'facade_id') {
                updates.floorplan_id = "";
            }
            return updates;
        });
    };

    const selectedFacade = facades.find(f => f.id === formData.facade_id);
    const selectedFloorPlan = selectedFacade?.floorplans?.find((fp: any) => fp.id === formData.floorplan_id);

    useEffect(() => {
        if (selectedFloorPlan) {
            setFormData(prev => ({
                ...prev,
                // These will be used for submission, matching the backend listing model
                // Note: We are auto-filling these from the selected floor plan
                bedrooms: selectedFloorPlan.bedrooms || 4,
                bathrooms: selectedFloorPlan.bathrooms || 2,
                cars: selectedFloorPlan.car_spaces || 2,
                house_size: selectedFloorPlan.total_area || "",
                // We keep land_size empty or manual if needed, but per request we removed the input
                // If land_size is required by backend, we might need to handle it or allow it logically.
                // For now assuming land_size is optional or we set a default/calculated logic if required.
                land_size: ""
            }));
        }
    }, [selectedFloorPlan]);

    const handleGeocode = async () => {
        if (!formData.address) return;
        setGeocoding(true);
        const result = await mapService.geocode(formData.address);
        if (result) {
            setFormData(prev => ({
                ...prev,
                latitude: result.lat.toString(),
                longitude: result.lon.toString()
            }));
        }
        setGeocoding(false);
    };

    const handleMapSelect = (lat: number, lng: number) => {
        setFormData(prev => ({
            ...prev,
            latitude: lat.toString(),
            longitude: lng.toString()
        }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        try {
            const uploadedUrls: string[] = [];
            for (let i = 0; i < files.length; i++) {
                const data = await api.uploadFile(files[i], "listings");
                uploadedUrls.push(data.url);
            }
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...uploadedUrls]
            }));
        } catch (err) {
            showAlert("Upload Failed", "There was an error uploading your file(s). Please try again.", "error");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const { showAlert } = useUI();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.createListing(formData, "mock-token");
            showAlert("Success", "Listing created successfully!", "success");
            router.push("/admin/designs");
        } catch (err: any) {
            console.error("Submission Error:", err);
            const errorMessage = err.response?.data?.details
                ? Array.isArray(err.response.data.details)
                    ? err.response.data.details.map((d: any) => d.message).join(", ")
                    : err.response.data.details
                : err.message || "Failed to create listing. Please check your inputs.";

            showAlert("Error", errorMessage, "error");
        } finally {
            setLoading(false);
        }
    };



    return (
        <form onSubmit={handleSubmit} className="max-w-6xl mx-auto pb-20 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">New House Listing</h2>
                    <p className="text-gray-400 text-sm mt-1">Create a new property listing</p>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-mimosa-dark text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-black transition-all shadow-xl disabled:opacity-50"
                >
                    {loading ? "Creating..." : <><Save size={20} /> Create Listing</>}
                </button>
            </div>

            {/* Facade Selection */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-mimosa-dark/10 rounded-xl flex items-center justify-center">
                        <Home className="text-mimosa-dark" size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Select Facade Design</h3>
                </div>

                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Facade</label>
                    <select
                        name="facade_id"
                        value={formData.facade_id}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-mimosa-dark/30 rounded-2xl px-5 py-4 text-gray-900 transition-all outline-none"
                    >
                        <option value="">Select a facade...</option>
                        {facades.map(facade => (
                            <option key={facade.id} value={facade.id}>
                                {facade.title} ({facade.floorplans?.length || 0} floor plans)
                            </option>
                        ))}
                    </select>
                </div>

                {selectedFacade && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedFacade.image_url && (
                                <div className="rounded-xl overflow-hidden">
                                    <img src={getFullUrl(selectedFacade.image_url)} alt={selectedFacade.title} className="w-full h-48 object-cover" />
                                    <p className="text-xs text-gray-500 mt-2 text-center">Facade Preview</p>
                                </div>
                            )}
                            <div>
                                <h4 className="font-bold text-gray-900 mb-2">Available Floor Plans:</h4>
                                <ul className="space-y-2 mb-4">
                                    {selectedFacade.floorplans?.map((fp: any) => (
                                        <li key={fp.id} className="text-sm text-gray-600">
                                            • {fp.title} - {fp.total_area || 'N/A'} sq
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Floor Plan</label>
                    <select
                        name="floorplan_id"
                        value={formData.floorplan_id}
                        onChange={handleChange}
                        required
                        disabled={!selectedFacade}
                        className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-mimosa-dark/30 rounded-2xl px-5 py-4 text-gray-900 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <option value="">{selectedFacade ? "Select a floor plan..." : "Select a facade first to see floor plans"}</option>
                        {selectedFacade?.floorplans?.map((fp: any) => (
                            <option key={fp.id} value={fp.id}>
                                {fp.title} ({fp.total_area || 'N/A'} sq)
                            </option>
                        ))}
                    </select>

                    {selectedFloorPlan && selectedFloorPlan.image_url && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <h4 className="font-bold text-gray-900 mb-2">Floor Plan Preview</h4>
                            <div className="rounded-xl overflow-hidden border border-gray-200 bg-white">
                                <img
                                    src={getFullUrl(selectedFloorPlan.image_url)}
                                    alt={selectedFloorPlan.title}
                                    className="w-full h-auto object-contain max-h-[400px]"
                                />
                            </div>
                            <div className="mt-2 text-center">
                                <span className="text-xl font-bold text-gray-900 block mb-4">{selectedFloorPlan.title}</span>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
                                    <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                                        <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Total Area</span>
                                        <span className="text-sm font-bold text-gray-900">{selectedFloorPlan.total_area || '-'} <span className="text-xs font-normal text-gray-500">sqm</span></span>
                                    </div>
                                    <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                                        <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">House Size</span>
                                        <span className="text-sm font-bold text-gray-900">{selectedFloorPlan.total_area || '-'} <span className="text-xs font-normal text-gray-500">sqm</span></span>
                                    </div>
                                    <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                                        <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Min Frontage</span>
                                        <span className="text-sm font-bold text-gray-900">{selectedFloorPlan.min_frontage || '-'}m</span>
                                    </div>
                                    <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                                        <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Min Depth</span>
                                        <span className="text-sm font-bold text-gray-900">{selectedFloorPlan.min_depth || '-'}m</span>
                                    </div>
                                    <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                                        <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Bedrooms</span>
                                        <span className="text-sm font-bold text-gray-900">{selectedFloorPlan.bedrooms || 4}</span>
                                    </div>
                                    <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                                        <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Bathrooms</span>
                                        <span className="text-sm font-bold text-gray-900">{selectedFloorPlan.bathrooms || 2}</span>
                                    </div>
                                    <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                                        <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Cars</span>
                                        <span className="text-sm font-bold text-gray-900">{selectedFloorPlan.car_spaces || 2}</span>
                                    </div>
                                    <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                                        <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Stories</span>
                                        <span className="text-sm font-bold text-gray-900">{selectedFloorPlan.stories || 1}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Basic Info */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6"
            >
                <h3 className="text-xl font-bold text-gray-900 mb-6">Property Details</h3>

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
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Address</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                name="address"
                                required
                                value={formData.address}
                                onChange={handleChange}
                                className="flex-1 bg-gray-50 border border-transparent focus:bg-white focus:border-mimosa-dark/30 rounded-2xl px-5 py-4 text-gray-900 transition-all outline-none"
                            />
                            <button
                                type="button"
                                onClick={handleGeocode}
                                disabled={geocoding}
                                className="px-6 py-4 bg-mimosa-dark text-white rounded-2xl font-bold hover:bg-black transition-all disabled:opacity-50"
                            >
                                {geocoding ? "..." : <><MapPin size={18} className="inline mr-2" />Geocode</>}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Price ($)</label>
                        <input
                            type="number"
                            name="price"
                            required
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-mimosa-dark/30 rounded-2xl px-5 py-4 text-gray-900 transition-all outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Type</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-mimosa-dark/30 rounded-2xl px-5 py-4 text-gray-900 transition-all outline-none"
                        >
                            <option value="house_land">House & Land</option>
                            <option value="ready_built">Ready Built</option>
                            <option value="display_home">Display Home</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Collection</label>
                        <select
                            name="collection"
                            value={formData.collection}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-mimosa-dark/30 rounded-2xl px-5 py-4 text-gray-900 transition-all outline-none"
                        >
                            <option value="V_Collection">V Collection</option>
                            <option value="M_Collection">M Collection</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-mimosa-dark/30 rounded-2xl px-5 py-4 text-gray-900 transition-all outline-none"
                        >
                            <option value="available">Available</option>
                            <option value="deposit_taken">Deposit Taken</option>
                            <option value="sold">Sold</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-mimosa-dark/30 rounded-2xl px-5 py-4 text-gray-900 transition-all outline-none resize-none"
                        />
                    </div>
                </div>
            </motion.div>

            {/* Image Gallery */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6"
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Property Images</h3>
                    <span className="text-sm text-gray-500">{formData.images.length} images uploaded</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((url, index) => (
                        <div key={index} className="relative group aspect-square rounded-2xl overflow-hidden border border-gray-100">
                            <img src={getFullUrl(url)} alt={`Property image ${index + 1}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="p-2 bg-white text-red-500 rounded-full hover:bg-red-50 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 hover:border-mimosa-dark rounded-2xl flex flex-col items-center justify-center gap-2 transition-all group"
                    >
                        <Upload className="text-gray-400 group-hover:text-mimosa-dark transition-colors" size={24} />
                        <span className="text-xs font-bold text-gray-400 group-hover:text-gray-600">
                            {uploading ? "Uploading..." : "Add Images"}
                        </span>
                    </button>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                        multiple
                    />
                </div>
            </motion.div>

            {/* Map */}
            {formData.latitude && formData.longitude && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
                >
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Location</h3>
                    <MapPicker
                        initialLat={parseFloat(formData.latitude)}
                        initialLng={parseFloat(formData.longitude)}
                        onSelect={handleMapSelect}
                    />
                </motion.div>
            )}
        </form>
    );
}
