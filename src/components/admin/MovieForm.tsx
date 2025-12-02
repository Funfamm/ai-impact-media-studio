"use client";

import * as React from "react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Loader2, Upload, X } from "lucide-react";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Movie } from "@/types/movie";

interface MovieFormProps {
    initialData?: Movie;
    onSubmit: (data: Omit<Movie, "id" | "createdAt">) => Promise<void>;
    onCancel: () => void;
    isLoading: boolean;
}

export function MovieForm({ initialData, onSubmit, onCancel, isLoading }: MovieFormProps) {
    const [formData, setFormData] = useState<Partial<Movie>>(
        initialData || {
            title: "",
            tagline: "",
            description: "",
            year: new Date().getFullYear().toString(),
            genre: "",
            duration: "",
            videoUrl: "",
            featured: false,
            sliderDuration: 8000,
        }
    );
    const [posterFile, setPosterFile] = useState<File | null>(null);
    const [posterPreview, setPosterPreview] = useState<string>(initialData?.posterUrl || "");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleToggle = (checked: boolean) => {
        setFormData((prev) => ({ ...prev, featured: checked }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPosterFile(file);
            setPosterPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            let posterUrl = formData.posterUrl || "";

            if (posterFile) {
                const storageRef = ref(storage, `posters/${Date.now()}_${posterFile.name}`);
                const snapshot = await uploadBytes(storageRef, posterFile);
                posterUrl = await getDownloadURL(snapshot.ref);
            }

            if (!posterUrl) {
                alert("Please upload a poster image.");
                return;
            }

            await onSubmit({
                title: formData.title!,
                tagline: formData.tagline || "",
                description: formData.description!,
                posterUrl,
                videoUrl: formData.videoUrl || "",
                year: formData.year!,
                genre: formData.genre!,
                duration: formData.duration || "",
                featured: formData.featured || false,
                sliderDuration: Number(formData.sliderDuration) || 8000,
            });
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Failed to save movie. Check console for details.");
        }
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
                        placeholder="e.g. Neon Horizon"
                        className="bg-white/5 border-white/10"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input
                        id="tagline"
                        name="tagline"
                        value={formData.tagline}
                        onChange={handleChange}
                        placeholder="e.g. The future is now."
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
                    required
                    rows={4}
                    className="flex w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-white"
                    placeholder="Movie synopsis..."
                />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                    <Label htmlFor="genre">Genre</Label>
                    <Input
                        id="genre"
                        name="genre"
                        value={formData.genre}
                        onChange={handleChange}
                        required
                        placeholder="Sci-Fi"
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
                        placeholder="2h 15m"
                        className="bg-white/5 border-white/10"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Poster Image</Label>
                <div
                    className="border-2 border-dashed border-white/10 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {posterPreview ? (
                        <div className="relative w-full max-w-[200px] aspect-[2/3]">
                            <img src={posterPreview} alt="Preview" className="w-full h-full object-cover rounded-md" />
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setPosterPreview("");
                                    setPosterFile(null);
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white hover:bg-red-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-400">Click to upload poster</p>
                        </div>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="videoUrl">Trailer URL (Video)</Label>
                <Input
                    id="videoUrl"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="bg-white/5 border-white/10"
                />
            </div>

            <div className="bg-white/5 p-4 rounded-lg space-y-4 border border-white/10">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label className="text-base">Featured in Hero Slider</Label>
                        <p className="text-sm text-gray-400">Show this movie in the main homepage slider</p>
                    </div>
                    {/* Simple Checkbox if Switch doesn't exist, but I'll try to use a checkbox styled as switch or just a checkbox */}
                    <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => handleToggle(e.target.checked)}
                        className="w-5 h-5 accent-primary"
                    />
                </div>

                {formData.featured && (
                    <div className="space-y-2">
                        <Label htmlFor="sliderDuration">Slider Duration (ms)</Label>
                        <Input
                            id="sliderDuration"
                            name="sliderDuration"
                            type="number"
                            value={formData.sliderDuration}
                            onChange={handleChange}
                            placeholder="8000"
                            className="bg-white/5 border-white/10"
                        />
                        <p className="text-xs text-gray-500">How long this slide stays visible (default: 8000ms)</p>
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-primary text-white">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? "Update Movie" : "Add Movie"}
                </Button>
            </div>
        </form>
    );
}
