"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Film, Users, Settings, LogOut, Handshake } from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Movies", href: "/admin/movies", icon: Film },
    { name: "Casting", href: "/admin/casting", icon: Users },
    { name: "Sponsors", href: "/admin/sponsors", icon: Handshake },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-black border-r border-white/10 h-screen fixed left-0 top-0 flex flex-col z-40">
            <div className="p-6 border-b border-white/10">
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                        <span className="text-white font-bold">AI</span>
                    </div>
                    <span className="font-bold text-white tracking-tight">Admin Panel</span>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {sidebarLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
                                isActive
                                    ? "bg-primary/20 text-primary border border-primary/20"
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <link.icon className="h-5 w-5" />
                            {link.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/10">
                <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-sm font-medium">
                    <LogOut className="h-5 w-5" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
