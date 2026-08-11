"use client";

import { Suspense, Fragment } from "react";
import { HomeFilterProvider } from "@/contexts/HomeFilterContext";
import PropertySearch from "@/components/shared/PropertySearch";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import TopTrendingCities from "@/components/home/TopTrendingcities";
import Banner from "@/components/home/Banner";
import HowWeWork from "@/components/home/HowWeWork";
import HighDemandProperties from "@/components/home/HighDemandProperties";
import UpcomingProperties from "@/components/home/UpcomingProperties";
import IntroVideo from "@/components/home/IntroVideo";

import { heroBadges } from "@/components/home/Options";
import type { HeroBadge } from "@/components/home/Options";
import React from "react";
import Image from "next/image";
import RotatingText, { RotatingTextRef } from "@/components/ui/RotatingText";
import ShinyText from "@/components/ui/ShinyText";
import { getHeroConfig, getImageUrl } from "@/lib/api";

const badgeIconMap: Record<HeroBadge["iconName"], React.ReactNode> = {
  ShieldCheck: <Image src="/assets/home/icons/verified.png" alt="Verified Properties" width={36} height={36} unoptimized />,
  MapPin: <Image src="/assets/home/icons/location.png" alt="Prime Locations" width={36} height={36} unoptimized />,
  Award: <Image src="/assets/home/icons/greatDeal.png" alt="Great Deals" width={36} height={36} unoptimized />,
  Headphones: <Image src="/assets/home/icons/expert.png" alt="Expert Support" width={36} height={36} unoptimized />,
};

export default function HomePageClient() {
  const [textIndex, setTextIndex] = React.useState(0);
  const ref1 = React.useRef<RotatingTextRef>(null);
  const ref2 = React.useRef<RotatingTextRef>(null);

  const [heroConfig, setHeroConfig] = React.useState({
    bgImage: "/assets/heroBG.png",
    shinyText: "Find your dream property in just a few clicks",
    rotatingTexts1: ["Better Homes.", "Better Life."],
    rotatingTexts2: ["Better Life.", "Better Homes."],
  });

  React.useEffect(() => {
    async function loadHeroConfig() {
      try {
        const res = await getHeroConfig();
        if (res.success && res.data) {
          setHeroConfig(res.data);
        }
      } catch (err) {
        console.error("Failed to load hero configuration from backend:", err);
      }
    }
    loadHeroConfig();
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => {
        const maxLen = Math.max(heroConfig.rotatingTexts1.length, heroConfig.rotatingTexts2.length);
        if (maxLen <= 1) return 0;
        return (prev + 1) % maxLen;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [heroConfig.rotatingTexts1.length, heroConfig.rotatingTexts2.length]);

  React.useEffect(() => {
    if (ref1.current && heroConfig.rotatingTexts1.length > textIndex) {
      ref1.current.jumpTo(textIndex);
    }
    if (ref2.current && heroConfig.rotatingTexts2.length > textIndex) {
      ref2.current.jumpTo(textIndex);
    }
  }, [textIndex, heroConfig.rotatingTexts1.length, heroConfig.rotatingTexts2.length]);


  return (
    <HomeFilterProvider>
      {/* ── Hero Section ── */}
      <section 
        className="relative h-[100dvh] lg:h-[90dvh] pt-10 md:pt-16 lg:pt-24 w-full flex items-start justify-center overflow-visible bg-cover bg-center bg-no-repeat z-30"
        style={{ backgroundImage: `url('${getImageUrl(heroConfig.bgImage)}')` }}
      >
        <div className="container mx-auto px-4 flex flex-col items-center text-center relative z-10">
          {/* Subtitle */}
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-4 md:mb-6 lg:mb-10">
            <Image
              src="/assets/home/icons/left.png"
              alt="Left decorative icon"
              width={20}
              height={20}
              className="object-contain w-6 h-6 md:w-[124px] md:h-[15px] shrink-0"
              unoptimized
            />
            <ShinyText
              text={heroConfig.shinyText}
              speed={2}
              delay={0}
              color="#4F8BD3"
              shineColor="#FFFFFF"
              spread={120}
              direction="left"
              yoyo={false}
              pauseOnHover={false}
              disabled={false}
              className="text-sm md:text-base lg:text-lg font-bold tracking-wider"
            />
            <Image
              src="/assets/home/icons/right.png"
              alt="Right decorative icon"
              width={20}
              height={20}
              className="object-contain w-6 h-6 md:w-[124px] md:h-[15px] shrink-0"
              unoptimized
            />
          </div>
          
          {/* Heading */}
          <h1 className="text-5xl lg:text-[68px] font-extrabold tracking-tight mb-4 md:mb-6 lg:mb-10 min-h-[1.2em] select-none">
            <span className={`inline-flex transition-colors duration-500 ${textIndex % 2 === 0 ? "text-primary" : "text-secondary"}`}>
              <RotatingText
                ref={ref1}
                auto={false}
                texts={heroConfig.rotatingTexts1}
                mainClassName="overflow-hidden py-1 lg:py-2"
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
              />
            </span>
            <span className="hidden md:inline">&nbsp;</span>
            <br className="md:hidden"/>
            <span className={`inline-flex transition-colors duration-500 ${textIndex % 2 === 0 ? "text-secondary" : "text-primary"}`}>
              <RotatingText
                ref={ref2}
                auto={false}
                texts={heroConfig.rotatingTexts2}
                mainClassName="overflow-hidden py-1 lg:py-2"
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
              />
            </span>
          </h1>

          {/* Badges/Features Row */}
          <div className="p-4 md:px-6 md:py-4 grid grid-cols-2 gap-4 md:flex md:flex-nowrap md:justify-center md:items-center md:gap-8 mb-6 md:mb-10 max-w-6xl w-full">
            {heroBadges.map((item, index, arr) => (
              <Fragment key={item.id}>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 shrink-0 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    {badgeIconMap[item.iconName]}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[14px] font-bold text-gray-900 leading-tight">
                      {item.title}
                    </span>
                    <span className="text-[13px] text-gray-400 font-medium leading-tight">
                      {item.subtitle}
                    </span>
                  </div>
                </div>
                {index < arr.length - 1 && (
                  <div className="hidden md:block w-px h-8 bg-secondary shrink-0" />
                )}
              </Fragment>
            ))}
          </div>

          {/* Search/Filter Controls */}
          <Suspense fallback={null}>
            <PropertySearch />
          </Suspense>
        </div>
      </section>

      {/* Spacer below the inline hero search */}
      <div className="h-12" />

      <Banner />

      <TopTrendingCities />

      <HighDemandProperties />

      {/* ── Featured Properties ───────────────────────────────────────── */}
      <FeaturedProperties />

      <UpcomingProperties />

      <IntroVideo />

      {/* ── How We Work ──────────────────────────────────────────────── */}
      <HowWeWork />
    </HomeFilterProvider>
  );
}
