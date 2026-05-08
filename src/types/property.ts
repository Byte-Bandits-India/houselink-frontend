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

export const HOUSE_TYPES = ["1RK","1BHK","2BHK","3BHK","4BHK","5BHK"];
export const CONSTRUCTION_AGES = ["New Construction","Less than 1 year","1-3 years","3-5 years","5-10 years","10+ years"];
export const FURNISHING_TYPES = ["Furnished","Semi-Furnished","Unfurnished"];
export const WATER_SUPPLY_OPTIONS = ["Borewell","Corporation","Both"];
export const FOOD_PREF_OPTIONS = ["Veg","Non-Veg","No Restrictions"];
export const OWNERSHIP_TYPES = ["Fully Owned","On Lease","Shared Ownership","Company Owned"];
export const NOTICE_PERIODS = ["No-notice","1 Month","2 Months","3 Months","6 Months"];
export const LEASE_DURATIONS = ["1 year","2 years","3 years","> 3 years"];
export const MAINTENANCE_RESP = ["Tenant","Owner","Shared"];

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
  "Lift","Power Backup","Swimming Pool","Security","CCTV","Gym","Club House",
  "Garden","Children Play Area","Sports Facility","Shopping Center","Hospital",
  "School","Rain Water Harvesting","Sewage Treatment Plant","Piped Gas",
  "Fire Safety","Intercom","Visitor Parking","Servant Quarter",
];

export const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Chandigarh","Puducherry",
];

export interface PropertyFormData {
  // Step 1: Basic Details
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
  // Step 2: Property Profile
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
  // Step 3: Location
  address?: string;
  landmark?: string;
  state?: string;
  city?: string;
  area?: string;
  pincode?: string;
  latitude?: string;
  longitude?: string;
  // Step 4: Amenities
  amenities?: string[];
  tags?: string[];
  // Step 5: SEO/Final
  seo_title?: string;
  seo_desc?: string;
  video_url?: string;
}

export const defaultFormData: PropertyFormData = {
  property_for: "sell",
  owner_type: "",
  property_main_type: "residential",
  property_subtype: "",
  name: "",
  permalink: "",
  description: "",
  amenities: [],
  tags: [],
  tenant_preference: [],
  parking_type: [],
  key_specifications: [""],
};
