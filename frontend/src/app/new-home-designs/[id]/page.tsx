"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { api, getFullUrl } from "../../../services/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2, Bed, Bath, Car, ArrowRight, Home, ZoomIn, ZoomOut, RefreshCcw, ArrowLeftRight, Check, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectFade, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

interface FloorPlan {
    id: string;
    title: string;
    image_url: string;
    total_area: string | number;
    stories: number;
    bedrooms: number;
    bathrooms: number;
    car_spaces: number;
    min_frontage: string | number;
    min_depth: string | number;
    ground_floor_area?: string | number;
    first_floor_area?: string | number;
    garage_area?: string | number;
    porch_area?: string | number;
    alfresco_area?: string | number;
    facades?: Facade[];
    description?: string; // Assuming description might be added or used from title
}

interface Facade {
    id: string;
    title: string;
    image_url: string;
}

export default function DisplayHomeDetails() {
    const params = useParams();
    const id = params.id as string;

    const [floorplan, setFloorplan] = useState<FloorPlan | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"facades" | "inclusions">("facades");
    const [zoomLevel, setZoomLevel] = useState(1);
    const [isFlipped, setIsFlipped] = useState(false);

    const PRIMARY_COLOR = "#0897b1";

    useEffect(() => {
        const fetchFloorPlan = async () => {
            try {
                setLoading(true);
                const data: any = await api.getFloorPlan(id);
                setFloorplan(data);
            } catch (err: any) {
                console.error("Failed to fetch floor plan:", err);
                setError("Failed to load home details.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchFloorPlan();
        }
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="animate-spin text-gray-400" size={48} />
        </div>
    );

    if (error || !floorplan) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <p className="text-red-500 font-medium mb-4">{error || "Home not found"}</p>
                <Link href="/display-homes" className="text-blue-600 hover:underline">Back to Display Homes</Link>
            </div>
        </div>
    );

    // Derived Data
    const listingImage = floorplan.facades && floorplan.facades.length > 0
        ? getFullUrl(floorplan.facades[0].image_url)
        : (floorplan.image_url ? getFullUrl(floorplan.image_url) : "/placeholder-home.jpg");

    // Calculate total area breakdown for table
    const groundFloor = Number(floorplan.ground_floor_area || 0);
    const firstFloor = Number(floorplan.first_floor_area || 0);
    const garageString = Number(floorplan.garage_area || 0); // Renamed to avoid confusion with car_spaces
    const porch = Number(floorplan.porch_area || 0);
    const alfresco = Number(floorplan.alfresco_area || 0);
    const totalArea = Number(floorplan.total_area || 0);
    // Convert to sq (approx)
    const totalSquares = (totalArea / 9.29).toFixed(1);

    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* HERO SECTION */}
            <section className="relative h-[60vh] min-h-[500px] w-full bg-gray-900">
                <Image
                    src={listingImage}
                    alt={floorplan.title}
                    fill
                    className="object-cover opacity-80"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                <div className="absolute top-24 left-0 w-full px-4 md:px-12 z-10">
                    <div className="text-white/80 text-sm font-medium tracking-wide uppercase flex items-center gap-2">
                        <Link href="/" className="hover:text-white transition-colors">MITRA</Link>
                        <span>&gt;</span>
                        <Link href="/display-homes" className="hover:text-white transition-colors">NEW HOMES</Link>
                        <span>&gt;</span>
                        <span className="text-white font-bold">{floorplan.title} {Math.round(totalArea)}</span>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full container mx-auto px-4 md:px-12 pb-12 z-20 flex flex-col md:flex-row justify-between items-end">
                    {/* Provide space for Enquiry button which might float */}
                </div>
            </section>

            {/* ENQUIRE BUTTON (Floating Area) */}
            <div className="bg-[#2a2a2a] py-6 relative">
                <div className="container mx-auto px-4 flex justify-end -mt-16 md:-mt-20 relative z-30">
                    <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-white hover:text-black transition-all uppercase tracking-widest">
                        Enquire Now
                    </button>
                </div>
            </div>

            {/* TITLE & SPECS */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-bold text-gray-900 mb-2">{floorplan.title}</h1>
                    <div className="inline-block text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-widest mb-8" style={{ backgroundColor: PRIMARY_COLOR }}>
                        Collection
                    </div>

                    <div className="flex justify-center items-center gap-8 md:gap-16 text-gray-700">
                        <div className="flex items-center gap-2">
                            <Bed className="w-8 h-8" style={{ color: PRIMARY_COLOR }} />
                            <span className="text-2xl font-bold">{floorplan.bedrooms}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Bath className="w-8 h-8" style={{ color: PRIMARY_COLOR }} />
                            <span className="text-2xl font-bold">{floorplan.bathrooms}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Car className="w-8 h-8" style={{ color: PRIMARY_COLOR }} />
                            <span className="text-2xl font-bold">{floorplan.car_spaces}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* DESCRIPTION */}
            <section className="py-12 bg-gray-50 text-center">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">A beautiful {floorplan.bedrooms} bedroom home.</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Without compromising on space and practicality, the {floorplan.title} features all the essential elements you could want in your dream home.
                        The ground floor includes an open plan living, meals and kitchen, guest bedroom with ensuite and large walk-in wardrobe, powder room, large walk-in pantry and a laundry with access to outside.
                        The first floor features {floorplan.bedrooms} spacious bedrooms, a central lounge area, separate bathroom, separate w.c and a luxurious master bedroom with a large walk-in wardrobe and ensuite, providing the perfect home for growing families.
                    </p>
                </div>
            </section>

            {/* FLOORPLAN VIEWER */}
            <section className="py-16 bg-white border-t border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-6">
                        <div>
                            <h2 className="text-xl font-medium mb-4" style={{ color: PRIMARY_COLOR }}>Choose Floorplan Design:</h2>
                            <div className="text-white px-4 py-2 rounded font-bold inline-block" style={{ backgroundColor: PRIMARY_COLOR }}>
                                {Math.round(totalArea)}
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex gap-4">
                            <button onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors">
                                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                                    <ZoomOut size={20} />
                                </div>
                                <span className="text-xs">zoom out</span>
                            </button>
                            <button onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.1))} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors">
                                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                                    <ZoomIn size={20} />
                                </div>
                                <span className="text-xs">zoom in</span>
                            </button>
                            <button onClick={() => { setZoomLevel(1); setIsFlipped(false); }} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors">
                                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                                    <RefreshCcw size={20} />
                                </div>
                                <span className="text-xs">reset</span>
                            </button>
                            <button onClick={() => setIsFlipped(!isFlipped)} className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors">
                                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                                    <ArrowLeftRight size={20} />
                                </div>
                                <span className="text-xs">flip</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                        {/* LEFT COLUMN: SPECS */}
                        <div className="lg:col-span-1 space-y-8">
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <p className="font-medium text-sm mb-1" style={{ color: PRIMARY_COLOR }}>Minimum Frontage</p>
                                    <p className="text-gray-900 font-bold">{floorplan.min_frontage} m</p>
                                </div>
                                <div className="border-l-2 border-gray-200 pl-4">
                                    <p className="font-medium text-sm mb-1" style={{ color: PRIMARY_COLOR }}>Min Depth</p>
                                    <p className="text-gray-900 font-bold">{floorplan.min_depth} m</p>
                                </div>
                                <div className="border-l-2 border-gray-200 pl-4">
                                    <p className="font-medium text-sm mb-1" style={{ color: PRIMARY_COLOR }}>Total Area</p>
                                    <p className="text-gray-900 font-bold">{totalSquares}sq</p>
                                </div>
                            </div>

                            <div className="pt-8 mt-8 border-t border-gray-100">
                                <h4 className="font-medium mb-4" style={{ color: PRIMARY_COLOR }}>Area Analysis</h4>
                                <table className="w-full text-sm">
                                    <tbody>
                                        <tr className="border-b border-gray-100">
                                            <td className="py-2 text-gray-600">Living Area</td>
                                            <td className="py-2 text-right">
                                                <div className="text-gray-900 font-medium">Ground Floor {groundFloor} sqm | {(groundFloor / 9.29).toFixed(1)} sq</div>
                                                {firstFloor > 0 && (
                                                    <div className="text-gray-900 font-medium">First Floor {firstFloor} sqm | {(firstFloor / 9.29).toFixed(1)} sq</div>
                                                )}
                                            </td>
                                        </tr>
                                        {garageString > 0 && (
                                            <tr className="border-b border-gray-100">
                                                <td className="py-2 text-gray-600">Garage Area</td>
                                                <td className="py-2 text-right font-medium text-gray-900">{garageString} sqm | {(garageString / 9.29).toFixed(1)} sq</td>
                                            </tr>
                                        )}
                                        {porch > 0 && (
                                            <tr className="border-b border-gray-100">
                                                <td className="py-2 text-gray-600">Porch Area</td>
                                                <td className="py-2 text-right font-medium text-gray-900">{porch} sqm | {(porch / 9.29).toFixed(1)} sq</td>
                                            </tr>
                                        )}
                                        {alfresco > 0 && (
                                            <tr className="border-b border-gray-100">
                                                <td className="py-2 text-gray-600">Alfresco Area</td>
                                                <td className="py-2 text-right font-medium text-gray-900">{alfresco} sqm | {(alfresco / 9.29).toFixed(1)} sq</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: IMAGES */}
                        <div className="lg:col-span-3 bg-gray-50 rounded-xl overflow-hidden flex flex-col relative h-[600px] border border-gray-100">
                            {/* Scrollable Container */}
                            <div className="absolute inset-0 overflow-auto flex items-center justify-center p-4">
                                {/* Scalable Content Wrapper */}
                                <div
                                    style={{
                                        width: `${zoomLevel * 100}%`,
                                        height: `${zoomLevel * 100}%`,
                                        minWidth: '100%',
                                        minHeight: '100%',
                                        transition: 'width 0.3s ease-out, height 0.3s ease-out'
                                    }}
                                    className="relative flex-shrink-0"
                                >
                                    {floorplan.image_url ? (
                                        <div
                                            className="relative w-full h-full"
                                            style={{
                                                transform: `scaleX(${isFlipped ? -1 : 1})`,
                                                transition: 'transform 0.3s ease-out'
                                            }}
                                        >
                                            <Image
                                                src={getFullUrl(floorplan.image_url)}
                                                alt="Floorplan"
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400">No floorplan image available</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* TABS SECTION (Facades / Inclusions) */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center gap-6 mb-12">
                        <button
                            onClick={() => setActiveTab("facades")}
                            className={`w-48 py-8 px-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-3 border-b-4 bg-white`}
                            style={{
                                borderColor: activeTab === "facades" ? PRIMARY_COLOR : "transparent"
                            }}
                        >
                            <Home size={32} style={{ color: activeTab === "facades" ? PRIMARY_COLOR : "#9CA3AF" }} />
                            <span className={`font-medium ${activeTab === "facades" ? "text-gray-900" : "text-gray-500"}`}>Facade Options</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("inclusions")}
                            className={`w-48 py-8 px-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-3 border-b-4`}
                            style={{
                                borderColor: activeTab === "inclusions" ? PRIMARY_COLOR : "transparent"
                            }}
                        >
                            <FileText size={32} style={{ color: activeTab === "inclusions" ? PRIMARY_COLOR : "#9CA3AF" }} />
                            <span className={`font-medium ${activeTab === "inclusions" ? "text-gray-900" : "text-gray-500"}`}>Inclusions</span>
                        </button>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-8 min-h-[400px]">
                        {activeTab === "facades" ? (
                            <div className="w-full">
                                {floorplan.facades && floorplan.facades.length > 0 ? (
                                    <div className="relative max-w-5xl mx-auto px-4 md:px-12">
                                        <button className="custom-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 hover:opacity-75 transition-opacity disabled:opacity-30" style={{ color: PRIMARY_COLOR }}>
                                            <ChevronLeft size={48} />
                                        </button>
                                        <button className="custom-next absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 hover:opacity-75 transition-opacity disabled:opacity-30" style={{ color: PRIMARY_COLOR }}>
                                            <ChevronRight size={48} />
                                        </button>

                                        <Swiper
                                            modules={[Navigation]}
                                            spaceBetween={30}
                                            slidesPerView={1}
                                            navigation={{
                                                prevEl: '.custom-prev',
                                                nextEl: '.custom-next'
                                            }}
                                            loop={true}
                                            className="w-full max-w-4xl mx-auto"
                                        >
                                            {floorplan.facades.map((facade) => (
                                                <SwiperSlide key={facade.id}>
                                                    <div className="flex flex-col items-center">
                                                        <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-6 shadow-sm bg-gray-100">
                                                            <Image
                                                                src={getFullUrl(facade.image_url)}
                                                                alt={facade.title}
                                                                fill
                                                                className="object-cover"
                                                                priority
                                                            />
                                                        </div>
                                                        <h3 className="text-xl font-bold text-gray-900">{facade.title} - {floorplan.title}</h3>
                                                    </div>
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-gray-400">
                                        No facade options available for this home design.
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="w-full max-w-2xl mx-auto text-left">
                                <h3 className="text-2xl font-bold mb-6">Standard Inclusions</h3>
                                <ul className="space-y-3">
                                    {[
                                        "Fixed site costs",
                                        "Developer requirements",
                                        "Quality floor coverings throughout",
                                        "Stainless steel appliances",
                                        "Ducted heating",
                                        "Remote control garage door",
                                        "Solar hot water system",
                                        "6-star energy rating"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-gray-700">
                                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                                <Check size={12} className="text-green-600" />
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-8 p-4 bg-gray-50 rounded text-sm text-gray-500">
                                    * Standard inclusions may vary. Please contact us for a detailed specification list.
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <div className="py-24" /> {/* Spacer */}

            <Footer />
        </main>
    );
}
