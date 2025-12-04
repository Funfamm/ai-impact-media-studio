"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import NextImage from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { VideoModal } from "@/components/ui/VideoModal";
import { useToast } from "@/components/ui/Toast";

interface MovieHeroProps {
    title: string;
    description: string;
    videoUrl?: string;
    fullMovieUrl?: string;
    posterUrl?: string;
    tags?: string[];
}

export function MovieHero({
    title,
    description,
    videoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    fullMovieUrl,
    posterUrl,
    tags = ["Sci-Fi", "2025"]
}: MovieHeroProps) {
    const [isVideoOpen, setIsVideoOpen] = React.useState(false);
    const [currentVideoUrl, setCurrentVideoUrl] = React.useState("");
    const { showToast } = useToast();

    const handlePosterClick = () => {
        if (videoUrl) {
            setCurrentVideoUrl(videoUrl);
            setIsVideoOpen(true);
        }
    };

    const handlePlayClick = () => {
        const urlToPlay = fullMovieUrl || videoUrl;
        if (urlToPlay) {
            setCurrentVideoUrl(urlToPlay);
            setIsVideoOpen(true);
        } else {
            showToast("No video available", "error");
        }
    };

    return (
        <div className="relative w-full overflow-hidden h-[60vh] md:h-[70vh] lg:h-[90vh]">
            <VideoModal
                isOpen={isVideoOpen}
                onClose={() => setIsVideoOpen(false)}
                videoUrl={currentVideoUrl}
            />

            {/* Poster Background */}
            <div
                className="absolute inset-0 bg-black cursor-pointer group"
                onClick={handlePosterClick}
            >
                {posterUrl ? (
                    <>
                        <NextImage
                            src={posterUrl}
                            alt={title}
                            fill
                            className="object-cover opacity-60 group-hover:opacity-70 transition-opacity"
                            priority
                        />
                        {videoUrl && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                    <Play className="h-10 w-10 text-white fill-white ml-1" />
                                </div>
                            </div>
                        )}
                    </>
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
            </div>

            {/* Content */}
            <Container className="relative z-10 h-full flex flex-col justify-end pb-8 md:pb-24 lg:pb-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl"
                >
                    <div className="flex items-center gap-3 mb-4">
                        {tags.map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-white/10 backdrop-blur-md rounded text-xs font-medium text-gray-200">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <h1 className="hero-title font-bold mb-4 text-white">
                        {title}
                    </h1>

                    <p className="text-gray-300 text-sm md:text-lg mb-8 line-clamp-3 md:line-clamp-2 max-w-xl">
                        {description}
                    </p>

                    <div className="flex gap-4">
                        <Button
                            size="lg"
                            className="gap-2 bg-white text-black hover:bg-gray-200 border-none"
                            onClick={handlePlayClick}
                        >
                            <Play className="fill-current h-5 w-5" />
                            Play {fullMovieUrl ? "Movie" : "Trailer"}
                        </Button>
                    </div>
                </motion.div>
            </Container>
        </div>
    );
}
