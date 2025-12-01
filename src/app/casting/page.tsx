"use client";

import { CastingForm } from "@/components/casting/CastingForm";
import { CastingShowcase } from "@/components/casting/CastingShowcase";

export default function CastingPage() {
    return (
        <main className="min-h-screen flex flex-col lg:flex-row relative bg-black">
            {/* Right Side (Showcase) - Fixed on Desktop */}
            <div className="w-full lg:w-[55%] h-[65vh] lg:h-screen lg:fixed lg:right-0 lg:top-0 order-1 lg:order-2 z-0">
                <CastingShowcase />
                {/* Gradient Overlay for seamless blend - Desktop only side blend */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent z-20 pointer-events-none hidden lg:block" />
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-20 hidden lg:block" />
            </div>

            {/* Left Side (Form) - Scrollable */}
            <div className="relative w-full lg:w-[50%] min-h-screen order-2 lg:order-1 flex flex-col justify-center py-20 lg:py-0 z-10 bg-[#050505]">
                {/* Virtual Studio Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_200px,#3b82f615,transparent)]" />

                <div className="relative z-10 pl-0 lg:pl-8">
                    <div className="bg-transparent backdrop-blur-none rounded-3xl border-none p-6 lg:p-8">
                        <CastingForm />
                    </div>
                </div>
            </div>
        </main>
    );
}
