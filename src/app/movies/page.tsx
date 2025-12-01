"use client";

import * as React from "react";

import { MovieHero } from "@/components/movies/MovieHero";
import { MovieSearchFilters } from "@/components/movies/MovieSearchFilters";
import { MovieRail } from "@/components/movies/MovieRail";
import { MovieGrid } from "@/components/movies/MovieGrid";

// Mock Data Generation
const generateMovies = (count: number, startId: number) => {
    return Array.from({ length: count }).map((_, i) => ({
        id: startId + i,
        title: [
            "The Quantum Paradox",
            "Neon Nights: Cyber City",
            "Echoes of the Void",
            "Synthetic Dreams",
            "The Last Algorithm",
            "Binary Horizon",
            "Digital Soul",
            "Neural Network Confidential",
            "Silicon Valley Noir",
            "Protocol Omega"
        ][i % 10] + (i > 10 ? ` ${i}` : ""),
        year: "202" + (Math.floor(Math.random() * 5) + 1),
        genre: ["Sci-Fi", "Thriller", "Drama", "Action", "Documentary"][Math.floor(Math.random() * 5)],
        // Using placeholder images
        imageUrl: `https://picsum.photos/seed/${startId + i}/400/600`
    }));
};

const trendingMovies = generateMovies(10, 100);
const newReleases = generateMovies(10, 200);
const allMovies = generateMovies(20, 300);

export default function MoviesPage() {
    const [activeGenre, setActiveGenre] = React.useState("All");

    // Filter movies based on active genre
    const filterMovies = (movies: ReturnType<typeof generateMovies>) => {
        if (activeGenre === "All") return movies;
        return movies.filter(movie => movie.genre === activeGenre);
    };

    const filteredTrending = filterMovies(trendingMovies);
    const filteredNewReleases = filterMovies(newReleases);
    const filteredAllMovies = filterMovies(allMovies);

    return (
        <main className="min-h-screen bg-black pb-20 relative overflow-hidden">
            <div className="relative z-10">
                <MovieHero
                    title="Neon Horizon: The Awakening"
                    description="In a city that never sleeps, an AI detective uncovers a conspiracy that threatens the very fabric of reality. Witness the beginning of a new era where code meets consciousness."
                />

                <MovieSearchFilters
                    activeGenre={activeGenre}
                    onGenreChange={setActiveGenre}
                />

                <div className="space-y-4">
                    {filteredTrending.length > 0 && (
                        <MovieRail title="Trending Now" movies={filteredTrending} />
                    )}
                    {filteredNewReleases.length > 0 && (
                        <MovieRail title="New Releases" movies={filteredNewReleases} />
                    )}
                    {filteredAllMovies.length > 0 ? (
                        <MovieGrid title="All Movies" movies={filteredAllMovies} />
                    ) : (
                        <div className="py-20 text-center text-gray-500">
                            No movies found for {activeGenre}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
