"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle, AlertCircle } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = React.useState<Toast[]>([]);

    const showToast = (message: string, type: ToastType = "info") => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg bg-surface border border-border min-w-[300px]"
                        >
                            {toast.type === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
                            {toast.type === "error" && <AlertCircle className="h-5 w-5 text-red-500" />}
                            {toast.type === "info" && <AlertCircle className="h-5 w-5 text-blue-500" />}
                            <p className="text-sm font-medium text-foreground flex-1">{toast.message}</p>
                            <button onClick={() => removeToast(toast.id)} className="text-gray-400 hover:text-white">
                                <X className="h-4 w-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export const useToast = () => {
    const context = React.useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};
