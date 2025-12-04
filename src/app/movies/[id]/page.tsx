"use client";

import * as React from "react";
import { useParams, useSearchParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Movie } from "@/types/movie";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Play, ArrowLeft } from "lucide-react";
import Link from "next/link";
import NextImage from "next/image";

export default function MovieDetailsPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const id = params.id as string;
    const shouldAutoPlay = searchParams.get("autoplay") === "true";

    const [movie, setMovie] = React.useState<Movie | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isPlaying, setIsPlaying] = React.useState(false);

    React.useEffect(() => {
        const fetchMovie = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, "movies", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setMovie({ id: docSnap.id, ...docSnap.data() } as Movie);
                } else {
                    console.error("No such movie!");
                }
            } catch (error) {
                console.error("Error fetching movie:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMovie();
    }, [id]);

    // Set initial playing state based on autoplay param, but only once movie is loaded or immediately if we trust param
    React.useEffect(() => {
        if (shouldAutoPlay) {
            setIsPlaying(true);
        }
    }, [shouldAutoPlay]);

    if (isLoading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
    if (!movie) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Movie not found</div>;

    return (
        <main className="min-h-screen bg-black text-white pt-24 pb-20">
            <Container>
                <Link href="/movies" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Movies
                </Link>

                {/* 16:9 Aspect Ratio Container */}
                <div className="relative w-full aspect-[16/9] bg-gray-900 rounded-2xl overflow-hidden mb-8 shadow-2xl border border-white/10">
                    {isPlaying && movie.videoUrl ? (
                        <video
                            src={movie.videoUrl}
                            className="w-full h-full object-cover"
                            controls
                            autoPlay
                        />
                    ) : (
                        <div className="relative w-full h-full group">
                            <NextImage
                                src={movie.posterUrl}
                                alt={movie.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                {movie.videoUrl && (
                                    <Button
                                        size="lg"
                                        onClick={() => setIsPlaying(true)}
                                        className="rounded-full w-20 h-20 pl-1 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:scale-110 transition-all"
                                    >
                                        <Play className="h-8 w-8 fill-white text-white" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">{movie.title}</h1>
                    {movie.tagline && (
                        <p className="text-xl text-gray-400 italic mb-6">{movie.tagline}</p>
                    )}

                    <div className="flex flex-wrap gap-4 mb-8 text-sm text-gray-300">
                        <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10">{movie.year}</span>
                        <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10">{movie.genre}</span>
                        {movie.duration && <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10">{movie.duration}</span>}
                    </div>

                    <p className="text-lg leading-relaxed text-gray-300 mb-12">
                        {movie.description}
                    </p>
                </div>
            </Container>
        </main>
    );
}
