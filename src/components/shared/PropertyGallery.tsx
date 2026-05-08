"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryImage {
    image_url: string;
}

interface PropertyGalleryProps {
    images: GalleryImage[];
}

export default function PropertyGallery({ images }: PropertyGalleryProps) {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState<"left" | "right" | null>(null);
    const [animating, setAnimating] = useState(false);

    const total = images.length;

    const goTo = (index: number, dir: "left" | "right") => {
        if (animating || total <= 1) return;
        setDirection(dir);
        setAnimating(true);
        setTimeout(() => {
            setCurrent(index);
            setAnimating(false);
            setDirection(null);
        }, 350);
    };

    const prev = () => {
        const prevIndex = (current - 1 + total) % total;
        goTo(prevIndex, "right");
    };

    const next = () => {
        const nextIndex = (current + 1) % total;
        goTo(nextIndex, "left");
    };

    // Visible images: main (center), left thumb, right thumb
    const getIndex = (offset: number) => (current + offset + total) % total;

    return (
        <div className="relative w-full overflow-hidden">
            {/* Sliding strip */}
            <div
                className="flex h-[240px] md:h-[420px] transition-transform duration-350 ease-in-out"
                style={{
                    transform: animating
                        ? `translateX(${direction === "left" ? "-33.333%" : "33.333%"})`
                        : "translateX(0)",
                    transition: animating ? "transform 0.35s ease-in-out" : "none",
                }}
            >
                {/* Show 3 images side by side — left, center (main), right */}
                {[-1, 0, 1].map((offset) => {
                    const idx = getIndex(offset);
                    const isMain = offset === 0;
                    return (
                        <div
                            key={idx}
                            className={`relative flex-shrink-0 overflow-hidden ${isMain ? "w-1/2" : "w-1/4"
                                }`}
                        >
                            <Image
                                src={images[idx].image_url}
                                alt={`Property photo ${idx + 1}`}
                                fill
                                className="object-cover"
                                priority={isMain}
                            />
                            {/* Dim side images slightly */}
                            {!isMain && (
                                <div className="absolute inset-0 bg-black/20 pointer-events-none" />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Left arrow */}
            <button
                onClick={prev}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 active:scale-95 transition-all"
            >
                <ChevronLeft size={18} className="text-gray-700" />
            </button>

            {/* Right arrow */}
            <button
                onClick={next}
                aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 active:scale-95 transition-all"
            >
                <ChevronRight size={18} className="text-gray-700" />
            </button>

            {/* Dot indicators */}
            {total > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i, i > current ? "left" : "right")}
                            aria-label={`Go to image ${i + 1}`}
                            className={`rounded-full transition-all duration-300 ${i === current
                                    ? "w-5 h-1.5 bg-white"
                                    : "w-1.5 h-1.5 bg-white/50"
                                }`}
                        />
                    ))}
                </div>
            )}

            {/* Image counter */}
            <div className="absolute top-3 right-3 z-10 bg-black/40 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
                {current + 1} / {total}
            </div>
        </div>
    );
}