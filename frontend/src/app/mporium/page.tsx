"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ChevronRight, Play, Clock, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";

export default function MporiumPage() {
    const [formData, setFormData] = useState({
        title: "",
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        suburb: "",
        question: "",
        subscribe: "yes"
    });

    const [isVpPlaying, setIsVpPlaying] = useState(false);
    const vpRef = useRef<HTMLVideoElement>(null);

    const toggleVpPlay = () => {
        if (vpRef.current) {
            if (isVpPlaying) {
                vpRef.current.pause();
            } else {
                vpRef.current.play();
            }
            setIsVpPlaying(!isVpPlaying);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        alert("Thank you for your enquiry. We will get back to you soon!");
    };

    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop"
                    alt="MPORIUM Showroom"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60" />
                <div className="relative z-10 text-center text-white px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-extrabold uppercase tracking-tight italic"
                    >
                        MPORIUM - HOME DESIGN SHOWROOM
                    </motion.h1>
                </div>

                {/* Breadcrumbs */}
                <div className="absolute bottom-8 left-8 z-10 hidden md:flex items-center gap-2 text-white/80 text-xs font-bold uppercase tracking-widest">
                    <Link href="/" className="hover:text-white transition-colors">Mitra Homes</Link>
                    <ChevronRight size={14} className="text-mimosa-gold" />
                    <span className="text-white">MPORIUM - HOME DESIGN SHOWROOM</span>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row gap-16">

                        {/* Main Content Area */}
                        <div className="flex-[1.5] space-y-16">

                            {/* Visual Gallery */}
                            <div className="grid grid-cols-4 gap-4 aspect-[21/9]">
                                <div className="col-span-1 relative rounded-xl overflow-hidden shadow-lg border-2 border-transparent hover:border-mimosa-gold transition-all duration-500">
                                    <img
                                        src="https://images.unsplash.com/photo-1616486307514-61c07153cb7e?q=80&w=600&auto=format&fit=crop"
                                        alt="Showroom display"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="col-span-1 relative rounded-xl overflow-hidden shadow-lg border-2 border-transparent hover:border-mimosa-gold transition-all duration-500">
                                    <img
                                        src="https://images.unsplash.com/photo-1615873966503-4554b791caec?q=80&w=600&auto=format&fit=crop"
                                        alt="Showroom display"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="col-span-1 relative rounded-xl overflow-hidden shadow-lg border-2 border-transparent hover:border-mimosa-gold transition-all duration-500">
                                    <img
                                        src="https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?q=80&w=600&auto=format&fit=crop"
                                        alt="Showroom display"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="col-span-1 relative rounded-xl overflow-hidden shadow-lg border-2 border-transparent hover:border-mimosa-gold transition-all duration-500">
                                    <img
                                        src="https://images.unsplash.com/photo-1616137422495-1e9e47e2177e?q=80&w=600&auto=format&fit=crop"
                                        alt="Showroom display"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="space-y-8"
                            >
                                <div className="space-y-6">
                                    <p className="text-gray-600 text-lg leading-relaxed font-medium">
                                        Welcome to MPORIUM - the ultimate destination for colour and design by Mitra Homes!
                                        From the moment you step inside, prepare to be immersed in a world of exquisite design
                                        and quality products that will engage all your senses. Our state-of-the-art showroom
                                        offers a vast range of products that cater to your individual style and taste,
                                        and our expert in-house professionals are always on hand to guide you every step of the way.
                                    </p>
                                    <p className="text-gray-600 text-lg leading-relaxed font-medium">
                                        Discover our specially allocated areas and experience the thrill of creating your dream home.
                                        At MPORIUM, we understand that your home is a reflection of your unique personality and lifestyle,
                                        and our team of experts will help you bring your vision to life. From touch and feel to
                                        visualizing your ideas, we offer a comprehensive range of services that make designing your
                                        home a joyous and stress-free experience.
                                    </p>
                                    <p className="text-gray-600 text-lg leading-relaxed font-medium">
                                        Join us at MPORIUM Home Design Showroom and be inspired to create a home that you will love for years to come.
                                        We can't wait to see you there!
                                    </p>
                                </div>

                                {/* Matterport / Virtual Tour Placeholder */}
                                <div
                                    className="relative aspect-video bg-gray-900 rounded-3xl overflow-hidden shadow-2xl group cursor-pointer"
                                    onClick={toggleVpPlay}
                                >
                                    <video
                                        ref={vpRef}
                                        loop
                                        muted
                                        playsInline
                                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                                    >
                                        <source src="/banner/Generate_Elegant_House_Video.mp4" type="video/mp4" />
                                    </video>

                                    <motion.div
                                        animate={{ opacity: isVpPlaying ? 0 : 1, scale: isVpPlaying ? 0.9 : 1 }}
                                        transition={{ duration: 0.3 }}
                                        className="absolute inset-0 flex flex-col items-center justify-center text-white pointer-events-none bg-black/20"
                                    >
                                        <div className="w-20 h-20 bg-mimosa-gold/80 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 shadow-2xl">
                                            <Play size={40} fill="white" className="ml-2" />
                                        </div>
                                        <h4 className="text-2xl font-extrabold uppercase tracking-widest italic drop-shadow-lg">Showroom Experience</h4>
                                        <p className="text-white/80 text-xs font-bold uppercase tracking-[.3em] mt-2 drop-shadow-md">Step into your dream home</p>
                                    </motion.div>

                                    {/* Small floating pause button when playing */}
                                    {isVpPlaying && (
                                        <div className="absolute bottom-6 right-6 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all">
                                            <div className="flex gap-1">
                                                <div className="w-1 h-3 bg-white rounded-full"></div>
                                                <div className="w-1 h-3 bg-white rounded-full"></div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Opening Hours & Contact */}
                                <div className="grid md:grid-cols-2 gap-12 pt-8">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4 text-mimosa-gold">
                                            <Clock size={24} />
                                            <h4 className="text-xl font-extrabold uppercase tracking-tight italic text-gray-900">Showroom Hours</h4>
                                        </div>
                                        <ul className="space-y-4 font-bold text-sm tracking-widest uppercase">
                                            <li className="flex justify-between border-b border-gray-100 pb-2">
                                                <span className="text-gray-900">Monday - Friday</span>
                                                <span className="text-gray-400">By Appointment Only</span>
                                            </li>
                                            <li className="flex justify-between border-b border-gray-100 pb-2">
                                                <span className="text-gray-900">Saturday</span>
                                                <span className="text-gray-400">Open 9am - 1pm</span>
                                            </li>
                                            <li className="flex justify-between border-b border-gray-100 pb-2">
                                                <span className="text-gray-900">Sunday</span>
                                                <span className="text-gray-400 italic">Closed</span>
                                            </li>
                                            <li className="flex justify-between text-mimosa-gold/60 text-[10px]">
                                                <span>Public Holidays</span>
                                                <span>Hours May Vary</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4 text-mimosa-gold">
                                            <MapPin size={24} />
                                            <h4 className="text-xl font-extrabold uppercase tracking-tight italic text-gray-900">Location</h4>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-gray-600 font-bold uppercase text-xs tracking-widest leading-loose">
                                                123 Elgar Rd,<br />
                                                Derrimut VIC 3026 Australia
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4 text-mimosa-gold pt-2">
                                            <Phone size={24} />
                                            <h4 className="text-xl font-extrabold uppercase tracking-tight italic text-gray-900">Contact</h4>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-gray-600 font-black text-lg tracking-tight">1300 MITRA</p>
                                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">or (03) 8361 1900</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Sidebar Form Area */}
                        <div className="flex-1">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-2xl border border-gray-100 shadow-[0_10px_50px_rgba(0,0,0,0.05)] p-10 sticky top-32"
                            >
                                <h3 className="text-3xl font-extrabold text-gray-900 mb-2 italic tracking-tight uppercase">Enquire Now</h3>
                                <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em] mb-10 font-bold">
                                    Call us on <a href="tel:1300646672" className="text-mimosa-gold font-black">1300 646 672</a>
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Title*</label>
                                            <select
                                                required
                                                className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-mimosa-gold/20 transition-all appearance-none cursor-pointer text-gray-700"
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            >
                                                <option value="">Select</option>
                                                <option value="Mr">Mr</option>
                                                <option value="Mrs">Mrs</option>
                                                <option value="Ms">Ms</option>
                                                <option value="Miss">Miss</option>
                                                <option value="Dr">Dr</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Suburb*</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-mimosa-gold/20 transition-all text-gray-800"
                                                onChange={(e) => setFormData({ ...formData, suburb: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">First Name*</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-mimosa-gold/20 transition-all text-gray-800"
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Last Name*</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-mimosa-gold/20 transition-all text-gray-800"
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Phone*</label>
                                        <input
                                            type="tel"
                                            required
                                            className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-mimosa-gold/20 transition-all text-gray-800"
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Email*</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-mimosa-gold/20 transition-all text-gray-800"
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-1">Your Question</label>
                                        <textarea
                                            rows={4}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-mimosa-gold/20 transition-all resize-none text-gray-800"
                                            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-4 pt-2">
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sign up to stay up to date with all of our promotions, blogs and styling tips!</p>
                                        <div className="flex items-center gap-6">
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                <input
                                                    type="radio"
                                                    name="subscribe"
                                                    value="yes"
                                                    defaultChecked
                                                    className="accent-mimosa-gold"
                                                    onChange={(e) => setFormData({ ...formData, subscribe: e.target.value })}
                                                />
                                                <span className="text-xs font-bold text-gray-600 group-hover:text-mimosa-gold transition-colors">Yes</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                <input
                                                    type="radio"
                                                    name="subscribe"
                                                    value="no"
                                                    className="accent-mimosa-gold"
                                                    onChange={(e) => setFormData({ ...formData, subscribe: e.target.value })}
                                                />
                                                <span className="text-xs font-bold text-gray-600 group-hover:text-mimosa-gold transition-colors">No</span>
                                            </label>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-[#005a8f] text-white py-4 rounded-lg font-black uppercase text-xs tracking-[0.2em] hover:bg-[#004a75] transition-all shadow-xl mt-4"
                                    >
                                        Submit
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
