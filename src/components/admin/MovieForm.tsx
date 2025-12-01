"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Movie } from "@/types/movie";
import { X, Save } from "lucide-react";
import { FileUpload } from "@/components/admin/FileUpload";

interface MovieFormProps {
    initialData?: Movie;
    onSubmit: (data: Omit<Movie, "id" | "views">) => void;
    onCancel: () => void;
}

export function MovieForm({ initialData, onSubmit, onCancel }: MovieFormProps) {
    const [formData, setFormData] = React.useState<Omit<Movie, "id" | "views">>({
        title: initialData?.title || "",
        description: initialData?.description || "",
        genre: initialData?.genre || "",
        year: initialData?.year || new Date().getFullYear().toString(),
        duration: initialData?.duration || "",
        posterUrl: initialData?.posterUrl || "",
        trailerUrl: initialData?.trailerUrl || "",
        videoUrl: initialData?.videoUrl || "",
        publishLocations: initialData?.publishLocations || { home: false, movies: true },
        status: initialData?.status || "Draft",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (location: "home" | "movies") => {
        setFormData(prev => ({
            ...prev,
            publishLocations: {
                ...prev.publishLocations,
                [location]: !prev.publishLocations[location]
            }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="bg-white/5 border-white/10"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="genre">Genre</Label>
                    <select
                        id="genre"
                        name="genre"
                        value={formData.genre}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md bg-[#0a0a0a] border border-white/10 p-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                        <option value="" disabled>Select a Genre</option>
                        <option value="Action">Action</option>
                        <option value="Adventure">Adventure</option>
                        <option value="Animation">Animation</option>
                        <option value="Comedy">Comedy</option>
                        <option value="Crime">Crime</option>
                        <option value="Documentary">Documentary</option>
                        <option value="Drama">Drama</option>
                        <option value="Family">Family</option>
                        <option value="Fantasy">Fantasy</option>
                        <option value="Horror">Horror</option>
                        <option value="Music">Music</option>
                        <option value="Mystery">Mystery</option>
                        <option value="Romance">Romance</option>
                        <option value="Sci-Fi">Sci-Fi</option>
                        <option value="Thriller">Thriller</option>
                        <option value="War">War</option>
                        <option value="Western">Western</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input
                        id="year"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        required
                        className="bg-white/5 border-white/10"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        placeholder="e.g. 2h 15m"
                        className="bg-white/5 border-white/10"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full rounded-md bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <FileUpload
                        label="Movie Poster"
                        accept="image/*"
                        value={formData.posterUrl}
                        onChange={(url) => setFormData(prev => ({ ...prev, posterUrl: url }))}
                    />
                </div>
                <div className="space-y-2">
                    <FileUpload
                        label="Trailer Video"
                        accept="video/*"
                        value={formData.trailerUrl}
                        onChange={(url) => setFormData(prev => ({ ...prev, trailerUrl: url }))}
                    />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-medium text-gray-300">Full Movie File</Label>
                        <span className="text-xs text-yellow-500/80 bg-yellow-500/10 px-2 py-0.5 rounded">
                            Catalog Only
                        </span>
                    </div>
                    <FileUpload
                        label="Upload Full Movie"
                        accept="video/*"
                        value={formData.videoUrl}
                        onChange={(url) => setFormData(prev => ({ ...prev, videoUrl: url }))}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        This file will only be accessible in the Movie Catalog view.
                    </p>
                </div>
            </div>

            <div className="space-y-4 border-t border-white/10 pt-4">
                <Label>Publish Settings</Label>
                <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.publishLocations.home}
                            onChange={() => handleCheckboxChange("home")}
                            className="rounded border-white/20 bg-white/5 text-primary focus:ring-primary"
                        />
                        <span className="text-gray-300">Show on Home Page</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.publishLocations.movies}
                            onChange={() => handleCheckboxChange("movies")}
                            className="rounded border-white/20 bg-white/5 text-primary focus:ring-primary"
                        />
                        <span className="text-gray-300">Show on Movies Page</span>
                    </label>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full rounded-md bg-[#0a0a0a] border border-white/10 p-2 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                        <option value="Draft">Draft</option>
                        <option value="Published">Published</option>
                        <option value="Scheduled">Scheduled</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel} className="border-white/10 hover:bg-white/5 text-white">
                    Cancel
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                    <Save className="mr-2 h-4 w-4" />
                    Save Movie
                </Button>
            </div>
        </form>
    );
}
