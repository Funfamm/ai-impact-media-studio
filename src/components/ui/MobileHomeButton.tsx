"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";
import { motion } from "framer-motion";

export function MobileHomeButton() {
    const pathname = usePathname();

    // Don't show on homepage or admin pages
    if (pathname === "/" || pathname.startsWith("/admin")) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="fixed bottom-6 right-6 z-50 md:hidden"
        >
            <Link
                href="/"
                className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg hover:scale-110 transition-transform duration-300 group relative"
            >
                {/* Glowing effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-purple-600 opacity-75 blur-xl animate-pulse" />

                {/* Icon */}
                <Home className="w-6 h-6 relative z-10 group-hover:scale-110 transition-transform" />
            </Link>
        </motion.div>
    );
}
