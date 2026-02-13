"use client";

import Link from "next/link";
import { ChevronRight, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const DisplayHomesMap = dynamic(() => import("@/components/DisplayHomesMap"), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center">Loading Map...</div>
});

const OFFICE_DATA = {
    id: 'office',
    title: 'Mitra Homes Head Office',
    address: '123 Elgar Road, Derrimut, VIC, 3026',
    agent_phone: '1300 646 672',
    latitude: -37.8483,
    longitude: 144.7794,
    email: 'sales@mimosahomes.com.au'
};

const CONTACTS = [
    { name: 'General enquiries', phone: '1300 646 672', email: 'sales@mimosahomes.com.au' },
    { name: 'Digant', phone: '0450 573 022', email: 'digant@mimosahomes.com.au' },
    { name: 'Chamrin', phone: '0469 767 687', email: 'chamrin@mimosahomes.com.au' },
    { name: 'Chitraksh', phone: '0424 447 033', email: 'chitraksh@mimosahomes.com.au' },
    { name: 'Hussain', phone: '0411 788 531', email: 'hussain@mimosahomes.com.au' },
    { name: 'Ramon', phone: '0434 522 500', email: 'ramon@mimosahomes.com.au' },
    { name: 'Vikas', phone: '0468 629 991', email: 'vikas@mimosahomes.com.au' },
    { name: 'Marcela', phone: '0435 734 772', email: 'marcela@mimosahomes.com.au' },
    { name: 'Adam', phone: '0439 729 909', email: 'adamk@mimosahomes.com.au' },
];

export default function OfficeLocationPage() {
    return (
        <main className="min-h-screen bg-white">
            <Header />

            <div className="container mx-auto px-6 py-12 pt-32">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8">
                    <Link href="/" className="hover:text-[#0a3a4a]">Home</Link>
                    <ChevronRight size={10} />
                    <Link href="/display-homes" className="hover:text-[#0a3a4a]">Display Homes</Link>
                    <ChevronRight size={10} />
                    <span className="text-[#0a3a4a]">Mitra Homes Head Office</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                    {/* Map Section */}
                    <div className="lg:col-span-2 h-[500px] rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                        <DisplayHomesMap locations={[OFFICE_DATA]} center={[OFFICE_DATA.latitude, OFFICE_DATA.longitude]} />
                    </div>

                    {/* Details Section */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-4xl font-black text-[#1a3a4a] uppercase italic leading-tight mb-4">Mitra Homes Head Office</h1>
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#08a2be] mb-1">Address</h4>
                                    <p className="text-sm font-bold text-gray-600">{OFFICE_DATA.address}</p>
                                </div>

                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#08a2be] mb-1">Opening Hours</h4>
                                    <p className="text-sm font-bold text-gray-600 italic">Open Monday - Friday 9am - 5pm</p>
                                </div>

                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#08a2be] mb-3">Contact</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                                        {CONTACTS.map((contact, idx) => (
                                            <div key={idx} className="space-y-0.5">
                                                <p className="text-[13px] font-black text-[#1a3a4a]">{contact.name}</p>
                                                <p className="text-[11px] font-bold text-gray-500">P: {contact.phone}</p>
                                                <p className="text-[11px] font-bold text-gray-400 italic">E: {contact.email}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(OFFICE_DATA.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block w-full text-center py-4 bg-[#0a3a4a] text-white rounded-lg text-sm font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg"
                        >
                            Get Directions
                        </a>
                    </div>
                </div>

                {/* Listing Grid Section Wrapper to match style */}
                <div className="mt-24 pt-12 border-t border-gray-100">
                    <h2 className="text-4xl font-black text-[#1a3a4a] uppercase italic mb-8">Homes on Display</h2>
                    <div className="py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Please visit one of our display villages to see our homes</p>
                        <Link href="/display-homes" className="inline-block mt-4 text-[#08a2be] font-black uppercase tracking-widest text-[10px] hover:underline">View Display Locations</Link>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
