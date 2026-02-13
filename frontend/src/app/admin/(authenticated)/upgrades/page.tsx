"use client";

import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { Plus, Search, Edit, Trash2, ChevronRight, X, Settings } from "lucide-react";
import Link from "next/link";
import { useUI } from "@/context/UIContext";

export default function UpgradesPage() {
    const { showAlert, showConfirm } = useUI();
    const [categories, setCategories] = useState<any[]>([]);
    const [groups, setGroups] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Category Modal State
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [categoryFormData, setCategoryFormData] = useState({ name: "", group_id: "" });

    // Group Modal State
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [editingGroup, setEditingGroup] = useState<any>(null);
    const [groupFormData, setGroupFormData] = useState({ name: "", order: 0 });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const groupsData = await api.getUpgradeGroups() as any[];
            setGroups(groupsData);

            const categoriesData = await api.getUpgradeCategories() as any[];
            setCategories(categoriesData);
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        groups.find(g => g.id === category.group_id)?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteCategory = async (id: string) => {
        showConfirm({
            title: "Delete Category",
            message: "Are you sure you want to delete this category? All associated upgrades will also be deleted.",
            onConfirm: async () => {
                try {
                    await api.deleteUpgradeCategory(id, "mock-token");
                    showAlert("Deleted", "Category has been deleted.", "success");
                    loadData();
                } catch (error) {
                    showAlert("Error", "Failed to delete category.", "error");
                }
            }
        });
    };

    const openCategoryModal = (category?: any) => {
        if (category) {
            setEditingCategory(category);
            setCategoryFormData({ name: category.name, group_id: category.group_id });
        } else {
            setEditingCategory(null);
            setCategoryFormData({ name: "", group_id: groups[0]?.id || "" });
        }
        setShowModal(true);
    };

    const handleCategorySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const groupName = groups.find(g => g.id === categoryFormData.group_id)?.name || "";
            const payload = { ...categoryFormData, group: groupName };

            if (editingCategory) {
                await api.updateUpgradeCategory(editingCategory.id, payload, "mock-token");
                showAlert("Success", "Category updated successfully.", "success");
            } else {
                await api.createUpgradeCategory({
                    ...payload,
                    slug: categoryFormData.name.toLowerCase().replace(/ /g, '-')
                }, "mock-token");
                showAlert("Success", "Category created successfully.", "success");
            }
            setShowModal(false);
            loadData();
        } catch (error) {
            showAlert("Error", "Failed to save category.", "error");
        }
    };

    const openGroupModal = (group?: any) => {
        if (group) {
            setEditingGroup(group);
            setGroupFormData({ name: group.name, order: group.order });
        } else {
            setEditingGroup(null);
            setGroupFormData({ name: "", order: groups.length });
        }
        setShowGroupModal(true);
    };

    const handleGroupSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingGroup) {
                await api.updateUpgradeGroup(editingGroup.id, groupFormData, "mock-token");
                showAlert("Success", "Group updated successfully.", "success");
            } else {
                await api.createUpgradeGroup({
                    ...groupFormData,
                    slug: groupFormData.name.toLowerCase().replace(/ /g, '-')
                }, "mock-token");
                showAlert("Success", "Group created successfully.", "success");
            }
            setShowGroupModal(false);
            loadData();
        } catch (error) {
            showAlert("Error", "Failed to save group.", "error");
        }
    };

    const handleDeleteGroup = async (id: string, name: string) => {
        console.log("handleDeleteGroup called for:", name, id);
        showConfirm({
            title: "Delete Group",
            message: `Are you sure you want to delete the "${name}" group? This will also delete ALL categories and upgrades within this group. This action cannot be undone.`,
            onConfirm: async () => {
                console.log("onConfirm triggered for group:", id);
                try {
                    console.log("Calling api.deleteUpgradeGroup...");
                    const result = await api.deleteUpgradeGroup(id, "mock-token");
                    console.log("Delete result:", result);
                    showAlert("Deleted", "Group and its contents have been deleted.", "success");
                    loadData();
                } catch (error) {
                    console.error("Delete group failed:", error);
                    showAlert("Error", "Failed to delete group.", "error");
                }
            }
        });
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Upgrades</h1>
                    <p className="text-gray-500 mt-2">Manage sections, categories and items for the quote builder.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => openGroupModal()}
                        className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors shadow-sm font-medium"
                    >
                        <Plus size={18} />
                        New Group
                    </button>
                    <button
                        onClick={() => openCategoryModal()}
                        className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-colors shadow-sm font-medium"
                    >
                        <Plus size={18} />
                        New Category
                    </button>
                </div>
            </div>

            {/* Quick Groups Management (Table View) */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">Upgrade Groups (Sections)</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Settings size={14} />
                        These define the main scroll sections in the Quote Builder
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                            <tr>
                                <th className="px-6 py-4">Order</th>
                                <th className="px-6 py-4">Group Name</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {groups.map((group) => (
                                <tr key={group.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-gray-400">{group.order}</td>
                                    <td className="px-6 py-4 font-bold text-gray-900">{group.name}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-1">
                                            <button
                                                onClick={() => openGroupModal(group)}
                                                className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteGroup(group.id, group.name)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Search Categories */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 max-w-md">
                <Search size={20} className="text-gray-400" />
                <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="flex-grow outline-none text-gray-600 placeholder-gray-400"
                />
            </div>

            {/* Categories by Group */}
            {loading ? (
                <div className="flex justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
            ) : groups.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <p className="text-gray-500 font-medium">No groups found. Please create a group first.</p>
                </div>
            ) : (
                <div className="space-y-12">
                    {groups.map(group => {
                        const groupCategories = filteredCategories.filter(c => c.group_id === group.id);
                        if (groupCategories.length === 0 && searchTerm) return null;

                        return (
                            <div key={group.id} className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <h3 className="text-xl font-bold text-gray-900">{group.name}</h3>
                                    <div className="flex-grow h-px bg-gray-100"></div>
                                    <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">{groupCategories.length} Categories</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {groupCategories.map((category: any) => (
                                        <div key={category.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h4 className="font-bold text-gray-900 text-lg">{category.name}</h4>
                                                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{category.upgrades?.length || 0} items</span>
                                                </div>
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => openCategoryModal(category)}
                                                        className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteCategory(category.id)}
                                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            <Link
                                                href={`/admin/upgrades/${category.id}`}
                                                className="w-full mt-4 flex items-center justify-between text-sm font-bold text-black bg-gray-50 p-3 rounded-xl hover:bg-gray-100 transition-colors"
                                            >
                                                Manage Items
                                                <ChevronRight size={16} />
                                            </Link>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => {
                                            setEditingCategory(null);
                                            setCategoryFormData({ name: "", group_id: group.id });
                                            setShowModal(true);
                                        }}
                                        className="bg-gray-50/50 border-2 border-dashed border-gray-100 rounded-3xl p-6 flex flex-col items-center justify-center gap-2 text-gray-400 hover:bg-gray-50 hover:border-gray-200 transition-all group"
                                    >
                                        <div className="p-2 bg-white rounded-xl group-hover:scale-110 transition-transform shadow-sm">
                                            <Plus size={20} />
                                        </div>
                                        <span className="text-sm font-bold">Add to {group.name}</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Category Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">
                                {editingCategory ? "Edit Category" : "New Category"}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleCategorySubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Section (Group)</label>
                                <select
                                    value={categoryFormData.group_id}
                                    onChange={(e) => setCategoryFormData({ ...categoryFormData, group_id: e.target.value })}
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 outline-none text-sm"
                                    required
                                >
                                    <option value="" disabled>Select a group</option>
                                    {groups.map(g => (
                                        <option key={g.id} value={g.id}>{g.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                                <input
                                    type="text"
                                    value={categoryFormData.name}
                                    onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 outline-none text-sm placeholder-gray-400"
                                    placeholder="e.g. Roofing"
                                    required
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
                                >
                                    Save Category
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Group Modal */}
            {showGroupModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">
                                {editingGroup ? "Edit Group" : "New Group"}
                            </h3>
                            <button
                                onClick={() => setShowGroupModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleGroupSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                                <input
                                    type="text"
                                    value={groupFormData.name}
                                    onChange={(e) => setGroupFormData({ ...groupFormData, name: e.target.value })}
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 outline-none text-sm placeholder-gray-400"
                                    placeholder="e.g. Kitchen & Bath"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                                <input
                                    type="number"
                                    value={groupFormData.order}
                                    onChange={(e) => setGroupFormData({ ...groupFormData, order: parseInt(e.target.value) || 0 })}
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 outline-none text-sm"
                                    required
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowGroupModal(false)}
                                    className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
                                >
                                    Save Group
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
