"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 bg-red-900/20 border border-red-500 rounded-lg m-4 text-white">
                    <h2 className="text-xl font-bold mb-2 text-red-400">Something went wrong</h2>
                    <p className="mb-4 text-gray-300">The component failed to render.</p>
                    {this.state.error && (
                        <pre className="bg-black/50 p-4 rounded overflow-auto text-sm font-mono text-red-300">
                            {this.state.error.toString()}
                        </pre>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}
