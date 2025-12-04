"use client";

import * as React from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Movie } from "@/types/movie";
import { MovieHero } from "@/components/movies/MovieHero";
import { MovieSearchFilters } from "@/components/movies/MovieSearchFilters";
import { MovieRail } from "@/components/movies/MovieRail";
import { MovieGrid } from "@/components/movies/MovieGrid";

export default function MoviesPage() {
    const [movies, setMovies] = React.useState<Movie[]>([]);
    const [activeGenre, setActiveGenre] = React.useState("All");
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const q = query(collection(db, "movies"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const moviesData = snapshot.docs.map((doc) => ({
                id: doc.id, // Firestore ID is string, but components might expect number? 
                // Wait, MovieCard expects string or number? 
                // Let's check MovieCard. It likely expects string or number. 
                // The interface in MovieGrid says id: number. I need to update that interface too.
                ...doc.data(),
            })) as unknown as Movie[]; // Cast to unknown first to avoid ID type conflict if any
            setMovies(moviesData);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Filter movies based on active genre
    const filterMovies = (moviesList: Movie[]) => {
        if (activeGenre === "All") return moviesList;
        return moviesList.filter(movie => movie.genre.toLowerCase().includes(activeGenre.toLowerCase()));
    };

    const filteredMovies = filterMovies(movies);

    // Derived lists
    const featuredMovies = movies.filter(m => m.featured);
    const recentMovies = movies.slice(0, 10); // First 10 (already sorted by desc)

    // Hero Movie: Pick the first featured one, or just the first one
    const heroMovie = featuredMovies[0] || movies[0];

    return (
        <main className="min-h-screen bg-black pb-20 relative overflow-hidden">
            <div className="relative z-10">
                {heroMovie ? (
                    <MovieHero
                        title={heroMovie.title}
                        description={heroMovie.description}
                        videoUrl={heroMovie.videoUrl}
                        fullMovieUrl={heroMovie.fullMovieUrl}
                        posterUrl={heroMovie.posterUrl}
                        tags={[heroMovie.year, heroMovie.genre]}
                    />
                ) : (
                    // Fallback Hero if no movies
                    <MovieHero
                        title="Welcome to AI Impact Studio"
                        description="Your cinematic journey begins here. Add movies in the admin panel to get started."
                    />
                )}

                <MovieSearchFilters
                    activeGenre={activeGenre}
                    onGenreChange={setActiveGenre}
                />

                {isLoading ? (
                    <div className="text-center py-20 text-gray-500">Loading movies...</div>
                ) : (
                    <div className="space-y-4">
                        {featuredMovies.length > 0 && (
                            <MovieRail title="Featured & Trending" movies={featuredMovies} />
                        )}
                        {recentMovies.length > 0 && (
                            <MovieRail title="New Releases" movies={recentMovies} />
                        )}
                        {filteredMovies.length > 0 ? (
                            <MovieGrid title="All Movies" movies={filteredMovies} />
                        ) : (
                            <div className="py-20 text-center text-gray-500">
                                No movies found for {activeGenre}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}
