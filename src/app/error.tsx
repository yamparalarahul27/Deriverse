'use client';

import { useEffect } from 'react';

/**
 * Route-level error boundary — catches render/runtime errors anywhere in the
 * page tree and shows a recoverable message instead of a blank screen.
 */
export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('[App] Unhandled error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0D0D21] text-white p-4">
            <div className="max-w-md w-full border border-white/10 bg-black/60 backdrop-blur-xl p-8 text-center space-y-4">
                <h2 className="text-xl font-bold">Something went wrong</h2>
                <p className="text-white/60 text-sm">
                    An unexpected error occurred while rendering this page. Your data is safe —
                    try again, or reload the app if the problem persists.
                </p>
                {error.digest && (
                    <p className="text-white/40 text-xs font-mono">Error ID: {error.digest}</p>
                )}
                <div className="flex justify-center gap-3 pt-2">
                    <button
                        onClick={reset}
                        className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-none transition-colors"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => window.location.assign('/')}
                        className="px-6 py-2.5 border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 text-sm font-medium rounded-none transition-colors"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        </div>
    );
}
