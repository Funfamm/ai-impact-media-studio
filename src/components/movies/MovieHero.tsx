"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Play, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { VideoModal } from "@/components/ui/VideoModal";
import { useToast } from "@/components/ui/Toast";

interface MovieHeroProps {
    title: string;
    description: string;
    videoUrl?: string; // Optional for now, fallback to gradient
    posterUrl?: string;
    tags?: string[];
}

export function MovieHero({
    title,
    description,
    videoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    tags = ["Sci-Fi", "2025"]
}: MovieHeroProps) {
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const [isVideoOpen, setIsVideoOpen] = React.useState(false);
    const { showToast } = useToast();

    // Auto-pause on scroll logic
    React.useEffect(() => {
        const handleScroll = () => {
            if (!videoRef.current) return;
            if (window.scrollY > 50) {
                videoRef.current.pause();
            } else {
                videoRef.current.play().catch(() => { });
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="relative w-full overflow-hidden h-[60vh] md:h-[70vh] lg:h-[90vh]">
            <VideoModal
                isOpen={isVideoOpen}
                onClose={() => setIsVideoOpen(false)}
                videoUrl={videoUrl}
            />

            {/* Video Background */}
            <div className="absolute inset-0 bg-black">
                <video
                    ref={videoRef}
                    className="h-full w-full object-cover opacity-60"
                    src={videoUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            </div>

            {/* Content */}
            <Container className="relative z-10 h-full flex flex-col justify-end pb-20 md:pb-24 lg:pb-32">
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
                            onClick={() => setIsVideoOpen(true)}
                        >
                            <Play className="fill-current h-5 w-5" />
                            Play
                        </Button>
                    </div>
                </motion.div>
            </Container>
        </div>
    );
}
