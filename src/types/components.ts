// ─── Shared component prop types ──────────────────────────────────────────────

export type PropertyCardProps = {
  id: string;
  name: string;
  image: string;
  permalink?: string;
  isFeatured?: boolean;
  type?: string;
  categoryName?: string;
  price: string | number;
  location: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  direction?: string;
  features?: Array<{ name: string; icon?: string }>;
  isInWishlist?: boolean;

  // Extra fields for details page
  seo_title?: string;
  seo_desc?: string;
  created_at?: string;
  views?: number;
  description?: string;
  images?: Array<{ image_url: string }>;
  city?: { name: string };
  state?: { name: string };
  custom_fields?: Array<{ field_name: string; field_value: string; unit?: string }>;
  house_type?: string;
  construction_age?: string;
  ownership_type?: string;
  furnishing_type?: string;
  water_supply?: string;
  food_preference?: string;
  pet_policy?: string;
  balcony?: string;
  garden?: string;
  swimming_pool?: string;
  corner_property?: string;
  compound_wall?: string;
  property_suitable_for?: string;
  utility_area?: string;
  loading_unloading_facility?: string;
  pantry_area?: string;
  key_specifications?: string[];
  parking_availability?: string;
  parking_type?: string[];
  parking_slots_count?: number;
  tenant_preference?: string[];
  property_for?: string;
  security_deposit?: number;
  security_deposit_type?: string;
  maintenance_charge_status?: string;
  maintenance_charge_amount?: number;
  lease_duration?: string;
  maintenance_responsibility?: string;
  notice_period?: string;
  brokerage_type?: string;
  brokerage_fee?: number;
};

export type PropertyHorizontalCardProps = PropertyCardProps & {
  onEnquireClick: (property: any) => void;
};

export type BreadcrumbItemProps = {
  label: string;
  href?: string;
};

export type BreadcrumbProps = {
  items: BreadcrumbItemProps[];
  variant?: "default" | "simple";
};

export type SearchSuggestionsProps = {
  query?: string;
  onSelectKeyword: (keyword: string) => void;
  onSelectLocation: (location: string) => void;
  onSelectCategory?: (category: string) => void;
  onSelectCity?: (city: string) => void;
  onSelectAmenity?: (amenity: string) => void;
  selectedAmenities?: string[];
  onSearch: (overrides?: {
    keyword?: string;
    location?: string;
    category?: string;
    city?: string;
    amenities?: string[];
    fromModal?: boolean;
    property_purpose?: "sell" | "rent";
    max_price?: string;
    max_area?: string;
    house_type?: string;
  }) => void;
  onClose: () => void;
};

export type DeletePropertyDialogProps = {
  propertyName: string;
  onConfirm: () => void | Promise<void>;
  /** Uncontrolled: provide a trigger node and the dialog manages its own open state */
  trigger?: React.ReactNode;
  /** Controlled: provide open + onOpenChange when you manage state externally */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export type PurposeToggleProps = {
  value: "sell" | "rent";
  onChange: (value: "sell" | "rent") => void;
  sellLabel?: string;
  rentLabel?: string;
};

export type PropertyImageGalleryProps = {
  images: { image_url: string }[];
  propertyName: string;
};

export type TabItem = {
  id: string;
  label: string;
};

export type PropertySaveButtonProps = {
  propertyId: number;
};

export type PropertyTypeSwitchProps = {
  activeTab: "sell" | "rent";
  onChange: (tab: "sell" | "rent") => void;
  variant?: "header" | "sidebar";
};

export type PropertyEnquirySidebarProps = {
  property: {
    id: number;
    name: string;
    propertyFor?: string;
    propertyOwnership?: string;
    permalink?: string;
    [key: string]: any;
  };
};

export type PropertiesListingLayoutProps = {
  properties: any[];
  isLoading: boolean;
  error: string | null;
  title: string;
  breadcrumbLabel: string;
};

export type LeadChartsProps = {
  leads: import("@/types/leads").LeadChartItem[];
};

export type PropertyChartsProps = {
  properties: import("@/types/dashboard").PropertyChartItem[];
};

export type RequestInfoCardProps = {
  priceFormatted: string;
  categoryName: string;
  ownerType: string;
  property: any;
  compact?: boolean;
};

export type GalleryImage = {
  image_url: string;
};

export type PropertiesTableProps = {
  properties: import("@/types/dashboard").DashboardProperty[];
  leads: import("@/types/leads").Lead[];
  onDelete: (id: number, name: string) => void;
};

export type PaginationProps = {
  current: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
  showTotal?: boolean;
};

export type HoverViewCardProps = {
  /** The label text shown inside the following circle (default: "View") */
  label?: string;
  /** Extra classes applied to the wrapper div */
  className?: string;
  children: React.ReactNode;
};

export type SearchFilterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialKeyword: string;
  initialLocation?: string;
  initialPurpose: "sell" | "rent";
  onSearch: (filters: {
    keyword?: string;
    location?: string;
    property_purpose: "sell" | "rent";
    max_price?: string;
    max_area?: string;
    amenities?: string[];
    house_type?: string;
    category?: string;
  }) => void;
};
