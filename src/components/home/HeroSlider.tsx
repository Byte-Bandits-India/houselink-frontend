"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { heroSlides } from "@/data/mockProperties";

const SLIDE_DURATION = 5000;
const DRAG_THRESHOLD = 50;

const contentVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
  exit: {},
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

// Slide enters from right (forward) or from left (backward)
import type { Variants } from "framer-motion";
const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
  }),
  center: {
    x: "0%",
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
};

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const dragStartX = useRef<number | null>(null);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  const handleDotClick = useCallback(
    (i: number) => {
      setDirection(i > current ? 1 : -1);
      setCurrent(i);
    },
    [current],
  );

  useEffect(() => {
    const timer = setInterval(handleNext, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [handleNext]);

  const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    dragStartX.current = e.clientX;
  };

  const onPointerUp = (e: React.PointerEvent<HTMLElement>) => {
    if (dragStartX.current === null) return;
    const diff = dragStartX.current - e.clientX;
    if (Math.abs(diff) > DRAG_THRESHOLD) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    dragStartX.current = null;
  };

  const slide = heroSlides[current];

  return (
    <section
      className="relative w-full h-[100vh] md:h-[80vh] min-h-[600px] overflow-hidden select-none"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      {/* Background images — animated with directional enter/exit */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={slide.id}
          className="absolute inset-0"
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="container mx-auto px-4 h-full flex items-center relative z-10">
        <div className="max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.h3
                className="text-brand-300 text-lg font-semibold tracking-wider uppercase mb-3"
                variants={itemVariants}
              >
                {slide.subtitle}
              </motion.h3>

              <motion.h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
                variants={itemVariants}
              >
                {slide.title}
              </motion.h1>

              <motion.p
                className="text-white/80 text-lg mb-8 leading-relaxed max-w-xl"
                variants={itemVariants}
              >
                {slide.description}
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-4"
                variants={itemVariants}
              >
                <Link
                  href="/properties"
                  className="px-8 py-3.5 bg-brand text-white font-semibold uppercase text-sm tracking-wider hover:bg-brand-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  draggable={false}
                >
                  Explore More
                </Link>
                <Link
                  href="/properties"
                  className="px-8 py-3.5 bg-white backdrop-blur-sm border border-white/30 text-brand-900 font-semibold uppercase text-sm tracking-wider hover:bg-brand-700 hover:text-white transition-all duration-300 hover:-translate-y-0.5"
                  draggable={false}
                >
                  View Properties
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => handleDotClick(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === current
                ? "w-10 bg-white"
                : "w-4 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
