"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { MapPin, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { getPopularRegions, getImageUrl, type PopularRegionApiItem } from "@/lib/api";
import { smoothScrollBy } from "@/lib/smoothScroll";
import type { CityCardProps } from "@/types/home";

function CityCard({ image, name, propertiesCount, growthRate }: CityCardProps) {
  return (
    <div className="flex flex-col bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden w-full max-w-[280px] sm:max-w-none">
      {/* Image Container */}
      <div className="relative h-[180px] w-full overflow-hidden select-none image-anime">
        {/* High Demand Badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-[10px] font-bold text-red-500 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm border border-red-50/50 z-10">
          <img src="/assets/home/icons/fire.png" alt="fire" className="w-3.5 h-3.5 object-contain" /> High Demand
        </div>
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, 280px"
          unoptimized={true}
          className="object-cover hover:scale-105 transition-transform duration-500"
          draggable={false}
        />
      </div>

      {/* Info Container */}
      <div className="p-5 text-left flex flex-col gap-3">
        {/* Location Row */}
        <div className="flex items-center gap-1.5">
          <MapPin size={18} className="text-blue-500 -mt-2" />
          <h3 className="text-primary font-extrabold text-base tracking-tight">{name}</h3>
        </div>

        {/* Subtitle properties */}
        <p className="text-xs text-gray-500 font-medium -mt-3">{propertiesCount}+ Properties</p>

        {/* Trend badge */}
        <div className="inline-flex items-center -mt-3 gap-1 bg-[#EAEAFE] text-primary text-[10px] font-bold px-2.5 py-1.5 rounded-full w-fit">
          <TrendingUp size={12} />
          {growthRate} Growth
        </div>
      </div>
    </div>
  );
}

const CARD_WIDTH = 296; // 280px card + 16px gap (gap-4)
const GAP = 24; // gap-6 = 24px

export default function TopTrendingCities() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoplayTimeoutRef = useRef<any>(null);
  const isAutoplayEnabledRef = useRef(true);
  const [cities, setCities] = useState<PopularRegionApiItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getPopularRegions()
      .then((data) => {
        if (isMounted) setCities(data);
      })
      .catch((err) => {
        console.error("Error loading high demand regions:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  // Duplicate cities 4× for a seamless infinite loop
  const loopedCities = cities.length > 0
    ? [...cities, ...cities, ...cities, ...cities]
    : [];

  // Auto-scroll via requestAnimationFrame (works with scrollLeft + arrow buttons)
  useEffect(() => {
    let animationFrameId: number;
    let isHovered = false;
    const container = scrollRef.current;
    if (!container) return;

    const step = () => {
      if (isAutoplayEnabledRef.current && !isHovered && container) {
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (maxScroll > 0) {
          container.scrollLeft += 0.8;
          // Wrap: when we've scrolled past the 2nd copy, jump back to 1st copy
          if (container.scrollLeft >= maxScroll * 0.75) {
            container.scrollLeft = maxScroll * 0.25;
          }
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    const handleMouseEnter = () => { isHovered = true; };
    const handleMouseLeave = () => { isHovered = false; };

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);
    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (autoplayTimeoutRef.current) clearTimeout(autoplayTimeoutRef.current);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [loopedCities.length]);

  const handleScroll = (direction: "left" | "right") => {
    isAutoplayEnabledRef.current = false;
    if (autoplayTimeoutRef.current) clearTimeout(autoplayTimeoutRef.current);

    // Resume autoplay after 5s of inactivity
    autoplayTimeoutRef.current = setTimeout(() => {
      isAutoplayEnabledRef.current = true;
    }, 5000);

    if (scrollRef.current) {
      smoothScrollBy(
        scrollRef.current,
        direction === "left" ? -(CARD_WIDTH + GAP) : (CARD_WIDTH + GAP),
        450
      );
    }
  };

  if (!isLoading && cities.length === 0) {
    return null;
  }

  return (
    <section id="trending-cities" className="py-12 container mx-auto px-4 md:px-6">
      {/* Title and Controls block */}
      <div className="flex justify-between items-end mb-8">
        <div className="text-left">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#000000] flex items-center gap-2 mb-2">
            <img src="/assets/home/icons/fire.png" alt="fire" className="w-7 h-7 object-contain" /> High Demand Regions
          </h2>
          <p className="text-sm md:text-base text-[#918B8B] font-medium">
            Top locations with great demand and promising returns
          </p>
        </div>

        {/* Arrow Slider Controls */}
        <div className="flex gap-2">
          <button
            onClick={() => handleScroll("left")}
            className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 active:scale-95 transition-all shadow-xs cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} className="stroke-[2px]" />
          </button>
          <button
            onClick={() => handleScroll("right")}
            className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 active:scale-95 transition-all shadow-xs cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} className="stroke-[2px]" />
          </button>
        </div>
      </div>

      {/* Cards list */}
      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide w-full"
      >
        {isLoading
          ? [1, 2, 3, 4].map((n) => (
              <div key={n} className="flex-shrink-0 w-[260px] md:w-[280px] h-[280px] bg-gray-100 rounded-3xl animate-pulse" />
            ))
          : loopedCities.map((city, i) => (
              <div key={`${city.id}-${i}`} className="flex-shrink-0 w-[260px] md:w-[280px]">
                <CityCard
                  image={getImageUrl(city.image)}
                  name={city.name}
                  propertiesCount={city.propertiesCount}
                  growthRate={city.growthRate}
                />
              </div>
            ))
        }
      </div>
    </section>
  );
}