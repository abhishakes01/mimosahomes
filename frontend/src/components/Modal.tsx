"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, CheckCircle, Info, HelpCircle } from "lucide-react";
import { useEffect } from "react";

export type ModalType = "success" | "error" | "info" | "confirm";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    title: string;
    message: string;
    type?: ModalType;
    confirmText?: string;
    cancelText?: string;
}

export default function Modal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    type = "info",
    confirmText = "Confirm",
    cancelText = "Cancel"
}: ModalProps) {
    // Handle escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [isOpen, onClose]);

    const getIcon = () => {
        switch (type) {
            case "success": return <CheckCircle className="text-green-500" size={48} />;
            case "error": return <AlertCircle className="text-red-500" size={48} />;
            case "confirm": return <HelpCircle className="text-mimosa-dark" size={48} />;
            default: return <Info className="text-blue-500" size={48} />;
        }
    };

    const getAccentColor = () => {
        switch (type) {
            case "success": return "bg-green-500";
            case "error": return "bg-red-500";
            case "confirm": return "bg-mimosa-dark";
            default: return "bg-blue-500";
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden border border-white/20"
                    >
                        {/* Top Accent Line */}
                        <div className={`h-2 w-full ${getAccentColor()}`} />

                        <div className="p-8 pt-10 text-center">
                            <div className="mb-6 flex justify-center">
                                <motion.div
                                    initial={{ scale: 0.5, rotate: -10 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    className="p-4 rounded-full bg-gray-50"
                                >
                                    {getIcon()}
                                </motion.div>
                            </div>

                            <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">
                                {title}
                            </h3>
                            <p className="text-gray-500 font-medium leading-relaxed mb-10">
                                {message}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3">
                                {type === "confirm" ? (
                                    <>
                                        <button
                                            onClick={onClose}
                                            className="flex-1 px-8 py-4 rounded-3xl font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all active:scale-95"
                                        >
                                            {cancelText}
                                        </button>
                                        <button
                                            onClick={() => {
                                                onConfirm?.();
                                                onClose();
                                            }}
                                            className={`flex-1 px-8 py-4 rounded-3xl font-bold text-white transition-all active:scale-95 shadow-lg ${getAccentColor()} hover:brightness-110`}
                                        >
                                            {confirmText}
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={onClose}
                                        className={`w-full px-8 py-4 rounded-3xl font-bold text-white transition-all active:scale-95 shadow-lg ${getAccentColor()} hover:brightness-110`}
                                    >
                                        Got it
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Close button icon */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all"
                        >
                            <X size={20} />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
