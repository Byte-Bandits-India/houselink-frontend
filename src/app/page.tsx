import type { Metadata } from "next";
import HomePageClient from "@/components/home/HomePageClient";

export const metadata: Metadata = {
  title: "Find Your Dream Property in India",
  description:
    "Explore thousands of verified property listings across India. Buy, sell, or rent residential & commercial properties with Houselink360.",
};

export default function HomePage() {
  return <HomePageClient />;
}

