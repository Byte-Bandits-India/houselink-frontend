"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import PropertyCard from "@/components/shared/PropertyCard";
import PropertyTypeSwitch from "@/components/shared/PropertyTypeSwitch";
import { getProperties, mapApiPropertyToCardProps, getCityIdByName } from "@/lib/api";
import { fadeUp } from "@/lib/animations";
import { useHomeFilter } from "@/contexts/HomeFilterContext";
import { smoothScrollBy } from "@/lib/smoothScroll";

const FeaturedPropertyCard = ({ property }: { property: any }) => {
  return <PropertyCard {...property} />;
};

function FeaturedPropertiesContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { filters: homeFilters, setFilters } = useHomeFilter();

  const isHomePage = pathname === "/";

  const activeTab = homeFilters.activeTab || "sell";
  const activeCategory = homeFilters.activeCategory || "all";
  const city = homeFilters.city || null;
  const keyword = homeFilters.keyword || null;
  const location = homeFilters.location || null;
  const categoryType = homeFilters.categoryType || null;
  const maxPrice = homeFilters.maxPrice || null;
  const maxArea = homeFilters.maxArea || null;
  const amenities = homeFilters.amenities || null;

  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const scrollContainer = useRef<HTMLDivElement>(null);

  const handleTabChange = (newTab: "sell" | "rent") => {
    setFilters({
      ...homeFilters,
      activeTab: newTab,
      activeCategory: newTab !== "sell" && homeFilters.activeCategory === "plots" ? "all" : homeFilters.activeCategory,
    });
  };

  const getViewAllLink = () => {
    return "/properties";
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
        if ((homeFilters as any).minPrice) {
          params.min_price = (homeFilters as any).minPrice;
        }
        if (maxArea) {
          params.max_area = maxArea;
        }
        if ((homeFilters as any).minArea) {
          params.min_area = (homeFilters as any).minArea;
        }
        if ((homeFilters as any).houseType) {
          params.house_type = (homeFilters as any).houseType;
        }
        if (amenities) {
          params.features = amenities;
        }
        if ((homeFilters as any).facilities) {
          params.facilities = (homeFilters as any).facilities;
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

        // Sort: featured properties first, then by last updated/approved time descending
        filteredData.sort((a, b) => {
          const aFeatured = a.isFeatured ? 1 : 0;
          const bFeatured = b.isFeatured ? 1 : 0;
          if (bFeatured !== aFeatured) {
            return bFeatured - aFeatured;
          }

          const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
          const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
          if (bTime !== aTime) {
            return bTime - aTime;
          }
          return b.id - a.id;
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
  }, [activeTab, activeCategory, city, keyword, location, categoryType, maxPrice, maxArea, amenities, homeFilters]);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainer.current) {
      const scrollAmount = 360; // card width + gap approx
      smoothScrollBy(
        scrollContainer.current,
        direction === "left" ? -scrollAmount : scrollAmount,
        450
      );
    }
  };

  return (
    <section className="py-4 bg-surface" id="featured-properties">
      <div className="container mx-auto px-4 max-w-[1440px]">
        {/* Sale/Rent Toggle (Top Center) */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="flex justify-center gap-3 mb-8"
        >
          <div className="w-[280px]">
            <PropertyTypeSwitch
              activeTab={activeTab}
              onChange={handleTabChange}
              variant="header"
            />
          </div>
        </motion.div>
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="flex justify-between items-center mb-10"
        >
          <div className="text-left">
            <h2 className="text-xl md:text-2xl font-extrabold text-primary flex items-center gap-0.5">
              All Properties
              <ChevronRight size={22} className="stroke-[2.5px]" />
            </h2>
          </div>

          <div className="flex items-center gap-4">
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
            <Link
              href={getViewAllLink()}
              className="px-4 py-1.5 border border-gray-200 rounded-full text-xs font-bold text-primary hover:bg-gray-50 transition-colors flex items-center gap-0.5 shadow-sm"
            >
              View All
              <ChevronRight size={14} className="stroke-[2.5px]" />
            </Link>
          </div>
        </motion.div>

        {/* Property Carousel */}
        {isLoading ? (
          <div className="text-center py-16">
            <p className="text-ink-secondary font-medium">Loading properties...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-500 font-semibold text-lg">{error}</p>
          </div>
        ) : (
          <div 
            ref={scrollContainer}
            className="flex overflow-x-auto gap-6 pb-6 pt-4 scrollbar-hide w-full"
          >
            {/* Style block to hide scrollbar */}
            <style dangerouslySetInnerHTML={{ __html: `
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
              .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}} />
            {properties.length > 0 ? (
              properties.slice(0, 6).map((property) => (
                <div key={property.id} className="flex-none w-[290px] md:w-[340px]">
                  <Link href={property.permalink ? `/properties/${property.permalink}` : `/properties/${property.id}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl overflow-visible">
                    <FeaturedPropertyCard property={property} />
                  </Link>
                </div>
              ))
            ) : (
              <div className="w-full text-center py-16 bg-white rounded-2xl border border-gray-100">
                <h4 className="text-xl text-ink-secondary">
                  No properties found matching your search filters.
                </h4>
              </div>
            )}
          </div>
        )}
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
