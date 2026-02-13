"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/services/api";

export default function AdminLogin() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res: any = await api.login({ email, password });
            // In a real app, save token to cookies/localStorage
            // localStorage.setItem('token', res.token); 
            localStorage.setItem('user', JSON.stringify(res.user));
            router.push("/admin/dashboard");
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-black">
            {/* Left Side - Image/Brand */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop"
                    alt="Luxury Home"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
                <div className="absolute bottom-20 left-20 text-white z-10">
                    <h1 className="text-6xl font-bold mb-4 flex items-center gap-3">
                        <img src="/logo.png" alt="Logo" className="w-16 h-16 object-contain brightness-0 invert" />
                        Mitra <span className="text-mimosa-gold">Home</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-md font-light leading-relaxed">
                        Manage your premium property portfolio and customer enquiries with elegance.
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 relative">
                <div className="absolute inset-0 bg-black z-0" />
                {/* Subtle abstract gold shape */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-mimosa-gold/5 rounded-full blur-3xl" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md relative z-10 space-y-8"
                >
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                        <p className="text-gray-500">Sign in to access your administrative dashboard.</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-mimosa-gold uppercase tracking-wider">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-mimosa-gold transition-colors" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-mimosa-gold/50 focus:bg-white/10 transition-all"
                                    placeholder="admin@mitrahomes.com.au"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-mimosa-gold uppercase tracking-wider">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-mimosa-gold transition-colors" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-mimosa-gold/50 focus:bg-white/10 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-gray-400 hover:text-white cursor-pointer transition-colors">
                                <input type="checkbox" className="rounded bg-white/10 border-white/20 text-mimosa-gold focus:ring-mimosa-gold/50" />
                                Remember me
                            </label>
                            <a href="#" className="text-gray-400 hover:text-mimosa-gold transition-colors">Forgot Password?</a>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-mimosa-gold to-yellow-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-mimosa-gold/20 hover:shadow-mimosa-gold/40 transform hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing In...' : (
                                <>Login to Dashboard <ArrowRight size={20} /></>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
