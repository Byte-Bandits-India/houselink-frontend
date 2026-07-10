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

const badgeIconMap: Record<HeroBadge["iconName"], React.ReactNode> = {
  ShieldCheck: <Image src="/assets/home/icons/verified.png" alt="Verified Properties" width={36} height={36} unoptimized />,
  MapPin: <Image src="/assets/home/icons/location.png" alt="Prime Locations" width={36} height={36} unoptimized />,
  Award: <Image src="/assets/home/icons/greatDeal.png" alt="Great Deals" width={36} height={36} unoptimized />,
  Headphones: <Image src="/assets/home/icons/expert.png" alt="Expert Support" width={36} height={36} unoptimized />,
};

export default function HomePageClient() {
  return (
    <HomeFilterProvider>
      {/* ── Hero Section ── */}
      <section 
        className="relative h-[100dvh] lg:h-[90dvh] pt-10 md:pt-16 lg:pt-24 w-full flex items-start justify-center overflow-visible bg-cover bg-center bg-no-repeat z-30"
        style={{ backgroundImage: "url('/assets/heroBG.png')" }}
      >
        <div className="container mx-auto px-4 flex flex-col items-center text-center relative z-10">
          {/* Subtitle */}
          <span className="text-secondary text-sm md:text-base lg:text-lg font-bold mb-4 md:mb-6 lg:mb-10 tracking-wider">
            Find your dream property in just a few clicks
          </span>
          
          {/* Heading */}
          <h1 className="text-5xl lg:text-[68px] font-extrabold tracking-tight mb-4 md:mb-6 lg:mb-10">
            <span className="text-primary">Better Homes. </span><br className="md:hidden"/>
            <span className="text-secondary">Better Life.</span>
          </h1>

          {/* Badges/Features Row */}
          <div className="p-4 md:px-6 md:py-4 grid grid-cols-2 gap-4 md:flex md:flex-nowrap md:justify-center md:items-center md:gap-8 mb-6 md:mb-10 max-w-4xl w-full">
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
