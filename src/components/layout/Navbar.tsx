"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { useToast } from "@/components/ui/Toast";
import { Magnetic } from "@/components/ui/Magnetic";

// Inline cn for safety
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
function cnSafe(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isScrolled, setIsScrolled] = React.useState(false);
    const pathname = usePathname();
    const { showToast } = useToast();

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Movies", href: "/movies" },
        { name: "Casting", href: "/casting" },
        { name: "Sponsors", href: "/sponsor" },
    ];

    return (
        <header className={cnSafe(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
            isScrolled ? "bg-black/60 backdrop-blur-xl border-b border-white/5 py-4 shadow-[0_4px_30px_rgba(0,0,0,0.1)]" : "bg-transparent py-6"
        )}>
            <Container>
                <nav className="flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold tracking-tighter flex items-center gap-2 group">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                            <span className="text-white font-bold">AI</span>
                        </div>
                        <span className="hidden sm:inline-block font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-white animate-pulse group-hover:animate-none group-hover:text-white transition-colors">Impact Studio</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cnSafe(
                                    "text-sm font-medium transition-colors relative group",
                                    pathname === link.href ? "text-white" : "text-gray-400 hover:text-white"
                                )}
                            >
                                {link.name}
                                <span className={cnSafe(
                                    "absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full",
                                    pathname === link.href ? "w-full" : ""
                                )} />
                            </Link>
                        ))}
                        <Magnetic>
                            <Link href="/donation">
                                <Button
                                    size="sm"
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none hover:opacity-90"
                                >
                                    Donate
                                </Button>
                            </Link>
                        </Magnetic>
                        <Magnetic>
                            <Link href="/admin/login">
                                <Button
                                    size="sm"
                                    className="bg-white text-black hover:bg-gray-200 border-none"
                                >
                                    Client Login
                                </Button>
                            </Link>
                        </Magnetic>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-gray-400 hover:text-white"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </nav>
            </Container>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
                    >
                        <Container className="py-8 flex flex-col gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cnSafe(
                                        "text-lg font-medium transition-colors",
                                        pathname === link.href ? "text-primary" : "text-gray-400 hover:text-white"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link href="/donation" onClick={() => setIsOpen(false)}>
                                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 border-none">
                                    Donate
                                </Button>
                            </Link>
                            <Link href="/admin/login" onClick={() => setIsOpen(false)}>
                                <Button className="w-full">Client Login</Button>
                            </Link>
                        </Container>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
