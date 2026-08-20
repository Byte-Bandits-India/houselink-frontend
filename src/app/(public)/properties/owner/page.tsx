"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import PropertiesListingLayout from "@/components/shared/PropertiesListingLayout";
import {
  getProperties,
  mapApiPropertyToCardProps,
  getCityIdByName,
  getPopularRegions,
  getPropertyCategories,
  getFeatures,
  getFacilities,
} from "@/lib/api";
import {
  PageFilterProvider,
  usePageFilter,
  PRICE_RANGES,
  PageFilterValues,
  defaultFilterValues,
} from "@/contexts/HomeFilterContext";

function parseUrlParams(
  searchParams: ReturnType<typeof useSearchParams>,
  dbCategories: any[] = [],
  popularRegionsList: string[] = [],
  dbFeatures: any[] = [],
  dbFacilities: any[] = []
): PageFilterValues {
  if (!searchParams) return defaultFilterValues;

  let activeTab = (searchParams.get("property_purpose") as "sell" | "rent") || "sell";
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
    if (
      lower.includes("rent") ||
      lower.includes("lease") ||
      lower.includes("rental") ||
      lower.includes("renting")
    ) {
      activeTab = "rent";
    } else if (
      lower.includes("sale") ||
      lower.includes("sell") ||
      lower.includes("selling") ||
      lower.includes("buy") ||
      lower.includes("purchase")
    ) {
      activeTab = "sell";
    }

    // Category
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
      } else if (
        (name.includes("plot") || name.includes("land")) &&
        (lower.includes("plot") || lower.includes("land"))
      ) {
        isMatched = true;
        val = "plots";
      } else if (
        name.includes("commercial") &&
        (lower.includes("commercial") ||
          lower.includes("shop") ||
          lower.includes("office") ||
          lower.includes("warehouse") ||
          lower.includes("godown"))
      ) {
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
    else if (
      lower.includes("5 bhk") ||
      lower.includes("5bhk") ||
      lower.includes("5+ bhk") ||
      lower.includes("5+bhk")
    )
      houseType = "5+ BHK";
    else if (lower.includes("1 rk") || lower.includes("1rk")) houseType = "1 RK";

    // Location / Region
    for (const reg of popularRegionsList) {
      const regLower = reg.toLowerCase();
      if (lower.includes(regLower)) {
        location = reg;
        break;
      }
    }

    // Amenities
    const activeAmenitiesList = amenities ? amenities.split(",") : [];
    const updatedAmenities = [...activeAmenitiesList];
    const allDbAmenities = [...dbFeatures, ...dbFacilities];

    for (const item of allDbAmenities) {
      const nameLower = item.name.toLowerCase();
      const isMatched =
        lower.includes(nameLower) ||
        (nameLower.includes("swimming pool") &&
          (lower.includes("pool") || lower.includes("swim"))) ||
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

  return {
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
  };
}

function OwnerPropertiesListContent() {
  const { filters, setFilters } = usePageFilter();
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [popularRegionsList, setPopularRegionsList] = useState<string[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [dbFeatures, setDbFeatures] = useState<any[]>([]);
  const [dbFacilities, setDbFacilities] = useState<any[]>([]);

  // 1. Load backend filter metadata once on mount
  useEffect(() => {
    Promise.all([
      getPopularRegions().catch(() => []),
      getPropertyCategories()
        .then((res) => (res?.success ? res.data : []))
        .catch(() => []),
      getFeatures()
        .then((res) => (res?.success ? res.data : []))
        .catch(() => []),
      getFacilities()
        .then((res) => (res?.success ? res.data : []))
        .catch(() => []),
    ]).then(([regions, categories, features, facilities]) => {
      if (Array.isArray(regions)) setPopularRegionsList(regions.map((r) => r.name));
      setDbCategories(categories || []);
      setDbFeatures(features || []);
      setDbFacilities(facilities || []);
    });
  }, []);

  // 2. Synchronize URL searchParams with Filter Context only once if explicit query params are present on mount
  const hasInitializedFromUrl = useRef(false);

  useEffect(() => {
    if (hasInitializedFromUrl.current) return;
    if (!searchParams || searchParams.toString().length === 0) {
      hasInitializedFromUrl.current = true;
      return;
    }
    const parsed = parseUrlParams(
      searchParams,
      dbCategories,
      popularRegionsList,
      dbFeatures,
      dbFacilities
    );

    setFilters(parsed);
    hasInitializedFromUrl.current = true;
  }, [searchParams, dbCategories, popularRegionsList, dbFeatures, dbFacilities]);

  // 3. Fetch & Filter Owner Properties
  useEffect(() => {
    let isCurrent = true;
    setIsLoading(true);
    setError(null);

    async function fetchFilteredProperties() {
      try {
        const fetchParams: any = {
          is_active: "true",
          moderation: "approved",
          property_ownership: "owner",
          page_size: "100",
        };

        if (filters.activeTab === "sell" && !filters.keyword) {
          fetchParams.property_for = "sell";
        }

        if (filters.city) {
          const cityId = await getCityIdByName(filters.city);
          if (cityId) fetchParams.city_id = String(cityId);
        }

        if (filters.maxPrice) fetchParams.max_price = filters.maxPrice;

        const locationTags = filters.location
          ? filters.location
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          : [];

        if (filters.keyword) {
          fetchParams.search = filters.keyword;
        } else if (locationTags.length === 1) {
          fetchParams.search = locationTags[0];
        }

        const selectedCategories =
          filters.activeCategory && filters.activeCategory !== "all"
            ? filters.activeCategory.split(",").filter(Boolean)
            : [];

        if (selectedCategories.length === 1) {
          const cat = selectedCategories[0];
          if (cat === "apartments") fetchParams.categories_id = 1;
          else if (cat === "villas") fetchParams.categories_id = 2;
          else if (cat === "house") fetchParams.categories_id = 4;
          else if (cat === "plots")
            fetchParams.categories_id = filters.activeTab === "sell" ? 3 : 5;
        }

        const res = await getProperties(fetchParams);
        if (!isCurrent) return;

        let data = res.data || [];

        // Only owner properties
        data = data.filter((p) => (p.propertyOwnership || "").toLowerCase() === "owner");

        // 1. Property Purpose Filter
        if (filters.activeTab === "sell") {
          data = data.filter((p) => p.propertyFor === "sell");
        } else if (filters.activeTab === "rent") {
          data = data.filter((p) => p.propertyFor === "rent" || p.propertyFor === "lease");
        }

        // 2. Keyword Filter
        if (filters.keyword) {
          const q = filters.keyword.toLowerCase().trim();
          data = data.filter(
            (p) =>
              (p.name && p.name.toLowerCase().includes(q)) ||
              (p.permalink && p.permalink.toLowerCase().includes(q)) ||
              (p.description && p.description.toLowerCase().includes(q)) ||
              (p.location && p.location.toLowerCase().includes(q)) ||
              (p.category?.name && p.category.name.toLowerCase().includes(q)) ||
              (p.city?.name && p.city.name.toLowerCase().includes(q)) ||
              (p.state?.name && p.state.name.toLowerCase().includes(q))
          );
        }

        // 3. Location Filter
        if (locationTags.length > 0) {
          const tags = locationTags.map((tag) => tag.toLowerCase().trim()).filter(Boolean);
          data = data.filter((p) =>
            tags.some(
              (tag) =>
                (p.location && p.location.toLowerCase().includes(tag)) ||
                (p.name && p.name.toLowerCase().includes(tag)) ||
                (p.city?.name && p.city.name.toLowerCase().includes(tag))
            )
          );
        }

        // 4. Category Type
        if (filters.categoryType) {
          const type = filters.categoryType.toLowerCase();
          data = data.filter(
            (p) => p.category?.type && p.category.type.toLowerCase() === type
          );
        }

        // 5. Subcategory Filter
        if (selectedCategories.length > 0) {
          data = data.filter((p) => {
            const catName = (p.category?.name || "").toLowerCase().replace(/_/g, " ");
            return selectedCategories.some((cat) => {
              if (cat === "plots") return catName.includes("plot") || catName.includes("land");
              if (cat === "apartments") return catName.includes("apartment");
              if (cat === "villas") return catName.includes("villa");
              if (cat === "house")
                return catName.includes("individual house") || catName.includes("house");
              if (cat === "commercial")
                return (
                  catName.includes("commercial") ||
                  catName.includes("shop") ||
                  catName.includes("building") ||
                  catName.includes("godown") ||
                  catName.includes("warehouse") ||
                  catName.includes("office")
                );
              return true;
            });
          });
        }

        // 6. Price Filter
        if (filters.priceRanges) {
          const selectedRangeIds = filters.priceRanges.split(",").filter(Boolean);
          if (selectedRangeIds.length > 0) {
            const selectedDefs = PRICE_RANGES.filter((r) => selectedRangeIds.includes(r.id));
            data = data.filter((p) => {
              const priceNum = Number(p.price || 0);
              return selectedDefs.some(
                (r) => priceNum >= r.min && (r.max === Infinity ? true : priceNum <= r.max)
              );
            });
          }
        } else {
          if (filters.minPrice) {
            const minLimit = Number(filters.minPrice);
            if (!isNaN(minLimit)) data = data.filter((p) => Number(p.price || 0) >= minLimit);
          }
          if (filters.maxPrice) {
            const priceLimit = Number(filters.maxPrice);
            if (!isNaN(priceLimit)) data = data.filter((p) => Number(p.price || 0) <= priceLimit);
          }
        }

        // 7. Max Area Filter
        if (filters.maxArea) {
          const areaLimit = Number(filters.maxArea);
          if (!isNaN(areaLimit)) {
            data = data.filter(
              (p) => Number(p.builtUpArea || p.plotLandArea || 0) <= areaLimit
            );
          }
        }

        // 8. House Type Filter
        if (filters.houseType) {
          const mappedTypes = filters.houseType
            .split(",")
            .filter(Boolean)
            .map((t) => {
              const rawType = t.replace(/\s+/g, "").toUpperCase();
              if (rawType.startsWith("5")) return "five_bhk";
              return rawType === "1RK"
                ? "one_bk"
                : rawType === "1BHK"
                ? "one_bhk"
                : rawType === "2BHK"
                ? "two_bhk"
                : rawType === "3BHK"
                ? "three_bhk"
                : rawType === "4BHK"
                ? "four_bhk"
                : "";
            })
            .filter(Boolean);

          if (mappedTypes.length > 0) {
            data = data.filter((p) => mappedTypes.includes(p.houseType));
          }
        }

        // 9. Amenities & Facilities Filter
        if (filters.amenities) {
          const requested = filters.amenities.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
          data = data.filter((p) => {
            const featuresAndFacilities: string[] = [
              ...(p.propertyFeatures || []).map((pf: any) =>
                (pf.feature?.name || "").toLowerCase()
              ),
              ...(p.propertyFacilities || []).map((pf: any) =>
                (pf.facility?.name || "").toLowerCase()
              ),
            ];
            return requested.every((req) =>
              featuresAndFacilities.some(
                (pa) => pa.includes(req) || req.includes(pa)
              )
            );
          });
        }

        // Sort: newest first
        data.sort((a, b) => {
          const aTime = a.updatedAt
            ? new Date(a.updatedAt).getTime()
            : a.createdAt
            ? new Date(a.createdAt).getTime()
            : 0;
          const bTime = b.updatedAt
            ? new Date(b.updatedAt).getTime()
            : b.createdAt
            ? new Date(b.createdAt).getTime()
            : 0;
          return bTime - aTime;
        });

        if (isCurrent) {
          setProperties(data.map(mapApiPropertyToCardProps));
        }
      } catch (err: any) {
        if (isCurrent) {
          console.error("Error loading owner properties list:", err);
          setError("Failed to search owner properties. Please try again.");
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    fetchFilteredProperties();

    return () => {
      isCurrent = false;
    };
  }, [filters]);

  return (
    <PropertiesListingLayout
      properties={properties}
      isLoading={isLoading}
      error={error}
      title="Direct from Owner Properties in Chennai"
      breadcrumbLabel="Owner Properties"
    />
  );
}

export default function OwnerPropertiesPage() {
  return (
    <div className="w-full">
      <Suspense fallback={null}>
        <OwnerPropertiesListContent />
      </Suspense>
    </div>
  );
}
