import { PropertyFormData, PropertySubtype, AMENITIES_LIST } from "@/types/property";
import { apiClient } from "./client";
import { getStates, getCities } from "./locations";

// ─── Constants & Mappings ───────────────────────────────────────────────────

const CATEGORY_ID_MAP: Record<PropertySubtype, number> = {
  apartment: 1,
  villa: 2,
  plot: 3,
  individual_house: 4,
  land: 5,
  shop: 6,
  building: 7,
  godown: 8,
  warehouse: 9,
  office_space: 10,
};

const AREA_UNIT_MAP: Record<string, string> = {
  "1": "sq_ft",
  "2": "square_inches",
  "3": "acres",
  "4": "cents",
  "5": "square_meters",
  "6": "square_yards",
  "7": "hectares",
};

const HOUSE_TYPE_MAP: Record<string, string> = {
  "1RK": "one_bk", // maps "1RK" to "one_bk" per backend Zod schema HouseTypeEnum
  "1BHK": "one_bhk",
  "2BHK": "two_bhk",
  "3BHK": "three_bhk",
  "4BHK": "four_bhk",
  "5BHK": "five_bhk",
};

const CONSTRUCTION_AGE_MAP: Record<string, string> = {
  "New Construction": "new",
  "Less than 1 year": "less_than_1_year",
  "1-3 years": "years_1_to_3",
  "3-5 years": "years_3_to_5",
  "5-10 years": "years_5_to_10",
  "10+ years": "years_10_plus",
};

const FURNISHING_TYPE_MAP: Record<string, string> = {
  "Furnished": "fully_furnished",
  "Semi-Furnished": "semi_furnished",
  "Unfurnished": "unfurnished",
};

const OWNERSHIP_TYPE_MAP: Record<string, string> = {
  "Fully Owned": "fully_owned",
  "On Lease": "on_lease",
  "Shared Ownership": "shared_ownership",
  "Company Owned": "fully_owned", // Fallback to fully_owned as company_owned is not in the OwnershipTypeEnum schema
};

const FOOD_PREFERENCE_MAP: Record<string, string> = {
  "Veg": "veg",
  "Non-Veg": "non_veg",
  "No Restrictions": "no_restrictions",
};

// ─── Number Parsing Helpers ──────────────────────────────────────────────────

function parseOptionalFloat(value?: string | number): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const clean = String(value).replace(/,/g, "");
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? undefined : parsed;
}

function parseOptionalInt(value?: string | number): number | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  const clean = String(value).replace(/,/g, "");
  const parsed = parseInt(clean, 10);
  return isNaN(parsed) ? undefined : parsed;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Dynamically query the backend locations API to map string-based State
 * and City selection to their database IDs.
 */
export async function resolveLocationIds(
  stateName?: string,
  cityName?: string
): Promise<{ stateId: number; cityId: number }> {
  let stateId = 78; // default fallback (Tamil Nadu, which exists in the seeded DB)
  let cityId = 7063;  // default fallback (Chennai)

  try {
    // 1. Fetch States & Match
    const statesRes = await getStates();
    const states = statesRes.data || [];
    const normalizedState = stateName?.trim().toLowerCase();
    const matchedState = states.find(
      (s) => s.name.toLowerCase() === normalizedState
    );

    if (matchedState) {
      stateId = matchedState.id;
    } else if (states.length > 0) {
      // Fallback to first state if none matches
      stateId = states[0].id;
    }

    // 2. Fetch Cities & Match under State
    const citiesRes = await getCities(stateId);
    const cities = citiesRes.data || [];
    const normalizedCity = cityName?.trim().toLowerCase();

    if (normalizedCity) {
      // Try exact match
      const exactMatch = cities.find(
        (c) => c.name.toLowerCase() === normalizedCity
      );
      if (exactMatch) {
        cityId = exactMatch.id;
      } else {
        // Substring fallback match
        const substringMatch = cities.find(
          (c) =>
            c.name.toLowerCase().includes(normalizedCity) ||
            normalizedCity.includes(c.name.toLowerCase())
        );
        if (substringMatch) {
          cityId = substringMatch.id;
        } else if (cities.length > 0) {
          cityId = cities[0].id;
        }
      }
    } else if (cities.length > 0) {
      cityId = cities[0].id;
    }
  } catch (error) {
    console.error("Location resolution failed, using fallbacks:", error);
  }

  return { stateId, cityId };
}

/**
 * Maps frontend form schema to strict backend nested API payload structure.
 */
