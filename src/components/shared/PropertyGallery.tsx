"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryImage {
    image_url: string;
}

export default function PropertyGallery({ images }: { images: GalleryImage[] }) {
    const [current, setCurrent] = useState(0);
    const [sliding, setSliding] = useState(false);
    const [slideDir, setSlideDir] = useState<"left" | "right">("left");
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
        // Outer wrapper: positions the arrows outside the clip area
        <div className="relative w-full select-none">
            {/* Left arrow */}
            <button
                onClick={() => go("right")}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white rounded flex items-center justify-center shadow-md hover:bg-gray-50 active:scale-95 transition-all"
            >
                <ChevronLeft size={18} className="text-gray-700" />
            </button>

            {/* Clipping container — hides the overflowing slides */}
            <div className="overflow-hidden w-full">
                {/* Sliding strip */}
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

                        // Each item takes a percentage of the *strip*.
                        // We set strip width to 400% of parent.
                        // So 25% of parent = 6.25% of strip.
                        // 50% of parent = 12.5% of strip.
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
                                <div className={`relative w-full h-full overflow-hidden transition-all duration-300 ${isCenter ? 'rounded-xl shadow-md' : 'rounded-lg opacity-60'}`}>
                                    <Image
                                        src={images[i].image_url}
                                        alt={`Property photo ${i + 1}`}
                                        fill
                                        sizes={isCenter ? "50vw" : "25vw"}
                                        className="object-cover"
                                        priority={offset === 0}
                                        unoptimized={true}
                                    />
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
    );
}