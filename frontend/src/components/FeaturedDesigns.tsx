"use client";

import Image from "next/image";
import { Bed, Bath, Car, Maximize, ArrowUpRight } from "lucide-react";

const DESIGNS = [
    {
        id: 1,
        name: "The Savoy 42",
        price: "$345,900",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
        beds: 4,
        baths: 2,
        cars: 2,
        sqm: 390
    },
    {
        id: 2,
        name: "Montclair 33",
        price: "$298,500",
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop",
        beds: 4,
        baths: 2.5,
        cars: 2,
        sqm: 306
    },
    {
        id: 3,
        name: "Avalon 28",
        price: "$265,000",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
        beds: 3,
        baths: 2,
        cars: 2,
        sqm: 260
    }
];

export default function FeaturedDesigns() {
    return (
        <section className="py-24 bg-gray-50">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div>
                        <span className="text-mimosa-gold font-semibold tracking-wider uppercase text-sm mb-2 block">Our Collection</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-mimosa-dark">Featured Home Designs</h2>
                    </div>
                    <a href="#" className="hidden md:flex items-center gap-2 text-mimosa-dark font-medium hover:text-mimosa-gold transition-colors group">
                        View All Designs
                        <ArrowUpRight size={20} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {DESIGNS.map((house) => (
                        <div key={house.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <img
                                    src={house.image}
                                    alt={house.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold text-mimosa-dark shadow-sm">
                                    From {house.price}
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-2xl font-bold text-mimosa-dark mb-4">{house.name}</h3>

                                <div className="flex items-center justify-between text-gray-500 mb-6 border-b border-gray-100 pb-6">
                                    <div className="flex items-center gap-2" title="Bedrooms">
                                        <Bed size={18} />
                                        <span>{house.beds}</span>
                                    </div>
                                    <div className="flex items-center gap-2" title="Bathrooms">
                                        <Bath size={18} />
                                        <span>{house.baths}</span>
                                    </div>
                                    <div className="flex items-center gap-2" title="Garage Spaces">
                                        <Car size={18} />
                                        <span>{house.cars}</span>
                                    </div>
                                    <div className="flex items-center gap-2" title="Total Area">
                                        <Maximize size={18} />
                                        <span>{house.sqm}m²</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button className="flex-1 py-3 border border-gray-200 rounded-lg text-mimosa-dark font-medium hover:bg-mimosa-dark hover:text-white hover:border-mimosa-dark transition-all">
                                        View Floorplan
                                    </button>
                                    <button className="flex-1 py-3 bg-mimosa-gold text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors">
                                        Enquire Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <a href="#" className="inline-flex items-center gap-2 text-mimosa-dark font-medium hover:text-mimosa-gold transition-colors">
                        View All Designs
                        <ArrowUpRight size={20} />
                    </a>
                </div>
            </div>
        </section>
    );
}