export function mapFormDataToApiPayload(
  formData: PropertyFormData,
  customerId: string,
  stateId: number,
  cityId: number
) {
  const propertyFor =
    formData.property_for === "sell"
      ? "sell"
      : formData.rent_lease_type || "rent";

  let propertyOwnership = formData.owner_type ? formData.owner_type.toLowerCase() : "owner";
  // The rent_lease handlers map ONLY has owner and consultant. Fallback builder to owner for rent_lease.
  if (formData.property_for === "rent_lease" && propertyOwnership === "builder") {
    propertyOwnership = "owner";
  }

  // Build clean location string without duplicates
  const locationParts = [
    formData.address,
    formData.area,
    formData.city,
    formData.state,
  ].filter((part): part is string => !!part);

  const uniqueParts: string[] = [];
  locationParts.forEach((part) => {
    part.split(",").forEach((subPart) => {
      const trimmed = subPart.trim();
      if (trimmed && !uniqueParts.includes(trimmed)) {
        uniqueParts.push(trimmed);
      }
    });
  });
  const location = uniqueParts.join(", ") || "India";

  let subtypeRaw = formData.property_subtype ? formData.property_subtype.toLowerCase() : "apartment";
  let categoriesId = CATEGORY_ID_MAP[subtypeRaw as PropertySubtype] || 1;

  const payload: any = {
    customerId: Number(customerId),
    propertyFor,
    propertyOwnership,
    stateId: Number(stateId),
    cityId: Number(cityId),
    location,
    categoriesId,
    name: formData.name || `Beautiful ${subtypeRaw.replace(/_/g, " ")}`,
    description: formData.description || formData.name || `A spacious and well-located ${subtypeRaw.replace(/_/g, " ")} available now.`,
  };

  // Classifications (required for Apartment, Villa)
  if (subtypeRaw === "apartment" || subtypeRaw === "villa" || subtypeRaw === "individual_house") {
    payload.houseType = formData.house_type && HOUSE_TYPE_MAP[formData.house_type]
      ? HOUSE_TYPE_MAP[formData.house_type]
      : "one_bhk"; // default fallback to satisfy enum requirement
  } else if (formData.house_type && HOUSE_TYPE_MAP[formData.house_type]) {
    payload.houseType = HOUSE_TYPE_MAP[formData.house_type];
  }

  if (formData.construction_age && CONSTRUCTION_AGE_MAP[formData.construction_age]) {
    payload.constructionAge = CONSTRUCTION_AGE_MAP[formData.construction_age];
  }

  // Area mappings with schema positive-number Zod validation fallbacks
  const plotAreaVal = parseOptionalFloat(formData.plot_area);
  const builtUpAreaVal = parseOptionalFloat(formData.super_builtup_area);

  // Plot area required check (Plot, Villa/Individual House, Land)
  if (subtypeRaw === "plot" || subtypeRaw === "land" || subtypeRaw === "villa" || subtypeRaw === "individual_house") {
    payload.plotLandArea = plotAreaVal && plotAreaVal > 0 ? plotAreaVal : (builtUpAreaVal && builtUpAreaVal > 0 ? builtUpAreaVal : 1200);
  } else {
    if (plotAreaVal) payload.plotLandArea = plotAreaVal;
  }

  // Built-up area required check (Apartment, Villa/House, Shop, Building, Godown, Office Space)
  if (subtypeRaw !== "plot" && subtypeRaw !== "land") {
    payload.builtUpArea = builtUpAreaVal && builtUpAreaVal > 0 ? builtUpAreaVal : (plotAreaVal && plotAreaVal > 0 ? plotAreaVal : 1000);
  } else {
    if (builtUpAreaVal) payload.builtUpArea = builtUpAreaVal;
  }

  payload.areaUnit = formData.area_unit && AREA_UNIT_MAP[formData.area_unit]
    ? AREA_UNIT_MAP[formData.area_unit]
    : "sq_ft";

  payload.plotLandLength = parseOptionalFloat(formData.plot_length);
  payload.plotLandBreadth = parseOptionalFloat(formData.plot_breadth);
  payload.carpetArea = parseOptionalFloat(formData.carpet_area);

  // Total floors (required for all rent_lease, and sell residential/commercial buildings)
  const isFloorRequired = (formData.property_for === "rent_lease" && subtypeRaw !== "land") ||
    (formData.property_for === "sell" && (subtypeRaw === "apartment" || subtypeRaw === "villa" || subtypeRaw === "individual_house" || subtypeRaw === "office_space" || subtypeRaw === "building"));

  if (isFloorRequired) {
    payload.totalFloors = parseOptionalInt(formData.total_floors) ?? 1;
  } else {
    payload.totalFloors = parseOptionalInt(formData.total_floors);
  }

  // Property on floor (required for Apartment, Villa, Office Space)
  const isOnFloorRequired = subtypeRaw === "apartment" || subtypeRaw === "villa" || subtypeRaw === "individual_house" || (formData.property_for === "sell" && subtypeRaw === "office_space");
  if (isOnFloorRequired) {
    payload.propertyOnFloor = parseOptionalInt(formData.property_on_floor) ?? 0;
  } else {
    payload.propertyOnFloor = parseOptionalInt(formData.property_on_floor);
  }

  // Rooms count (required for Apartment, Villa, and Bathrooms is required for rent commercial)
  if (subtypeRaw === "apartment" || subtypeRaw === "villa" || subtypeRaw === "individual_house") {
    payload.bedrooms = parseOptionalInt(formData.bedrooms) ?? 1;
    payload.bathrooms = parseOptionalInt(formData.bathrooms) ?? 1;
  } else {
    payload.bedrooms = parseOptionalInt(formData.bedrooms);
    // Bathrooms are required for all commercial rent_lease schemas, and commercial sell (shop, building, office_space, godown, warehouse)
    if ((formData.property_for === "rent_lease" && subtypeRaw !== "land") || (formData.property_for === "sell" && ["shop", "building", "office_space", "godown", "warehouse"].includes(subtypeRaw))) {
      payload.bathrooms = parseOptionalInt(formData.bathrooms) ?? 1;
    } else {
      payload.bathrooms = parseOptionalInt(formData.bathrooms);
    }
  }

  // UDS Area & Storage Area mappings
  payload.udsArea = parseOptionalFloat(formData.uds_area);

  if (formData.storage_area) {
    payload.storageArea = parseOptionalFloat(formData.storage_area);
  } else if (formData.property_for === "rent_lease" && (subtypeRaw === "godown" || subtypeRaw === "warehouse")) {
    payload.storageArea = parseOptionalFloat(formData.super_builtup_area) || parseOptionalFloat(formData.plot_area) || 1000;
  }

  // Booleans mapped from "Yes" / "No" — only set when explicitly chosen, otherwise omit (null)
  if (formData.balcony === "Yes" || formData.balcony === "No") {
    payload.balcony = formData.balcony === "Yes";
  }
  if (formData.garden === "Yes" || formData.garden === "No") {
    payload.garden = formData.garden === "Yes";
  }
  if (formData.swimming_pool === "Yes" || formData.swimming_pool === "No") {
    payload.swimmingPool = formData.swimming_pool === "Yes";
  }
  if (formData.compound_wall === "Yes" || formData.compound_wall === "No") {
    payload.compoundWall = formData.compound_wall === "Yes";
  }
  if (formData.corner_property === "Yes" || formData.corner_property === "No") {
    payload.cornerProperty = formData.corner_property === "Yes";
  }
  if (formData.utility_area === "Yes" || formData.utility_area === "No") {
    payload.utilityArea = formData.utility_area === "Yes";
  }
  if (formData.pantry_area === "Yes" || formData.pantry_area === "No") {
    payload.pantryArea = formData.pantry_area === "Yes";
  }

  if (formData.loading_unloading_facility === "Yes" || formData.loading_unloading_facility === "No") {
    payload.loadingUnloadingFacility = formData.loading_unloading_facility === "Yes";
  }

  // Enums mapped with robust fallbacks
  payload.ownershipType = formData.ownership_type && OWNERSHIP_TYPE_MAP[formData.ownership_type]
    ? OWNERSHIP_TYPE_MAP[formData.ownership_type]
    : "fully_owned"; // fully_owned is required and extremely safe

  if (subtypeRaw === "apartment" || subtypeRaw === "villa" || subtypeRaw === "individual_house") {
    payload.furnishingType = formData.furnishing_type && FURNISHING_TYPE_MAP[formData.furnishing_type]
      ? FURNISHING_TYPE_MAP[formData.furnishing_type]
      : "unfurnished";

    payload.foodPreference = formData.food_preference && FOOD_PREFERENCE_MAP[formData.food_preference]
      ? FOOD_PREFERENCE_MAP[formData.food_preference]
      : "no_restrictions";

    payload.petPolicy = formData.pet_policy === "Not Allowed" ? "not_allowed" : "allowed";
  } else {
    if (formData.furnishing_type && FURNISHING_TYPE_MAP[formData.furnishing_type]) {
      payload.furnishingType = FURNISHING_TYPE_MAP[formData.furnishing_type];
    }
    if (formData.food_preference && FOOD_PREFERENCE_MAP[formData.food_preference]) {
      payload.foodPreference = FOOD_PREFERENCE_MAP[formData.food_preference];
    }
    if (formData.pet_policy) {
      payload.petPolicy = formData.pet_policy === "Not Allowed" ? "not_allowed" : "allowed";
    }
  }

  // Water supply enum ('borewell', 'corporation', 'both')
  if (formData.water_supply) {
    const ws = formData.water_supply.toLowerCase();
    if (["borewell", "corporation", "both"].includes(ws)) {
      payload.waterSupply = ws;
    }
  }

  // Parking
  const isParkingAvailabilityRequired = (subtypeRaw !== "plot" && subtypeRaw !== "land");
  if (isParkingAvailabilityRequired) {
    payload.parkingAvailability = formData.parking_availability === "Yes";
  } else {
    if (formData.parking_availability) {
      payload.parkingAvailability = formData.parking_availability === "Yes";
    }
  }

  if (formData.parking_type && formData.parking_type.length > 0) {
    const normalized = formData.parking_type.map((t: string) => t.toLowerCase().trim());
    if (normalized.includes("bike") && normalized.includes("car")) {
      payload.parkingType = "both";
    } else if (normalized.includes("bike")) {
      payload.parkingType = "bike";
    } else if (normalized.includes("car")) {
      payload.parkingType = "car";
    }
  }
  if (formData.parking_slots_count) {
    payload.parkingSlots = parseInt(formData.parking_slots_count, 10);
  }

  // Commercial specifications
  const isSuitableRequired = (formData.property_for === "rent_lease" && (subtypeRaw === "shop" || subtypeRaw === "building" || subtypeRaw === "godown" || subtypeRaw === "warehouse" || subtypeRaw === "office_space")) || (formData.property_for === "sell" && subtypeRaw === "office_space");
  if (isSuitableRequired) {
    payload.propertySuitableFor = formData.property_suitable_for || "Any commercial business";
  } else if (formData.property_suitable_for) {
    payload.propertySuitableFor = formData.property_suitable_for;
  }

  if (formData.key_specifications && formData.key_specifications.length > 0) {
    payload.keySpecifications = formData.key_specifications.filter(Boolean);
  }

  // Direction Facing mapping
  if (formData.direction_facing) {
    payload.directionFacing = formData.direction_facing;
  } else if (subtypeRaw === "plot" && (propertyOwnership === "builder" || propertyOwnership === "consultant")) {
    payload.directionFacing = "east"; // Safe default as it's required in backend Zod schema
  }

  // Consultant Brokerage Mappings (required strictly for consultant properties)
  if (propertyOwnership === "consultant") {
    const type = formData.brokerage_type || "no_brokerage";
    payload.brokerageType = type;
    if (type === "fixed" && formData.brokerage_fee) {
      payload.brokerageFee = parseFloat(formData.brokerage_fee) || 0;
    } else if (type === "percentage" && formData.brokerage_percentage) {
      payload.brokeragePercentage = parseFloat(formData.brokerage_percentage) || 0;
    }
  }

  // Pricing & Rent-Lease unions
  const basePrice = parseOptionalFloat(formData.price) || 0;

  if (propertyFor === "sell") {
    payload.price = basePrice > 0 ? basePrice : 100000; // safe positive sell amount
  } else if (propertyFor === "rent") {
    payload.price = basePrice > 0 ? basePrice : 1000; // safe positive rent amount

    const deposit = parseOptionalFloat(formData.security_deposit) || 0;
    payload.securityDeposit = deposit > 0 ? deposit : 1000;
    if (formData.security_deposit_type) {
      payload.securityDepositType = formData.security_deposit_type;
    }

    payload.maintenanceChargeStatus = formData.maintenance_charge_status === "Yes";
    if (formData.maintenance_charge_amount) {
      payload.maintenanceChargeAmount = parseOptionalFloat(formData.maintenance_charge_amount);
    }

    if (formData.notice_period) {
      payload.noticePeriod = formData.notice_period;
    }
  } else if (propertyFor === "lease") {
    payload.price = basePrice > 0 ? basePrice : 10000; // safe positive lease amount
    payload.leaseDuration = formData.lease_duration || "1 year";

    const resp = formData.maintenance_responsibility ? formData.maintenance_responsibility.toLowerCase() : "shared";
    payload.maintenanceResponsibility = ["tenant", "owner", "shared"].includes(resp) ? resp : "shared";

    if (formData.notice_period) {
      const np = formData.notice_period.toLowerCase().replace("-", " ").replace("months", "month");
      if (["no notice", "1 month", "2 month", "3 month", "6 month"].includes(np)) {
        payload.noticePeriod = np;
      } else {
        payload.noticePeriod = "1 month";
      }
    }
  }

  // Availability Status mapped correctly matching Zod enums
  if (formData.availability_status) {
    const statusMap: Record<string, string> = {
      "Ready to Occupy": "ready_to_occupy",
      "Under Construction": "under_construction",
      "Available From": "available_from",
    };
    payload.availabilityStatus = statusMap[formData.availability_status] || formData.availability_status.toLowerCase().replace(/ /g, "_").replace(/-/g, "_");
  } else {
    payload.availabilityStatus = "ready_to_occupy";
  }

  if (formData.availability_date && /^\d{4}-\d{2}-\d{2}$/.test(formData.availability_date)) {
    payload.availabilityDate = formData.availability_date;
  }

  // Tenant preference (required in rent_lease schemas)
  if (propertyFor === "rent" || propertyFor === "lease") {
    if (formData.tenant_preference && formData.tenant_preference.length > 0) {
      payload.tenantPreference = formData.tenant_preference.map(t => {
        const normalized = t.toLowerCase().trim();
        if (normalized === "students" || normalized === "student") {
          return "students";
        }
        if (normalized === "working professionals" || normalized === "working_professionals" || normalized === "professional") {
          return "working_professionals";
        }
        if (normalized.includes("bachelor")) {
          return "bachelor";
        }
        return normalized;
      });
    } else {
      payload.tenantPreference = ["any"];
    }
  }

  if (formData.permalink) {
    payload.permalink = formData.permalink;
  }

  // Renewal settings
  payload.renew24Hours = !!formData.renew_24_hours;
  payload.renew30Days = !!formData.renew_30_days;
  payload.isFeatured = !!formData.is_featured;

  // Videos - clean, auto-prepend https:// and validate to prevent 422 validation errors
  let videoUrl = formData.video_url?.trim();
  if (videoUrl) {
    if (!/^https?:\/\//i.test(videoUrl)) {
      videoUrl = `https://${videoUrl}`;
    }
    let isValid = false;
    try {
      new URL(videoUrl);
      isValid = true;
    } catch {
      isValid = false;
    }
    if (isValid) {
      payload.videos = [
        {
          videoUrl: videoUrl,
          altText: "Property Tour Video",
          videoThumbnail: !!formData.video_thumbnail,
          videoThumbnailUrl: formData.video_thumbnail || null,
        },
      ];
    } else {
      payload.videos = [];
    }
  } else {
    payload.videos = [];
  }

  // Property Images
  const mappedImages = (formData.images || []).map((img) => ({
    image: img,
    altText: formData.name ? `${formData.name} Image` : "Property Image",
  }));

  payload.images = mappedImages;

  // Features & Facilities mapping
  if (formData.features && formData.features.length > 0) {
    payload.features = formData.features;
  } else if (formData.amenities && formData.amenities.length > 0) {
    payload.features = formData.amenities
      .map((name) => {
        const idx = AMENITIES_LIST.indexOf(name);
        return idx !== -1 ? { featureId: idx + 1 } : null;
      })
      .filter(Boolean);
  } else {
    payload.features = [];
  }

  if (formData.facilities && formData.facilities.length > 0) {
    payload.facilities = formData.facilities.map((fac) => ({
      facilityId: Number(fac.facilityId),
      facilityValue: fac.facilityValue,
    }));
  } else {
    payload.facilities = [];
  }

  // SEO details
  if (formData.seo_title || formData.seo_desc || formData.seo_img) {
    payload.seo = {
      title: formData.seo_title || formData.name,
      description: formData.seo_desc || formData.description,
      seo_img: formData.seo_img || null,
      index: "index",
    };
  }

  return payload;
}

