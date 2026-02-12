"use client";

import { useEffect } from "react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <html>
            <body>
                <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
                    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong!</h2>
                        <p className="text-gray-500 mb-6">
                            A critical error occurred. Please try refreshing the page.
                        </p>
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-mono text-left mb-6 overflow-auto max-h-40">
                            {error.message || "Unknown error"}
                        </div>
                        <button
                            onClick={() => reset()}
                            className="px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}
