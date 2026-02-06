"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import Modal, { ModalType } from '@/components/Modal';

interface ModalOptions {
    title: string;
    message: string;
    type?: ModalType;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
}

interface UIContextType {
    showAlert: (title: string, message: string, type?: "success" | "error" | "info") => void;
    showConfirm: (options: ModalOptions) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
    const [modalConfig, setModalConfig] = useState<ModalOptions & { isOpen: boolean }>({
        isOpen: false,
        title: '',
        message: '',
        type: 'info'
    });

    const showAlert = (title: string, message: string, type: "success" | "error" | "info" = 'info') => {
        setModalConfig({
            isOpen: true,
            title,
            message,
            type
        });
    };

    const showConfirm = (options: ModalOptions) => {
        setModalConfig({
            ...options,
            isOpen: true,
            type: 'confirm'
        });
    };

    const closeModal = () => {
        setModalConfig(prev => ({ ...prev, isOpen: false }));
    };

    return (
        <UIContext.Provider value={{ showAlert, showConfirm }}>
            {children}
            <Modal
                isOpen={modalConfig.isOpen}
                onClose={closeModal}
                title={modalConfig.title}
                message={modalConfig.message}
                type={modalConfig.type}
                confirmText={modalConfig.confirmText}
                cancelText={modalConfig.cancelText}
                onConfirm={modalConfig.onConfirm}
            />
        </UIContext.Provider>
    );
}

export function useUI() {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
}
