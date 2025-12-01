"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Handshake, Users, Heart, Film } from "lucide-react";

const actions = [
    {
        title: "Become a Sponsor",
        description: "Partner with AI Impact to reach a global audience and define the future of entertainment.",
        icon: Handshake,
        href: "/sponsor",
        buttonText: "Partner With Us",
        gradient: "from-blue-500 to-purple-600",
        delay: 0
    },
    {
        title: "Casting Call",
        description: "We are looking for unique voices and faces. Join our elite roster of AI-driven talent.",
        icon: Users,
        href: "/casting",
        buttonText: "Apply Now",
        gradient: "from-purple-500 to-pink-600",
        delay: 0.1
    },
    {
        title: "Support the Vision",
        description: "Help us build independent, cutting-edge media. Your contribution fuels the revolution.",
        icon: Heart,
        href: "/donation",
        buttonText: "Donate",
        gradient: "from-amber-500 to-orange-600",
        delay: 0.2
    },
    {
        title: "Explore Movies",
        description: "Discover our library of AI-generated films and immersive narratives.",
        icon: Film,
        href: "/movies",
        buttonText: "Watch Now",
        gradient: "from-red-500 to-orange-600",
        delay: 0.3
    }
];

export function CTA() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-background to-blue-900/10 pointer-events-none" />

            <Container className="relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        Join the <span className="text-gradient">Revolution</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Whether you are a brand, a creator, or a supporter, there is a place for you at AI Impact Media Studio.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {actions.map((action, index) => (
                        <motion.div
                            key={action.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: action.delay }}
                        >
                            <Link href={action.href} className="block h-full">
                                <Card className="h-full p-8 flex flex-col items-center text-center hover:border-primary/50 transition-colors group relative overflow-hidden">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                                    <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${action.gradient} p-4 mb-6 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                                        <action.icon className="h-full w-full text-white" />
                                    </div>

                                    <h3 className="text-2xl font-bold mb-3 text-white">{action.title}</h3>
                                    <p className="text-gray-400 mb-8 flex-grow leading-relaxed">
                                        {action.description}
                                    </p>

                                    <div className="w-full">
                                        <div className="inline-flex items-center justify-center rounded-lg font-medium transition-colors px-6 py-3 text-base w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white group-hover:border-white/20">
                                            {action.buttonText}
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
