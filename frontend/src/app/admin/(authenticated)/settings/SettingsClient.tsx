"use client";

import { useState, useEffect } from "react";
import { api, getFullUrl } from "@/services/api";
import {
    Save,
    Mail,
    ShieldCheck,
    Bell,
    Globe,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Info,
    FileText,
    Upload,
    Trash2,
    Plus,
    ChevronDown,
    Facebook,
    Instagram,
    Linkedin,
    Twitter,
    Phone,
    MapPin,
    Share2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsClient() {
    const [settings, setSettings] = useState<any>({
        admin_email: "",
        autoApproveReviews: false,
        inclusions_pdf_url: "",
        contact_phone: "",
        contact_email: "",
        contact_address: "",
        social_facebook: "",
        social_instagram: "",
        social_linkedin: "",
        social_twitter: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [expandedCategories, setExpandedCategories] = useState<number[]>([0]);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const data: any = await api.getSettings("mock-token");
            setSettings({
                admin_email: data.admin_email || "",
                autoApproveReviews: data.autoApproveReviews === true || data.autoApproveReviews === 'true',
                inclusions_pdf_url: data.inclusions_pdf_url || "",
                standard_inclusions: data.standard_inclusions || { categories: [] },
                contact_phone: data.contact_phone || "1300 646 672",
                contact_email: data.contact_email || "info@mitrahomes.com.au",
                contact_address: data.contact_address || "123 Example Street, Melbourne VIC 3000",
                social_facebook: data.social_facebook || "#",
                social_instagram: data.social_instagram || "#",
                social_linkedin: data.social_linkedin || "#",
                social_twitter: data.social_twitter || "#",
            });
        } catch (err) {
            console.error("Failed to load settings", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (key: string, value: any) => {
        setSaving(true);
        setMessage(null);
        try {
            await api.updateSetting(key, value, "mock-token");
            setSettings((prev: any) => ({ ...prev, [key]: value }));
            setMessage({ type: 'success', text: 'Setting updated successfully!' });

            // Clear success message after 3s
            setTimeout(() => setMessage(null), 3000);
        } catch (err: any) {
            console.error("Failed to update setting", err);
            setMessage({ type: 'error', text: err.message || 'Failed to update setting' });
        } finally {
            setSaving(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSaving(true);
        try {
            const data = await api.uploadFile(file, "documents");
            handleSave('inclusions_pdf_url', data.url);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to upload PDF' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-mimosa-gold" size={48} />
            </div>
        );
    }

    return (
        <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Header section with optional status message */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight italic">System <span className="text-mimosa-gold">Settings</span></h1>
                    <p className="text-gray-500 font-medium">Manage global application configurations and notification preferences.</p>
                </div>

                {message && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                            }`}
                    >
                        {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                        {message.text}
                    </motion.div>
                )}
            </div>

            <div className="grid grid-cols-1 gap-6">

                {/* Email Notifications Card */}
                <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                            <Mail size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Email Notifications</h3>
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Admin Recipient Configuration</p>
                        </div>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="space-y-4">
                            <label className="text-sm font-bold text-gray-700 block">Administrator Contact Email</label>
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="relative flex-1 group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-mimosa-gold transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="admin@mitrahomes.com.au"
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-mimosa-gold focus:ring-4 focus:ring-mimosa-gold/5 transition-all font-medium text-gray-900 shadow-inner"
                                        value={settings.admin_email}
                                        onChange={(e) => setSettings({ ...settings, admin_email: e.target.value })}
                                    />
                                </div>
                                <button
                                    onClick={() => handleSave('admin_email', settings.admin_email)}
                                    disabled={saving}
                                    className="bg-mimosa-dark text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl shadow-mimosa-dark/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                                >
                                    {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                    Update
                                </button>
                            </div>
                            <div className="flex items-start gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider bg-gray-50/50 p-3 rounded-lg">
                                <Info size={14} className="mt-0.5 text-blue-400" />
                                <p>All new enquiries from the website (Contact, Quote, Mporium) will be sent to this address.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Standard Inclusions Card */}
                <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex items-center gap-4">
                        <div className="p-3 bg-mimosa-gold/10 text-mimosa-gold rounded-2xl">
                            <FileText size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Standard Inclusions Management</h3>
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Manage inclusion categories and items</p>
                        </div>
                    </div>
                    <div className="p-8 space-y-8">
                        {/* Categories List */}
                        <div className="space-y-6">
                            {(settings.standard_inclusions?.categories || []).map((category: any, cIndex: number) => {
                                const isExpanded = expandedCategories.includes(cIndex);
                                return (
                                    <div key={cIndex} className="bg-gray-50 rounded-[24px] border border-gray-100 overflow-hidden group/cat transition-all duration-300">
                                        <div
                                            className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-100/50 transition-colors"
                                            onClick={() => {
                                                setExpandedCategories(prev =>
                                                    prev.includes(cIndex) ? prev.filter(i => i !== cIndex) : [...prev, cIndex]
                                                );
                                            }}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Category Title</span>
                                                    <h4 className="font-bold text-gray-900 uppercase tracking-tight">{category.title || "UNTITLED CATEGORY"}</h4>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const newCategories = [...settings.standard_inclusions.categories];
                                                        newCategories.splice(cIndex, 1);
                                                        handleSave('standard_inclusions', { ...settings.standard_inclusions, categories: newCategories });
                                                    }}
                                                    className="p-2 text-gray-300 hover:text-red-500 bg-white rounded-xl shadow-sm opacity-0 group-hover/cat:opacity-100 transition-all font-bold text-xs"
                                                >
                                                    Delete
                                                </button>
                                                <div className={`p-2 bg-white rounded-xl shadow-sm transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                                    <ChevronDown size={18} className="text-gray-500" />
                                                </div>
                                            </div>
                                        </div>

                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                                >
                                                    <div className="p-6 pt-0 border-t border-gray-100 bg-white">
                                                        <div className="space-y-6 pt-6">
                                                            <div>
                                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Edit Category Title</label>
                                                                <input
                                                                    type="text"
                                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-mimosa-gold font-bold uppercase"
                                                                    value={category.title}
                                                                    onChange={(e) => {
                                                                        const newCategories = [...settings.standard_inclusions.categories];
                                                                        newCategories[cIndex].title = e.target.value;
                                                                        setSettings({ ...settings, standard_inclusions: { ...settings.standard_inclusions, categories: newCategories } });
                                                                    }}
                                                                    onBlur={() => handleSave('standard_inclusions', settings.standard_inclusions)}
                                                                />
                                                            </div>

                                                            <div className="space-y-2">
                                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Inclusion Items ({category.items?.length || 0})</label>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                    {(category.items || []).map((item: string, iIndex: number) => (
                                                                        <div key={iIndex} className="flex gap-2">
                                                                            <input
                                                                                type="text"
                                                                                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-mimosa-gold font-medium"
                                                                                value={item}
                                                                                onChange={(e) => {
                                                                                    const newCategories = [...settings.standard_inclusions.categories];
                                                                                    newCategories[cIndex].items[iIndex] = e.target.value;
                                                                                    setSettings({ ...settings, standard_inclusions: { ...settings.standard_inclusions, categories: newCategories } });
                                                                                }}
                                                                                onBlur={() => handleSave('standard_inclusions', settings.standard_inclusions)}
                                                                            />
                                                                            <button
                                                                                onClick={() => {
                                                                                    const newCategories = [...settings.standard_inclusions.categories];
                                                                                    newCategories[cIndex].items.splice(iIndex, 1);
                                                                                    handleSave('standard_inclusions', { ...settings.standard_inclusions, categories: newCategories });
                                                                                }}
                                                                                className="p-2 text-gray-300 hover:text-red-500"
                                                                            >
                                                                                <Trash2 size={14} />
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                    <button
                                                                        onClick={() => {
                                                                            const newCategories = [...settings.standard_inclusions.categories];
                                                                            newCategories[cIndex].items.push("");
                                                                            setSettings({ ...settings, standard_inclusions: { ...settings.standard_inclusions, categories: newCategories } });
                                                                        }}
                                                                        className="flex items-center justify-center gap-2 p-2 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-mimosa-gold hover:text-mimosa-gold transition-all text-xs font-bold"
                                                                    >
                                                                        <Plus size={14} />
                                                                        Add Item
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}

                            <button
                                onClick={() => {
                                    const newCategories = [...(settings.standard_inclusions?.categories || []), { title: "NEW CATEGORY", items: [""] }];
                                    handleSave('standard_inclusions', { ...settings.standard_inclusions, categories: newCategories });
                                }}
                                className="w-full py-4 border-2 border-dashed border-gray-200 rounded-[24px] text-gray-400 hover:border-mimosa-gold hover:text-mimosa-gold hover:bg-mimosa-gold/5 transition-all font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2"
                            >
                                <Plus size={18} />
                                Add New Category
                            </button>
                        </div>

                        <div className="pt-8 border-t border-gray-100">
                            <label className="text-sm font-bold text-gray-700 block mb-4">Standard Inclusions PDF Download</label>
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                {settings.inclusions_pdf_url ? (
                                    <div className="flex-1 w-full bg-gray-50 rounded-2xl p-6 border border-gray-100 flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-red-50 text-red-500 rounded-xl">
                                                <FileText size={24} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">standard-inclusions.pdf</p>
                                                <a
                                                    href={getFullUrl(settings.inclusions_pdf_url)}
                                                    target="_blank"
                                                    className="text-xs text-mimosa-gold font-bold uppercase tracking-wider hover:underline"
                                                >
                                                    View Document
                                                </a>
                                            </div>
                                        </div>
                                        <label className="cursor-pointer bg-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-gray-200 hover:border-mimosa-gold transition-all shadow-sm">
                                            Replace
                                            <input type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
                                        </label>
                                    </div>
                                ) : (
                                    <label className="w-full bg-gray-50 border-2 border-dashed border-gray-100 hover:border-mimosa-gold hover:bg-white rounded-[28px] p-12 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 group">
                                        <div className="p-5 bg-white rounded-2xl shadow-sm text-gray-400 group-hover:text-mimosa-gold transition-colors">
                                            <Upload size={32} />
                                        </div>
                                        <div className="text-center">
                                            <p className="font-bold text-gray-900">Upload Standard Inclusions PDF</p>
                                            <p className="text-xs text-gray-400 font-medium">This PDF will be linked for download</p>
                                        </div>
                                        <input type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Review Settings Card */}
                <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Review Moderation</h3>
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Public Testimonial Governance</p>
                        </div>
                    </div>
                    <div className="p-8">
                        <div className="flex items-center justify-between p-6 bg-gray-50/50 rounded-3xl border border-gray-100 hover:border-mimosa-gold/30 transition-all group">
                            <div className="space-y-1">
                                <h4 className="font-bold text-gray-900">Auto-Approve Public Reviews</h4>
                                <p className="text-sm text-gray-500 font-medium">When enabled, reviews submitted by users will appear instantly without admin review.</p>
                            </div>
                            <button
                                onClick={() => handleSave('autoApproveReviews', !settings.autoApproveReviews)}
                                disabled={saving}
                                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ring-offset-2 focus:ring-2 focus:ring-mimosa-gold ${settings.autoApproveReviews ? 'bg-green-500' : 'bg-gray-200'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${settings.autoApproveReviews ? 'translate-x-[1.6rem]' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Contact Information Card */}
                <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex items-center gap-4">
                        <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
                            <Phone size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Contact Information</h3>
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Public Contact Details (Header/Footer)</p>
                        </div>
                    </div>
                    <div className="p-8 space-y-8">
                        {/* Phone Number */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700 block">Public Phone Number</label>
                            <div className="flex gap-4">
                                <div className="relative flex-1 group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-mimosa-gold transition-colors">
                                        <Phone size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="1300 000 000"
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-mimosa-gold transition-all font-medium text-gray-900 shadow-inner"
                                        value={settings.contact_phone}
                                        onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                                    />
                                </div>
                                <button
                                    onClick={() => handleSave('contact_phone', settings.contact_phone)}
                                    disabled={saving}
                                    className="bg-mimosa-dark text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                                >
                                    {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                    Update
                                </button>
                            </div>
                        </div>

                        {/* Public Email */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700 block">Public Contact Email</label>
                            <div className="flex gap-4">
                                <div className="relative flex-1 group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-mimosa-gold transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="info@mitrahomes.com.au"
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-mimosa-gold transition-all font-medium text-gray-900 shadow-inner"
                                        value={settings.contact_email}
                                        onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                                    />
                                </div>
                                <button
                                    onClick={() => handleSave('contact_email', settings.contact_email)}
                                    disabled={saving}
                                    className="bg-mimosa-dark text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                                >
                                    {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                    Update
                                </button>
                            </div>
                        </div>

                        {/* Physical Address */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700 block">Physical Address</label>
                            <div className="flex gap-4">
                                <div className="relative flex-1 group">
                                    <div className="absolute inset-y-0 left-0 pl-4 pt-4 items-start pointer-events-none text-gray-400 group-focus-within:text-mimosa-gold transition-colors">
                                        <MapPin size={18} />
                                    </div>
                                    <textarea
                                        placeholder="123 Example Street, Melbourne VIC 3000"
                                        rows={2}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-mimosa-gold transition-all font-medium text-gray-900 shadow-inner resize-none"
                                        value={settings.contact_address}
                                        onChange={(e) => setSettings({ ...settings, contact_address: e.target.value })}
                                    />
                                </div>
                                <button
                                    onClick={() => handleSave('contact_address', settings.contact_address)}
                                    disabled={saving}
                                    className="bg-mimosa-dark text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 h-fit"
                                >
                                    {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Media Links Card */}
                <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex items-center gap-4">
                        <div className="p-3 bg-pink-50 text-pink-600 rounded-2xl">
                            <Share2 size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Social Media Links</h3>
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Public Profiles (Footer)</p>
                        </div>
                    </div>
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            { id: 'social_facebook', label: 'Facebook URL', icon: Facebook },
                            { id: 'social_instagram', label: 'Instagram URL', icon: Instagram },
                            { id: 'social_linkedin', label: 'LinkedIn URL', icon: Linkedin },
                            { id: 'social_twitter', label: 'Twitter URL', icon: Twitter },
                        ].map((social) => (
                            <div key={social.id} className="space-y-3">
                                <label className="text-sm font-bold text-gray-700 block">{social.label}</label>
                                <div className="flex gap-4">
                                    <div className="relative flex-1 group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-mimosa-gold transition-colors">
                                            <social.icon size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="https://..."
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-mimosa-gold transition-all font-medium text-gray-900 shadow-inner"
                                            value={settings[social.id]}
                                            onChange={(e) => setSettings({ ...settings, [social.id]: e.target.value })}
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleSave(social.id, settings[social.id])}
                                        disabled={saving}
                                        className="bg-mimosa-dark text-white p-4 rounded-full font-black uppercase text-xs tracking-widest hover:bg-black transition-all shadow-xl active:scale-95 disabled:opacity-50"
                                    >
                                        {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
