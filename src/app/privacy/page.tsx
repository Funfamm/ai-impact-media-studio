"use client";

import { Container } from "@/components/ui/Container";

export default function PrivacyPage() {
    return (
        <main className="min-h-screen py-20 bg-black text-white relative overflow-hidden">
            {/* Custom Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
                style={{ backgroundImage: "url('/legal-bg.png')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90" />

            <Container className="relative z-10">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gradient">Privacy Policy</h1>
                    <p className="text-gray-400 mb-12">Last Updated: {new Date().toLocaleDateString()}</p>

                    <div className="space-y-12 text-gray-300 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
                            <p>
                                AI Impact Media Studio ("we," "our," or "us") is committed to protecting your privacy.
                                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website
                                and use our services, including our casting and media production platforms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
                            <p className="mb-4">
                                We collect information that you provide directly to us, such as when you submit a casting application,
                                subscribe to our newsletter, or make a donation. This may include:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Personal identification information (Name, email address, phone number).</li>
                                <li>Professional information (Portfolio, resume, casting materials).</li>
                                <li>Payment information (processed securely by third-party providers).</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
                            <p className="mb-4">
                                We use the information we collect to:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Process and evaluate casting applications.</li>
                                <li>Provide, operate, and maintain our website and services.</li>
                                <li>Communicate with you regarding updates, newsletters, and promotional materials.</li>
                                <li>Process donations and sponsorships.</li>
                                <li>Improve our AI models and production workflows (with explicit consent for creative data).</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">4. Data Security</h2>
                            <p>
                                We implement appropriate technical and organizational security measures to protect your personal information
                                against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet
                                is 100% secure, and we cannot guarantee absolute security.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">5. Contact Us</h2>
                            <p>
                                If you have any questions about this Privacy Policy, please contact us at:
                                <br />
                                <a href="mailto:legal@aiimpactmediastudio.com" className="text-blue-500 hover:text-blue-400 transition-colors">
                                    legal@aiimpactmediastudio.com
                                </a>
                            </p>
                        </section>
                    </div>
                </div>
            </Container>
        </main>
    );
}
