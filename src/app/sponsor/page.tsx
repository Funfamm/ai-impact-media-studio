"use client";

import * as React from "react";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Mail, Building2, Handshake } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/Toast";

export default function SponsorPage() {
    const { showToast } = useToast();

    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        setIsSubmitting(true);

        const formData = {
            companyName: (form.elements.namedItem('companyName') as HTMLInputElement).value,
            contactName: (form.elements.namedItem('contactName') as HTMLInputElement).value,
            email: (form.elements.namedItem('email') as HTMLInputElement).value,
            partnershipType: (form.elements.namedItem('partnershipType') as HTMLSelectElement).value,
            message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
            _honey: (form.elements.namedItem('_honey') as HTMLInputElement).value,
        };

        try {
            const response = await fetch('/api/sponsor/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Submission failed');

            showToast("Sponsorship Inquiry Sent Successfully! Check your email.", "success");
            form.reset();
        } catch (error: unknown) {
            console.error(error);
            const message = error instanceof Error ? error.message : "Submission failed";
            showToast(`Failed: ${message}`, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen py-20 bg-black text-white relative overflow-hidden">
            {/* Unique Background: Cyber Grid & Blue Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/40 via-purple-900/20 to-black pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            <Container className="relative z-10">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Become a <span className="text-gradient">Sponsor</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Partner with <span className="text-gradient font-bold">AI Impact</span> Media Studio to reach the next generation of creators and audiences.
                        Let&apos;s build the future of entertainment together.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Partnership Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8 order-2 lg:order-1"
                    >
                        <Card glass className="p-6 md:p-8">
                            <h2 className="text-2xl font-bold mb-6 text-white">Why Partner With Us?</h2>
                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Building2 className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-1">Brand Integration</h3>
                                        <p className="text-gray-400 leading-relaxed">
                                            Seamlessly integrate your brand into our AI-driven productions and cinematic experiences.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Handshake className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-1">Strategic Partnership</h3>
                                        <p className="text-gray-400 leading-relaxed">
                                            Collaborate on exclusive content, events, and technology showcases that define the industry.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Mail className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-red-600 mb-1">Direct Contact</h3>
                                        <p className="text-gray-400">partnerships@aiimpact.studio</p>
                                        <p className="text-gray-400">+1 (555) 987-6543</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Sponsorship Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="order-1 lg:order-2"
                    >
                        <Card className="p-6 md:p-8 bg-surface/50 border-primary/20">
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                {/* Honeypot for spam protection */}
                                <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />

                                <div className="space-y-2">
                                    <Label htmlFor="companyName">Company Name</Label>
                                    <Input id="companyName" name="companyName" placeholder="Tech Corp Inc." className="h-12" required />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="contactName">Contact Name</Label>
                                        <Input id="contactName" name="contactName" placeholder="Jane Doe" className="h-12" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Business Email</Label>
                                        <Input id="email" name="email" type="email" placeholder="jane@techcorp.com" className="h-12" required />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="partnershipType">Partnership Interest</Label>
                                    <div className="relative">
                                        <select id="partnershipType" name="partnershipType" required className="flex h-12 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary appearance-none cursor-pointer hover:bg-surface-hover transition-colors">
                                            <option value="" className="bg-surface">Select Type</option>
                                            <option value="brand-integration" className="bg-surface">Brand Integration</option>
                                            <option value="event-sponsorship" className="bg-surface">Event Sponsorship</option>
                                            <option value="technology-partner" className="bg-surface">Technology Partner</option>
                                            <option value="investment" className="bg-surface">Investment Opportunity</option>
                                            <option value="other" className="bg-surface">Other</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">Message</Label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={4}
                                        className="flex w-full rounded-lg border border-border bg-surface px-3 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground placeholder-gray-500"
                                        placeholder="Tell us about your sponsorship goals..."
                                        required
                                    />
                                </div>

                                <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-base font-bold bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 shadow-lg shadow-primary/20">
                                    {isSubmitting ? "Sending..." : "Submit Inquiry"}
                                </Button>
                            </form>
                        </Card>
                    </motion.div>
                </div>
            </Container>
        </main>
    );
}
