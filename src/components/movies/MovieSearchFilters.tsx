"use client";

import * as React from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/Toast";

// Inline cn for safety
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
function cnSafe(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const genres = ["All", "Sci-Fi", "Action", "Drama", "Documentary", "Thriller"];

interface MovieSearchFiltersProps {
    activeGenre: string;
    onGenreChange: (genre: string) => void;
}

export function MovieSearchFilters({ activeGenre, onGenreChange }: MovieSearchFiltersProps) {
    const [isSearchFocused, setIsSearchFocused] = React.useState(false);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = React.useState(false);
    const { showToast } = useToast();

    const handleGenreClick = (genre: string) => {
        onGenreChange(genre);
        showToast(`Filtering by ${genre}`, "info");
    };

    return (
        <>
            <div className="sticky top-16 z-40 w-full bg-black/80 backdrop-blur-xl border-b border-white/5 py-4 transition-all">
                <Container>
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Search Bar */}
                        <div className={cnSafe(
                            "relative w-full md:max-w-md transition-all duration-300",
                            isSearchFocused ? "md:max-w-lg" : ""
                        )}>
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search movies, genres, directors..."
                                className="w-full bg-surface border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                            />
                        </div>

                        {/* Desktop Filters */}
                        <div className="hidden md:flex items-center gap-2 overflow-x-auto scrollbar-hide">
                            {genres.map((genre) => (
                                <button
                                    key={genre}
                                    onClick={() => handleGenreClick(genre)}
                                    className={cnSafe(
                                        "px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                                        activeGenre === genre
                                            ? "bg-white text-black"
                                            : "bg-surface text-gray-400 hover:bg-surface-hover hover:text-white"
                                    )}
                                >
                                    {genre}
                                </button>
                            ))}
                        </div>

                        {/* Mobile Filter Button */}
                        <div className="md:hidden w-full flex justify-between items-center">
                            <span className="text-sm text-gray-400">Browsing {activeGenre}</span>
                            <Button
                                variant="secondary"
                                size="sm"
                                className="gap-2"
                                onClick={() => setIsMobileFiltersOpen(true)}
                            >
                                <SlidersHorizontal className="h-4 w-4" />
                                Filters
                            </Button>
                        </div>
                    </div>
                </Container>
            </div>

            {/* Mobile Filters Drawer */}
            <AnimatePresence>
                {isMobileFiltersOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm md:hidden"
                            onClick={() => setIsMobileFiltersOpen(false)}
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 bg-surface border-t border-white/10 z-50 p-6 rounded-t-2xl md:hidden"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold">Filters</h3>
                                <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 bg-white/5 rounded-full">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-400 mb-3">Genre</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {genres.map((genre) => (
                                            <button
                                                key={genre}
                                                onClick={() => {
                                                    handleGenreClick(genre);
                                                    setIsMobileFiltersOpen(false);
                                                }}
                                                className={cnSafe(
                                                    "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                                                    activeGenre === genre
                                                        ? "bg-primary text-white"
                                                        : "bg-black/40 text-gray-400 border border-white/10"
                                                )}
                                            >
                                                {genre}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
