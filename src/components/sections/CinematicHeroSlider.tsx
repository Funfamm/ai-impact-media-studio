"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Play, ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";

// Mock Data for Slider
const SLIDES = [
    {
        id: 1,
        title: "Neon Horizon",
        tagline: "The future is brighter than you think.",
        description: "In a city that never sleeps, an AI detective uncovers a conspiracy that threatens the very fabric of reality.",
        image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2525&auto=format&fit=crop", // Cyberpunk/Neon city
        color: "from-cyan-500 to-blue-600"
    },
    {
        id: 2,
        title: "The Last Echo",
        tagline: "Silence speaks volumes.",
        description: "A solitary astronaut must decode the final transmission from a lost civilization before time runs out.",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop", // Space/Planet
        color: "from-purple-500 to-pink-600"
    },
    {
        id: 3,
        title: "Velvet Shadows",
        tagline: "Trust no one.",
        description: "A high-stakes noir thriller set in 1950s Paris, where every shadow hides a secret.",
        image: "https://images.unsplash.com/photo-1517604931442-71053e3e2e3c?q=80&w=2670&auto=format&fit=crop", // Noir/Shadowy
        color: "from-amber-500 to-red-600"
    }
];

export function CinematicHeroSlider() {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [direction, setDirection] = React.useState(0);

    // Auto-play
    React.useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 8000); // 8 seconds per slide
        return () => clearInterval(timer);
    }, [currentIndex]);

    const nextSlide = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    };

    const prevSlide = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    };

    const currentSlide = SLIDES[currentIndex];

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
    const imageVariants: any = {
        initial: (index: number) => ({
            scale: 1,
            x: "0%"
        }),
        animate: (index: number) => ({
            scale: 1.1,
            x: "0%", // No pan
            transition: {
                duration: 10,
                ease: "linear"
            }
        })
    };

    return (
        <section className="relative h-screen w-full overflow-hidden bg-black">
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.5 }
                    }}
                    className="absolute inset-0 w-full h-full"
                >
                    {/* Background Image with Ken Burns */}
                    <div className="absolute inset-0 overflow-hidden">
                        <motion.img
                            src={currentSlide.image}
                            alt={currentSlide.title}
                            className="w-full h-full object-cover"
                            custom={currentIndex}
                            variants={imageVariants}
                            initial="initial"
                            animate="animate"
                        />
                        {/* Gradient Overlay for Readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
                    </div>

                    {/* Content */}
                    <Container className="relative h-full flex items-end pb-32 z-10">
                        <div className="max-w-2xl">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                            >
                                <span className={`inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider uppercase rounded-full bg-gradient-to-r ${currentSlide.color} text-white`}>
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
                                    <Button size="lg" className={`bg-gradient-to-r ${currentSlide.color} hover:opacity-90 border-none text-white font-bold px-8`}>
                                        <Play className="mr-2 h-5 w-5 fill-current" />
                                        Watch Now
                                    </Button>

                                </div>
                            </motion.div>
                        </div>
                    </Container>
                </motion.div>
            </AnimatePresence>

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
                {SLIDES.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setDirection(index > currentIndex ? 1 : -1);
                            setCurrentIndex(index);
                        }}
                        className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex ? "w-8 bg-white" : "w-2 bg-white/30 hover:bg-white/50"
                            }`}
                    />
                ))}
            </div>
        </section>
    );
}
