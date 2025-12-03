"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Movie } from "@/types/movie";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Plus, Search, Edit2, Trash2, Film, Star, X, Eye, Check, Play } from "lucide-react";
import { MovieForm } from "@/components/admin/MovieForm";
import { useToast } from "@/components/ui/Toast";
import { AnimatePresence, motion } from "framer-motion";

export default function AdminMoviesPage() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMovie, setEditingMovie] = useState<Movie | undefined>(undefined);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
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
            if (selectedMovie?.id === id) setSelectedMovie(null);
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
                if (selectedMovie?.id === editingMovie.id) {
                    setSelectedMovie({ ...editingMovie, ...data } as Movie);
                }
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
        <div className="space-y-8 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Movies & Trailers</h1>
                    <p className="text-gray-400">Manage your film library, trailers, and featured content.</p>
                </div>
                <Button onClick={handleAddMovie} className="bg-primary text-white gap-2">
                    <Plus className="h-4 w-4" /> Add Movie
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* List View */}
                <div className="lg:col-span-2">
                    <Card className="border-white/10 bg-black/40 backdrop-blur-sm overflow-hidden">
                        <div className="p-4 border-b border-white/10">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search movies..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 bg-white/5 border-white/10 text-white"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 text-gray-400 text-sm uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4 font-medium">Movie</th>
                                        <th className="p-4 font-medium">Genre</th>
                                        <th className="p-4 font-medium">Year</th>
                                        <th className="p-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {isLoading ? (
                                        <tr><td colSpan={4} className="p-8 text-center text-gray-500">Loading...</td></tr>
                                    ) : filteredMovies.length === 0 ? (
                                        <tr><td colSpan={4} className="p-8 text-center text-gray-500">No movies found.</td></tr>
                                    ) : (
                                        filteredMovies.map((movie) => (
                                            <tr
                                                key={movie.id}
                                                className={`hover:bg-white/5 transition-colors cursor-pointer ${selectedMovie?.id === movie.id ? 'bg-white/10' : ''}`}
                                                onClick={() => setSelectedMovie(movie)}
                                            >
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-12 w-8 rounded bg-white/5 overflow-hidden flex-shrink-0">
                                                            <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div>
                                                            <p className="text-white font-medium line-clamp-1">{movie.title}</p>
                                                            {movie.featured && (
                                                                <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded border border-yellow-500/30 flex items-center gap-1 w-fit mt-1">
                                                                    <Star className="h-2 w-2 fill-current" /> Featured
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-gray-300 text-sm">{movie.genre}</td>
                                                <td className="p-4 text-gray-300 text-sm">{movie.year}</td>
                                                <td className="p-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleEditMovie(movie); }}
                                                            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleDeleteMovie(movie.id!); }}
                                                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* Detail View */}
                <div className="lg:col-span-1">
                    <AnimatePresence mode="wait">
                        {selectedMovie ? (
                            <motion.div
                                key={selectedMovie.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6"
                            >
                                <Card className="p-6 border-white/10 bg-black/40 backdrop-blur-sm">
                                    <div className="flex items-start justify-between mb-6">
                                        <h3 className="text-xl font-bold text-white">Movie Details</h3>
                                        <Button variant="ghost" size="sm" onClick={() => setSelectedMovie(null)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="aspect-[2/3] w-full rounded-xl overflow-hidden mb-6 relative group">
                                        <img src={selectedMovie.posterUrl} alt={selectedMovie.title} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <h2 className="text-2xl font-bold text-white mb-1">{selectedMovie.title}</h2>
                                            <p className="text-gray-300 italic text-sm">{selectedMovie.tagline}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                                                <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Year</label>
                                                <p className="text-white font-medium">{selectedMovie.year}</p>
                                            </div>
                                            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                                                <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Duration</label>
                                                <p className="text-white font-medium">{selectedMovie.duration || "N/A"}</p>
                                            </div>
                                        </div>

                                        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                                            <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Genre</label>
                                            <p className="text-white font-medium">{selectedMovie.genre}</p>
                                        </div>

                                        <div className="pt-4 border-t border-white/10">
                                            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Synopsis</label>
                                            <p className="text-gray-300 text-sm leading-relaxed">
                                                {selectedMovie.description}
                                            </p>
                                        </div>

                                        {selectedMovie.videoUrl && (
                                            <div className="pt-4 border-t border-white/10">
                                                <a
                                                    href={selectedMovie.videoUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center gap-2 w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
                                                >
                                                    <Play className="h-4 w-4 fill-current" /> Watch Trailer
                                                </a>
                                            </div>
                                        )}

                                        {selectedMovie.featured && (
                                            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-yellow-400">
                                                <span className="flex items-center gap-2 text-sm font-medium">
                                                    <Star className="h-4 w-4 fill-current" /> Featured Movie
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    Slider: {selectedMovie.sliderDuration || 8000}ms
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-3 mt-6 pt-6 border-t border-white/10">
                                        <Button
                                            onClick={() => handleEditMovie(selectedMovie)}
                                            className="flex-1 bg-white text-black hover:bg-gray-200"
                                        >
                                            <Edit2 className="mr-2 h-4 w-4" /> Edit
                                        </Button>
                                        <Button
                                            onClick={() => handleDeleteMovie(selectedMovie.id!)}
                                            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500 p-8 border border-white/5 rounded-xl border-dashed min-h-[400px]">
                                <div className="text-center">
                                    <Film className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                    <p>Select a movie to view details</p>
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

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
