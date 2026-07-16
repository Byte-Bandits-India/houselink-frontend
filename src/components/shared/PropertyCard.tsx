import Image from 'next/image';
import { Heart, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { getImageUrl } from '@/lib/api';
import { useWishlist } from '@/context/WishlistContext';

import type { PropertyCardProps } from "@/types/components";

export type { PropertyCardProps };

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

  const getCategoryColor = (category?: string) => {
    if (!category) return "text-primary";
    const c = category.toLowerCase().trim();
    if (c.includes("plot") || c.includes("land")) return "text-amber-500";
    if (c.includes("villa")) return "text-emerald-600";
    if (c.includes("individual house") || c.includes("individual_house") || c.includes("house")) return "text-rose-500";
    if (c.includes("commercial") || c.includes("office") || c.includes("shop") || c.includes("godown") || c.includes("warehouse")) return "text-violet-600";
    if (c.includes("apartment")) return "text-sky-600";
    return "text-primary";
  };
  const getShortCategoryName = (category?: string) => {
    if (!category) return "";
    const name = category.trim();
    if (name.toLowerCase() === "individual house") return "House";
    if (name.toLowerCase() === "commercial property") return "Commercial";
    return name;
  };
  const categoryColorClass = getCategoryColor(props.categoryName);
  const displayName = getShortCategoryName(props.categoryName);

  return (
    <Card className="group relative flex h-[380px] max-w-[420px] w-full flex-col rounded-xl border border-gray-150 shadow-sm transition-all duration-300 hover:shadow-md bg-white overflow-visible">
      {/* Image container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-xl select-none image-anime">
        <Image
          src={props.image && props.image !== "/assets/blur.png" ? getImageUrl(props.image) : getDefaultImage(props.categoryName)}
          alt={props.name}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          fill
          unoptimized={true}
        />
        
        {/* Heart button - moved to bottom-right of image container to avoid ribbon clash */}
        <button
          onClick={handleWishlistClick}
          className="absolute bottom-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-neutral-700 hover:bg-white/90 hover:text-black shadow-sm transition-colors cursor-pointer border-none animate-none"
          type="button"
          aria-label="Add to favorites"
        >
          <Heart className={`h-4.5 w-4.5 stroke-[2px] ${wishlisted ? "fill-red-500 text-red-500" : "text-neutral-700"}`} />
        </button>

        {/* Badges on top-left - Featured, Owner/Builder, and Sell/Rent */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {props.isFeatured && (
            <span className="rounded-md bg-emerald-100 text-emerald-800 px-2.5 py-1 font-semibold text-[11px] md:text-xs shadow-sm">
              Featured
            </span>
          )}
          {props.type && (
            <span className="rounded-md bg-blue-100 text-blue-800 px-2.5 py-1 font-semibold text-[11px] md:text-xs shadow-sm">
              {props.type}
            </span>
          )}
          {props.property_for && (
            <span className="rounded-md bg-[#153e75] text-white px-2.5 py-1 font-semibold text-[11px] md:text-xs shadow-sm">
              {props.property_for === "For Sale" || props.property_for.toLowerCase() === "sell"
                ? "Sell"
                : props.property_for === "Rent"
                ? "Rent"
                : props.property_for === "Lease"
                ? "Lease"
                : props.property_for}
            </span>
          )}
        </div>
      </div>

      {/* Category ribbon / badge */}
      {displayName && (
        <div className={`absolute -top-3.5 right-4 z-20 select-none filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)] ${categoryColorClass}`}>
          <svg width="84" height="34" viewBox="0 0 84 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 8 0 H 76 C 80 0, 84 4, 84 8 C 80 12, 80 22, 84 26 C 84 30, 80 34, 76 34 H 8 C 4 34, 0 30, 0 26 C 4 22, 4 12, 0 8 C 0 4, 4 0, 8 0 Z" fill="currentColor" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white tracking-wider uppercase">
            {displayName}
          </span>
        </div>
      )}

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