// ─── API Endpoints ───────────────────────────────────────────────────────────

/**
 * Resolve locations, transform the payload, and submit the new property listing.
 */
export async function createProperty(
  formData: PropertyFormData,
  customerId: string
): Promise<any> {
  if (!formData.property_subtype || !formData.owner_type) {
    throw new Error("Missing required basic details (subtype or owner type)");
  }

  // Resolve location IDs first
  const { stateId, cityId } = await resolveLocationIds(
    formData.state,
    formData.city
  );

  // Map the payload
  const payload = mapFormDataToApiPayload(
    formData,
    customerId,
    stateId,
    cityId
  );

  // Construct dynamic URL endpoint slug & resolve categoriesId
  const propertyFor = formData.property_for; // 'sell' or 'rent_lease'
  let ownerType = formData.owner_type.toLowerCase();

  // Backwards compat: fallback builder to owner for rent_lease (no builder rent/lease endpoint exists)
  if (propertyFor === "rent_lease" && ownerType === "builder") {
    ownerType = "owner";
  }

  let rawSubtype = formData.property_subtype.toLowerCase();
  let slug = rawSubtype.replace(/_/g, "-");

  // Route slug mappings to avoid 404s
  if (propertyFor === "sell") {
    if (slug === "land") {
      slug = "plot"; // There's no land endpoint under sell; map to plot
    }
  } else if (propertyFor === "rent_lease") {
    if (slug === "land" || slug === "plot") {
      slug = "plot"; // Both map to plot (running createRentLeaseOwnerLand / createRentLeaseConsultantLand)
    }
  }

  const url = `/properties/${propertyFor}/${ownerType}/${slug}`;

  return apiClient.post<any>(url, payload);
}

