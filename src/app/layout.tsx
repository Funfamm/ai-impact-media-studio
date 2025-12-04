import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { FilmGrain } from "@/components/ui/FilmGrain";
import { Preloader } from "@/components/ui/Preloader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ai-impact-media-studio.com'), // Replace with actual domain
  title: {
    default: "AI Impact Media Studio",
    template: "%s | AI Impact Media Studio",
  },
  description: "Cinematic, futuristic media production powered by Artificial Intelligence. Join the revolution in storytelling.",
  keywords: ["AI", "Media", "Production", "Film", "Casting", "Future", "Cinema", "Technology"],
  authors: [{ name: "AI Impact Media Studio" }],
  creator: "AI Impact Media Studio",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ai-impact-media-studio.com",
    title: "AI Impact Media Studio",
    description: "Cinematic, futuristic media production powered by Artificial Intelligence.",
    siteName: "AI Impact Media Studio",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Impact Media Studio",
    description: "Cinematic, futuristic media production powered by Artificial Intelligence.",
    creator: "@aiimpactmedia",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import { ToastProvider } from "@/components/ui/Toast";
import { MobileHomeButton } from "@/components/ui/MobileHomeButton";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased" suppressHydrationWarning>
        <ToastProvider>
          <Preloader />
          <CustomCursor />
          <FilmGrain />
          <Navbar />
          {children}
          <Footer />
          <MobileHomeButton />
        </ToastProvider>
      </body>
    </html>
  );
}
