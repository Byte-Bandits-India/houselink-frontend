"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────

interface HeroSlide {
  id: string | number;
  image: string;
  title: string;
  subtitle?: string;
  description?: string;
}

// ─── Replace with your real data import ──────────────────────────────────────
// import { heroSlides } from "@/data/mockProperties";

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80",
    title: "List Your Property",
    subtitle: "Premium Listings",
    description: "Showcase your property to thousands of active seekers. Easy listing. Maximum visibility. Zero hassle.",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&auto=format&fit=crop&q=80",
    title: "Find Your Dream Home",
    subtitle: "Exclusive Properties",
    description: "Browse thousands of verified listings across the city. From cozy apartments to luxury villas.",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80",
    title: "Invest in Real Estate",
    subtitle: "Best Deals",
    description: "Discover high-yield investment properties and commercial spaces with expert guidance.",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&auto=format&fit=crop&q=80",
    title: "Rent with Confidence",
    subtitle: "Verified Rentals",
    description: "Find verified rental homes and apartments with transparent pricing and zero brokerage.",
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const SLIDE_DURATION = 4500;

// ─── Slide image state helpers ────────────────────────────────────────────────

type SlideState = "entering" | "active" | "exiting";

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
            "linear-gradient(90deg, #163D75 0%, #163D75 20.29%, rgba(115, 115, 115, 0) 100%)",
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