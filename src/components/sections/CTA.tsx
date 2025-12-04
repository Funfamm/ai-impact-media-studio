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
        <section className="absolute inset-x-0 bottom-0 md:bottom-24 h-1/5 md:h-1/6 bg-white/10 backdrop-blur-md rounded-t-2xl z-20 overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-background to-blue-900/10 pointer-events-none" />

            <Container className="relative z-10">


                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6 lg:gap-8">
                    {actions.map((action, index) => (
                        <motion.div
                            key={action.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -10 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: action.delay }}
                        >
                            <Link href={action.href} className="block h-full">
                                <Card className="h-full p-2 md:p-8 flex flex-col items-center text-center hover:border-primary/50 transition-colors group relative overflow-hidden bg-white/5 backdrop-blur-sm border-white/10">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                                    <div className={`h-8 w-8 md:h-16 md:w-16 rounded-xl md:rounded-2xl bg-gradient-to-br ${action.gradient} p-2 md:p-4 mb-2 md:mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                                        <action.icon className="h-full w-full text-white" />
                                    </div>



                                    <h3 className="text-sm md:text-2xl font-bold mb-1 md:mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
                                        {action.title}
                                    </h3>
                                    <p className="hidden md:block text-xs md:text-base text-gray-400 mb-4 md:mb-8 flex-grow leading-relaxed group-hover:text-gray-300 transition-colors line-clamp-3 md:line-clamp-none">
                                        {action.description}
                                    </p>


                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
