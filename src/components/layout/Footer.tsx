import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Twitter, Instagram, Linkedin, Github } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-gray-700 bg-gradient-to-r from-gray-800 via-gray-900 to-black py-8 text-gray-300">
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div>
                        <Link href="/" className="text-2xl font-bold tracking-tight mb-4 block">
                            <span className="text-gradient">AI Impact</span> <span className="text-blue-400">Studio</span>
                        </Link>
                        <p className="max-w-sm">Pioneering the future of media production with artificial intelligence. Cinematic quality, automated workflows, limitless creativity.</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <ul className="space-y-2">
                            <li><Link href="/movies" className="hover:text-primary transition-colors">Movies</Link></li>
                            <li><Link href="/casting" className="hover:text-primary transition-colors">Casting</Link></li>
                            <li><Link href="/sponsor" className="hover:text-primary transition-colors">Sponsors</Link></li>
                        </ul>
                        <ul className="space-y-2">
                            <li><Link href="/donation" className="hover:text-primary transition-colors">Donate</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                        </ul>
                        <ul className="space-y-2">
                            <li><Link href="/admin/login" className="hover:text-primary transition-colors">Admin Login</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm">© {new Date().getFullYear()} AI Impact Media Studio. All rights reserved.</p>
                    <div className="flex gap-4 text-gray-400">
                        <a href="#" className="hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></a>
                        <a href="https://www.instagram.com/ai_impactmedia/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><Instagram className="h-5 w-5" /></a>
                        <a href="#" className="hover:text-primary transition-colors"><Linkedin className="h-5 w-5" /></a>
                        <a href="#" className="hover:text-primary transition-colors"><Github className="h-5 w-5" /></a>
                    </div>
                </div>
            </Container>
        </footer>
    );
}
