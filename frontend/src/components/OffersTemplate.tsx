"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CollectionHero from "@/components/CollectionHero";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface Offer {
    id: string;
    title: string;
    description: string;
    image: string;
    ctaText: string;
    ctaLink: string;
    badge?: string;
}

interface OffersTemplateProps {
    collectionName: string;
    heroImage: string;
    offers: Offer[];
    heroSubtitle?: string;
}

export default function OffersTemplate({ collectionName, heroImage, offers, heroSubtitle }: OffersTemplateProps) {
    return (
        <main className="min-h-screen bg-white">
            <Header />

            <CollectionHero
                title={`${collectionName} Current Offers`}
                backgroundImage={heroImage}
                breadcrumbs={[
                    { label: `${collectionName} Current Offers` }
                ]}
            />

            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 max-w-6xl">
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase italic text-center mb-16">
                        {collectionName} Offers
                    </h2>

                    {heroSubtitle && (
                        <p className="text-center text-gray-400 font-bold uppercase tracking-widest mb-20 max-w-2xl mx-auto -mt-8">
                            {heroSubtitle}
                        </p>
                    )}

                    <div className="space-y-40">
                        {offers.map((offer, index) => (
                            <motion.div
                                key={offer.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 md:gap-24`}
                            >
                                {/* Text Side */}
                                <div className="flex-1 space-y-8">
                                    <div className="space-y-4">
                                        {offer.badge && (
                                            <span className="inline-block bg-[#0897b1] text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full">
                                                {offer.badge}
                                            </span>
                                        )}
                                        <h3 className="text-3xl md:text-4xl font-black text-gray-900 uppercase italic leading-tight">
                                            {offer.title}
                                        </h3>
                                    </div>

                                    <p className="text-gray-500 font-medium leading-relaxed">
                                        {offer.description}
                                    </p>

                                    <Link
                                        href={offer.ctaLink}
                                        className="inline-flex items-center justify-center bg-[#0897b1] hover:bg-[#067a8e] text-white text-[12px] font-black px-10 py-5 rounded-full transition-all tracking-[0.25em] uppercase italic"
                                    >
                                        {offer.ctaText}
                                    </Link>
                                </div>

                                {/* Image Side */}
                                <div className="flex-1 w-full relative">
                                    <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl group">
                                        <Image
                                            src={offer.image}
                                            alt={offer.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                    </div>
                                    {/* Decorative Elements */}
                                    <div className={`absolute -z-10 w-full h-full bg-[#0897b1]/5 rounded-[2rem] translate-x-4 translate-y-4 ${index % 2 === 0 ? '' : '-translate-x-8'}`} />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-40 text-center space-y-8 bg-gray-50 p-12 md:p-20 rounded-[3rem] border border-gray-100">
                        <h3 className="text-3xl font-black text-gray-900 uppercase italic">
                            Ready to Build Your Dream?
                        </h3>
                        <p className="text-gray-500 max-w-xl mx-auto font-medium">
                            Join the 2021 HIA Victorian Display Home of the Year Award winners. Designed to blend livability and functionality whilst featuring all the luxurious inclusions that make a house a home.
                        </p>
                        <Link
                            href="/new-home-designs"
                            className="inline-flex items-center justify-center border-2 border-[#0897b1] text-[#0897b1] hover:bg-[#0897b1] hover:text-white text-[12px] font-black px-10 py-5 rounded-full transition-all tracking-[0.25em] uppercase italic"
                        >
                            View Home Designs
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
