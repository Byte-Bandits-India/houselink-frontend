"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import PropertyCard from "@/components/shared/PropertyCard";
import PropertySearch from "@/components/shared/PropertySearch";
import { getProperties, mapApiPropertyToCardProps, getCityIdByName } from "@/lib/api";


function PropertiesListContent() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract parameters
  const propertyPurpose = searchParams.get("property_purpose");
  const city = searchParams.get("city");
  const keyword = searchParams.get("keyword");
  const location = searchParams.get("location");
  const categoryType = searchParams.get("category_type");
  const category = searchParams.get("category");
  const maxPrice = searchParams.get("max_price");
  const maxArea = searchParams.get("max_area");
  const amenities = searchParams.get("amenities");

  useEffect(() => {
    async function fetchFilteredProperties() {
      setIsLoading(true);
      setError(null);
      try {
        const fetchParams: any = {
          is_active: "true",
          moderation: "approved",
          page_size: "100",
        };

        if (propertyPurpose === "sell") {
          fetchParams.property_for = "sell";
        }

        if (city) {
          const cityId = await getCityIdByName(city);
          if (cityId) {
            fetchParams.city_id = String(cityId);
          }
        }

        if (maxPrice) {
          fetchParams.max_price = maxPrice;
        }

        if (keyword) {
          fetchParams.search = keyword;
        } else if (location) {
          fetchParams.search = location;
        }

        if (category && category !== "all") {
          if (category === "apartments") {
            fetchParams.categories_id = 1;
          } else if (category === "villas") {
            fetchParams.categories_id = 2;
          } else if (category === "house") {
            fetchParams.categories_id = 4;
          } else if (category === "plots") {
            fetchParams.categories_id = propertyPurpose === "sell" ? 3 : 5;
          }
        }

        // Fetch properties from API
        const res = await getProperties(fetchParams);
        let data = res.data || [];

        // Apply client-side filters
        
        // 1. Property Purpose (Rent/Lease)
        if (propertyPurpose === "rent") {
          data = data.filter(
            (p) => p.propertyFor === "rent" || p.propertyFor === "lease"
          );
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

        // 5. Subcategory Filter
        if (category && category !== "all") {
          const cat = category.toLowerCase();
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

        // Map filtered backend properties to PropertyCardProps format
        const mapped = data.map(mapApiPropertyToCardProps);
        setProperties(mapped);
      } catch (err: any) {
        console.error("Error loading properties list:", err);
        setError("Failed to search properties. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchFilteredProperties();
  }, [propertyPurpose, city, keyword, location, categoryType, category, maxPrice, maxArea, amenities]);

  return (
    <div className="w-full">
      <PropertySearch />

      {isLoading ? null : error ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <p className="text-red-500 font-semibold text-lg">{error}</p>
        </div>
      ) : properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((prop) => (
            <PropertyCard key={prop.id} {...prop} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-brand-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h4 className="text-xl font-bold text-ink mb-2">No properties found</h4>
          <p className="text-ink-secondary max-w-sm">
            We couldn't find any properties matching your current filters. Try resetting or adjusting your search parameters.
          </p>
        </div>
      )}
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <div className="w-full">
      {/* Hero Header with Background Image */}
      <div className="relative w-full py-44 mb-10 flex items-center justify-center bg-brand-900">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/images/footer/front_image1.png"
            alt="Properties Background"
            fill
            className="object-cover opacity-40 mix-blend-overlay"
            priority
          />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">Find Your Dream Property</h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md">
            Browse our extensive collection of properties across the city.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <Suspense fallback={null}>
          <PropertiesListContent />
        </Suspense>
      </div>
    </div>
  );
}