/**
 * Fetch all active features from the backend
 */
export async function getFeatures(): Promise<{ success: boolean; data: Array<{ id: number; name: string }> }> {
  return apiClient.get<{ success: boolean; data: Array<{ id: number; name: string }> }>("/features", { skipAuth: true });
}

/**
 * Fetch all active facilities from the backend
 */
export async function getFacilities(): Promise<{ success: boolean; data: Array<{ id: number; name: string }> }> {
  return apiClient.get<{ success: boolean; data: Array<{ id: number; name: string }> }>("/facilities", { skipAuth: true });
}

/**
 * Upload one or more files to the backend property upload endpoint.
 * Accepts an array of standard File objects and returns their absolute public backend URLs.
 */
export async function uploadFiles(files: File[], type?: 'property' | 'seo' | 'video'): Promise<string[]> {
  if (files.length === 0) return [];
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  const url = type ? `/properties/upload?type=${type}` : "/properties/upload";
  const res = await apiClient.post<{ success: boolean; data: { urls: string[] } }>(
    url,
    formData
  );

  return res.data?.urls || [];
}

/**
 * Fetch all properties for a specific customer from the backend
 */
export async function getUserProperties(customerId: number): Promise<{ success: boolean; data: any[] }> {
  return apiClient.get<{ success: boolean; data: any[] }>(`/properties?customer_id=${customerId}`);
}

