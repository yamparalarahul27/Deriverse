'use client';

/**
 * Root error boundary — catches errors thrown by the root layout itself.
 * Must render its own <html>/<body> because the layout failed.
 */
export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="en">
            <body style={{ margin: 0, background: '#0D0D21', color: '#fff', fontFamily: 'monospace' }}>
                <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
                    <div style={{ maxWidth: 420, textAlign: 'center' }}>
                        <h2 style={{ marginBottom: 12 }}>Something went wrong</h2>
                        <p style={{ opacity: 0.6, fontSize: 14, marginBottom: 8 }}>
                            The app failed to load. Try again, or refresh the page.
                        </p>
                        {error.digest && (
                            <p style={{ opacity: 0.4, fontSize: 12, marginBottom: 16 }}>Error ID: {error.digest}</p>
                        )}
                        <button
                            onClick={reset}
                            style={{
                                padding: '10px 24px',
                                background: '#9333ea',
                                color: '#fff',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: 14,
                            }}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}
