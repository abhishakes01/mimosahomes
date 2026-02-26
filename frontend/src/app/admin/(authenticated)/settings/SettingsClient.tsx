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
    Upload
} from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsClient() {
    const [settings, setSettings] = useState<any>({
        admin_email: "",
        autoApproveReviews: false,
        inclusions_pdf_url: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const data: any = await api.getSettings("mock-token");
            setSettings({
                admin_email: data.admin_email || "",
                autoApproveReviews: data.autoApproveReviews === true || data.autoApproveReviews === 'true',
                inclusions_pdf_url: data.inclusions_pdf_url || ""
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
        <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

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
                            <h3 className="font-bold text-gray-900">Build a Quote Resources</h3>
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Standard Inclusions Document</p>
                        </div>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="space-y-4">
                            <label className="text-sm font-bold text-gray-700 block">Standard Inclusions PDF</label>

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
                                            <p className="text-xs text-gray-400 font-medium">PDF files only, max 5MB</p>
                                        </div>
                                        <input type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
                                    </label>
                                )}
                            </div>

                            <div className="flex items-start gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider bg-gray-50/50 p-3 rounded-lg">
                                <Info size={14} className="mt-0.5 text-blue-400" />
                                <p>This document will be displayed in the Step 2 "Inclusions" modal on the Build a Quote page.</p>
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
            </div>
        </div>
    );
}