/**
 * Fetch all properties for a specific customer with additional parameters (e.g. moderation status)
 */
export async function getUserPropertiesWithParams(customerId: number, params?: Record<string, any>): Promise<{ success: boolean; data: any[] }> {
  let query = `?customer_id=${customerId}`;
  if (params) {
    const cleanParams: Record<string, string> = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        cleanParams[key] = String(value);
      }
    });
    const searchParams = new URLSearchParams(cleanParams);
    query += `&${searchParams.toString()}`;
  }
  return apiClient.get<{ success: boolean; data: any[] }>(`/properties${query}`);
}

/**
 * Delete a property listing by ID
 */
export async function deleteProperty(id: number): Promise<{ success: boolean; message: string }> {
  return apiClient.delete<{ success: boolean; message: string }>(`/properties/${id}`);
}

/**
 * Fetch a single property listing by ID
 */
export async function getProperty(id: number): Promise<{ success: boolean; data: any }> {
  return apiClient.get<{ success: boolean; data: any }>(`/properties/${id}`);
}

/**
 * Fetch a single property listing by permalink
 */
export async function getPropertyByPermalink(permalink: string): Promise<{ success: boolean; data: any }> {
  return apiClient.get<{ success: boolean; data: any }>(`/properties/slug/${permalink}`, { skipAuth: true });
}

// ─── Reverse mappings ────────────────────────────────────────────────────────

const CATEGORY_ID_REVERSE: Record<number, PropertySubtype> = {
  1: "apartment",
  2: "villa",
  3: "plot",
  4: "individual_house",
  5: "land",
  6: "shop",
  7: "building",
  8: "godown",
  9: "warehouse",
  10: "office_space",
};

const AREA_UNIT_REVERSE: Record<string, string> = {
  sq_ft: "1",
  square_inches: "2",
  acres: "3",
  cents: "4",
  square_meters: "5",
  square_yards: "6",
  hectares: "7",
};

const HOUSE_TYPE_REVERSE: Record<string, string> = {
  one_bk: "1RK",
  one_bhk: "1BHK",
  two_bhk: "2BHK",
  three_bhk: "3BHK",
  four_bhk: "4BHK",
  five_bhk: "5BHK",
};

