"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

import type { PropertyImageGalleryProps } from "@/types/components";

export default function PropertyImageGallery({
  images,
  propertyName,
}: PropertyImageGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    document.body.style.overflow = "";
  }, []);

  const goNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % images.length);
  }, [lightboxIndex, images.length]);

  const goPrev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
  }, [lightboxIndex, images.length]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") closeLightbox();
    },
    [goNext, goPrev, closeLightbox]
  );

  const fallback = "/assets/images/property_images/1746276498_pexels-kamo11235-667838.jpg";

  return (
    <>
      {/* ── MOBILE: Horizontal snap carousel ── */}
      <div className="md:hidden w-full">
        <div
          className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-2 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {images.map((img, i) => (
            <div
              key={i}
              className="relative shrink-0 w-[85vw] h-[240px] rounded-xl overflow-hidden border border-gray-200 snap-center cursor-zoom-in"
              onClick={() => openLightbox(i)}
            >
              <Image
                src={img.image_url || fallback}
                alt={`${propertyName} — image ${i + 1}`}
                fill
                className="object-cover"
                unoptimized
                priority={i === 0}
              />
              {/* Zoom hint */}
              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-end justify-end p-2">
                <span className="bg-black/40 text-white rounded-lg p-1.5">
                  <ZoomIn size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>
        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-2">
            {images.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === 0 ? "bg-[#163D75] w-3" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── DESKTOP: 3-panel grid ── */}
      <div className="hidden md:flex gap-3 h-[350px] xl:h-auto xl:flex-1 w-full min-h-[300px]">
        {/* Large image — left */}
        <div
          className="relative flex-[2] max-w-[700px] rounded-xl overflow-hidden border border-gray-200 cursor-zoom-in group"
          onClick={() => openLightbox(0)}
        >
          <Image
            src={images[0]?.image_url || fallback}
            alt={`${propertyName} — image 1`}
            fill
            className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
            unoptimized
            priority
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          <div className="absolute bottom-3 right-3 bg-black/40 text-white rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn size={16} />
          </div>
        </div>

        {/* Two stacked images — right */}
        <div className="flex flex-col gap-3 flex-1 max-w-[290px]">
          {[1, 2].map((imgIdx) => (
            <div
              key={imgIdx}
              className="relative flex-1 rounded-xl overflow-hidden border border-gray-200 cursor-zoom-in group"
              onClick={() => openLightbox(Math.min(imgIdx, images.length - 1))}
            >
              <Image
                src={images[imgIdx]?.image_url || images[0]?.image_url || fallback}
                alt={`${propertyName} — image ${imgIdx + 1}`}
                fill
                className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              <div className="absolute bottom-2 right-2 bg-black/40 text-white rounded-lg p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn size={14} />
              </div>
              {/* "View all" overlay on last panel if more images */}
              {imgIdx === 2 && images.length > 3 && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
                  <span className="font-black text-2xl">+{images.length - 3}</span>
                  <span className="text-xs font-semibold mt-1">more photos</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── LIGHTBOX ── */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors z-10 cursor-pointer"
            aria-label="Close"
          >
            <X size={22} />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm font-semibold select-none">
            {lightboxIndex + 1} / {images.length}
          </div>

          {/* Prev arrow */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-3 md:left-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2.5 transition-colors z-10 cursor-pointer"
              aria-label="Previous"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Image */}
          <div
            className="relative w-full h-full max-w-5xl max-h-[85vh] mx-16"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex]?.image_url || fallback}
              alt={`${propertyName} — image ${lightboxIndex + 1}`}
              fill
              className="object-contain"
              unoptimized
              priority
            />
          </div>

          {/* Next arrow */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-3 md:right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2.5 transition-colors z-10 cursor-pointer"
              aria-label="Next"
            >
              <ChevronRight size={24} />
            </button>
          )}

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto px-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
                  className={`relative shrink-0 w-14 h-10 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    i === lightboxIndex ? "border-white scale-105" : "border-white/30 opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img.image_url || fallback}
                    alt={`thumb ${i + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
