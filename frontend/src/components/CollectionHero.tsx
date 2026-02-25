"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface CollectionHeroProps {
    title: string;
    backgroundImage: string;
    breadcrumbs: BreadcrumbItem[];
}

export default function CollectionHero({ title, backgroundImage, breadcrumbs }: CollectionHeroProps) {
    return (
        <section className="relative h-[40vh] min-h-[400px] w-full bg-gray-900 flex items-center justify-center overflow-hidden">
            <Image
                src={backgroundImage}
                alt={title}
                fill
                className="object-cover opacity-60 scale-105"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

            <div className="relative z-10 container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col items-center gap-4"
                >
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
                        {title}
                    </h1>
                </motion.div>
            </div>

            {/* Breadcrumbs - Moved to bottom-left pinned position to match /mporium */}
            <div className="absolute bottom-8 left-8 z-20 hidden md:flex items-center gap-2 text-white/80 text-xs font-bold uppercase tracking-widest">
                <Link href="/" className="hover:text-white transition-colors">Mitra Homes</Link>
                {breadcrumbs.map((crumb, index) => (
                    <span key={index} className="flex items-center gap-2">
                        <ChevronRight size={14} className="text-mimosa-gold" />
                        {crumb.href ? (
                            <Link href={crumb.href} className="hover:text-white transition-colors">
                                {crumb.label}
                            </Link>
                        ) : (
                            <span className="text-white">{crumb.label}</span>
                        )}
                    </span>
                ))}
            </div>
        </section>
    );
}
