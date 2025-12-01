"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Wand2, Zap, Layers, Globe, Shield, Users } from "lucide-react";

const features = [
    {
        icon: Wand2,
        title: "AI-Powered Creation",
        description: "Generate stunning visuals and scripts with our advanced AI models tailored for media production.",
    },
    {
        icon: Zap,
        title: "Lightning Fast",
        description: "Reduce production time by up to 80% with automated workflows and instant rendering.",
    },
    {
        icon: Layers,
        title: "Cinematic Quality",
        description: "Professional grade output that meets industry standards for resolution and color accuracy.",
    },
    {
        icon: Globe,
        title: "Global Distribution",
        description: "Seamlessly distribute your content to multiple platforms with a single click.",
    },
    {
        icon: Shield,
        title: "Secure Storage",
        description: "Enterprise-grade security for your assets with encrypted storage and backup.",
    },
    {
        icon: Users,
        title: "Collaborative Studio",
        description: "Real-time collaboration tools for teams to work together from anywhere in the world.",
    },
];

export function Features() {
    return (
        <section className="py-24 bg-surface/30">
            <Container>
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Why Choose <span className="text-gradient">AI Impact</span>
                    </h2>
                    <p className="text-gray-400 text-lg">
                        We combine cutting-edge AI technology with professional filmmaking tools to redefine media production.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card glass className="h-full border-primary/10 hover:border-primary/50 hover:bg-surface-hover/80 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-300 p-6 md:p-8 group">
                                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <feature.icon className="h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
                                </div>
                                <h3 className="text-lg md:text-xl font-bold mb-3 text-gray-100 group-hover:text-white transition-colors">{feature.title}</h3>
                                <p className="text-sm md:text-base text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                                    {feature.description}
                                </p>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
