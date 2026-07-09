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
import { ShieldCheck, MapPin, Award, Headphones } from "lucide-react";
import { heroBadges } from "@/components/home/Options";
import type { HeroBadge } from "@/components/home/Options";
import React from "react";

const badgeIconMap: Record<HeroBadge["iconName"], React.ReactNode> = {
  ShieldCheck: <ShieldCheck size={22} strokeWidth={2} />,
  MapPin: <MapPin size={22} strokeWidth={2} />,
  Award: <Award size={22} strokeWidth={2} />,
  Headphones: <Headphones size={22} strokeWidth={2} />,
};

export default function HomePageClient() {
  return (
    <HomeFilterProvider>
      {/* ── Hero Section ── */}
      <section 
        className="relative h-[90dvh] w-full flex items-center justify-center overflow-visible bg-cover bg-center bg-no-repeat z-30"
        style={{ backgroundImage: "url('/assets/heroBG.png')" }}
      >
        <div className="container mx-auto px-4 flex flex-col items-center text-center relative z-10">
          {/* Subtitle */}
          <span className="text-primary-light text-sm md:text-base lg:text-lg font-bold mb-4 md:mb-6 lg:mb-10 tracking-wider">
            Find your dream property in just a few clicks
          </span>
          
          {/* Heading */}
          <h1 className="text-5xl lg:text-[68px] font-extrabold tracking-tight mb-4 md:mb-6 lg:mb-10">
            <span className="text-primary">Better Homes. </span><br className="md:hidden"/>
            <span className="text-primary-light">Better Life.</span>
          </h1>

          {/* Badges/Features Row */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 md:px-6 md:py-4 shadow-sm border border-blue-100 grid grid-cols-2 gap-4 md:flex md:flex-nowrap md:justify-center md:items-center md:gap-8 mb-6 md:mb-10 max-w-4xl w-full">
            {heroBadges.map((item, index, arr) => (
              <Fragment key={item.id}>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 shrink-0 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
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
                  <div className="hidden md:block w-px h-8 bg-gray-200 shrink-0" />
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