const CONSTRUCTION_AGE_REVERSE: Record<string, string> = {
  new: "New Construction",
  less_than_1_year: "Less than 1 year",
  years_1_to_3: "1-3 years",
  years_3_to_5: "3-5 years",
  years_5_to_10: "5-10 years",
  years_10_plus: "10+ years",
};

const FURNISHING_TYPE_REVERSE: Record<string, string> = {
  fully_furnished: "Furnished",
  semi_furnished: "Semi-Furnished",
  unfurnished: "Unfurnished",
};

const OWNERSHIP_TYPE_REVERSE: Record<string, string> = {
  fully_owned: "Fully Owned",
  on_lease: "On Lease",
  shared_ownership: "Shared Ownership",
};

const FOOD_PREFERENCE_REVERSE: Record<string, string> = {
  veg: "Veg",
  non_veg: "Non-Veg",
  no_restrictions: "No Restrictions",
};

const AVAILABILITY_STATUS_REVERSE: Record<string, string> = {
  ready_to_occupy: "Ready to Occupy",
  under_construction: "Under Construction",
  available_from: "Available From",
};

/**
 * Maps dynamic backend property payload back to frontend type-safe PropertyFormData.
 */
export function mapApiPayloadToFormData(p: any): PropertyFormData {
  if (!p) {
    throw new Error("Invalid API property data received");
  }

  const subtype = (p.categoriesId && CATEGORY_ID_REVERSE[Number(p.categoriesId)]) || "apartment";
  const property_for = p.propertyFor === "sell" ? "sell" : "rent_lease";
  const rent_lease_type = p.propertyFor === "sell" ? "" : (p.propertyFor || "rent");

  // Handle owner type mapping
  let owner_type: "Owner" | "Builder" | "Consultant" = "Owner";
  if (p.propertyOwnership) {
    const oLower = p.propertyOwnership.toLowerCase();
    if (oLower === "builder") owner_type = "Builder";
    else if (oLower === "consultant") owner_type = "Consultant";
  }

  // Parse location
  let address = "";
  let area = "";
  const state = p.state?.name || "";
  const city = p.city?.name || "";

  if (p.location) {
    const parts = p.location.split(",").map((s: string) => s.trim());
    const cleanParts = parts.filter(
      (part: string) =>
        part.toLowerCase() !== state.toLowerCase() &&
        part.toLowerCase() !== city.toLowerCase()
    );
    const cleanAddress = cleanParts.join(", ");

    address = cleanAddress || p.location;

    if (cleanParts.length >= 2) {
      area = cleanParts[1] || "";
    }
  }

  let pincode = "";
  if (p.location) {
    const pinMatch = p.location.match(/\b\d{6}\b/);
    if (pinMatch) pincode = pinMatch[0];
  }

  // Amenities mapping from features relation
  const amenities = (p.propertyFeatures || [])
    .map((pf: any) => pf.feature?.name || "")
    .filter(Boolean);

  // Features mapping from features relation
  const features = (p.propertyFeatures || [])
    .map((pf: any) => {
      const id = pf.featureId || pf.feature?.id;
      return id ? { featureId: Number(id) } : null;
    })
    .filter(Boolean);

  // Facilities mapping from facilities relation
  const facilities = (p.propertyFacilities || [])
    .map((pf: any) => {
      const id = pf.facilityId || pf.facility?.id;
      return id ? { facilityId: Number(id), facilityValue: pf.facilityValue || "" } : null;
    })
    .filter(Boolean);

  // Key specifications mapping
  let key_specifications = (p.keySpecifications || [])
    .map((ks: any) => ks.description || "")
    .filter(Boolean);
  if (key_specifications.length === 0) {
    key_specifications = [""];
  }

  // Image and video extraction
  const images = (p.images || []).map((img: any) => img.image || "").filter(Boolean);
  const video_url = p.videos?.[0]?.videoUrl || "";
  const video_thumbnail = p.videos?.[0]?.videoThumbnailUrl || "";

  // Return the mapped PropertyFormData
  return {
    id: p.id,
    property_for,
    owner_type,
    property_main_type: p.category?.type?.toLowerCase() === "commercial" ? "commercial" : "residential",
    property_subtype: subtype,

    // Area and dimensions
    plot_area: p.plotLandArea != null ? String(p.plotLandArea) : "",
    area_unit: (p.areaUnit && AREA_UNIT_REVERSE[p.areaUnit]) || "1",
    plot_length: p.plotLandLength != null ? String(p.plotLandLength) : "",
    plot_breadth: p.plotLandBreadth != null ? String(p.plotLandBreadth) : "",
    super_builtup_area: p.builtUpArea != null ? String(p.builtUpArea) : "",
    carpet_area: p.carpetArea != null ? String(p.carpetArea) : "",
    uds_area: p.udsArea != null ? String(p.udsArea) : "",
    storage_area: p.storageArea != null ? String(p.storageArea) : "",
    total_floors: p.totalFloors != null ? String(p.totalFloors) : "",
    property_on_floor: p.propertyOnFloor != null ? String(p.propertyOnFloor) : "",

    // Structure
    name: p.name || "",
    permalink: p.permalink || "",
    description: p.description || "",
    house_type: (p.houseType && HOUSE_TYPE_REVERSE[p.houseType]) || "",
    construction_age: (p.constructionAge && CONSTRUCTION_AGE_REVERSE[p.constructionAge]) || "",
    bedrooms: p.bedrooms != null ? String(p.bedrooms) : "",
    bathrooms: p.bathrooms != null ? String(p.bathrooms) : "",
    balcony: p.balcony === true ? "Yes" : p.balcony === false ? "No" : "",
    garden: p.garden === true ? "Yes" : p.garden === false ? "No" : "",
    swimming_pool: p.swimmingPool === true ? "Yes" : p.swimmingPool === false ? "No" : "",
    compound_wall: p.compoundWall === true ? "Yes" : p.compoundWall === false ? "No" : "",
    corner_property: p.cornerProperty === true ? "Yes" : p.cornerProperty === false ? "No" : "",
    utility_area: p.utilityArea === true ? "Yes" : p.utilityArea === false ? "No" : "",
    pantry_area: p.pantryArea === true ? "Yes" : p.pantryArea === false ? "No" : "",
    loading_unloading_facility: p.loadingUnloadingFacility === true ? "Yes" : p.loadingUnloadingFacility === false ? "No" : "",
    property_suitable_for: p.propertySuitableFor || "",
    direction_facing: p.directionFacing || "",

    // Utilities / Policies
    furnishing_type: (p.furnishingType && FURNISHING_TYPE_REVERSE[p.furnishingType]) || "",
    water_supply: p.waterSupply ? p.waterSupply.charAt(0).toUpperCase() + p.waterSupply.slice(1) : "",
    food_preference: (p.foodPreference && FOOD_PREFERENCE_REVERSE[p.foodPreference]) || "",
    pet_policy: p.petPolicy === "not_allowed" ? "Not Allowed" : p.petPolicy === "allowed" ? "Allowed" : "",
    parking_availability: p.parkingAvailability === true ? "Yes" : p.parkingAvailability === false ? "No" : "",
    parking_type: (() => {
      if (!p.parkingType) return [];
      if (p.parkingType.toLowerCase() === "both") return ["Bike", "Car"];
      return [p.parkingType.charAt(0).toUpperCase() + p.parkingType.slice(1)];
    })(),
    parking_slots_count: p.parkingSlots != null ? String(p.parkingSlots) : "",
    ownership_type: (p.ownershipType && OWNERSHIP_TYPE_REVERSE[p.ownershipType]) || "",

    // Pricing / Financials
    rent_lease_type,
    price: p.price != null ? String(p.price) : "",
    security_deposit: p.securityDeposit != null ? String(p.securityDeposit) : "",
    security_deposit_type: p.securityDepositType || "",
    maintenance_charge_status: p.maintenanceChargeStatus === true ? "Yes" : p.maintenanceChargeStatus === false ? "No" : "",
    maintenance_charge_amount: p.maintenanceChargeAmount != null ? String(p.maintenanceChargeAmount) : "",
    lease_duration: p.leaseDuration || "",
    maintenance_responsibility: p.maintenanceResponsibility
      ? p.maintenanceResponsibility.charAt(0).toUpperCase() + p.maintenanceResponsibility.slice(1)
      : "",
    notice_period: p.noticePeriod || "",
    availability_status: (p.availabilityStatus && AVAILABILITY_STATUS_REVERSE[p.availabilityStatus]) || "",
    availability_date: p.availabilityDate ? String(p.availabilityDate).split("T")[0] : "",

    // Brokerage (Consultant)
    brokerage_type: p.brokerageType || "",
    brokerage_fee: p.brokerageFee != null ? String(p.brokerageFee) : "",
    brokerage_percentage: p.brokeragePercentage != null ? String(p.brokeragePercentage) : "",

    // Location Step 3
    address,
    landmark: p.landmark || "",
    state: p.state?.name || "",
    city: p.city?.name || "",
    area,
    pincode,
    latitude: p.latitude != null ? String(p.latitude) : "",
    longitude: p.longitude != null ? String(p.longitude) : "",

    // Step 4 & 5
    amenities,
    features,
    facilities,
    key_specifications,
    tenant_preference: (() => {
      if (!p.tenantPreference) return [];
      const parts = typeof p.tenantPreference === "string"
        ? p.tenantPreference.split(",")
        : (Array.isArray(p.tenantPreference) ? p.tenantPreference : [p.tenantPreference]);
      
      return parts.map((t: string) => {
        const val = t.toLowerCase().trim();
        if (val === "family") return "Family";
        if (val === "bachelor") return "Bachelor";
        if (val === "students" || val === "student") return "Students";
        if (val === "working_professionals" || val === "working professionals" || val === "professional") return "Working Professionals";
        if (val === "any") return "Any";
        if (val === "individual") return "Individual";
        if (val === "company") return "Company";
        return t.charAt(0).toUpperCase() + t.slice(1);
      });
    })(),
    tags: Array.isArray(p.tags) ? p.tags : [],
    images,
    video_url,
    video_thumbnail,
    renew_24_hours: !!p.renew24Hours,
    renew_30_days: !!p.renew30Days,
    seo_title: p.seo?.title || "",
    seo_desc: p.seo?.description || "",
    seo_img: p.seo?.image || "",
  };
}

