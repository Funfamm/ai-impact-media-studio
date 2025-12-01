"use client";

import { Container } from "@/components/ui/Container";
import { MovieCard } from "./MovieCard";

interface Movie {
    id: number;
    title: string;
    year: string;
    genre: string;
    imageUrl?: string;
}

interface MovieGridProps {
    title: string;
    movies: Movie[];
}

export function MovieGrid({ title, movies }: MovieGridProps) {
    return (
        <section className="py-8">
            <Container>
                <h2 className="text-[16px] font-[600] md:text-[20px] md:font-[700] text-white mb-6">
                    {title}
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
                    {movies.map((movie) => (
                        <MovieCard
                            key={movie.id}
                            title={movie.title}
                            year={movie.year}
                            genre={movie.genre}
                            imageUrl={movie.imageUrl}
                            className="w-full"
                        />
                    ))}
                </div>
            </Container>
        </section>
    );
}
