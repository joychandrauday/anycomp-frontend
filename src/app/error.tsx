// src/app/error.tsx
"use client";

import { useEffect } from "react";
import { Button } from "antd";
import { RefreshCcw, AlertTriangle } from "lucide-react";

interface GlobalErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
    useEffect(() => {
        // Log error for monitoring (Sentry / LogRocket / console)
        console.error("Global Error:", error);
    }, [error]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>

                <h1 className="mb-2 text-xl font-semibold text-gray-900">
                    Something went wrong
                </h1>

                <p className="mb-6 text-sm text-gray-600">
                    We encountered an unexpected error while processing your request.
                    Please try again. If the problem persists, contact support.
                </p>

                {/* Optional: hide technical message in production */}
                {process.env.NODE_ENV !== "production" && (
                    <p className="mb-6 rounded-md bg-gray-100 p-3 text-left text-xs text-gray-700">
                        {error.message}
                    </p>
                )}

                <Button
                    type="primary"
                    icon={<RefreshCcw size={16} />}
                    onClick={reset}
                    className="w-full bg-[#00204E] hover:bg-blue-900"
                >
                    Try Again
                </Button>
            </div>
        </div>
    );
}
