"use client";

import { Container } from "@/components/ui/Container";

export default function TermsPage() {
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
                    <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gradient">Terms of Service</h1>
                    <p className="text-gray-400 mb-12">Last Updated: {new Date().toLocaleDateString()}</p>

                    <div className="space-y-12 text-gray-300 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                            <p>
                                By accessing or using the website and services of AI Impact Media Studio (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;),
                                you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">2. Intellectual Property</h2>
                            <p>
                                All content, features, and functionality on this website, including but not limited to text, graphics, logos,
                                AI-generated media, and software, are the exclusive property of AI Impact Media Studio and are protected by
                                international copyright, trademark, and other intellectual property laws.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">3. User Conduct</h2>
                            <p className="mb-4">
                                You agree not to use our services for any unlawful purpose or in any way that could damage, disable,
                                overburden, or impair our servers or networks. Prohibited activities include:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Attempting to gain unauthorized access to any portion of the website.</li>
                                <li>Using any robot, spider, or other automated means to access the website.</li>
                                <li>Harassing, abusing, or harming another person or group.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">4. Limitation of Liability</h2>
                            <p>
                                In no event shall AI Impact Media Studio, its directors, employees, or agents be liable for any indirect,
                                punitive, incidental, special, or consequential damages arising out of or in any way connected with the use
                                of this website or with the delay or inability to use this website.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">5. Changes to Terms</h2>
                            <p>
                                We reserve the right to modify or replace these Terms at any time. Your continued use of the website after
                                any such changes constitutes your acceptance of the new Terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-4">6. Contact Information</h2>
                            <p>
                                Questions about the Terms of Service should be sent to us at:
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
