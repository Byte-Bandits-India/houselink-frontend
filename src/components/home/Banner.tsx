"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const bannerImages = [
  "/assets/default_images/Banner.png",
  "/assets/images/about-us/about-img-2.jpg",
  "/assets/default_images/Banner.png",
];

const SLIDE_DURATION = 4000;

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

const Banner = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % bannerImages.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(handleNext, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [handleNext]);

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
          key={bannerImages[current]}
          className="absolute inset-0"
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
        >
          <Image
            src={bannerImages[current]}
            alt={`Banner Image ${current + 1}`}
            fill
            className="object-cover"
            priority
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {bannerImages.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > current ? 1 : -1);
              setCurrent(i);
            }}
            className={`h-2 w-6 rounded-full transition-all duration-500 ${i === current ? "bg-white" : "bg-white/40 hover:bg-white/60"
              }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Banner;
