"use client";

import { useEffect, useState } from "react";
import { RefreshCcw } from "lucide-react";
import { api } from "@/services/api";

interface CaptchaProps {
    onRefresh?: () => void;
    className?: string;
}

export default function Captcha({ onRefresh, className = "" }: CaptchaProps) {
    const [captchaUrl, setCaptchaUrl] = useState("");

    const refreshCaptcha = () => {
        setCaptchaUrl(api.getCaptchaUrl());
        if (onRefresh) onRefresh();
    };

    useEffect(() => {
        refreshCaptcha();
    }, []);

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-widest">Security Verification</label>
            <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-xl border border-gray-100">
                <div
                    className="flex-1 h-12 bg-white rounded-lg overflow-hidden flex items-center justify-center cursor-pointer"
                    onClick={refreshCaptcha}
                >
                    {captchaUrl && (
                        <img
                            src={captchaUrl}
                            alt="CAPTCHA"
                            className="h-full w-auto select-none"
                            onDragStart={(e) => e.preventDefault()}
                        />
                    )}
                </div>
                <button
                    type="button"
                    onClick={refreshCaptcha}
                    className="p-3 text-mimosa-dark hover:bg-white hover:shadow-sm rounded-lg transition-all"
                    title="Refresh CAPTCHA"
                >
                    <RefreshCcw size={18} />
                </button>
            </div>
            <p className="text-[10px] text-gray-400 font-medium">Click image or refresh button to get a new code.</p>
        </div>
    );
}