/**
 * Update an existing property listing by ID
 */
export async function updateProperty(
  id: number,
  formData: PropertyFormData,
  customerId: string
): Promise<any> {
  const { stateId, cityId } = await resolveLocationIds(
    formData.state,
    formData.city
  );

  const payload = mapFormDataToApiPayload(
    formData,
    customerId,
    stateId,
    cityId
  );

  return apiClient.put<any>(`/properties/${id}`, payload);
}

/**
 * Fetch all properties with optional query filters
 */
export async function getProperties(params?: Record<string, any>): Promise<{
  success: boolean;
  data: any[];
  meta?: { total: number; page: number; page_size: number; total_pages: number };
}> {
  let query = "";
  if (params) {
    const cleanParams: Record<string, string> = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        cleanParams[key] = String(value);
      }
    });
    const searchParams = new URLSearchParams(cleanParams);
    query = `?${searchParams.toString()}`;
  }
  return apiClient.get<{
    success: boolean;
    data: any[];
    meta?: { total: number; page: number; page_size: number; total_pages: number };
  }>(`/properties${query}`, { skipAuth: true });
}

/**
 * Maps a single backend property record to the UI's PropertyCardProps format.
 */
export function mapApiPropertyToCardProps(p: any): any {
  // extract first image URL
  const mainImage = p.images?.[0]?.image || "/assets/blur.png";

  // map owner type
  let ownerTypeVal = "Owner";
  if (p.propertyOwnership) {
    const o = p.propertyOwnership.toLowerCase();
    if (o === "builder") ownerTypeVal = "Builder";
    else if (o === "consultant") ownerTypeVal = "Consultant";
  }

  // map category name
  const categoryNameVal = p.category?.name || "Apartment";

  // map area
  let areaVal = "";
  if (p.builtUpArea) {
    areaVal = `${p.builtUpArea} Sq.Ft`;
  } else if (p.plotLandArea) {
    areaVal = `${p.plotLandArea} Sq.Ft`;
  }

  // map direction facing
  let directionVal = "";
  if (p.directionFacing) {
    directionVal = p.directionFacing
      .replace(/_/g, "-")
      .split("-")
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("-");
  }

  // map features
  const featuresVal = (p.propertyFeatures || [])
    .map((pf: any) => ({ name: pf.feature?.name }))
    .filter((f: any) => !!f.name);

  // map property purpose
  const purposeVal = p.propertyFor === "sell" ? "For Sale" : p.propertyFor === "rent" ? "Rent" : "Lease";

  return {
    id: String(p.id),
    name: p.name || "Untitled Property",
    image: mainImage,
    permalink: p.permalink || undefined,
    isFeatured: !!p.isFeatured,
    type: ownerTypeVal,
    categoryName: categoryNameVal,
    price: Number(p.price) || 0,
    location: (() => {
      if (!p.location) return "N/A";
      const stateName = p.state?.name || "";
      const cityName = p.city?.name || "";
      const parts = p.location.split(",").map((s: string) => s.trim());
      const cleanParts = parts.filter(
        (part: string) =>
          part.toLowerCase() !== stateName.toLowerCase() &&
          part.toLowerCase() !== cityName.toLowerCase()
      );
      return cleanParts.join(", ") || p.location;
    })(),
    bedrooms: p.bedrooms != null ? Number(p.bedrooms) : undefined,
    bathrooms: p.bathrooms != null ? Number(p.bathrooms) : undefined,
    area: areaVal || undefined,
    direction: directionVal || undefined,
    features: featuresVal,
    property_for: purposeVal,
    security_deposit: p.securityDeposit ? Number(p.securityDeposit) : undefined,
    lease_duration: p.leaseDuration || undefined,
  };
}

