"use client";

import { useState, useEffect, useRef, use } from "react";
import { api, getFullUrl } from "@/services/api";
import { Plus, Search, Edit, Trash2, ArrowLeft, X, Upload, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUI } from "@/context/UIContext";

export default function CategoryDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { showAlert, showConfirm } = useUI();
    const [category, setCategory] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [editingUpgrade, setEditingUpgrade] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: "",
        price: 0,
        description: "",
        is_standard: false,
        image_url: "",
        is_active: true
    });

    // File Upload State
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const loadData = async () => {
        try {
            setLoading(true);
            // We can reuse getUpgradeCategories and filter, or fetch specifically if endpoint existed
            // For now, let's just fetch all categories and find the one we need.
            const categories = await api.getUpgradeCategories() as any[];
            const foundCategory = categories.find((c: any) => c.id === id);

            if (foundCategory) {
                setCategory(foundCategory);
            } else {
                showAlert("Error", "Category not found", "error");
                router.push("/admin/upgrades");
            }
        } catch (error) {
            console.error("Failed to load data", error);
            showAlert("Error", "Failed to load category details", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            loadData();
        }
    }, [id]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredUpgrades = category?.upgrades?.filter((upgrade: any) =>
        upgrade.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const handleDelete = async (upgradeId: string) => {
        showConfirm({
            title: "Delete Upgrade",
            message: "Are you sure you want to delete this upgrade item?",
            onConfirm: async () => {
                try {
                    await api.deleteUpgrade(upgradeId, "mock-token");
                    showAlert("Deleted", "Upgrade has been deleted.", "success");
                    loadData();
                } catch (error) {
                    showAlert("Error", "Failed to delete upgrade.", "error");
                }
            }
        });
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const response: any = await api.uploadFile(file, "upgrades");
            setFormData(prev => ({ ...prev, image_url: response.path || response.url }));
        } catch (error) {
            console.error("Upload failed", error);
            showAlert("Error", "Failed to upload image", "error");
        } finally {
            setUploading(false);
        }
    };

    const openModal = (upgrade?: any) => {
        if (upgrade) {
            setEditingUpgrade(upgrade);
            setFormData({
                name: upgrade.name,
                price: upgrade.price,
                description: upgrade.description || "",
                is_standard: upgrade.is_standard,
                image_url: upgrade.image_url || "",
                is_active: upgrade.is_active
            });
        } else {
            setEditingUpgrade(null);
            setFormData({
                name: "",
                price: 0,
                description: "",
                is_standard: false,
                image_url: "",
                is_active: true
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                category_id: category.id
            };

            if (editingUpgrade) {
                await api.updateUpgrade(editingUpgrade.id, payload, "mock-token");
                showAlert("Success", "Upgrade updated successfully.", "success");
            } else {
                await api.createUpgrade(payload, "mock-token");
                showAlert("Success", "Upgrade created successfully.", "success");
            }
            setShowModal(false);
            loadData();
        } catch (error) {
            showAlert("Error", "Failed to save upgrade.", "error");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!category) return null;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col gap-6">
                <Link
                    href="/admin/upgrades"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-black transition-colors font-medium text-sm"
                >
                    <ArrowLeft size={16} />
                    Back to Categories
                </Link>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                                {category.group}
                            </span>
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{category.name}</h1>
                        </div>
                        <p className="text-gray-500 mt-2">Manage upgrade options for this category.</p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-colors shadow-sm font-medium"
                    >
                        <Plus size={18} />
                        Add Upgrade Item
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 max-w-md">
                <Search size={20} className="text-gray-400" />
                <input
                    type="text"
                    placeholder="Search upgrades..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="flex-grow outline-none text-gray-600 placeholder-gray-400"
                />
            </div>

            {/* Upgrades List */}
            {filteredUpgrades.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <p className="text-gray-500 font-medium">No upgrades found in this category.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredUpgrades.map((upgrade: any) => (
                        <div key={upgrade.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden group">
                            {/* Image */}
                            <div className="relative h-48 bg-gray-50">
                                {upgrade.image_url ? (
                                    <Image
                                        src={getFullUrl(upgrade.image_url)}
                                        alt={upgrade.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-300">
                                        No Image
                                    </div>
                                )}

                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm p-1 rounded-lg shadow-sm">
                                    <button
                                        onClick={() => openModal(upgrade)}
                                        className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded-md transition-colors"
                                    >
                                        <Edit size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(upgrade.id)}
                                        className="p-1.5 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>

                                {upgrade.is_standard && (
                                    <div className="absolute top-2 left-2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">
                                        Standard
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="font-bold text-gray-900 mb-1">{upgrade.name}</h3>
                                <p className="text-sm text-gray-500 line-clamp-2 min-h-[2.5em] mb-3">{upgrade.description || "No description"}</p>

                                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                    <span className={`font-bold ${upgrade.price > 0 ? 'text-gray-900' : 'text-green-600'}`}>
                                        {upgrade.price > 0 ? `+ $${upgrade.price.toLocaleString()}` : "Included"}
                                    </span>
                                    <span className={`w-2 h-2 rounded-full ${upgrade.is_active ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">
                                {editingUpgrade ? "Edit Upgrade" : "New Upgrade"}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Upgrade Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-black focus:ring-0 outline-none text-sm placeholder-gray-400"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price Adjustment</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-gray-500 text-sm">$</span>
                                        <input
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                                            className="w-full p-2.5 pl-7 rounded-xl border border-gray-200 focus:border-black focus:ring-0 outline-none text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center pt-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.is_standard ? 'bg-black border-black text-white' : 'border-gray-300 bg-white'}`}>
                                            {formData.is_standard && <Check size={12} />}
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={formData.is_standard}
                                            onChange={(e) => setFormData({ ...formData, is_standard: e.target.checked })}
                                        />
                                        <span className="text-sm font-medium text-gray-700">Is Standard?</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:border-black focus:ring-0 outline-none text-sm h-24 resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                                <div className="flex items-start gap-4">
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-gray-50 transition-colors relative overflow-hidden"
                                    >
                                        {formData.image_url ? (
                                            <Image
                                                src={getFullUrl(formData.image_url)}
                                                alt="Preview"
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <>
                                                <Upload size={20} className="text-gray-400" />
                                                <span className="text-[10px] text-gray-400">Upload</span>
                                            </>
                                        )}
                                        {uploading && (
                                            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-grow pt-2">
                                        <p className="text-xs text-gray-500 mb-2">Upload a high-quality image of the upgrade option.</p>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            className="hidden"
                                            onChange={handleUpload}
                                            accept="image/*"
                                        />
                                        {formData.image_url && (
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, image_url: "" })}
                                                className="text-xs text-red-500 hover:text-red-600 font-medium"
                                            >
                                                Remove Image
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2.5 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
                                >
                                    Save Upgrade
                                </button>
                            </div>
                        </form>
                    </div>
                </div >
            )
            }
        </div >
    );
}
