"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { getAds } from "@/lib/api";
import type { AdBanner } from "@/types/ad";

const defaultBanners = [
  {
    id: -1,
    name: "Default Banner 1",
    image: "/assets/default_images/Banner.png",
    url: null,
    openInNewTab: false,
  },
  {
    id: -2,
    name: "Default Banner 2",
    image: "/assets/images/about-us/about-img-2.jpg",
    url: null,
    openInNewTab: false,
  },
  {
    id: -3,
    name: "Default Banner 3",
    image: "/assets/default_images/Banner.png",
    url: null,
    openInNewTab: false,
  },
];

const SLIDE_DURATION = 5000;

import type { Variants } from "framer-motion";
const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: "0%",
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
};

interface BannerSlide {
  id: number;
  name: string;
  image: string;
  url: string | null;
  openInNewTab: boolean;
}

const Banner = () => {
  const [banners, setBanners] = useState<BannerSlide[]>(defaultBanners);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  // Fetch banners from API
  useEffect(() => {
    async function loadBanners() {
      try {
        const res = await getAds();
        if (res.success && res.data && res.data.length > 0) {
          const now = new Date();
          const activeBanners = res.data
            .filter((ad) => {
              // Only show active banners
              if (ad.status !== "published") return false;
              // Check expiry date if set
              if (ad.expiredAt && new Date(ad.expiredAt) < now) return false;
              // Must have at least one image
              return !!(ad.pcImage || ad.tabletImage || ad.mobileImage);
            })
            .map((ad) => {
              const rawImg = ad.pcImage || ad.tabletImage || ad.mobileImage;
              let resolvedImg = "/assets/default_images/Banner.png";
              if (rawImg) {
                if (rawImg.startsWith("http://") || rawImg.startsWith("https://")) {
                  resolvedImg = rawImg;
                } else {
                  const base = process.env.NEXT_PUBLIC_WEB_API_URL ?? "http://localhost:4000";
                  resolvedImg = `${base.replace(/\/$/, "")}/${rawImg.replace(/^\//, "")}`;
                }
              }
              return {
                id: ad.id,
                name: ad.name,
                image: resolvedImg,
                url: ad.url || null,
                openInNewTab: ad.openInNewTab,
              };
            });

          if (activeBanners.length > 0) {
            setBanners(activeBanners);
            setCurrent(0);
          }
        }
      } catch (err) {
        console.error("Failed to load banner ads:", err);
      }
    }
    loadBanners();
  }, []);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(handleNext, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [handleNext, banners.length]);

  const slide = banners[current];

  return (
    <section
      className="relative container mx-auto h-[520px] overflow-hidden select-none rounded-lg
        border border-gray-200
        shadow-[0_4px_24px_rgba(0,0,0,0.13),_0_1.5px_6px_rgba(0,0,0,0.07)]
        p-0                      
      "
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={`${slide.id}-${current}`}
          className="absolute inset-0"
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
        >
          {slide.url ? (
            <a
              href={slide.url}
              target={slide.openInNewTab ? "_blank" : undefined}
              rel={slide.openInNewTab ? "noopener noreferrer" : undefined}
              className="absolute inset-0 block cursor-pointer w-full h-full"
            >
              <Image
                src={slide.image}
                alt={slide.name}
                fill
                unoptimized
                className="object-cover"
                priority
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent" />
            </a>
          ) : (
            <div className="absolute inset-0 w-full h-full">
              <Image
                src={slide.image}
                alt={slide.name}
                fill
                unoptimized
                className="object-cover"
                priority
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent" />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Slide indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > current ? 1 : -1);
                setCurrent(i);
              }}
              className={`h-2 w-6 rounded-full transition-all duration-500 ${
                i === current ? "bg-white" : "bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Banner;
