"use client";

import { CinematicHeroSlider } from "@/components/sections/CinematicHeroSlider";
import { CTA } from "@/components/sections/CTA";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <CinematicHeroSlider />
      <CTA />
    </main>
  );
}
