"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { heroSlides, HERO_SLIDE_DURATION_MS } from "@/components/home/Options";

type SlideState = "entering" | "active" | "exiting";

const SLIDE_DURATION = HERO_SLIDE_DURATION_MS;

// ─── Component ────────────────────────────────────────────────────────────────

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [states, setStates] = useState<SlideState[]>(
    heroSlides.map((_, i) => (i === 0 ? "active" : "entering"))
  );
  const [activeTab, setActiveTab] = useState<"sell" | "rent">("sell");
  const transitioning = useRef(false);

  const goTo = useCallback((next: number) => {
    if (transitioning.current || next === current) return;
    transitioning.current = true;

    const prev = current;
    setCurrent(next);

    setStates((prev_states) => {
      const s = [...prev_states];
      s[next] = "entering";
      return s;
    });

    // Double rAF to ensure entering class is painted before removing it
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setStates((s) => {
          const ns = [...s];
          ns[next] = "active";
          ns[prev] = "exiting";
          return ns;
        });
      });
    });

    setTimeout(() => {
      setStates((s) => {
        const ns = [...s];
        ns[prev] = "entering"; // reset off-screen
        return ns;
      });
      transitioning.current = false;
    }, 800);
  }, [current]);

  const handleNext = useCallback(() => {
    goTo((current + 1) % heroSlides.length);
  }, [current, goTo]);

  // Auto-advance (right to left only)
  useEffect(() => {
    const timer = setInterval(handleNext, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [handleNext]);

  return (
    <section className="relative w-full overflow-hidden select-none" style={{ height: "620px" }}>

      {/* ── Background images ── */}
      {heroSlides.map((slide, i) => (
        <div
          key={slide.id}
          className="absolute inset-0 transition-all"
          style={{
            transform:
              states[i] === "entering"
                ? "translateX(100%)"
                : states[i] === "active"
                  ? "translateX(0%)"
                  : "translateX(-30%)",
            opacity: states[i] === "active" ? 1 : 0,
            transitionProperty: "transform, opacity",
            transitionDuration: "0.75s",
            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={i === 0}
            draggable={false}
          />
        </div>
      ))}

      {/* ── Gradient overlay (exact spec) ── */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, var(--primary) 0%, var(--primary) 20.29%, rgba(115, 115, 115, 0) 100%)",
        }}
      />

      {/* ── Hero text content ── */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="container mx-auto h-full flex flex-col justify-center px-4 md:px-6 pointer-events-auto">
          <div className="w-full md:w-[55%] lg:w-full">
            <h1
              className="font-bold text-white leading-tight mb-3"
              style={{
                fontSize: "clamp(2.5rem, 3.5vw, 5rem)",
                letterSpacing: "-0.01em",
              }}
            >
              {heroSlides[current].title}
            </h1>
            <p
              className="text-white/80 leading-relaxed"
              style={{ fontSize: "0.95rem", maxWidth: "340px" }}
            >
              {heroSlides[current].description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}