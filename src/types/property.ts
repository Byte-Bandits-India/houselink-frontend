export type PropertyFor = "sell" | "rent_lease";
export type OwnerType = "Owner" | "Builder" | "Consultant";
export type MainType = "residential" | "commercial";
export type PropertySubtype =
  | "apartment" | "villa" | "individual_house" | "plot"
  | "land" | "shop" | "building" | "godown" | "warehouse" | "office_space";

export const AREA_UNITS = [
  { value: "1", label: "Sq. Ft" },
  { value: "2", label: "Square Inches" },
  { value: "3", label: "Acres" },
  { value: "4", label: "Cents" },
  { value: "5", label: "Square Meters" },
  { value: "6", label: "Square Yards" },
  { value: "7", label: "Hectares" },
];

export const HOUSE_TYPES = ["1RK", "1BHK", "2BHK", "3BHK", "4BHK", "5BHK"];
export const CONSTRUCTION_AGES = ["New Construction", "Less than 1 year", "1-3 years", "3-5 years", "5-10 years", "10+ years"];
export const FURNISHING_TYPES = ["Furnished", "Semi-Furnished", "Unfurnished"];
export const WATER_SUPPLY_OPTIONS = ["Borewell", "Corporation", "Both"];
export const FOOD_PREF_OPTIONS = ["Veg", "Non-Veg", "No Restrictions"];
export const OWNERSHIP_TYPES = ["Fully Owned", "On Lease", "Shared Ownership", "Company Owned"];
export const NOTICE_PERIODS = ["No-notice", "1 Month", "2 Months", "3 Months", "6 Months"];
export const LEASE_DURATIONS = ["1 year", "2 years", "3 years", "> 3 years"];
export const MAINTENANCE_RESP = ["Tenant", "Owner", "Shared"];

export const RESIDENTIAL_SUBTYPES: { value: PropertySubtype; label: string }[] = [
  { value: "apartment", label: "Apartment" },
  { value: "villa", label: "Villa" },
  { value: "individual_house", label: "Individual House" },
  { value: "plot", label: "Plots" },
];

export const COMMERCIAL_SUBTYPES: { value: PropertySubtype; label: string }[] = [
  { value: "land", label: "Land" },
  { value: "shop", label: "Shop" },
  { value: "building", label: "Building" },
  { value: "godown", label: "Godown" },
  { value: "warehouse", label: "Warehouse" },
  { value: "office_space", label: "Office Space" },
];

export const AMENITIES_LIST = [
  "Lift", "Power Backup", "Swimming Pool", "Security", "CCTV", "Gym", "Club House",
  "Garden", "Children Play Area", "Sports Facility", "Shopping Center", "Hospital",
  "School", "Rain Water Harvesting", "Sewage Treatment Plant", "Piped Gas",
  "Fire Safety", "Intercom", "Visitor Parking", "Servant Quarter",
];

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Chandigarh", "Puducherry",
];

// Step 1: Basic Details Form Data
export interface Step1FormData {
  property_for: PropertyFor;
  owner_type: OwnerType | "";
  property_main_type: MainType;
  property_subtype: PropertySubtype | "";
  // area fields
  plot_area?: string;
  plot_unit?: string;
  plot_length?: string;
  plot_breadth?: string;
  super_builtup_area?: string;
  builtup_unit?: string;
  carpet_area?: string;
  carpet_unit?: string;
  total_floors?: string;
  property_on_floor?: string;
}

