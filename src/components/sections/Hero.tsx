"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { VideoModal } from "@/components/ui/VideoModal";

export function Hero() {
    const [isVideoOpen, setIsVideoOpen] = React.useState(false);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />

            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none" />

            {/* Subtle Background Element (Cinematic Glow/Spotlight) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            <Container className="relative z-10">
                <div className="flex flex-col items-center text-center max-w-[800px] mx-auto">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        className="mb-6 flex flex-col items-center"
                    >
                        <h1 className="font-bold tracking-tight leading-[1.1] mb-4 text-center">
                            <span className="block text-[clamp(3rem,6vw,4.5rem)] text-white overflow-hidden">
                                <motion.span
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                    className="block"
                                >
                                    Create Cinematic
                                </motion.span>
                            </span>
                            <span className="block text-[clamp(3rem,6vw,4.5rem)] bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient-x overflow-hidden">
                                <motion.span
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                                    className="block"
                                >
                                    AI Experiences
                                </motion.span>
                            </span>
                        </h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-[clamp(1rem,2vw,1.25rem)] text-[#b3b3b3] max-w-2xl mx-auto mb-6 leading-relaxed font-light"
                        >
                            Transform your vision into reality with our AI-driven media studio.
                            Professional grade production, automated workflows, and stunning results.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto"
                    >
                        <Link href="/casting">
                            <Button size="lg" className="group relative bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 border-none shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.8)] transition-all duration-300 w-full sm:w-auto overflow-hidden">
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                <span className="relative flex items-center">
                                    Start Casting
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </span>
                            </Button>
                        </Link>
                        <Button
                            variant="secondary"
                            size="lg"
                            className="group bg-[#5c6cff] text-white border-none hover:bg-[#4b59d9] hover:shadow-[0_0_20px_rgba(92,108,255,0.4)] transition-all"
                            onClick={() => setIsVideoOpen(true)}
                        >
                            <Play className="mr-2 h-4 w-4 fill-current" />
                            Watch Demo
                        </Button>
                    </motion.div>
                </div>
            </Container>
        </section>
    );
}
