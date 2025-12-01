"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Lock, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Mock Authentication
        // In a real app, this would call an API endpoint
        setTimeout(() => {
            if (username === "admin" && password === "admin") {
                // Set a mock cookie or local storage
                localStorage.setItem("admin_auth", "true");
                router.push("/admin");
            } else {
                setError("Invalid credentials");
                setIsLoading(false);
            }
        }, 1000);
    };

    return (
        <main className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

            <Card className="w-full max-w-md p-8 bg-black/50 backdrop-blur-xl border-white/10 relative z-10">
                <div className="text-center mb-8">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/20">
                        <Lock className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
                    <p className="text-gray-400 text-sm">Enter your credentials to access the command center.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2 text-red-400 text-sm">
                            <AlertCircle className="h-4 w-4" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="bg-white/5 border-white/10 focus:border-primary/50"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-white/5 border-white/10 focus:border-primary/50"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity"
                        disabled={isLoading}
                    >
                        {isLoading ? "Authenticating..." : "Login"}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                        Restricted Area. Unauthorized access is prohibited.
                    </p>
                </div>
            </Card>
        </main>
    );
}
