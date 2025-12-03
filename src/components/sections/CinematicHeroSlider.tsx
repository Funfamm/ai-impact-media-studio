"use client";

import * as React from "react";
import { motion, AnimatePresence, useScroll, useTransform, Variants } from "framer-motion";
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
        sliderDuration: 8000,
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
        sliderDuration: 8000,
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
        sliderDuration: 8000,
        createdAt: new Date().toISOString()
    }
];

export function CinematicHeroSlider() {
    const [slides, setSlides] = React.useState<Movie[]>([]);
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [direction, setDirection] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isVideoOpen, setIsVideoOpen] = React.useState(false);

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

        const currentSlideDuration = slides[currentIndex]?.sliderDuration || 8000;

        const timer = setInterval(() => {
            nextSlide();
        }, currentSlideDuration);
        return () => clearInterval(timer);
    }, [currentIndex, slides, nextSlide]);

    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 1000], [0, 400]);

    if (isLoading) {
        return <div className="h-screen w-full bg-black flex items-center justify-center text-white">Loading Experience...</div>;
    }

    if (slides.length === 0) {
        return null; // Or a default static hero
    }

    const currentSlide = slides[currentIndex];

    // Animation Variants
    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
            zIndex: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    // Ken Burns Effect Variants (Zoom Only)
    const imageVariants: Variants = {
        initial: () => ({
            scale: 1,
            x: "0%"
        }),
        animate: () => ({
            scale: 1.1,
            x: "0%", // No pan
            transition: {
                duration: (currentSlide.sliderDuration || 8000) / 1000 + 2, // Slightly longer than slide duration
                ease: "linear"
            }
        })
    };

    return (
        <section className="relative h-screen w-full overflow-hidden bg-black">
            <VideoModal
                isOpen={isVideoOpen}
                onClose={() => setIsVideoOpen(false)}
                videoUrl={currentSlide?.videoUrl}
            />

            <div className="absolute inset-0 w-full h-full">
                {/* Background Image/Video */}
                <div className="absolute inset-0 overflow-hidden">
                    {currentSlide.videoUrl ? (
                        <video
                            src={currentSlide.videoUrl}
                            className="w-full h-full object-cover"
                            autoPlay
                            muted
                            loop
                            playsInline
                        />
                    ) : (
                        <NextImage
                            src={currentSlide.posterUrl}
                            alt={currentSlide.title}
                            fill
                            priority
                            className="object-cover"
                        />
                    )}
                    {/* Gradient Overlay for Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
                </div>

                {/* Content */}
                <Container className="relative h-full flex items-end pb-32 z-10">
                    <div className="max-w-2xl">
                        <div>
                            <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider uppercase rounded-full bg-gradient-to-r from-primary to-purple-600 text-white">
                                Now Streaming
                            </span>
                            <h1 className="text-5xl md:text-7xl font-bold text-white mb-2 tracking-tight">
                                {currentSlide.title}
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-300 mb-6 font-light italic">
                                {currentSlide.tagline}
                            </p>
                            <p className="text-gray-400 mb-8 leading-relaxed max-w-lg">
                                {currentSlide.description}
                            </p>

                            <div className="flex flex-wrap gap-4">
                                {/* <Magnetic> */}
                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 border-none text-white font-bold px-8"
                                    onClick={() => setIsVideoOpen(true)}
                                >
                                    <Play className="mr-2 h-5 w-5 fill-current" />
                                    Watch Trailer
                                </Button>
                                {/* </Magnetic> */}
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Scroll</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-white/0 via-white/50 to-white/0" />
            </div>

            {/* Navigation Controls */}
            <div className="absolute bottom-12 right-12 z-20 flex gap-4">
                <button
                    onClick={prevSlide}
                    className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-colors border border-white/10"
                >
                    <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                    onClick={nextSlide}
                    className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-colors border border-white/10"
                >
                    <ChevronRight className="h-6 w-6" />
                </button>
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setDirection(index > currentIndex ? 1 : -1);
                            setCurrentIndex(index);
                        }}
                        className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex ? "w-8 bg-white" : "w-2 bg-white/30 hover:bg-white/50"}`}
                    />
                ))}
            </div>
        </section>
    );
}