// Step 2: Property Profile Form Data
export interface Step2FormData {
  name: string;
  permalink: string;
  description: string;
  house_type?: string;
  construction_age?: string;
  bedrooms?: string;
  bathrooms?: string;
  balcony?: "Yes" | "No" | "";
  garden?: "Yes" | "No" | "";
  swimming_pool?: "Yes" | "No" | "";
  furnishing_type?: string;
  water_supply?: string;
  food_preference?: string;
  pet_policy?: "Allowed" | "Not Allowed" | "";
  parking_availability?: "Yes" | "No" | "";
  parking_type?: string[];
  parking_slots_count?: string;
  ownership_type?: string;
  corner_property?: "Yes" | "No" | "";
  compound_wall?: "Yes" | "No" | "";
  utility_area?: "Yes" | "No" | "";
  loading_unloading_facility?: "Yes" | "No" | "";
  pantry_area?: "Yes" | "No" | "";
  storage_area?: string;
  property_suitable_for?: string;
  key_specifications?: string[];
  tenant_preference?: string[];
  rent_lease_type?: "rent" | "lease" | "";
  price?: string;
  security_deposit?: string;
  security_deposit_type?: "Fixed" | "Negotiable" | "";
  maintenance_charge_status?: "Yes" | "No" | "";
  maintenance_charge_amount?: string;
  lease_duration?: string;
  maintenance_responsibility?: string;
  notice_period?: string;
  availability_status?: string;
  availability_date?: string;
  // Brokerage details (Consultant only)
  brokerage_type?: "no_brokerage" | "fixed" | "percentage" | "";
  brokerage_fee?: string;
  brokerage_percentage?: string;
  // Optional extra decimals for residential/commercial sells
  uds_area?: string;
}

// Step 3: Location Form Data
export interface Step3FormData {
  address?: string;
  landmark?: string;
  state?: string;
  city?: string;
  area?: string;
  pincode?: string;
  latitude?: string;
  longitude?: string;
}

// Step 4: Amenities Form Data
export interface Step4FormData {
  amenities?: string[];
  features?: Array<{ featureId: number }>;
  facilities?: Array<{ facilityId: number; facilityValue: string }>;
  direction_facing?: string;
  tags?: string[];
}

// Step 5: SEO / Final Form Data
export interface Step5FormData {
  seo_title?: string;
  seo_desc?: string;
  seo_img?: string;
  video_url?: string;
  video_thumbnail?: string;
  images?: string[];
  // Auto-renewal options
  renew_24_hours?: boolean;
  renew_30_days?: boolean;
}

// Combined Property Form Data interface extending all steps
export interface PropertyFormData
  extends Step1FormData,
  Step2FormData,
  Step3FormData,
  Step4FormData,
  Step5FormData {
  id?: number | string;
}

export const defaultFormData: PropertyFormData = {
  property_for: "sell",
  owner_type: "Owner",
  property_main_type: "residential",
  property_subtype: "",
  name: "",
  permalink: "",
  description: "",
  amenities: [],
  features: [],
  facilities: [],
  tags: [],
  tenant_preference: [],
  parking_type: [],
  key_specifications: [""],
  brokerage_type: "",
  brokerage_fee: "",
  brokerage_percentage: "",
  storage_area: "",
  seo_img: "",
  video_thumbnail: "",
  images: [],
  renew_24_hours: false,
  renew_30_days: false,
  availability_status: "Ready to Occupy",
};

