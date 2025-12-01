"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useToast } from "@/components/ui/Toast";

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    alpha: number;
    targetAlpha: number;
}

type Theme = "default" | "casting" | "movies" | "vibrant" | "luxury";

interface LiveBackgroundProps {
    theme?: Theme;
    interactive?: boolean;
}

const THEMES = {
    default: {
        primary: "100, 100, 255", // Blue
        secondary: "150, 150, 255",
        orb1: "bg-primary/10",
        orb2: "bg-blue-900/10",
        particleColor: "rgba(100, 100, 255,",
    },
    casting: {
        primary: "139, 92, 246", // Violet
        secondary: "167, 139, 250",
        orb1: "bg-violet-600/10",
        orb2: "bg-purple-900/10",
        particleColor: "rgba(139, 92, 246,",
    },
    movies: {
        primary: "220, 38, 38", // Red
        secondary: "239, 68, 68",
        orb1: "bg-red-600/10",
        orb2: "bg-orange-900/10",
        particleColor: "rgba(220, 38, 38,",
    },
    vibrant: {
        primary: "79, 70, 229", // Indigo
        secondary: "124, 58, 237", // Violet
        orb1: "bg-indigo-900/40",
        orb2: "bg-violet-900/40",
        particleColor: "rgba(124, 58, 237,",
    },
    luxury: {
        primary: "217, 119, 6", // Amber-600
        secondary: "180, 83, 9", // Amber-700
        orb1: "bg-amber-600/10",
        orb2: "bg-yellow-900/10",
        particleColor: "rgba(251, 191, 36,", // Amber-400
    },
};

export function LiveBackground({ theme = "default", interactive = false }: LiveBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const { scrollY } = useScroll();
    const { showToast } = useToast();

    const currentTheme = THEMES[theme];

    // Parallax effects for layers
    const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
    const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
    const opacity = useTransform(scrollY, [0, 500], [1, 0.5]);

    // Mouse interaction
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            setMousePos({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // Canvas Particle System
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        const particleCount = 60;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const initParticles = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.2,
                    vy: (Math.random() - 0.5) * 0.2,
                    size: Math.random() * 2 + 0.5,
                    alpha: Math.random() * 0.5 + 0.1,
                    targetAlpha: Math.random() * 0.5 + 0.1,
                });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;

                const dx = mousePos.x - p.x;
                const dy = mousePos.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 200) {
                    const force = (200 - dist) / 200;
                    p.vx += (dx / dist) * force * 0.02;
                    p.vy += (dy / dist) * force * 0.02;
                }

                p.vx *= 0.99;
                p.vy *= 0.99;

                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                if (Math.random() < 0.01) {
                    p.targetAlpha = Math.random() * 0.5 + 0.1;
                }
                p.alpha += (p.targetAlpha - p.alpha) * 0.05;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `${currentTheme.particleColor} ${p.alpha})`;
                ctx.fill();
            });

            ctx.strokeStyle = `${currentTheme.particleColor} 0.05)`;
            ctx.lineWidth = 0.5;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();
        draw();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [mousePos, currentTheme]);

    const handleElementClick = (type: string) => {
        if (!interactive) return;
        showToast(`Selected ${type} category`, "info");
    };

    return (
        <div ref={containerRef} className="absolute inset-0 overflow-hidden bg-black pointer-events-none">
            {/* Layer 1: Cinematic Gradient Mesh */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#1a1a2e_0%,_#000000_100%)] opacity-80" />

            {/* Animated Color Orbs */}
            <motion.div
                style={{ y: y1, x: -50 }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute top-0 left-0 w-[800px] h-[800px] ${currentTheme.orb1} rounded-full blur-[120px] mix-blend-screen`}
            />
            <motion.div
                style={{ y: y2, x: 50 }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className={`absolute bottom-0 right-0 w-[600px] h-[600px] ${currentTheme.orb2} rounded-full blur-[100px] mix-blend-screen`}
            />

            {/* Layer 2: Canvas Particle System */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full opacity-60"
            />

            {/* Layer 3: Floating Media Elements */}
            <motion.div
                style={{ y: y1, opacity }}
                className={`absolute top-[20%] right-[15%] opacity-10 ${interactive ? 'pointer-events-auto cursor-pointer hover:opacity-30 transition-opacity' : ''}`}
                onClick={() => handleElementClick("Film")}
            >
                {theme === 'movies' ? (
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-white">
                        <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
                        <line x1="7" y1="2" x2="7" y2="22" />
                        <line x1="17" y1="2" x2="17" y2="22" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                    </svg>
                ) : (
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-white">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                        <line x1="12" y1="19" x2="12" y2="23" />
                        <line x1="8" y1="23" x2="16" y2="23" />
                    </svg>
                )}
            </motion.div>

            <motion.div
                style={{ y: y2, opacity }}
                className={`absolute bottom-[30%] left-[10%] opacity-10 ${interactive ? 'pointer-events-auto cursor-pointer hover:opacity-30 transition-opacity' : ''}`}
                onClick={() => handleElementClick("Audio")}
            >
                <svg width="80" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-white">
                    <path d="M2 12h2l2-6 4 12 4-12 2 6h2" />
                </svg>
            </motion.div>

            {/* Layer 4: Cinematic Overlays */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
            <div className={`absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-br ${theme === 'movies' ? 'from-red-500/10' : theme === 'vibrant' ? 'from-indigo-900/30' : theme === 'luxury' ? 'from-amber-900/20' : 'from-blue-500/10'} to-transparent blur-[100px] mix-blend-screen pointer-events-none`} />
        </div>
    );
}
