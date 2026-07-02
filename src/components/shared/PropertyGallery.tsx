"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

interface GalleryImage {
    image_url: string;
}

/* ── Lightbox Modal ───────────────────────────────────────────── */
function Lightbox({
    images,
    startIndex,
    onClose,
}: {
    images: GalleryImage[];
    startIndex: number;
    onClose: () => void;
}) {
    const [active, setActive] = useState(startIndex);
    const total = images.length;

    const prev = useCallback(() => setActive((i) => (i - 1 + total) % total), [total]);
    const next = useCallback(() => setActive((i) => (i + 1) % total), [total]);

    // Keyboard navigation
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose, prev, next]);

    // Prevent body scroll while open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    return (
        <div
            className="fixed inset-0 z-[9999] flex flex-col"
            style={{ background: "rgba(0,0,0,0.93)" }}
            onClick={onClose}
        >
            {/* Top bar */}
            <div
                className="flex items-center justify-between px-5 py-3 flex-shrink-0"
                onClick={(e) => e.stopPropagation()}
            >
                <span className="text-white/70 text-sm font-medium tracking-wide select-none">
                    {active + 1} / {total}
                </span>
                <button
                    onClick={onClose}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    aria-label="Close"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Main image area */}
            <div
                className="flex-1 flex items-center justify-center relative px-12 pb-4"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Prev button */}
                {total > 1 && (
                    <button
                        onClick={prev}
                        aria-label="Previous image"
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                )}

                {/* Image */}
                <div className="relative w-full h-full max-w-5xl">
                    <Image
                        key={active}
                        src={images[active].image_url}
                        alt={`Property photo ${active + 1}`}
                        fill
                        sizes="90vw"
                        className="object-contain"
                        unoptimized
                        priority
                    />
                </div>

                {/* Next button */}
                {total > 1 && (
                    <button
                        onClick={next}
                        aria-label="Next image"
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
                    >
                        <ChevronRight size={24} />
                    </button>
                )}
            </div>

            {/* Thumbnail strip */}
            {total > 1 && (
                <div
                    className="flex-shrink-0 flex justify-center gap-2 px-4 pb-4 overflow-x-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {images.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setActive(i)}
                            className={`relative flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${i === active ? "border-white scale-105" : "border-transparent opacity-50 hover:opacity-80"}`}
                        >
                            <Image
                                src={img.image_url}
                                alt={`Thumb ${i + 1}`}
                                fill
                                sizes="56px"
                                className="object-cover"
                                unoptimized
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ── Gallery ─────────────────────────────────────────────────── */
export default function PropertyGallery({ images }: { images: GalleryImage[] }) {
    const [current, setCurrent] = useState(0);
    const [sliding, setSliding] = useState(false);
    const [slideDir, setSlideDir] = useState<"left" | "right">("left");
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const total = images.length;

    const go = (dir: "left" | "right") => {
        if (sliding || total <= 1) return;
        setSlideDir(dir);
        setSliding(true);
        setTimeout(() => {
            setCurrent((c) =>
                dir === "left" ? (c + 1) % total : (c - 1 + total) % total
            );
            setSliding(false);
        }, 380);
    };

    const idx = (offset: number) => (current + offset + total) % total;

    return (
        <>
            {/* Gallery strip */}
            <div className="relative w-full select-none">
                {/* Left arrow */}
                <button
                    onClick={() => go("right")}
                    aria-label="Previous image"
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white rounded flex items-center justify-center shadow-md hover:bg-gray-50 active:scale-95 transition-all"
                >
                    <ChevronLeft size={18} className="text-gray-700" />
                </button>

                {/* Clipping container */}
                <div className="overflow-hidden w-full">
                    <div
                        className="flex h-[200px] sm:h-[280px] md:h-[370px] w-[400%]"
                        style={{
                            transform: sliding
                                ? `translateX(${slideDir === "left" ? "-12.5%" : "0%"})`
                                : "translateX(-6.25%)",
                            transition: sliding
                                ? "transform 0.38s cubic-bezier(0.4,0,0.2,1)"
                                : "none",
                        }}
                    >
                        {([-2, -1, 0, 1, 2] as const).map((offset) => {
                            const i = idx(offset);

                            let isCenter = false;
                            if (sliding) {
                                if (slideDir === "left" && offset === 1) isCenter = true;
                                if (slideDir === "right" && offset === -1) isCenter = true;
                            } else {
                                if (offset === 0) isCenter = true;
                            }

                            const widthPct = isCenter ? "12.5%" : "6.25%";

                            return (
                                <div
                                    key={`${i}-${offset}`}
                                    className="relative flex-shrink-0 h-full p-1"
                                    style={{
                                        width: widthPct,
                                        transition: sliding ? "width 0.38s cubic-bezier(0.4,0,0.2,1)" : "none",
                                    }}
                                >
                                    <div
                                        className={`relative w-full h-full overflow-hidden transition-all duration-300 ${isCenter ? "rounded-xl shadow-md cursor-zoom-in group" : "rounded-lg opacity-60"}`}
                                        onClick={isCenter ? () => setLightboxIndex(i) : undefined}
                                    >
                                        <Image
                                            src={images[i].image_url}
                                            alt={`Property photo ${i + 1}`}
                                            fill
                                            sizes={isCenter ? "50vw" : "25vw"}
                                            className="object-cover"
                                            priority={offset === 0}
                                            unoptimized={true}
                                        />
                                        {/* Zoom hint overlay on center image */}
                                        {isCenter && (
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                                                <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 scale-90 group-hover:scale-100 transform">
                                                    <ZoomIn size={18} className="text-gray-800" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right arrow */}
                <button
                    onClick={() => go("left")}
                    aria-label="Next image"
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white rounded flex items-center justify-center shadow-md hover:bg-gray-50 active:scale-95 transition-all"
                >
                    <ChevronRight size={18} className="text-gray-700" />
                </button>
            </div>

            {/* Lightbox */}
            {lightboxIndex !== null && (
                <Lightbox
                    images={images}
                    startIndex={lightboxIndex}
                    onClose={() => setLightboxIndex(null)}
                />
            )}
        </>
    );
}