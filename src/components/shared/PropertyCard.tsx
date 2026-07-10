import Image from 'next/image';
import { Heart, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { getImageUrl } from '@/lib/api';
import { useWishlist } from '@/context/WishlistContext';

export interface PropertyCardProps {
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
}

function getDefaultImage(categoryName?: string): string {
  if (!categoryName) return "/assets/default.png";
  const name = categoryName.toLowerCase().trim();
  if (name.includes("apartment")) {
    return "/assets/default_images/apartmentAvatar.jpg";
  }
  if (name.includes("villa")) {
    return "/assets/default_images/villaAvatar.jpg";
  }
  if (name.includes("plot")) {
    return "/assets/default_images/plotsAvatar.jpg";
  }
  if (name.includes("individual house") || name.includes("individual_house") || name.includes("house")) {
    return "/assets/default_images/houseAvatar.jpg";
  }
  if (name.includes("land")) {
    return "/assets/default_images/landAvatar.jpg";
  }
  if (name.includes("shop")) {
    return "/assets/default_images/shopAvatar.jpg";
  }
  if (name.includes("building")) {
    return "/assets/default_images/buildingAvatar.jpg";
  }
  if (name.includes("godown")) {
    return "/assets/default_images/godownAvatar.jpg";
  }
  if (name.includes("warehouse")) {
    return "/assets/default_images/warehouseAvatar.jpg";
  }
  if (name.includes("office")) {
    return "/assets/default_images/officeAvatar.jpg";
  }
  if (name.includes("commercial")) {
    return "/assets/default_images/commercialAvatar.jpg";
  }
  return "/assets/default.png";
}

export default function PropertyCard(props: PropertyCardProps) {
  const url = props.permalink ? `/properties/${props.permalink}` : `/properties/${props.id}`;
  const priceFormatted = typeof props.price === 'number'
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(props.price)
    : props.price;

  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(Number(props.id));

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(Number(props.id));
  };

  return (
    <Card className="group relative flex h-[380px] max-w-[420px] w-full flex-col overflow-hidden rounded-xl border border-gray-150 shadow-sm transition-all duration-300 hover:shadow-md bg-white">
      {/* Image container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-xl select-none image-anime">
        <Image
          src={props.image && props.image !== "/assets/blur.png" ? getImageUrl(props.image) : getDefaultImage(props.categoryName)}
          alt={props.name}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          fill
          unoptimized={true}
        />
        
        {/* Heart button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-neutral-700 hover:bg-white/90 hover:text-black shadow-sm transition-colors cursor-pointer border-none animate-none"
          type="button"
          aria-label="Add to favorites"
        >
          <Heart className={`h-4.5 w-4.5 stroke-[2px] ${wishlisted ? "fill-red-500 text-red-500" : "text-neutral-700"}`} />
        </button>

        {/* Badges on top-left */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {props.categoryName && (
            <span className="rounded-md bg-primary-light text-primary px-2.5 py-1 font-bold text-[10px] uppercase tracking-wider shadow-sm">
              {props.categoryName}
            </span>
          )}
          {props.isFeatured && (
            <span className="rounded-md bg-[#D1FAE5] text-emerald-800 px-2.5 py-1 font-bold text-[10px] uppercase tracking-wider shadow-sm">
              Featured
            </span>
          )}
        </div>
      </div>

      {/* Info Content */}
      <div className="flex flex-1 flex-col justify-between p-4 text-left">
        <div>
          <h3 className="font-extrabold text-[15px] md:text-base text-primary tracking-tight line-clamp-1">
            {props.name}
          </h3>
          <p className="text-gray-500 text-xs md:text-[13px] font-medium tracking-tight mt-1 flex items-center gap-1">
            <MapPin size={13} className="text-blue-500 flex-shrink-0" />
            <span className="truncate">{props.location}</span>
          </p>
        </div>

        {/* Footer specs and price */}
        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3 text-xs md:text-sm">
          {/* Bed/Bath specs */}
          <div className="flex items-center gap-3 text-slate-500 font-semibold text-xs md:text-[13px]">
            {props.bedrooms !== undefined && (
              <span className="flex items-center gap-1">
                <i className="fa fa-bed text-primary text-[13px]"></i> {props.bedrooms} Bed
              </span>
            )}
            {props.bathrooms !== undefined && (
              <span className="flex items-center gap-1">
                <i className="fa fa-bath text-primary text-[13px]"></i> {props.bathrooms} Bath
              </span>
            )}
          </div>
          
          {/* Price */}
          <span className="font-black text-primary text-sm md:text-base">
            {priceFormatted}
          </span>
        </div>
      </div>
    </Card>
  );
}
