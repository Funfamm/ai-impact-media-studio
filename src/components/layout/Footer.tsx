import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Twitter, Instagram, Linkedin, Github } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-white/5 bg-black py-12">
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="text-xl font-bold tracking-tight mb-4 block">
                            <span className="text-gradient">AI Impact</span> <span className="text-blue-500">Studio</span>
                        </Link>
                        <p className="text-gray-400 max-w-sm">
                            Pioneering the future of media production with artificial intelligence.
                            Cinematic quality, automated workflows, limitless creativity.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Explore</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><Link href="/movies" className="hover:text-primary transition-colors">Movies</Link></li>
                            <li><Link href="/casting" className="hover:text-primary transition-colors">Casting</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Support</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><Link href="/sponsor" className="hover:text-primary transition-colors">Sponsors</Link></li>
                            <li><Link href="/donation" className="hover:text-primary transition-colors">Donate</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Company</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link href="/admin/login" className="hover:text-primary transition-colors">Admin Login</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} AI Impact Media Studio. All rights reserved.
                    </p>
                    <div className="flex gap-4 text-gray-400">
                        <a href="#" className="hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></a>
                        <a href="https://www.instagram.com/ai_impactmedia/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><Instagram className="h-5 w-5" /></a>
                        <a href="#" className="hover:text-primary transition-colors"><Linkedin className="h-5 w-5" /></a>
                        <a href="#" className="hover:text-primary transition-colors"><Github className="h-5 w-5" /></a>
                    </div>
                </div>
            </Container >
        </footer >
    );
}
