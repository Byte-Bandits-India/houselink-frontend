"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import PropertyCard from "@/components/shared/PropertyCard";
import { mockProperties } from "@/data/mockProperties";
import { fadeUp, stagger } from "@/lib/animations";

const categories = [
  { id: "all", name: "All" },
  { id: "plots", name: "Plots" },
  { id: "apartments", name: "Apartments" },
  { id: "villas", name: "Villas" },
  { id: "house", name: "Individual House" },
  { id: "commercial", name: "Commercial Property" },
];

export default function FeaturedProperties() {
  const [activeTab, setActiveTab] = useState<"sell" | "rent">("sell");
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = mockProperties.filter((p) => {
    if (activeCategory === "all") return true;
    const cat = (p.categoryName ?? "").toLowerCase();
    if (activeCategory === "plots") return cat.includes("plot");
    if (activeCategory === "apartments") return cat.includes("apartment");
    if (activeCategory === "villas") return cat.includes("villa");
    if (activeCategory === "house") return cat.includes("house");
    if (activeCategory === "commercial") return cat.includes("commercial");
    return true;
  });

  return (
    <section className="py-24 bg-surface" id="featured-properties">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <motion.h3
              variants={fadeUp}
              className="text-brand text-sm font-semibold tracking-wider mb-2"
            >
              Featured Properties
            </motion.h3>
            <motion.h2
              variants={fadeUp}
              className="text-5xl sm:text-5xl font-extrabold text-ink"
            >
              Best Picks For You
            </motion.h2>
          </motion.div>

          <motion.p
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="text-ink-secondary max-w-xl text-base leading-relaxed"
          >
            We curate a versatile selection of properties, from carefully crafted
            residential homes to visually captivating and performance-driven
            commercial spaces.
          </motion.p>
        </div>

        {/* Sale/Rent Toggle */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="flex justify-center gap-3 mb-8"
        >
          {(["sell", "rent"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-7 py-2.5 text-sm font-bold border-2 border-brand rounded-md transition-all duration-300 ${activeTab === tab
                ? "bg-brand text-white shadow-md"
                : "bg-white text-brand hover:bg-brand/5"
                }`}
            >
              {tab === "sell" ? "For Sale" : "Rent/Lease"}
            </button>
          ))}
        </motion.div>

        {/* Category Nav */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="flex justify-center flex-wrap gap-6 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`relative pb-1.5 text-[15px] font-medium transition-all duration-300 whitespace-nowrap ${activeCategory === cat.id
                ? "text-brand font-semibold"
                : "text-gray-500 hover:text-brand"
                }`}
            >
              {cat.name}
              {/* Active underline */}
              <span
                className={`absolute bottom-0 left-0 h-[2.5px] bg-brand rounded-full transition-all duration-300 ${activeCategory === cat.id ? "w-full" : "w-0"
                  }`}
              />
            </button>
          ))}
        </motion.div>

        {/* Property Grid */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filtered.length > 0 ? (
            filtered.map((property) => (
              <motion.div key={property.id} variants={fadeUp}>
                <PropertyCard {...property} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <h4 className="text-xl text-ink-secondary">
                No properties found for{" "}
                {activeTab === "sell" ? "Sale" : "Rent"} in this category.
              </h4>
            </div>
          )}
        </motion.div>

        {/* See All Button */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="text-center mt-12"
        >
          <Link
            href={`/properties?property_purpose=${activeTab}`}
            className="inline-block px-10 py-3 bg-brand text-white rounded-[30px] font-semibold text-sm uppercase tracking-wider hover:bg-brand-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            See All Properties
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
