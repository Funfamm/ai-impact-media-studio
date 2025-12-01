"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

// Inline cn for safety
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
function cnSafe(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Mock Data
const movies = [
    {
        id: 1,
        title: "Neon Horizon",
        description: "In a city that never sleeps, an AI detective uncovers a conspiracy that threatens the very fabric of reality.",
        genre: "Sci-Fi / Thriller",
        year: "2025",
        color: "from-blue-900 to-purple-900", // Placeholder for image
    },
    {
        id: 2,
        title: "The Last Algorithm",
        description: "A documentary exploring the final days of human-written code and the dawn of the singularity.",
        genre: "Documentary",
        year: "2024",
        color: "from-red-900 to-orange-900",
    },
    {
        id: 3,
        title: "Echoes of Silence",
        description: "A silent film generated entirely by AI, telling the story of a robot learning to feel emotion.",
        genre: "Drama / Art",
        year: "2026",
        color: "from-green-900 to-teal-900",
    },
    {
        id: 4,
        title: "Cyber Punk 2099",
        description: "High-octane action in a dystopian future where humanity fights for survival against rogue machines.",
        genre: "Action",
        year: "2025",
        color: "from-yellow-900 to-amber-900",
    },
];

export function MovieShowcase() {
    const [activeMovie, setActiveMovie] = React.useState(movies[0]);

    return (
        <div className="relative h-screen w-full overflow-hidden bg-black">
            {/* Background Transition */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeMovie.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className={cnSafe(
                        "absolute inset-0 bg-gradient-to-br opacity-50",
                        activeMovie.color
                    )}
                />
            </AnimatePresence>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

            {/* Main Content */}
            <Container className="relative z-10 h-full flex flex-col justify-center pb-32">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeMovie.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-2xl"
                    >
                        <div className="flex items-center gap-4 mb-4 text-sm font-medium text-gray-300">
                            <span className="bg-white/10 px-2 py-1 rounded">{activeMovie.genre}</span>
                            <span>{activeMovie.year}</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                            {activeMovie.title}
                        </h1>
                        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                            {activeMovie.description}
                        </p>
                        <div className="flex gap-4">
                            <Button size="lg" className="gap-2">
                                <Play className="fill-current h-5 w-5" />
                                Watch Now
                            </Button>
                            <Button variant="secondary" size="lg" className="gap-2">
                                <Info className="h-5 w-5" />
                                More Info
                            </Button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </Container>

            {/* Bottom Thumbnail Navigation */}
            <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black to-transparent pt-20 pb-8">
                <Container>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {movies.map((movie) => (
                            <button
                                key={movie.id}
                                onClick={() => setActiveMovie(movie)}
                                className={cnSafe(
                                    "flex-shrink-0 w-48 h-28 rounded-lg overflow-hidden border-2 transition-all relative group",
                                    activeMovie.id === movie.id
                                        ? "border-primary scale-105"
                                        : "border-transparent opacity-50 hover:opacity-100"
                                )}
                            >
                                <div className={cnSafe("absolute inset-0 bg-gradient-to-br", movie.color)} />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors">
                                    <span className="font-bold text-sm text-center px-2">{movie.title}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </Container>
            </div>
        </div>
    );
}
