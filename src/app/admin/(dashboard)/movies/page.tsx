"use client";

import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, Edit, Trash2, MoreVertical, X } from "lucide-react";
import { Movie } from "@/types/movie";
import { MovieForm } from "@/components/admin/MovieForm";
import { motion, AnimatePresence } from "framer-motion";

// Mock Data
const initialMovies: Movie[] = [
    {
        id: "1",
        title: "Neon Horizon",
        description: "A futuristic sci-fi thriller.",
        genre: "Sci-Fi",
        year: "2025",
        duration: "2h 10m",
        posterUrl: "",
        trailerUrl: "",
        publishLocations: { home: true, movies: true },
        status: "Published",
        views: "1.2M"
    },
    {
        id: "2",
        title: "The Last Echo",
        description: "A gripping mystery.",
        genre: "Thriller",
        year: "2024",
        duration: "1h 55m",
        posterUrl: "",
        trailerUrl: "",
        publishLocations: { home: false, movies: true },
        status: "Published",
        views: "850K"
    }
];

export default function AdminMoviesPage() {
    const [movies, setMovies] = React.useState<Movie[]>(initialMovies);
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [editingMovie, setEditingMovie] = React.useState<Movie | undefined>(undefined);

    const handleAddMovie = (data: Omit<Movie, "id" | "views">) => {
        const newMovie: Movie = {
            ...data,
            id: Math.random().toString(36).substr(2, 9),
            views: "0"
        };
        setMovies([...movies, newMovie]);
        setIsFormOpen(false);
    };

    const handleEditMovie = (data: Omit<Movie, "id" | "views">) => {
        if (!editingMovie) return;
        setMovies(movies.map(m => m.id === editingMovie.id ? { ...m, ...data } : m));
        setIsFormOpen(false);
        setEditingMovie(undefined);
    };

    const handleDeleteMovie = (id: string) => {
        if (confirm("Are you sure you want to delete this movie?")) {
            setMovies(movies.filter(m => m.id !== id));
        }
    };

    const openEditForm = (movie: Movie) => {
        setEditingMovie(movie);
        setIsFormOpen(true);
    };

    const openAddForm = () => {
        setEditingMovie(undefined);
        setIsFormOpen(true);
    };

    return (
        <div className="space-y-8 relative">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Movie Management</h2>
                    <p className="text-gray-400">Manage your film library and releases.</p>
                </div>
                <Button
                    onClick={openAddForm}
                    className="bg-gradient-to-r from-primary to-purple-600 border-none"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Movie
                </Button>
            </div>

            {/* Movie List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {movies.map((movie) => (
                    <Card key={movie.id} className="group relative overflow-hidden border-white/10 bg-black/40 backdrop-blur-sm hover:border-primary/50 transition-colors">
                        {/* Movie Poster Placeholder */}
                        <div className="h-48 bg-white/5 relative">
                            {movie.posterUrl ? (
                                <img
                                    src={movie.posterUrl}
                                    alt={movie.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                                    <span className="text-4xl font-bold opacity-20">POSTER</span>
                                </div>
                            )}
                            <div className="absolute top-4 right-4 flex gap-2">
                                <span className={`px-2 py-1 rounded text-xs font-medium
                                    ${movie.status === 'Published' ? 'bg-green-500/20 text-green-400' :
                                        movie.status === 'Draft' ? 'bg-gray-500/20 text-gray-400' :
                                            'bg-blue-500/20 text-blue-400'}`}>
                                    {movie.status}
                                </span>
                            </div>
                            <div className="absolute bottom-4 left-4 flex gap-2">
                                {movie.publishLocations.home && (
                                    <span className="px-2 py-1 rounded text-xs font-medium bg-purple-500/20 text-purple-400">
                                        Home
                                    </span>
                                )}
                                {movie.publishLocations.movies && (
                                    <span className="px-2 py-1 rounded text-xs font-medium bg-blue-500/20 text-blue-400">
                                        Movies
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="p-6">
                            <h3 className="text-xl font-bold text-white mb-1">{movie.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                                <span>{movie.year}</span>
                                <span>•</span>
                                <span>{movie.genre}</span>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                <div className="text-sm text-gray-500">
                                    {movie.views} views
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openEditForm(movie)}
                                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteMovie(movie.id)}
                                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Modal Form */}
            <AnimatePresence>
                {isFormOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-white/10">
                                <h2 className="text-xl font-bold text-white">
                                    {editingMovie ? "Edit Movie" : "Add New Movie"}
                                </h2>
                                <button
                                    onClick={() => setIsFormOpen(false)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="p-6 max-h-[80vh] overflow-y-auto">
                                <MovieForm
                                    initialData={editingMovie}
                                    onSubmit={editingMovie ? handleEditMovie : handleAddMovie}
                                    onCancel={() => setIsFormOpen(false)}
                                />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
