"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import PropertyCard from "@/components/shared/PropertyCard";
import { getProperties, mapApiPropertyToCardProps, getCityIdByName } from "@/lib/api";
import { fadeUp, stagger } from "@/lib/animations";

const categories = [
  { id: "all", name: "All" },
  { id: "plots", name: "Plots" },
  { id: "apartments", name: "Apartments" },
  { id: "villas", name: "Villas" },
  { id: "house", name: "Individual House" },
  { id: "commercial", name: "Commercial Property" },
];

function FeaturedPropertiesContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Extract parameters from URL
  const activeTab = (searchParams.get("property_purpose") || "sell") as "sell" | "rent";
  const activeCategory = searchParams.get("category") || "all";
  const city = searchParams.get("city");
  const keyword = searchParams.get("keyword");
  const location = searchParams.get("location");
  const categoryType = searchParams.get("category_type");
  const maxPrice = searchParams.get("max_price");
  const maxArea = searchParams.get("max_area");
  const amenities = searchParams.get("amenities");

  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleTabChange = (newTab: "sell" | "rent") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("property_purpose", newTab);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleCategoryChange = (catId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (catId === "all") {
      params.delete("category");
    } else {
      params.set("category", catId);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    async function loadProperties() {
      setIsLoading(true);
      setError(null);
      try {
        const params: any = {
          is_active: "true",
          moderation: "approved",
        };

        if (activeTab === "sell") {
          params.property_for = "sell";
        }

        if (city) {
          const cityId = await getCityIdByName(city);
          if (cityId) {
            params.city_id = String(cityId);
          }
        }

        if (maxPrice) {
          params.max_price = maxPrice;
        }

        if (keyword) {
          params.search = keyword;
        } else if (location) {
          params.search = location;
        }

        if (activeCategory !== "all") {
          if (activeCategory === "apartments") {
            params.categories_id = 1;
          } else if (activeCategory === "villas") {
            params.categories_id = 2;
          } else if (activeCategory === "house") {
            params.categories_id = 4;
          } else if (activeCategory === "plots") {
            params.categories_id = activeTab === "sell" ? 3 : 5;
          }
        }

        // Fetch properties matching the query
        let res = await getProperties(params);
        let data = res.data || [];

        // Apply client-side filters
        let filteredData = applyFilters(data);

        // Sort: featured properties first
        filteredData.sort((a, b) => {
          const aFeatured = a.isFeatured ? 1 : 0;
          const bFeatured = b.isFeatured ? 1 : 0;
          return bFeatured - aFeatured;
        });

        // Map backend properties to PropertyCardProps format
        const mapped = filteredData.map(mapApiPropertyToCardProps);
        setProperties(mapped);
      } catch (err: any) {
        console.error("Error loading homepage featured properties:", err);
        setError("Could not load featured properties. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    function applyFilters(rawData: any[]) {
      let data = [...rawData];

      // 1. Property Purpose (Rent/Lease/Sale)
      if (activeTab === "rent") {
        data = data.filter(
          (p) => p.propertyFor === "rent" || p.propertyFor === "lease"
        );
      } else {
        data = data.filter((p) => p.propertyFor === "sell");
      }

      // 2. Keyword Filter
      if (keyword) {
        const q = keyword.toLowerCase();
        data = data.filter(
          (p) =>
            (p.name && p.name.toLowerCase().includes(q)) ||
            (p.description && p.description.toLowerCase().includes(q)) ||
            (p.location && p.location.toLowerCase().includes(q))
        );
      }

      // 3. Location Filter
      if (location) {
        const q = location.toLowerCase();
        data = data.filter(
          (p) => p.location && p.location.toLowerCase().includes(q)
        );
      }

      // 4. Category Type (Residential / Commercial)
      if (categoryType) {
        const type = categoryType.toLowerCase();
        data = data.filter(
          (p) => p.category?.type && p.category.type.toLowerCase() === type
        );
      }

      // 5. Subcategory Filter (Category)
      if (activeCategory && activeCategory !== "all") {
        const cat = activeCategory.toLowerCase();
        data = data.filter((p) => {
          const catName = (p.category?.name || "").toLowerCase().replace(/_/g, " ");
          if (cat === "plots") return catName.includes("plot") || catName.includes("land");
          if (cat === "apartments") return catName.includes("apartment");
          if (cat === "villas") return catName.includes("villa");
          if (cat === "house") return catName.includes("individual house") || catName.includes("house");
          if (cat === "commercial") {
            return (
              catName.includes("commercial") ||
              catName.includes("shop") ||
              catName.includes("building") ||
              catName.includes("godown") ||
              catName.includes("warehouse") ||
              catName.includes("office")
            );
          }
          return true;
        });
      }

      // 6. Max Price Filter
      if (maxPrice) {
        const priceLimit = Number(maxPrice);
        if (!isNaN(priceLimit)) {
          data = data.filter((p) => Number(p.price || 0) <= priceLimit);
        }
      }

      // 7. Max Area Filter
      if (maxArea) {
        const areaLimit = Number(maxArea);
        if (!isNaN(areaLimit)) {
          data = data.filter((p) => {
            const areaVal = Number(p.builtUpArea || p.plotLandArea || 0);
            return areaVal <= areaLimit;
          });
        }
      }

      // 8. Amenities Filter
      if (amenities) {
        const requested = amenities.split(",");
        data = data.filter((p) => {
          const propertyFeatures: string[] = (p.propertyFeatures || []).map((pf: any) =>
            (pf.feature?.name || "").toLowerCase()
          );
          return requested.every((req) =>
            propertyFeatures.some(
              (pa: string) =>
                pa.includes(req.toLowerCase()) ||
                req.toLowerCase().includes(pa)
            )
          );
        });
      }

      return data;
    }

    loadProperties();
  }, [activeTab, activeCategory, city, keyword, location, categoryType, maxPrice, maxArea, amenities]);

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
              onClick={() => handleTabChange(tab)}
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
              onClick={() => handleCategoryChange(cat.id)}
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
        {isLoading ? (
          <div className="text-center py-16">
            <p className="text-ink-secondary font-medium">Loading properties...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-500 font-semibold text-lg">{error}</p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {properties.length > 0 ? (
              properties.map((property) => (
                <motion.div key={property.id} variants={fadeUp}>
                  <PropertyCard {...property} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <h4 className="text-xl text-ink-secondary">
                  No properties found matching your search filters.
                </h4>
              </div>
            )}
          </motion.div>
        )}

        {/* See All Button */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="text-center mt-12"
        >
          <Link
            href={`/properties?${searchParams.toString()}`}
            className="inline-block px-10 py-3 bg-brand text-white rounded-[30px] font-semibold text-sm uppercase tracking-wider hover:bg-brand-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            See All Properties
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default function FeaturedProperties() {
  return (
    <Suspense fallback={
      <section className="py-24 bg-surface" id="featured-properties">
        <div className="container mx-auto px-4 text-center">
          <p className="text-ink-secondary font-medium">Loading properties...</p>
        </div>
      </section>
    }>
      <FeaturedPropertiesContent />
    </Suspense>
  );
}
