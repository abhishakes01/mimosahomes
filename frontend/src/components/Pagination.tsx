"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <div className="flex items-center justify-center gap-2 mt-8 py-6">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-mimosa-dark hover:border-mimosa-dark/30 disabled:opacity-30 disabled:hover:text-gray-400 disabled:hover:border-gray-100 transition-all font-bold flex items-center gap-1"
            >
                <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-1">
                {startPage > 1 && (
                    <>
                        <button
                            onClick={() => onPageChange(1)}
                            className={`w-12 h-12 rounded-xl font-bold transition-all ${currentPage === 1
                                    ? "bg-mimosa-dark text-white shadow-lg shadow-mimosa-dark/20"
                                    : "bg-white border border-gray-100 text-gray-500 hover:bg-gray-50"
                                }`}
                        >
                            1
                        </button>
                        {startPage > 2 && <span className="px-2 text-gray-300 font-bold">...</span>}
                    </>
                )}

                {pages.map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`w-12 h-12 rounded-xl font-bold transition-all ${currentPage === page
                                ? "bg-mimosa-dark text-white shadow-lg shadow-mimosa-dark/20"
                                : "bg-white border border-gray-100 text-gray-500 hover:bg-gray-50"
                            }`}
                    >
                        {page}
                    </button>
                ))}

                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && <span className="px-2 text-gray-300 font-bold">...</span>}
                        <button
                            onClick={() => onPageChange(totalPages)}
                            className={`w-12 h-12 rounded-xl font-bold transition-all ${currentPage === totalPages
                                    ? "bg-mimosa-dark text-white shadow-lg shadow-mimosa-dark/20"
                                    : "bg-white border border-gray-100 text-gray-500 hover:bg-gray-50"
                                }`}
                        >
                            {totalPages}
                        </button>
                    </>
                )}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-mimosa-dark hover:border-mimosa-dark/30 disabled:opacity-30 disabled:hover:text-gray-400 disabled:hover:border-gray-100 transition-all font-bold flex items-center gap-1"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
}
