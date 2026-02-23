"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api, getFullUrl } from "@/services/api";
import { Save, ArrowLeft, Loader2, Image as ImageIcon, Plus, Trash2, MapPin, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { mapService } from "@/services/mapService";
import nextDynamic from 'next/dynamic';
const MapPicker = nextDynamic(() => import("@/components/admin/MapPicker"), { ssr: false });

export default function PageEdit() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [pageTitle, setPageTitle] = useState("");
    const [content, setContent] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [locationSearch, setLocationSearch] = useState("");
    const [uploadingField, setUploadingField] = useState<string | null>(null);
    const [geocoding, setGeocoding] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        fetchPageData();
    }, [slug]);

    const fetchPageData = async () => {
        try {
            setLoading(true);
            const data: any = await api.getPageBySlug(slug);
            setPageTitle(data.title);
            setContent(data.content || {});
        } catch (error: any) {
            // If 404, we will just start with empty content and set a default title based on slug
            if (error.message.includes('404') || error.message.includes('not found')) {
                const defaultTitles: any = {
                    'about-us': 'About Us',
                    '50-year-structural-warranty': '50 Year Structural Warranty',
                    'procedure': 'Procedure',
                    'mporium': 'Mporium',
                    'partners': 'Partners',
                    'contact': 'Contact Us'
                };
                setPageTitle(defaultTitles[slug] || slug);
                setContent({});
            } else {
                console.error("Failed to fetch page:", error);
                showToast("Error loading page data", "error");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const token = localStorage.getItem('token') || ''; // Adjust if token logic differs
            await api.updatePage(slug, { title: pageTitle, content }, token);
            showToast("Page saved successfully!", "success");
            setTimeout(() => router.push('/admin/pages'), 1000);
        } catch (error) {
            console.error("Failed to save page:", error);
            showToast("Error saving page", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldPath: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploadingField(fieldPath);
            const res = await api.uploadFile(file, 'pages');

            // fieldPath could be "heroImage" or "commitments.0.image"
            if (fieldPath.includes('.')) {
                const parts = fieldPath.split('.');
                const root = parts[0];
                const index = parseInt(parts[1]);
                const prop = parts[2];

                const newArray = [...(content[root] || [])];
                newArray[index] = { ...newArray[index], [prop]: res.url };
                setContent({ ...content, [root]: newArray });
            } else {
                setContent({ ...content, [fieldPath]: res.url });
            }
        } catch (error) {
            console.error("Upload failed", error);
            showToast("Failed to upload image. Please check file type and size.", "error");
        } finally {
            setUploadingField(null);
            if (e.target) e.target.value = '';
        }
    };

    const updateNestedContent = (root: string, index: number, prop: string, value: any) => {
        const newArray = [...(content[root] || [])];
        if (!newArray[index]) newArray[index] = {};
        newArray[index] = { ...newArray[index], [prop]: value };
        setContent({ ...content, [root]: newArray });
    };

    const removeNestedItem = (root: string, index: number) => {
        const newArray = [...(content[root] || [])];
        newArray.splice(index, 1);
        setContent({ ...content, [root]: newArray });
    };

    const addNestedItem = (root: string, template: any) => {
        const newArray = [...(content[root] || []), template];
        setContent({ ...content, [root]: newArray });
    };

    const renderImageUploader = (label: string, fieldPath: string, currentUrl: string) => (
        <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">{label}</label>
            <div className={`relative border-2 border-dashed ${currentUrl ? 'border-[#1a3a4a]' : 'border-gray-200'} rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden transition-all group h-40`}>
                {uploadingField === fieldPath ? (
                    <div className="flex flex-col items-center text-gray-400">
                        <Loader2 className="w-8 h-8 animate-spin mb-2 text-[#0897b1]" />
                        <span className="text-xs font-bold uppercase tracking-widest">Uploading...</span>
                    </div>
                ) : currentUrl ? (
                    <>
                        <Image src={getFullUrl(currentUrl)} alt={label} fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-xs font-bold uppercase tracking-widest px-4 py-2 border border-white rounded-lg backdrop-blur-sm shadow-xl">Change Image</span>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center text-gray-400 group-hover:text-[#1a3a4a] transition-colors">
                        <ImageIcon className="w-8 h-8 mb-2" />
                        <span className="text-xs font-bold uppercase tracking-widest">Upload Image</span>
                    </div>
                )}
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, fieldPath)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploadingField === fieldPath}
                />
            </div>
        </div>
    );

    const handleMapSelect = (lat: number, lng: number) => {
        setContent({
            ...content,
            latitude: lat.toString(),
            longitude: lng.toString()
        });
    };

    const handleGeocode = async () => {
        const query = locationSearch || content.address;
        if (!query) {
            showToast("Please enter a location name or address first", "error");
            return;
        }
        setGeocoding(true);
        try {
            const result = await mapService.geocode(query);
            if (result) {
                setContent({
                    ...content,
                    latitude: result.lat.toString(),
                    longitude: result.lon.toString()
                });
                showToast("Location found!", "success");
            } else {
                showToast("Could not find location. Please try a more specific address or place name.", "error");
            }
        } catch (error) {
            showToast("Geocoding failed", "error");
        } finally {
            setGeocoding(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-[#0897b1]" size={40} />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-32">
            {/* Custom Toast Notification */}
            {toast && (
                <div className={`fixed bottom-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg font-medium text-sm transition-all flex items-center gap-2 ${toast.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                    {toast.type === 'success' ? (
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                    ) : (
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                    )}
                    {toast.message}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between sticky top-20 bg-gray-50/80 backdrop-blur-md py-4 z-40 border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <Link href="/admin/pages" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-all shadow-sm">
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Edit {pageTitle}</h1>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">/pages/{slug}</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-8 py-3 bg-[#1a3a4a] text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg disabled:opacity-50"
                >
                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    <span>Save Changes</span>
                </button>
            </div>

            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 space-y-12">

                {/* Global Hero Image for all pages */}
                {renderImageUploader("Hero Background Image", "heroImage", content.heroImage)}

                {/* ABOUT US SCHEMA */}
                {slug === 'about-us' && (
                    <div className="space-y-12">
                        <div className="space-y-6 pt-8 border-t border-gray-100">
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Introduction Section</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    {renderImageUploader("Intro Image", "introImage", content.introImage)}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Badge Text (e.g. 18+)</label>
                                            <input type="text" value={content.introBadgeText || ''} onChange={(e) => setContent({ ...content, introBadgeText: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#1a3a4a] outline-none" placeholder="18+" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Badge Label</label>
                                            <input type="text" value={content.introBadgeLabel || ''} onChange={(e) => setContent({ ...content, introBadgeLabel: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#1a3a4a] outline-none" placeholder="Years of Luxury Builders" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Tagline (Gold Text)</label>
                                        <input type="text" value={content.introTagline || ''} onChange={(e) => setContent({ ...content, introTagline: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#1a3a4a] outline-none" placeholder="Your journey starts here" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Main Title</label>
                                        <input type="text" value={content.introTitle || ''} onChange={(e) => setContent({ ...content, introTitle: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-lg font-black italic uppercase italic tracking-tight focus:border-[#1a3a4a] outline-none" placeholder="Mitra Homes is your premier..." />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Description</label>
                                        <textarea value={content.introDescription || ''} onChange={(e) => setContent({ ...content, introDescription: e.target.value })} rows={4} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#1a3a4a] outline-none" placeholder="At Mitra Homes, we specialize..." />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Benefits List</label>
                                    <button onClick={() => setContent({ ...content, introBenefits: [...(content.introBenefits || []), ""] })} className="text-xs font-bold text-[#0897b1] uppercase tracking-widest flex items-center gap-1">
                                        <Plus size={14} /> Add Benefit
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {(content.introBenefits || []).map((benefit: string, bIndex: number) => (
                                        <div key={bIndex} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={benefit}
                                                onChange={(e) => {
                                                    const newBenefits = [...content.introBenefits];
                                                    newBenefits[bIndex] = e.target.value;
                                                    setContent({ ...content, introBenefits: newBenefits });
                                                }}
                                                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#1a3a4a] outline-none"
                                            />
                                            <button onClick={() => {
                                                const newBenefits = content.introBenefits.filter((_: any, i: number) => i !== bIndex);
                                                setContent({ ...content, introBenefits: newBenefits });
                                            }} className="p-2 text-gray-300 hover:text-red-500">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Confidence Banner */}
                        <div className="space-y-6 pt-8 border-t border-gray-100">
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Confidence Commitment Banner</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Banner Title</label>
                                        <input type="text" value={content.confidenceTitle || ''} onChange={(e) => setContent({ ...content, confidenceTitle: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#1a3a4a] outline-none" placeholder="Our Build with Confidence Commitment" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Description</label>
                                        <textarea value={content.confidenceDesc || ''} onChange={(e) => setContent({ ...content, confidenceDesc: e.target.value })} rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#1a3a4a] outline-none" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Checkbox / Small Italic Text</label>
                                        <input type="text" value={content.confidenceCheckText || ''} onChange={(e) => setContent({ ...content, confidenceCheckText: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#1a3a4a] outline-none" placeholder="At Mitra Homes, our 50-year structural..." />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Section */}
                        <div className="space-y-6 pt-8 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Stats Section</h2>
                                <button onClick={() => addNestedItem('stats', { label: '', value: '', subValue: '' })} className="flex items-center gap-2 text-xs font-bold text-[#0897b1] hover:text-[#067a8f] uppercase tracking-widest">
                                    <Plus size={14} /> Add Stat
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {(content.stats || []).map((stat: any, index: number) => (
                                    <div key={index} className="bg-gray-50 p-6 rounded-2xl relative border border-gray-100 group space-y-4">
                                        <button onClick={() => removeNestedItem('stats', index)} className="absolute -top-2 -right-2 w-8 h-8 flex items-center justify-center bg-white text-gray-400 hover:text-red-500 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                            <Trash2 size={14} />
                                        </button>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Label (e.g. Display Homes)</label>
                                            <input type="text" value={stat.label || ''} onChange={(e) => updateNestedContent('stats', index, 'label', e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:border-[#1a3a4a] outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Value (e.g. 50+)</label>
                                            <input type="text" value={stat.value || ''} onChange={(e) => updateNestedContent('stats', index, 'value', e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:border-[#1a3a4a] outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Sub Value (Optional)</label>
                                            <input type="text" value={stat.subValue || ''} onChange={(e) => updateNestedContent('stats', index, 'subValue', e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:border-[#1a3a4a] outline-none" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Commitment Tabs */}
                        <div className="space-y-6 pt-8 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Our Commitment Tabs</h2>
                                <button onClick={() => addNestedItem('commitments', { title: '', content: '', image: '', badge: '' })} className="flex items-center gap-2 text-xs font-bold text-[#0897b1] hover:text-[#067a8f] uppercase tracking-widest">
                                    <Plus size={14} /> Add Commitment
                                </button>
                            </div>
                            <div className="space-y-8">
                                {(content.commitments || []).map((item: any, index: number) => (
                                    <div key={index} className="bg-gray-50 p-8 rounded-[32px] relative border border-gray-100 group">
                                        <button onClick={() => removeNestedItem('commitments', index)} className="absolute -top-2 -right-2 w-10 h-10 flex items-center justify-center bg-white text-gray-400 hover:text-red-500 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                            <Trash2 size={16} />
                                        </button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tab Title</label>
                                                    <input type="text" value={item.title || ''} onChange={(e) => updateNestedContent('commitments', index, 'title', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#1a3a4a] outline-none" />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Content</label>
                                                    <textarea value={item.content || ''} onChange={(e) => updateNestedContent('commitments', index, 'content', e.target.value)} rows={4} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#1a3a4a] outline-none" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                {renderImageUploader("Main Image", `commitments.${index}.image`, item.image)}
                                                {renderImageUploader("Badge Image (Optional)", `commitments.${index}.badge`, item.badge)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom CTA Section */}
                        <div className="space-y-6 pt-8 border-t border-gray-100">
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Bottom Call To Action</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    {renderImageUploader("CTA Background Image", "ctaImage", content.ctaImage)}
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">CTA Title</label>
                                        <input type="text" value={content.ctaTitle || ''} onChange={(e) => setContent({ ...content, ctaTitle: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-lg font-black italic uppercase tracking-tight focus:border-[#1a3a4a] outline-none" placeholder="Ready to Begin your Journey?" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">CTA Description</label>
                                        <textarea value={content.ctaDesc || ''} onChange={(e) => setContent({ ...content, ctaDesc: e.target.value })} rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#1a3a4a] outline-none" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* WARRANTY SCHEMA */}
                {slug === '50-year-structural-warranty' && (
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Hero Section</h2>
                            <div className="grid grid-cols-1 gap-6">
                                {renderImageUploader("Hero Background Image", "heroImage", content.heroImage)}
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Hero Title</label>
                                    <input
                                        type="text"
                                        value={content.heroTitle || ''}
                                        onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#1a3a4a] outline-none font-black italic uppercase"
                                        placeholder="50 YEAR STRUCTURAL WARRANTY"
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Hero Subtitle */}
                        <div className="space-y-4 pt-8 border-t border-gray-100">
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Introduction Section</h2>
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Main Warranty Text (Paragraphs)</label>
                                    <textarea
                                        value={content.mainText || ''}
                                        onChange={(e) => setContent({ ...content, mainText: e.target.value })}
                                        rows={8}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-sm focus:border-[#1a3a4a] focus:bg-white transition-colors outline-none"
                                        placeholder="Enter the main paragraphs describing the warranty..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Confidence Section */}
                        <div className="space-y-6 pt-8 border-t border-gray-100">
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Confidence Highlights</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Confidence Section Title</label>
                                    <input
                                        type="text"
                                        value={content.confidenceTitle || ''}
                                        onChange={(e) => setContent({ ...content, confidenceTitle: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#1a3a4a] outline-none font-bold uppercase"
                                        placeholder="Confidence That Moves In With You"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Confidence Items (List)</label>
                                        <button onClick={() => setContent({ ...content, confidenceItems: [...(content.confidenceItems || []), ""] })} className="text-xs font-bold text-[#0897b1] uppercase tracking-widest flex items-center gap-1">
                                            <Plus size={14} /> Add Item
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        {(content.confidenceItems || []).map((item: string, iIndex: number) => (
                                            <div key={iIndex} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={item}
                                                    onChange={(e) => {
                                                        const newItems = [...content.confidenceItems];
                                                        newItems[iIndex] = e.target.value;
                                                        setContent({ ...content, confidenceItems: newItems });
                                                    }}
                                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#1a3a4a] outline-none"
                                                />
                                                <button onClick={() => {
                                                    const newItems = content.confidenceItems.filter((_: any, i: number) => i !== iIndex);
                                                    setContent({ ...content, confidenceItems: newItems });
                                                }} className="p-2 text-gray-300 hover:text-red-500">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {renderImageUploader("Confidence Section Image", "confidenceImage", content.confidenceImage)}
                            </div>
                        </div>

                        {/* Stats Section */}
                        <div className="space-y-6 pt-8 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Stats Section</h2>
                                <button onClick={() => addNestedItem('stats', { label: '', value: '', subValue: '' })} className="flex items-center gap-2 text-xs font-bold text-[#0897b1] hover:text-[#067a8f] uppercase tracking-widest">
                                    <Plus size={14} /> Add Stat
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {(content.stats || []).map((stat: any, index: number) => (
                                    <div key={index} className="bg-gray-50 p-6 rounded-2xl relative border border-gray-100 group space-y-4">
                                        <button onClick={() => removeNestedItem('stats', index)} className="absolute -top-2 -right-2 w-8 h-8 flex items-center justify-center bg-white text-gray-400 hover:text-red-500 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                            <Trash2 size={14} />
                                        </button>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Label</label>
                                            <input type="text" value={stat.label || ''} onChange={(e) => updateNestedContent('stats', index, 'label', e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:border-[#1a3a4a] outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Value</label>
                                            <input type="text" value={stat.value || ''} onChange={(e) => updateNestedContent('stats', index, 'value', e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:border-[#1a3a4a] outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Sub Value</label>
                                            <input type="text" value={stat.subValue || ''} onChange={(e) => updateNestedContent('stats', index, 'subValue', e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:border-[#1a3a4a] outline-none" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Spotlight Section */}
                        <div className="space-y-6 pt-8 border-t border-gray-100">
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Homeowner Spotlight</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    {renderImageUploader("Spotlight Main Image", "spotlightImage", content.spotlightImage)}
                                    {renderImageUploader("Author Avatar", "spotlightAvatar", content.spotlightAvatar)}
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Headline (Gold Text)</label>
                                        <input type="text" value={content.spotlightHeadline || ''} onChange={(e) => setContent({ ...content, spotlightHeadline: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#1a3a4a] outline-none" placeholder="Don't just take our word for it" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Main Title</label>
                                        <input type="text" value={content.spotlightTitle || ''} onChange={(e) => setContent({ ...content, spotlightTitle: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-lg font-black italic uppercase tracking-tight focus:border-[#1a3a4a] outline-none" placeholder="Our Homeowners Say it Best" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Quote</label>
                                        <textarea value={content.spotlightQuote || ''} onChange={(e) => setContent({ ...content, spotlightQuote: e.target.value })} rows={4} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#1a3a4a] outline-none italic" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Author Name</label>
                                            <input type="text" value={content.spotlightAuthor || ''} onChange={(e) => setContent({ ...content, spotlightAuthor: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#1a3a4a] outline-none font-bold" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Author Title</label>
                                            <input type="text" value={content.spotlightAuthorTitle || ''} onChange={(e) => setContent({ ...content, spotlightAuthorTitle: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#1a3a4a] outline-none" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* PROCEDURE SCHEMA */}
                {slug === 'procedure' && (
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Hero Section</h2>
                            <div className="grid grid-cols-1 gap-6">
                                {renderImageUploader("Hero Background Image", "heroImage", content.heroImage)}
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Hero Title</label>
                                    <input
                                        type="text"
                                        value={content.heroTitle || ''}
                                        onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#1a3a4a] outline-none font-black italic uppercase"
                                        placeholder="PROCEDURE"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-gray-700">Procedure Introduction Text</label>
                            <textarea
                                value={content.introText || ''}
                                onChange={(e) => setContent({ ...content, introText: e.target.value })}
                                rows={6}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-sm focus:border-[#1a3a4a] focus:bg-white transition-colors outline-none"
                            />
                        </div>

                        {/* Procedure Steps Section */}
                        <div className="space-y-6 pt-8 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Building Procedure Steps</h2>
                                <button onClick={() => addNestedItem('steps', { title: '', description: '' })} className="flex items-center gap-2 text-xs font-bold text-[#0897b1] hover:text-[#067a8f] uppercase tracking-widest">
                                    <Plus size={14} /> Add Step
                                </button>
                            </div>
                            <div className="grid grid-cols-1 gap-6">
                                {(content.steps || []).map((step: any, index: number) => (
                                    <div key={index} className="bg-gray-50 p-6 rounded-2xl relative border border-gray-100 group space-y-4">
                                        <button onClick={() => removeNestedItem('steps', index)} className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 bg-white rounded-full shadow-sm">
                                            <Trash2 size={16} />
                                        </button>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                            <div className="md:col-span-1">
                                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-xl font-black text-[#1a3a4a] italic">
                                                    {index + 1}
                                                </div>
                                            </div>
                                            <div className="md:col-span-3 space-y-4">
                                                <div>
                                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Step Title</label>
                                                    <input type="text" value={step.title || ''} onChange={(e) => updateNestedContent('steps', index, 'title', e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-bold focus:border-[#1a3a4a] outline-none" />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Step Description</label>
                                                    <textarea value={step.description || ''} onChange={(e) => updateNestedContent('steps', index, 'description', e.target.value)} rows={3} className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:border-[#1a3a4a] outline-none" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Contact Form Section (Optional texts) */}
                        <div className="space-y-6 pt-8 border-t border-gray-100">
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Contact Section Override</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Contact Title</label>
                                    <input type="text" value={content.contactTitle || ''} onChange={(e) => setContent({ ...content, contactTitle: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#1a3a4a] outline-none" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Contact Headline</label>
                                    <input type="text" value={content.contactHeadline || ''} onChange={(e) => setContent({ ...content, contactHeadline: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#1a3a4a] outline-none" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* MPORIUM SCHEMA */}
                {slug === 'mporium' && (
                    <div className="space-y-12">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Visual Gallery (4 Images)</h2>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[0, 1, 2, 3].map((index) => (
                                    <div key={index}>
                                        {renderImageUploader(`Gallery Image ${index + 1}`, `gallery.${index}.url`, content.gallery?.[index]?.url)}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-gray-700">Video Embed URL (Optional)</label>
                            <input
                                type="text"
                                value={content.videoUrl || ''}
                                onChange={(e) => setContent({ ...content, videoUrl: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#1a3a4a] focus:bg-white transition-colors outline-none"
                                placeholder="URL to MP4 video"
                            />
                        </div>
                        <div className="space-y-6">
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Mporium Content & Hero</h2>
                            <div className="grid grid-cols-1 gap-6">
                                {renderImageUploader("Hero Background Image", "heroImage", content.heroImage)}
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Hero Title</label>
                                    <input
                                        type="text"
                                        value={content.heroTitle || ''}
                                        onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#1a3a4a] outline-none font-black italic uppercase"
                                        placeholder="MPORIUM - HOME DESIGN SHOWROOM"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">About Paragraphs</label>
                                        <button onClick={() => setContent({ ...content, paragraphs: [...(content.paragraphs || []), ""] })} className="text-xs font-bold text-[#0897b1] uppercase tracking-widest flex items-center gap-1">
                                            <Plus size={14} /> Add Paragraph
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {(content.paragraphs || []).map((para: string, pIndex: number) => (
                                            <div key={pIndex} className="flex gap-2">
                                                <textarea
                                                    value={para}
                                                    onChange={(e) => {
                                                        const newParas = [...content.paragraphs];
                                                        newParas[pIndex] = e.target.value;
                                                        setContent({ ...content, paragraphs: newParas });
                                                    }}
                                                    rows={3}
                                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#1a3a4a] outline-none font-medium"
                                                />
                                                <button onClick={() => {
                                                    const newParas = content.paragraphs.filter((_: any, i: number) => i !== pIndex);
                                                    setContent({ ...content, paragraphs: newParas });
                                                }} className="p-2 text-gray-300 hover:text-red-500">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Virtual Experience</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Video Overlay Title</label>
                                    <input
                                        type="text"
                                        value={content.videoLabel || ''}
                                        onChange={(e) => setContent({ ...content, videoLabel: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#1a3a4a] outline-none font-bold uppercase"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Video Overlay Subtitle</label>
                                    <input
                                        type="text"
                                        value={content.videoSubtitle || ''}
                                        onChange={(e) => setContent({ ...content, videoSubtitle: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#1a3a4a] outline-none font-medium"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Showroom Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Opening Hours</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <input type="text" value={content.hours?.monFri || ''} onChange={(e) => setContent({ ...content, hours: { ...content.hours, monFri: e.target.value } })} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm" placeholder="Mon-Fri (e.g. By Appointment Only)" />
                                        </div>
                                        <div>
                                            <input type="text" value={content.hours?.sat || ''} onChange={(e) => setContent({ ...content, hours: { ...content.hours, sat: e.target.value } })} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm" placeholder="Saturday" />
                                        </div>
                                        <div>
                                            <input type="text" value={content.hours?.sun || ''} onChange={(e) => setContent({ ...content, hours: { ...content.hours, sun: e.target.value } })} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm" placeholder="Sunday" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Location & Contact</h3>
                                    <div className="space-y-3">
                                        <textarea value={content.location || ''} onChange={(e) => setContent({ ...content, location: e.target.value })} rows={2} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm" placeholder="Full Address" />
                                        <input type="text" value={content.phone || ''} onChange={(e) => setContent({ ...content, phone: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm" placeholder="Phone (e.g. 1300 MITRA)" />
                                        <input type="text" value={content.phoneSub || ''} onChange={(e) => setContent({ ...content, phoneSub: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm" placeholder="Phone Subtext" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* PARTNERS SCHEMA */}
                {/* PARTNERS SCHEMA */}
                {slug === 'partners' && (
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Hero Section</h2>
                            <div className="grid grid-cols-1 gap-6">
                                {renderImageUploader("Hero Background Image", "heroImage", content.heroImage)}
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Hero Title</label>
                                    <input
                                        type="text"
                                        value={content.heroTitle || ''}
                                        onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#1a3a4a] outline-none font-black italic uppercase"
                                        placeholder="OUR PARTNERS"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Hero Subtitle</label>
                                    <textarea
                                        value={content.heroSubtitle || ''}
                                        onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
                                        rows={2}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#1a3a4a] outline-none font-medium"
                                        placeholder="Working with industry leaders to deliver excellence."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-8 border-t border-gray-100">
                            <label className="block text-sm font-bold text-gray-700">Introduction Text</label>
                            <textarea
                                value={content.introText || ''}
                                onChange={(e) => setContent({ ...content, introText: e.target.value })}
                                rows={4}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-sm focus:border-[#1a3a4a] focus:bg-white transition-colors outline-none"
                            />
                        </div>

                        <div className="space-y-4 pt-8 border-t border-gray-100">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Partner Logos</h2>
                                <button onClick={() => addNestedItem('partners', { name: '', url: '' })} className="flex items-center gap-2 text-xs font-bold text-[#0897b1] hover:text-[#067a8f] uppercase tracking-widest">
                                    <Plus size={14} /> Add Partner
                                </button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {(content.partners || []).map((partner: any, index: number) => (
                                    <div key={index} className="bg-gray-50 p-4 rounded-2xl relative border border-gray-100 group">
                                        <button onClick={() => removeNestedItem('partners', index)} className="absolute -top-2 -right-2 w-8 h-8 flex items-center justify-center bg-white text-gray-400 hover:text-red-500 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                            <Trash2 size={14} />
                                        </button>
                                        <div className="space-y-4">
                                            {renderImageUploader("Partner Logo", `partners.${index}.url`, partner.url)}
                                            <div>
                                                <input type="text" value={partner.name || ''} onChange={(e) => updateNestedContent('partners', index, 'name', e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-center focus:border-[#1a3a4a] outline-none" placeholder="Partner Name" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* CONTACT SCHEMA */}
                {slug === 'contact' && (
                    <div className="space-y-12">
                        <div className="space-y-6 bg-gray-50 border border-gray-100 rounded-2xl p-6">
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">General Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        value={content.email || ''}
                                        onChange={(e) => setContent({ ...content, email: e.target.value })}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#1a3a4a] outline-none font-medium"
                                        placeholder="info@mitrahomes.com.au"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                                    <input
                                        type="text"
                                        value={content.phone || ''}
                                        onChange={(e) => setContent({ ...content, phone: e.target.value })}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#1a3a4a] outline-none font-medium"
                                        placeholder="1300 646 672"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Head Office Address</label>
                                <textarea
                                    value={content.address || ''}
                                    onChange={(e) => setContent({ ...content, address: e.target.value })}
                                    rows={2}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#1a3a4a] outline-none font-medium"
                                    placeholder="123 Example Street, Melbourne VIC 3000"
                                />
                            </div>
                        </div>

                        <div className="space-y-6 bg-gray-50 border border-gray-100 rounded-2xl p-6">
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Hero Section</h2>
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Hero Title (e.g. GET IN TOUCH)</label>
                                    <input
                                        type="text"
                                        value={content.heroTitle || ''}
                                        onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#1a3a4a] outline-none font-black italic uppercase"
                                        placeholder="GET IN TOUCH"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Hero Subtitle</label>
                                    <textarea
                                        value={content.heroSubtitle || ''}
                                        onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
                                        rows={2}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#1a3a4a] outline-none font-medium"
                                        placeholder="Whether you're ready to build or just starting to explore..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 bg-gray-50 border border-gray-100 rounded-2xl p-6">
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Form & Info Titles</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Contact Info Card Title</label>
                                    <input
                                        type="text"
                                        value={content.infoTitle || ''}
                                        onChange={(e) => setContent({ ...content, infoTitle: e.target.value })}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#1a3a4a] outline-none font-bold uppercase"
                                        placeholder="Contact Info"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Form Card Title</label>
                                    <input
                                        type="text"
                                        value={content.formTitle || ''}
                                        onChange={(e) => setContent({ ...content, formTitle: e.target.value })}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#1a3a4a] outline-none font-bold uppercase"
                                        placeholder="Send us a message"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Form Card Subtitle</label>
                                <input
                                    type="text"
                                    value={content.formSubtitle || ''}
                                    onChange={(e) => setContent({ ...content, formSubtitle: e.target.value })}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#1a3a4a] outline-none font-medium"
                                    placeholder="Fill out the form below and our team will get back to you..."
                                />
                            </div>
                        </div>

                        <div className="space-y-6 bg-gray-50 border border-gray-100 rounded-2xl p-6">
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Business Hours</h2>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Monday - Friday</label>
                                    <input
                                        type="text"
                                        value={content.hours?.weekdays || ''}
                                        onChange={(e) => setContent({ ...content, hours: { ...content.hours, weekdays: e.target.value } })}
                                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:border-[#1a3a4a] outline-none"
                                        placeholder="9:00 AM - 5:00 PM"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Saturday</label>
                                    <input
                                        type="text"
                                        value={content.hours?.saturday || ''}
                                        onChange={(e) => setContent({ ...content, hours: { ...content.hours, saturday: e.target.value } })}
                                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:border-[#1a3a4a] outline-none"
                                        placeholder="10:00 AM - 4:00 PM"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Sunday</label>
                                    <input
                                        type="text"
                                        value={content.hours?.sunday || ''}
                                        onChange={(e) => setContent({ ...content, hours: { ...content.hours, sunday: e.target.value } })}
                                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:border-[#1a3a4a] outline-none"
                                        placeholder="Closed"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 bg-gray-50 border border-gray-100 rounded-2xl p-6">
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Map Location</h2>
                            <div className="space-y-4">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Search Place or Address</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            value={locationSearch}
                                            onChange={(e) => setLocationSearch(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleGeocode()}
                                            className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-4 text-sm focus:border-[#1a3a4a] outline-none font-medium"
                                            placeholder="e.g. 123 Elgar Rd, Derrimut or Place Name..."
                                        />
                                    </div>
                                    <button
                                        onClick={handleGeocode}
                                        disabled={geocoding || (!locationSearch && !content.address)}
                                        className="px-6 py-4 bg-[#0897b1] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#067a8f] transition-all disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {geocoding ? <Loader2 className="animate-spin" size={16} /> : <MapPin size={16} />}
                                        <span>Search</span>
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Latitude</label>
                                    <input
                                        type="text"
                                        readOnly
                                        value={content.latitude || ''}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono text-gray-500 cursor-not-allowed outline-none"
                                        placeholder="-37.8136"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Longitude</label>
                                    <input
                                        type="text"
                                        readOnly
                                        value={content.longitude || ''}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono text-gray-500 cursor-not-allowed outline-none"
                                        placeholder="144.9631"
                                    />
                                </div>
                            </div>

                            {content.latitude && content.longitude && (
                                <div className="mt-6 rounded-2xl overflow-hidden border border-gray-200 shadow-inner h-64 relative z-0">
                                    <MapPicker
                                        initialLat={parseFloat(content.latitude)}
                                        initialLng={parseFloat(content.longitude)}
                                        onSelect={handleMapSelect}
                                    />
                                    <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-gray-500 shadow-sm border border-gray-100">
                                        Drag or click map to fine-tune coordinates
                                    </div>
                                </div>
                            )}

                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                                Enter a place name or address and click {"\"Search\""} to automatically set coordinates. The latitude and longitude will be saved when you submit the form.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
