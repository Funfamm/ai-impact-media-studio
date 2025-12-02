"use client";

export function FilmGrain() {
    return (
        <div className="pointer-events-none fixed inset-0 z-[9998] opacity-[0.03] mix-blend-overlay">
            <div
                className="absolute inset-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"
                style={{ filter: 'contrast(150%) brightness(100%)' }}
            />
        </div>
    );
}