export function getSchemaFields(
  propertyFor: PropertyFor,
  ownerType: OwnerType | "",
  subtype: PropertySubtype | ""
): Record<string, boolean> {
  const fields: Record<string, boolean> = {};

  if (!subtype) return fields;

  const isRentLease = propertyFor === "rent_lease";
  const isConsultant = ownerType === "Consultant";

  // ─── 1. Common required/optional tail fields for all schemas ───
  fields.name = true;
  fields.permalink = true;
  fields.description = true;
  fields.price = true;
  fields.availability_status = true;
  fields.availability_date = true;
  if (
    subtype !== "plot" &&
    subtype !== "land" &&
    !["shop", "building", "office_space", "godown", "warehouse"].includes(subtype)
  ) {
    fields.construction_age = true;
  }
  fields.direction_facing = true;
  if (subtype && ["land", "shop", "building", "godown", "warehouse", "office_space"].includes(subtype)) {
    fields.key_specifications = true;
  }

  // SEO fields are allowed in all except consultant
  if (!isConsultant) {
    fields.seo_title = true;
    fields.seo_desc = true;
  }

  // ─── 2. Rent / lease specific pricing/terms ───
  if (isRentLease) {
    fields.rent_lease_type = true;
    fields.tenant_preference = true;

    // Rent specific
    fields.security_deposit = true;
    fields.security_deposit_type = true;
    fields.maintenance_charge_status = true;
    fields.maintenance_charge_amount = true;

    // Lease specific
    fields.lease_duration = true;
    fields.maintenance_responsibility = true;

    // Notice period (optional in Rent & Lease)
    fields.notice_period = true;
  }

  // ─── 3. Consultant specific brokerage ───
  if (isConsultant) {
    fields.brokerage_type = true;
    fields.brokerage_fee = true;
    fields.brokerage_percentage = true;
  }

  // ─── 4. Subtype-specific fields based on backend schemas ───
  if (["apartment", "villa", "individual_house"].includes(subtype)) {
    // Residential
    fields.house_type = true;
    fields.bedrooms = true;
    fields.bathrooms = true;
    fields.ownership_type = true;
    fields.furnishing_type = true;
    fields.food_preference = true;
    fields.pet_policy = true;
    fields.parking_availability = true;
    fields.parking_type = true;
    fields.parking_slots_count = true;
    fields.water_supply = true;
    fields.balcony = true;

    if (subtype === "apartment") {
      fields.super_builtup_area = true;
      fields.builtup_unit = true;
      fields.total_floors = true;
      fields.property_on_floor = true;
      if (!isRentLease) {
        fields.uds_area = true;
      }
    } else {
      // Villa / Individual House
      fields.plot_area = true;
      fields.plot_unit = true;
      fields.super_builtup_area = true;
      fields.builtup_unit = true;
      fields.carpet_area = true;
      fields.garden = true;
      fields.swimming_pool = true;
    }
  } else if (["plot", "land"].includes(subtype)) {
    // Plots / Lands
    fields.plot_area = true;
    fields.plot_unit = true;
    fields.ownership_type = true;
    fields.plot_length = true;
    fields.plot_breadth = true;
    fields.corner_property = true;
    fields.compound_wall = true;
    if (!isRentLease && subtype !== "plot" && subtype !== "land") {
      fields.water_supply = true;
    }
  } else {
    // Commercial (Office Space, Shop, Building, Godown, Warehouse)
    fields.ownership_type = true;
    fields.super_builtup_area = true;
    fields.builtup_unit = true;
    fields.carpet_area = true;
    fields.parking_availability = true;
    fields.parking_type = true;
    fields.parking_slots_count = true;
    fields.property_suitable_for = true;

    // Bathrooms are required in ALL rent_lease commercial schemas (NOT in sell commercial)
    if (isRentLease) {
      fields.bathrooms = true;
      fields.corner_property = ["shop", "building", "godown", "warehouse"].includes(subtype);
      fields.utility_area = ["shop", "building", "godown", "warehouse"].includes(subtype);
    } else {
      if (!["shop", "building", "office_space", "godown", "warehouse"].includes(subtype)) {
        fields.water_supply = true;
      }
    }

    // Plot area/unit is in all sell commercial and shop/building/godown/warehouse rent/lease schemas
    if (subtype !== "office_space" || !isRentLease) {
      fields.plot_area = true;
      fields.plot_unit = true;
    }

    if (subtype === "office_space") {
      fields.total_floors = true;
      fields.property_on_floor = true;
      if (isRentLease) {
        fields.furnishing_type = true;
      }
      fields.pantry_area = true;
      fields.bathrooms = true;
      fields.key_specifications = true;

      if (!isRentLease) {
        fields.storage_area = true;
      }
    } else if (subtype === "shop") {
      fields.total_floors = true;
      fields.property_on_floor = true;
      fields.bathrooms = true;
      fields.corner_property = true;
      fields.utility_area = true;
      fields.loading_unloading_facility = true;
      fields.key_specifications = true;
    } else if (subtype === "building") {
      fields.total_floors = true;
      fields.property_on_floor = true;
      fields.bathrooms = true;
      fields.corner_property = true;
      fields.utility_area = true;
      fields.key_specifications = true;

      if (isRentLease) {
        fields.loading_unloading_facility = true;
      }
    } else if (["godown", "warehouse"].includes(subtype)) {
      fields.storage_area = true;
      fields.loading_unloading_facility = true;
      fields.bathrooms = true;
      fields.corner_property = true;
      fields.utility_area = true;
      fields.key_specifications = true;

      if (isRentLease) {
        fields.total_floors = true;
        fields.property_on_floor = true;
      }
    }
  }

  return fields;
}
