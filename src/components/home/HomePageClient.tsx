"use client";

import { Suspense } from "react";
import { HomeFilterProvider } from "@/contexts/HomeFilterContext";
import HeroSlider from "@/components/home/HeroSlider";
import PropertySearch from "@/components/shared/PropertySearch";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import TopTrendingCities from "@/components/home/TopTrendingcities";
import Banner from "@/components/home/Banner";
import LatestBlogs from "@/components/home/LatestBlogs";
import HowWeWork from "@/components/home/HowWeWork";

export default function HomePageClient() {
  return (
    <HomeFilterProvider>
      {/* ── Hero with overlapping Search ──────────────────────────────── */}
      <section className="relative">
        <HeroSlider />

        <div className="absolute -bottom-20 left-0 right-0 translate-y-1/2 z-20 pointer-events-none">
          <div className="container mx-auto px-4 pointer-events-auto">
            <Suspense fallback={null}>
              <PropertySearch />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Spacer so content below doesn't sit under the overlapping card */}
      <div className="h-72 md:h-48" />

      <TopTrendingCities />

      <Banner />

      {/* ── Featured Properties ───────────────────────────────────────── */}
      <FeaturedProperties />

      {/* ── Latest Blogs ─────────────────────────────────────────────── */}
      <LatestBlogs />

      {/* ── How We Work ──────────────────────────────────────────────── */}
      <HowWeWork />
    </HomeFilterProvider>
  );
}
