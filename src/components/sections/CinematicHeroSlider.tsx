"use client";

import * as React from "react";
import { motion, AnimatePresence, useScroll, useTransform, Variants } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Magnetic } from "@/components/ui/Magnetic";
import { VideoModal } from "@/components/ui/VideoModal";
import { Play, ChevronRight, ChevronLeft } from "lucide-react";
import NextImage from "next/image";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Movie } from "@/types/movie";

const MotionImage = motion(NextImage);

const DEMO_SLIDES: Movie[] = [
    {
        id: "demo-1",
        title: "Neon Genesis",
        tagline: "The future is now.",
        description: "In a world dominated by cybernetic enhancements, one rebel fights to reclaim humanity's soul.",
        posterUrl: "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=2574&auto=format&fit=crop",
        // videoUrl: "https://cdn.coverr.co/videos/coverr-cyberpunk-city-lights-5348/1080p.mp4", // Optional: Add a real video URL if available
        year: "2045",
        genre: "Sci-Fi",
        featured: true,
        sliderDuration: 4,
        createdAt: new Date().toISOString()
    },
    {
        id: "demo-2",
        title: "Deep Space",
        tagline: "Silence is the loudest scream.",
        description: "A research vessel discovers a signal from the edge of the galaxy, but what they find is not what they expected.",
        posterUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop",
        year: "2102",
        genre: "Sci-Fi / Horror",
        featured: true,
        sliderDuration: 4,
        createdAt: new Date().toISOString()
    },
    {
        id: "demo-3",
        title: "Midnight Run",
        tagline: "Speed is the only escape.",
        description: "An underground racer gets caught in a high-stakes heist that threatens to destroy everything he loves.",
        posterUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2698&auto=format&fit=crop",
        year: "2023",
        genre: "Action",
        featured: true,
        sliderDuration: 4,
        createdAt: new Date().toISOString()
    }
];

export function CinematicHeroSlider() {
    const [slides, setSlides] = React.useState<Movie[]>([]);
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [direction, setDirection] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isVideoOpen, setIsVideoOpen] = React.useState(false);
    const [currentVideoUrl, setCurrentVideoUrl] = React.useState("");

    // Fetch Featured Movies
    React.useEffect(() => {
        const fetchSlides = async () => {
            try {
                const q = query(collection(db, "movies"), where("featured", "==", true));
                const snapshot = await getDocs(q);
                const fetchedSlides = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Movie[];

                // Filter out invalid slides
                const validSlides = fetchedSlides.filter(slide => slide.title && slide.posterUrl);

                if (validSlides.length > 0) {
                    setSlides(validSlides);
                } else {
                    // Fallback to demo slides
                    setSlides(DEMO_SLIDES);
                }
            } catch (error) {
                console.error("Error fetching hero slides:", error);
                setSlides(DEMO_SLIDES); // Fallback on error
            } finally {
                setIsLoading(false);
            }
        };

        fetchSlides();
    }, []);

    const nextSlide = React.useCallback(() => {
        if (slides.length === 0) return;
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    const prevSlide = React.useCallback(() => {
        if (slides.length === 0) return;
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    }, [slides.length]);

    // Auto-play
    React.useEffect(() => {
        if (slides.length === 0) return;

        // Interpret duration as seconds (default to 4 seconds if missing)
        const rawDuration = slides[currentIndex]?.sliderDuration || 4;
        const durationMs = rawDuration * 1000;

        const timer = setInterval(() => {
            nextSlide();
        }, durationMs);
        return () => clearInterval(timer);
    }, [currentIndex, slides, nextSlide]);

    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 1000], [0, 400]);

    if (isLoading) {
        return <div className="h-screen w-full bg-black flex items-center justify-center text-white">Loading Experience...</div>;
    }

    if (slides.length === 0) {
        return null;
    }

    const currentSlide = slides[currentIndex];

    // Smooth Crossfade Variants
    const slideVariants = {
        enter: (direction: number) => ({
            opacity: 0,
            scale: 1.05,
        }),
        center: {
            zIndex: 1,
            opacity: 1,
            scale: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            opacity: 0,
            scale: 1, // Keep scale stable on exit to avoid jarring shrink
        })
    };

    // Ken Burns Effect (Gentle Zoom)
    const kenBurnsVariants: Variants = {
        initial: { scale: 1 },
        animate: {
            scale: 1.1,
            transition: {
                duration: ((currentSlide.sliderDuration || 4) + 2), // Ensure zoom lasts longer than slide
                ease: "linear"
            }
        }
    };

    return (
        <section className="relative w-full aspect-[9/16] md:aspect-auto md:h-screen overflow-hidden bg-black">
            <VideoModal
                isOpen={isVideoOpen}
                onClose={() => setIsVideoOpen(false)}
                videoUrl={currentVideoUrl}
            />

            <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ opacity: { duration: 1.2, ease: "easeInOut" } }}
                    className="absolute inset-0 w-full h-full"
                >
                    {/* Background Poster Container */}
                    <div
                        className="absolute inset-0 overflow-hidden cursor-pointer group"
                        onClick={() => {
                            if (currentSlide.videoUrl) {
                                setCurrentVideoUrl(currentSlide.videoUrl);
                                setIsVideoOpen(true);
                            }
                        }}
                    >
                        <motion.div
                            variants={kenBurnsVariants}
                            initial="initial"
                            animate="animate"
                            className="w-full h-full"
                        >
                            <NextImage
                                src={currentSlide.posterUrl}
                                alt={currentSlide.title}
                                fill
                                priority
                                className="object-cover group-hover:opacity-80 transition-opacity"
                            />
                        </motion.div>

                        {/* Play Icon Overlay on Hover */}
                        {currentSlide.videoUrl && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                    <Play className="h-12 w-12 text-white fill-white ml-1" />
                                </div>
                            </div>
                        )}

                        {/* Gradient Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent pointer-events-none" />
                    </div>

                    {/* Content */}
                    <Container className="relative h-full flex items-end pb-8 md:pb-8 z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="max-w-2xl"
                        >
                            <div>
                                <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider uppercase rounded-full bg-gradient-to-r from-primary to-purple-600 text-white">
                                    Now Streaming
                                </span>
                                <h1 className="text-2xl md:text-7xl font-bold text-white mb-2 tracking-tight">
                                    {currentSlide.title}
                                </h1>
                                <p className="text-xl md:text-2xl text-gray-300 mb-6 font-light italic">
                                    {currentSlide.tagline}
                                </p>

                                <p className="hidden md:block text-gray-400 mb-8 leading-relaxed max-w-lg">
                                    {currentSlide.description}
                                </p>

                                <div className="flex flex-wrap gap-4">
                                    <Button
                                        size="lg"
                                        className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 border-none text-white font-bold px-8"
                                        onClick={() => {
                                            if (currentSlide.videoUrl) {
                                                setCurrentVideoUrl(currentSlide.videoUrl);
                                                setIsVideoOpen(true);
                                            }
                                        }}
                                    >
                                        <Play className="mr-2 h-5 w-5 fill-current" />
                                        Watch Trailer
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </Container>
                </motion.div >
            </AnimatePresence >






        </section >
    );
}
