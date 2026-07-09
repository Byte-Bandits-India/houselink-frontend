"use client";

import { Suspense, useState, useEffect } from "react";
import PropertiesListingLayout from "@/components/shared/PropertiesListingLayout";
import { getProperties, mapApiPropertyToCardProps, getCityIdByName } from "@/lib/api";
import { PageFilterProvider, usePageFilter } from "@/contexts/HomeFilterContext";

function FeaturedPropertiesListContent() {
  const { filters } = usePageFilter();
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { activeTab: propertyPurpose, city, keyword, location, categoryType, activeCategory: category, maxPrice, maxArea, amenities } = filters;

  useEffect(() => {
    async function fetchFilteredProperties() {
      setIsLoading(true);
      setError(null);
      try {
        const fetchParams: any = {
          is_active: "true",
          moderation: "approved",
          is_featured: "true",
          page_size: "100",
        };

        if (propertyPurpose === "sell") fetchParams.property_for = "sell";

        if (city) {
          const cityId = await getCityIdByName(city);
          if (cityId) fetchParams.city_id = String(cityId);
        }

        if (maxPrice) fetchParams.max_price = maxPrice;

        if (keyword) {
          fetchParams.search = keyword;
        } else if (location) {
          fetchParams.search = location;
        }

        if (category && category !== "all") {
          if (category === "apartments") fetchParams.categories_id = 1;
          else if (category === "villas") fetchParams.categories_id = 2;
          else if (category === "house") fetchParams.categories_id = 4;
          else if (category === "plots") fetchParams.categories_id = propertyPurpose === "sell" ? 3 : 5;
        }

        const res = await getProperties(fetchParams);
        let data = res.data || [];

        // Only featured
        data = data.filter((p) => p.isFeatured === true);

        // 1. Property Purpose
        if (propertyPurpose === "sell") {
          data = data.filter((p) => p.propertyFor === "sell");
        } else if (propertyPurpose === "rent") {
          data = data.filter((p) => p.propertyFor === "rent" || p.propertyFor === "lease");
        }

        // 2. Keyword Filter
        if (keyword) {
          const q = keyword.toLowerCase();
          data = data.filter((p) =>
            (p.name && p.name.toLowerCase().includes(q)) ||
            (p.description && p.description.toLowerCase().includes(q)) ||
            (p.location && p.location.toLowerCase().includes(q))
          );
        }

        // 3. Location Filter
        if (location) {
          const q = location.toLowerCase();
          data = data.filter((p) => p.location && p.location.toLowerCase().includes(q));
        }

        // 4. Category Type
        if (categoryType) {
          const type = categoryType.toLowerCase();
          data = data.filter((p) => p.category?.type && p.category.type.toLowerCase() === type);
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
            if (cat === "commercial") return catName.includes("commercial") || catName.includes("shop") || catName.includes("building") || catName.includes("godown") || catName.includes("warehouse") || catName.includes("office");
            return true;
          });
        }

        // 6. Max Price Filter
        if (maxPrice) {
          const priceLimit = Number(maxPrice);
          if (!isNaN(priceLimit)) data = data.filter((p) => Number(p.price || 0) <= priceLimit);
        }

        // 7. Max Area Filter
        if (maxArea) {
          const areaLimit = Number(maxArea);
          if (!isNaN(areaLimit)) data = data.filter((p) => Number(p.builtUpArea || p.plotLandArea || 0) <= areaLimit);
        }

        // 8. Amenities Filter
        if (amenities) {
          const requested = amenities.split(",");
          data = data.filter((p) => {
            const features: string[] = (p.propertyFeatures || []).map((pf: any) => (pf.feature?.name || "").toLowerCase());
            return requested.every((req) => features.some((pa) => pa.includes(req.toLowerCase()) || req.toLowerCase().includes(pa)));
          });
        }

        // Sort: lastly added/renewed featured first
        data.sort((a, b) => {
          const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
          const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
          if (bTime !== aTime) return bTime - aTime;
          return b.id - a.id;
        });

        setProperties(data.map(mapApiPropertyToCardProps));
      } catch (err: any) {
        console.error("Error loading featured properties list:", err);
        setError("Failed to search featured properties. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchFilteredProperties();
  }, [filters]);

  return (
    <PropertiesListingLayout
      properties={properties}
      isLoading={isLoading}
      error={error}
      title="Chennai Featured Properties"
      breadcrumbLabel="Featured Properties"
    />
  );
}

export default function FeaturedPropertiesPage() {
  return (
    <PageFilterProvider>
      <div className="w-full">
        <Suspense fallback={null}>
          <FeaturedPropertiesListContent />
        </Suspense>
      </div>
    </PageFilterProvider>
  );
}
