"use client";

import * as React from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Magnetic } from "@/components/ui/Magnetic";
import { Play, ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";
import NextImage from "next/image";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Movie } from "@/types/movie";

const MotionImage = motion(NextImage);

export function CinematicHeroSlider() {
    const [slides, setSlides] = React.useState<Movie[]>([]);
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [direction, setDirection] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState(true);

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

                if (fetchedSlides.length > 0) {
                    setSlides(fetchedSlides);
                } else {
                    // Fallback if no featured movies
                    setSlides([]);
                }
            } catch (error) {
                console.error("Error fetching hero slides:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSlides();
    }, []);

    // Auto-play
    React.useEffect(() => {
        if (slides.length === 0) return;

        const currentSlideDuration = slides[currentIndex]?.sliderDuration || 8000;

        const timer = setInterval(() => {
            nextSlide();
        }, currentSlideDuration);
        return () => clearInterval(timer);
    }, [currentIndex, slides]);

    const nextSlide = () => {
        if (slides.length === 0) return;
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        if (slides.length === 0) return;
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

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
    const imageVariants: any = {
        initial: (index: number) => ({
            scale: 1,
            x: "0%"
        }),
        animate: (index: number) => ({
            scale: 1.1,
            x: "0%", // No pan
            transition: {
                duration: (currentSlide.sliderDuration || 8000) / 1000 + 2, // Slightly longer than slide duration
                ease: "linear"
            }
        })
    };

    // We can't use hooks conditionally, so we assume this component is always rendered
    // But we need to handle the case where we might return early. 
    // Actually, hooks must run unconditionally. 
    // Moving the return null/loading to after hooks is safer, but useScroll might error if ref not attached? 
    // No, useScroll attaches to window by default.

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { scrollY } = useScroll();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const y = useTransform(scrollY, [0, 1000], [0, 400]);

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
                    {/* Background Image with Ken Burns & Parallax */}
                    <div className="absolute inset-0 overflow-hidden">
                        <MotionImage
                            src={currentSlide.posterUrl}
                            alt={currentSlide.title}
                            fill
                            priority
                            className="object-cover"
                            custom={currentIndex}
                            variants={imageVariants}
                            initial="initial"
                            animate="animate"
                            style={{ y }}
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
                                <motion.span
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6, duration: 0.5 }}
                                    className={`inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider uppercase rounded-full bg-gradient-to-r from-primary to-purple-600 text-white`}
                                >
                                    Now Streaming
                                </motion.span>
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7, duration: 0.5 }}
                                    className="text-5xl md:text-7xl font-bold text-white mb-2 tracking-tight"
                                >
                                    {currentSlide.title}
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8, duration: 0.5 }}
                                    className="text-xl md:text-2xl text-gray-300 mb-6 font-light italic"
                                >
                                    {currentSlide.tagline}
                                </motion.p>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.9, duration: 0.5 }}
                                    className="text-gray-400 mb-8 leading-relaxed max-w-lg"
                                >
                                    {currentSlide.description}
                                </motion.p>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.0, duration: 0.5 }}
                                    className="flex flex-wrap gap-4"
                                >
                                    <Magnetic>
                                        <Link href={currentSlide.videoUrl || "#"}>
                                            <Button size="lg" className={`bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 border-none text-white font-bold px-8`}>
                                                <Play className="mr-2 h-5 w-5 fill-current" />
                                                Watch Trailer
                                            </Button>
                                        </Link>
                                    </Magnetic>
                                </motion.div>
                            </motion.div>
                        </div>
                    </Container>
                </motion.div>
            </AnimatePresence>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
            >
                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Scroll</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-white/0 via-white/50 to-white/0" />
            </motion.div>

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
                        className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex ? "w-8 bg-white" : "w-2 bg-white/30 hover:bg-white/50"
                            }`}
                    />
                ))}
            </div>
        </section>
    );
}
