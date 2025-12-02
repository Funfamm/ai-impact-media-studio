"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2500); // 2.5 seconds loading time

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                <motion.div
                    className="fixed inset-0 z-[10000] flex items-center justify-center bg-black"
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="flex flex-col items-center gap-4"
                    >
                        <div className="relative">
                            <motion.div
                                className="w-16 h-16 border-t-2 border-l-2 border-primary rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            <motion.div
                                className="absolute inset-0 w-16 h-16 border-b-2 border-r-2 border-purple-500 rounded-full opacity-50"
                                animate={{ rotate: -360 }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            />
                        </div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 tracking-widest uppercase"
                        >
                            AI Impact Studio
                        </motion.h1>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
