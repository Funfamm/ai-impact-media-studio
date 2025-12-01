"use client";

import * as React from "react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Heart, Coffee, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export default function DonationPage() {
    return (
        <main className="min-h-screen py-20 bg-black text-white relative overflow-hidden flex items-center">
            {/* Custom Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
                style={{ backgroundImage: "url('/donation-bg.png')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90" />

            <Container className="relative z-10">
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-6xl font-bold mb-6"
                    >
                        Support Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-600">Vision</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-gray-300 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed"
                    >
                        At AI Impact Media Studio, we are redefining storytelling through the power of artificial intelligence.
                        Your support directly funds independent creators, cutting-edge model training, and the production of
                        immersive narratives that challenge the status quo. Join us in building the future of entertainment.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* PayPal Option */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Card className="h-full p-8 border-blue-500/20 hover:border-blue-500/50 transition-all duration-300 bg-surface/50 backdrop-blur-sm text-center group hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                            <div className="h-20 w-20 mx-auto rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Heart className="h-10 w-10 text-blue-500" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-white">Donate via PayPal</h3>
                            <p className="text-gray-400 mb-8 min-h-[3rem]">
                                Make a secure contribution directly to our studio operations and development fund.
                            </p>
                            <a href="https://www.paypal.me/AIImpactMedia" target="_blank" rel="noopener noreferrer" className="block w-full">
                                <Button
                                    size="lg"
                                    className="w-full bg-[#0070BA] hover:bg-[#005ea6] text-white font-bold shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all"
                                >
                                    <span className="flex items-center gap-2">
                                        Support on PayPal <ExternalLink className="h-4 w-4" />
                                    </span>
                                </Button>
                            </a>
                        </Card>
                    </motion.div>

                    {/* Buy Me a Coffee Option */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <Card className="h-full p-8 border-yellow-500/20 hover:border-yellow-500/50 transition-all duration-300 bg-surface/50 backdrop-blur-sm text-center group hover:shadow-[0_0_30px_rgba(234,179,8,0.15)]">
                            <div className="h-20 w-20 mx-auto rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Coffee className="h-10 w-10 text-yellow-500" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-white">Buy us a coffee</h3>
                            <p className="text-gray-400 mb-8 min-h-[3rem]">
                                Show some love with a small, one-time donation to keep our creative engines running.
                            </p>
                            <a href="https://buymeacoffee.com/aiimpactmedia" target="_blank" rel="noopener noreferrer" className="block w-full">
                                <Button
                                    size="lg"
                                    className="w-full bg-[#FFDD00] hover:bg-[#FFDD00]/90 text-black font-bold shadow-lg shadow-yellow-500/20 group-hover:shadow-yellow-500/40 transition-all"
                                >
                                    <span className="flex items-center gap-2">
                                        Buy us a coffee <ExternalLink className="h-4 w-4" />
                                    </span>
                                </Button>
                            </a>
                        </Card>
                    </motion.div>
                </div>
            </Container>
        </main>
    );
}
