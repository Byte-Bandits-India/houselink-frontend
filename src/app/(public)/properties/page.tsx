"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import PropertiesListingLayout from "@/components/shared/PropertiesListingLayout";
import { getProperties, mapApiPropertyToCardProps, getCityIdByName, getPopularRegions, getPropertyCategories, getFeatures, getFacilities } from "@/lib/api";
import { PageFilterProvider, usePageFilter } from "@/contexts/HomeFilterContext";


function PropertiesListContent() {
  const { filters, setFilters } = usePageFilter();
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [popularRegionsList, setPopularRegionsList] = useState<string[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [dbFeatures, setDbFeatures] = useState<any[]>([]);
  const [dbFacilities, setDbFacilities] = useState<any[]>([]);

  // Load backend filter metadata dynamically on mount
  useEffect(() => {
    Promise.all([
      getPopularRegions().catch(() => []),
      getPropertyCategories().then(res => res?.success ? res.data : []).catch(() => []),
      getFeatures().then(res => res?.success ? res.data : []).catch(() => []),
      getFacilities().then(res => res?.success ? res.data : []).catch(() => []),
    ]).then(([regions, categories, features, facilities]) => {
      if (Array.isArray(regions)) setPopularRegionsList(regions.map(r => r.name));
      setDbCategories(categories || []);
      setDbFeatures(features || []);
      setDbFacilities(facilities || []);
    });
  }, []);

  useEffect(() => {
    if (searchParams) {
      let activeTab = searchParams.get("property_purpose") as "sell" | "rent" || "sell";
      let activeCategory = searchParams.get("category") || "all";
      const city = searchParams.get("city") || "";
      const keyword = searchParams.get("keyword") || "";
      let location = searchParams.get("location") || "";
      const categoryType = searchParams.get("category_type") || "";
      const maxPrice = searchParams.get("max_price") || "";
      const maxArea = searchParams.get("max_area") || "";
      let amenities = searchParams.get("amenities") || "";
      let houseType = searchParams.get("house_type") || "";

      if (keyword) {
        const lower = keyword.toLowerCase();
        
        // Purpose
        if (lower.includes("rent") || lower.includes("lease") || lower.includes("rental") || lower.includes("renting")) {
          activeTab = "rent";
        } else if (lower.includes("sale") || lower.includes("sell") || lower.includes("selling") || lower.includes("buy") || lower.includes("purchase")) {
          activeTab = "sell";
        }

        // Category (dynamic from API categories)
        for (const cat of dbCategories) {
          const name = cat.name.toLowerCase();
          let isMatched = false;
          let val = name;

          if (name.includes("apartment") && (lower.includes("apartment") || lower.includes("flat"))) {
            isMatched = true;
            val = "apartments";
          } else if (name.includes("villa") && lower.includes("villa")) {
            isMatched = true;
            val = "villas";
          } else if (name.includes("house") && (lower.includes("house") || lower.includes("home"))) {
            isMatched = true;
            val = "house";
          } else if ((name.includes("plot") || name.includes("land")) && (lower.includes("plot") || lower.includes("land"))) {
            isMatched = true;
            val = "plots";
          } else if (name.includes("commercial") && (lower.includes("commercial") || lower.includes("shop") || lower.includes("office") || lower.includes("warehouse") || lower.includes("godown"))) {
            isMatched = true;
            val = "commercial";
          } else if (lower.includes(name)) {
            isMatched = true;
            if (name === "individual house") val = "house";
          }

          if (isMatched) {
            activeCategory = val;
            break;
          }
        }

        // House Type
        if (lower.includes("1 bhk") || lower.includes("1bhk")) houseType = "1 BHK";
        else if (lower.includes("2 bhk") || lower.includes("2bhk")) houseType = "2 BHK";
        else if (lower.includes("3 bhk") || lower.includes("3bhk")) houseType = "3 BHK";
        else if (lower.includes("4 bhk") || lower.includes("4bhk")) houseType = "4 BHK";
        else if (lower.includes("5 bhk") || lower.includes("5bhk") || lower.includes("5+ bhk") || lower.includes("5+bhk")) houseType = "5+ BHK";
        else if (lower.includes("1 rk") || lower.includes("1rk")) houseType = "1 RK";

        // Location / Region (dynamic from API regions)
        for (const reg of popularRegionsList) {
          const regLower = reg.toLowerCase();
          if (lower.includes(regLower)) {
            location = reg;
            break;
          }
        }

        // Amenities (dynamic features & facilities from API)
        const activeAmenitiesList = amenities ? amenities.split(",") : [];
        let updatedAmenities = [...activeAmenitiesList];
        const allDbAmenities = [...dbFeatures, ...dbFacilities];

        for (const item of allDbAmenities) {
          const nameLower = item.name.toLowerCase();
          const isMatched = lower.includes(nameLower) ||
            (nameLower.includes("swimming pool") && (lower.includes("pool") || lower.includes("swim"))) ||
            (nameLower.includes("internet") && lower.includes("wifi")) ||
            (nameLower.includes("ac") && lower.includes("air cond")) ||
            (nameLower.includes("security") && lower.includes("guard"));

          if (isMatched) {
            if (!updatedAmenities.includes(nameLower)) {
              updatedAmenities.push(nameLower);
            }
          }
        }

        if (updatedAmenities.length > activeAmenitiesList.length) {
          amenities = updatedAmenities.join(",");
        }
      }

      setFilters({
        activeTab,
        activeCategory,
        city,
        keyword,
        location,
        categoryType,
        maxPrice,
        maxArea,
        amenities,
        houseType,
      });
    }
  }, [searchParams, popularRegionsList, dbCategories, dbFeatures, dbFacilities]);

  const { activeTab: propertyPurpose, city, keyword, location, categoryType, activeCategory: category, maxPrice, maxArea, amenities, houseType } = filters;

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

        if (propertyPurpose === "sell" && !keyword) {
          fetchParams.property_for = "sell";
        }

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

        // 1. Property Purpose
        if (keyword) {
          data = data.filter((p) => p.propertyFor === "sell" || p.propertyFor === "rent" || p.propertyFor === "lease");
        } else if (propertyPurpose === "sell") {
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

        // 9. House Type Filter
        if (houseType) {
          const rawType = houseType.replace(/\s+/g, "").toUpperCase();
          if (rawType.startsWith("5")) {
            data = data.filter((p) => p.houseType === "five_bhk");
          } else {
            const mapped = rawType === "1RK" ? "one_bk" :
                           rawType === "1BHK" ? "one_bhk" :
                           rawType === "2BHK" ? "two_bhk" :
                           rawType === "3BHK" ? "three_bhk" :
                           rawType === "4BHK" ? "four_bhk" : "";
            if (mapped) {
              data = data.filter((p) => p.houseType === mapped);
            }
          }
        }

        // 8. Amenities Filter
        // 8. Amenities & Facilities Filter
        if (amenities) {
          const requested = amenities.split(",");
          data = data.filter((p) => {
            const featuresAndFacilities: string[] = [
              ...(p.propertyFeatures || []).map((pf: any) => (pf.feature?.name || "").toLowerCase()),
              ...(p.propertyFacilities || []).map((pf: any) => (pf.facility?.name || "").toLowerCase()),
            ];
            return requested.every((req) =>
              featuresAndFacilities.some((pa) => pa.includes(req.toLowerCase()) || req.toLowerCase().includes(pa))
            );
          });
        }

        // Sort: featured first, then newest
        data.sort((a, b) => {
          const aF = a.isFeatured ? 1 : 0;
          const bF = b.isFeatured ? 1 : 0;
          if (bF !== aF) return bF - aF;
          const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
          const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
          return bTime - aTime;
        });

        setProperties(data.map(mapApiPropertyToCardProps));
      } catch (err: any) {
        console.error("Error loading properties list:", err);
        setError("Failed to search properties. Please try again.");
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
      title="Chennai Properties"
      breadcrumbLabel="Properties"
    />
  );
}

export default function PropertiesPage() {
  return (
    <PageFilterProvider>
      <div className="w-full">
        <Suspense fallback={null}>
          <PropertiesListContent />
        </Suspense>
      </div>
    </PageFilterProvider>
  );
}
