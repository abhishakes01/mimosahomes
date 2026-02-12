'use client';

// Removed useEffect to avoid potential hook issues during initial render/build in strict environments
export const dynamic = 'force-dynamic';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body>
                <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
                    <h2>Something went wrong!</h2>
                    <p>A critical error occurred.</p>
                    <button
                        onClick={() => reset()}
                        style={{
                            marginTop: '1rem',
                            padding: '0.5rem 1rem',
                            cursor: 'pointer',
                            backgroundColor: '#000',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px'
                        }}
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    );
}
