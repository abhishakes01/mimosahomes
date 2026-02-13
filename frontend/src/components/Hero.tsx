"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useState, useRef } from "react";
import Link from "next/link";

export default function Hero() {
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
            {/* Cinematic Video Background */}
            <div className="absolute inset-0 z-0">
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    className="w-full h-full object-cover scale-105"
                >
                    <source
                        src="/banner/Generate_Elegant_House_Video.mp4"
                        type="video/mp4"
                    />
                    Your browser does not support the video tag.
                </video>

                {/* Cinematic Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-black/60 z-10" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80 z-10" />
            </div>

            {/* Video Controls (Subtle) */}
            <div className="absolute bottom-10 right-10 z-30 flex gap-4 text-white/70">
                <button
                    onClick={toggleMute}
                    className="p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 hover:text-white transition-all border border-white/10"
                    title={isMuted ? "Unmute" : "Mute"}
                >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <button
                    onClick={togglePlay}
                    className="p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 hover:text-white transition-all border border-white/10"
                    title={isPlaying ? "Pause" : "Play"}
                >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
            </div>

            {/* Content */}
            <div className="relative z-20 container mx-auto px-6 text-center text-white">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <span className="inline-block py-1 px-3 border border-white/30 rounded-full text-sm font-medium tracking-wider mb-6 backdrop-blur-sm bg-white/10 uppercase">
                        Quality Meets Affordability
                    </span>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-tight shadow-black drop-shadow-2xl">
                        Mitra's Premier <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500">
                            New Home Builder
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto mb-10 leading-relaxed font-light drop-shadow-lg">
                        Build with a HIA award winning new home builder that does not compromise on quality.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/new-home-designs"
                            className="px-10 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl flex items-center gap-2"
                        >
                            View Home Designs
                            <ArrowRight size={20} />
                        </Link>
                        <Link
                            href="/house-land-packages"
                            className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-semibold text-lg hover:bg-white/20 transition-all flex items-center gap-2 group"
                        >
                            View House & Land
                            <span className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center group-hover:scale-110 transition-transform">
                                <ArrowRight size={16} />
                            </span>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
