"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn as nextAuthSignIn } from "next-auth/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase"; // Ensure path is correct
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Card } from "@/components/ui/Card";
import { Lock, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function LoginForm() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const registered = searchParams.get("registered");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            // 1. Authenticate with Firebase Client SDK
            await signInWithEmailAndPassword(auth, email, password);

            // 2. Bridge to NextAuth Session
            // We pass the verified email and the "secret" bridge password
            const result = await nextAuthSignIn("credentials", {
                redirect: false,
                username: email,
                password: "FIREBASE_SESSION_VERIFIED_BY_CLIENT",
            });

            if (result?.ok) {
                router.push("/admin");
            } else {
                // Should not happen if bridge logic is correct, but fallback
                if (email === "admin" && password === "admin") {
                    // Try classic mock login just in case
                    const resultLegacy = await nextAuthSignIn("credentials", {
                        redirect: false,
                        username: "admin",
                        password: "admin",
                    });
                    if (resultLegacy?.ok) {
                        router.push("/admin");
                        return;
                    }
                }
                setError("Failed to establish session.");
                setIsLoading(false);
            }
        } catch (err: any) {
            console.error(err);
            // Fallback for "admin/admin" mock purely for development if firebase fails
            if (email === "admin" && password === "admin") {
                const resultLegacy = await nextAuthSignIn("credentials", {
                    redirect: false,
                    username: "admin",
                    password: "admin",
                });
                if (resultLegacy?.ok) {
                    router.push("/admin");
                    return;
                }
            }

            let msg = "Invalid email or password.";
            if (err.code === "auth/user-not-found") msg = "No account found with this email.";
            if (err.code === "auth/wrong-password") msg = "Incorrect password.";
            if (err.code === "auth/too-many-requests") msg = "Too many failed attempts. Try again later.";
            setError(msg);
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md p-8 bg-black/50 backdrop-blur-xl border-white/10 relative z-10">
            <div className="text-center mb-8">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/20">
                    <Lock className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
                <p className="text-gray-400 text-sm">Enter your credentials to access the command center.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
                {registered && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-green-400 text-sm text-center">
                        Account created successfully. Please log in.
                    </div>
                )}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2 text-red-400 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="email">Email / Username</Label>
                    <Input
                        id="email"
                        type="text"
                        placeholder="admin@impactaistudio.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white/5 border-white/10 focus:border-primary/50"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
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
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Authenticating...
                        </>
                    ) : (
                        "Login"
                    )}
                </Button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                    Don't have an account?{" "}
                    <Link href="/admin/signup" className="text-purple-400 hover:text-purple-300 hover:underline transition-colors">
                        Create Account
                    </Link>
                </p>
                <p className="text-xs text-gray-600 mt-4">
                    Restricted Area. Unauthorized access is prohibited.
                </p>
            </div>
        </Card>
    );
}

export default function AdminLoginPage() {
    return (
        <main className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            <Suspense fallback={<div className="text-white">Loading...</div>}>
                <LoginForm />
            </Suspense>
        </main>
    );
}
