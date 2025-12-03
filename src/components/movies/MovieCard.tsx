"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import NextImage from "next/image";

// Inline cn for safety if utils not found (though it should be)
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
function cnSafe(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface MovieCardProps {
    title: string;
    imageUrl?: string;
    year?: string;
    genre?: string;
    className?: string;
    videoUrl?: string;
}

import * as React from "react";
import { VideoModal } from "@/components/ui/VideoModal";

export function MovieCard({ title, imageUrl, year, genre, className, videoUrl }: MovieCardProps) {
    const [isVideoOpen, setIsVideoOpen] = React.useState(false);

    return (
        <>
            <VideoModal
                isOpen={isVideoOpen}
                onClose={() => setIsVideoOpen(false)}
                videoUrl={videoUrl}
            />
            <div
                className={cnSafe("flex flex-col gap-2 group cursor-pointer", className)}
                onClick={() => setIsVideoOpen(true)}
            >
                {/* Thumbnail Container */}
                <div className="relative overflow-hidden rounded-lg bg-surface-hover aspect-[1/1.4] min-w-[100px] min-h-[140px]">
                    {imageUrl ? (
                        <NextImage
                            src={imageUrl}
                            alt={title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="h-full w-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                            <span className="text-xs text-gray-600 font-mono">NO IMAGE</span>
                        </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Play className="h-6 w-6 text-white fill-current" />
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div>
                    <h3 className="movie-title font-bold text-gray-100 group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span>{year || "2025"}</span>
                        <span>•</span>
                        <span className="truncate">{genre || "Sci-Fi"}</span>
                    </div>
                </div>
            </div>
        </>
    );
}