/**
 * Resolve city name to its database cityId.
 * Seeding contains state Tamil Nadu (78) and city Chennai (7063).
 * Falls back to 999999 for non-seeded cities so that queries return no results.
 */
export async function getCityIdByName(cityName: string): Promise<number | undefined> {
  if (!cityName) return undefined;
  try {
    const { cityId } = await resolveLocationIds(undefined, cityName);
    // Double check that the resolved city name matches the input to avoid unwanted fallback
    const citiesRes = await getCities(78); // Tamil Nadu
    const matched = citiesRes.data?.find(
      (c) => c.name.toLowerCase() === cityName.toLowerCase()
    );
    if (matched) return Number(matched.id);
  } catch (e) {
    console.error("Error resolving city ID by name:", e);
  }
  return 999999;
}

export function getImageUrl(img?: string | null): string {
  if (!img) return "/assets/blur.png";
  if (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("data:")) return img;
  if (img.startsWith("/assets/") || img.startsWith("/assets") || img.startsWith("assets/")) {
    return img.startsWith("/") ? img : `/${img}`;
  }
  const baseUrl = process.env.NEXT_PUBLIC_WEB_API_URL || "http://localhost:4000";
  const cleanImg = img.startsWith("/") ? img.substring(1) : img;
  return `${baseUrl}/${cleanImg}`;
}

export async function checkPermalinkAvailability(
  permalink: string,
  propertyId?: number | string
): Promise<{ success: boolean; available: boolean; message?: string }> {
  const searchParams = new URLSearchParams();
  searchParams.append("permalink", permalink);
  if (propertyId) {
    searchParams.append("propertyId", String(propertyId));
  }
  return apiClient.get<{ success: boolean; available: boolean; message?: string }>(
    `/properties/check-permalink?${searchParams.toString()}`,
    { skipAuth: true }
  );
}

export async function getPropertyCategories(params?: Record<string, any>): Promise<{ success: boolean; data: any[] }> {
  let query = "";
  if (params) {
    const cleanParams: Record<string, string> = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        cleanParams[key] = String(value);
      }
    });
    const searchParams = new URLSearchParams(cleanParams);
    query = `?${searchParams.toString()}`;
  }
  return apiClient.get<{ success: boolean; data: any[] }>(`/categories${query}`, { skipAuth: true });
}






