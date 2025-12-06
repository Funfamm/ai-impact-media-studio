"use client";

import { Bell, User } from "lucide-react";

export function AdminHeader({ email }: { email?: string }) {
    return (
        <header className="h-16 bg-black/50 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-8 sticky top-0 z-30 ml-64">
            <h1 className="text-white font-semibold text-lg">Dashboard</h1>

            <div className="flex items-center gap-4">
                <button className="p-2 text-gray-400 hover:text-white transition-colors relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full" />
                </button>
                <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-white">{email || 'Admin'}</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center border border-white/10">
                        <User className="h-4 w-4 text-white" />
                    </div>
                </div>
            </div>
        </header>
    );
}
