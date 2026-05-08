import type { Metadata } from "next";
import HeroSlider from "@/components/home/HeroSlider";
import PropertySearch from "@/components/home/HomePropertySearch";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import HowWeWork from "@/components/home/HowWeWork";
import LatestBlogs from "@/components/home/LatestBlogs";
import TopTrendingCities from "@/components/home/TopTrendingcities";
import Banner from "@/components/home/Banner";

export const metadata: Metadata = {
  title: "Find Your Dream Property in India",
  description:
    "Explore thousands of verified property listings across India. Buy, sell, or rent residential & commercial properties with Houselink360.",
};

export default function HomePage() {
  return (
    <>
      {/* ── Hero with overlapping Search ──────────────────────────────── */}
      <section className="relative">
        <HeroSlider />

        <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 z-20 pointer-events-none">
          <div className="container mx-auto px-4 pointer-events-auto">
            <PropertySearch />
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
    </>
  );
}
