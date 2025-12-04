"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

const showcaseItems = [
    {
        id: 1,
        imageUrl: "https://picsum.photos/seed/cast1/1600/900",
        quote: "Your Voice, Your Story.",
        subtext: "Join the next generation of AI-driven storytelling.",
    },
    {
        id: 2,
        imageUrl: "https://picsum.photos/seed/cast2/1600/900",
        quote: "Be The Face of Innovation.",
        subtext: "We are looking for unique characters to bring our worlds to life.",
    },
    {
        id: 3,
        imageUrl: "https://picsum.photos/seed/cast3/1600/900",
        quote: "Step Into The Spotlight.",
        subtext: "No experience needed. Just passion and authenticity.",
    },
];

export function CastingShowcase() {
    const [currentIndex, setCurrentIndex] = React.useState(0);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % showcaseItems.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full h-full overflow-hidden bg-black">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0"
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${showcaseItems[currentIndex].imageUrl})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-16 z-30">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 1 }}
                    >
                        <h2 className="text-2xl md:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight tracking-tight">
                            {showcaseItems[currentIndex].quote}
                        </h2>
                        <div className="h-1 w-12 md:w-20 bg-primary mb-4 md:mb-6" />
                        <p className="text-base md:text-xl text-gray-200 max-w-lg font-light leading-relaxed">
                            {showcaseItems[currentIndex].subtext}
                        </p>
                    </motion.div>
                </AnimatePresence>

                {/* Progress Indicators */}
                <div className="flex gap-2 mt-8">
                    {showcaseItems.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-1 rounded-full transition-all duration-500 ${idx === currentIndex ? "w-8 bg-white" : "w-2 bg-white/30"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
