"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Movie } from "@/types/movie";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Plus, Search, Edit2, Trash2, Film, Star, X } from "lucide-react";
import { MovieForm } from "@/components/admin/MovieForm";
import { useToast } from "@/components/ui/Toast";
import { AnimatePresence, motion } from "framer-motion";

export default function AdminMoviesPage() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMovie, setEditingMovie] = useState<Movie | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showToast } = useToast();

    // Real-time listener
    useEffect(() => {
        const q = query(collection(db, "movies"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const moviesData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Movie[];
            setMovies(moviesData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching movies:", error);
            showToast("Failed to load movies", "error");
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredMovies = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.genre.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddMovie = () => {
        setEditingMovie(undefined);
        setIsModalOpen(true);
    };

    const handleEditMovie = (movie: Movie) => {
        setEditingMovie(movie);
        setIsModalOpen(true);
    };

    const handleDeleteMovie = async (id: string) => {
        if (!confirm("Are you sure you want to delete this movie? This cannot be undone.")) return;

        try {
            await deleteDoc(doc(db, "movies", id));
            showToast("Movie deleted successfully", "success");
        } catch (error) {
            console.error("Error deleting movie:", error);
            showToast("Failed to delete movie", "error");
        }
    };

    const handleSubmit = async (data: Omit<Movie, "id" | "createdAt">) => {
        setIsSubmitting(true);
        try {
            if (editingMovie?.id) {
                // Update
                await updateDoc(doc(db, "movies", editingMovie.id), {
                    ...data
                });
                showToast("Movie updated successfully", "success");
            } else {
                // Create
                await addDoc(collection(db, "movies"), {
                    ...data,
                    createdAt: new Date().toISOString(),
                });
                showToast("Movie added successfully", "success");
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving movie:", error);
            showToast("Failed to save movie", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Movies & Trailers</h1>
                    <p className="text-gray-400">Manage your film library, trailers, and featured content.</p>
                </div>
                <Button onClick={handleAddMovie} className="bg-primary text-white gap-2">
                    <Plus className="h-4 w-4" /> Add Movie
                </Button>
            </div>

            <Card className="p-4 bg-black/40 border-white/10 backdrop-blur-xl">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search movies by title or genre..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white/5 border-white/10 text-white"
                    />
                </div>
            </Card>

            {isLoading ? (
                <div className="text-center py-20 text-gray-500">Loading library...</div>
            ) : filteredMovies.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                    <Film className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No movies found. Add your first one!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMovies.map((movie) => (
                        <motion.div
                            key={movie.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="group relative bg-zinc-900/50 border border-white/5 rounded-xl overflow-hidden hover:border-primary/50 transition-colors"
                        >
                            <div className="aspect-video relative overflow-hidden">
                                <img
                                    src={movie.posterUrl}
                                    alt={movie.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                {movie.featured && (
                                    <div className="absolute top-2 right-2 bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded-full border border-yellow-500/50 flex items-center gap-1 backdrop-blur-md">
                                        <Star className="h-3 w-3 fill-current" /> Featured
                                    </div>
                                )}
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h3 className="text-lg font-bold text-white truncate">{movie.title}</h3>
                                    <p className="text-sm text-gray-400 truncate">{movie.tagline}</p>
                                </div>
                            </div>
                            <div className="p-4 flex items-center justify-between">
                                <div className="text-xs text-gray-500">
                                    {movie.year} • {movie.genre} • {movie.duration || "N/A"}
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="ghost" onClick={() => handleEditMovie(movie)}>
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300" onClick={() => handleDeleteMovie(movie.id!)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal Overlay */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white">
                                    {editingMovie ? "Edit Movie" : "Add New Movie"}
                                </h2>
                                <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                            <div className="p-6 overflow-y-auto">
                                <MovieForm
                                    initialData={editingMovie}
                                    onSubmit={handleSubmit}
                                    onCancel={() => setIsModalOpen(false)}
                                    isLoading={isSubmitting}
                                />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
