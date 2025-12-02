"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { MovieCard } from "./MovieCard";
import { useToast } from "@/components/ui/Toast";

// Inline cn for safety
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
function cnSafe(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Movie {
    id: number;
    title: string;
    year: string;
    genre: string;
    imageUrl?: string;
}

interface MovieRailProps {
    title: string;
    movies: Movie[];
}

export function MovieRail({ title, movies }: MovieRailProps) {
    const { showToast } = useToast();

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="py-8 border-b border-white/5"
        >
            <Container>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[16px] font-[600] md:text-[20px] md:font-[700] text-white">
                        {title}
                    </h2>
                    <button
                        className="hidden md:flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                        onClick={() => showToast(`Viewing all ${title}`, "info")}
                    >
                        View All <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            </Container>

            {/* Scroll Container - Bleeds to edge on mobile, contained on desktop if preferred, or full width */}
            <div className="w-full overflow-x-auto scrollbar-hide scroll-snap-x mandatory pb-4">
                <div className="flex px-4 md:px-8 gap-5 min-w-max">
                    {movies.map((movie, index) => (
                        <motion.div
                            key={movie.id}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="scroll-snap-align-start w-[100px] md:w-[200px]"
                        >
                            <MovieCard
                                title={movie.title}
                                year={movie.year}
                                genre={movie.genre}
                                imageUrl={movie.imageUrl}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
}
