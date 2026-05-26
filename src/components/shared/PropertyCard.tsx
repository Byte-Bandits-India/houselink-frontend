import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/api';

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

export default function PropertyCard(props: PropertyCardProps) {
  const url = props.permalink ? `/properties/${props.permalink}` : `/properties/${props.id}`;
  const priceFormatted = typeof props.price === 'number'
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(props.price)
    : props.price;

  return (
    <div className="custom-property-card group">
      <div className="property-card-wrapper">
        <div className="property-image-container image-anime">
          <div className="property-image">
            <Image
              src={getImageUrl(props.image)}
              alt={props.name}
              fill
              unoptimized={true}
              className="object-cover"
            />
            <Link href={url} className="property-link"></Link>

            <div className="property-overlay-top">
              <div className="property-tags">
                {props.isFeatured && <span className="tag-featured">Featured</span>}
                {props.ownership_type && <span className="tag-owner">{props.ownership_type}</span>}
                {props.property_for && <span className="tag-sell">{props.property_for}</span>}
                {!props.property_for && props.type && <span className="tag-sell capitalize">{props.type}</span>}
              </div>
              <button className="property-wishlist-btn group/btn">
                <i className={`${props.isInWishlist ? 'fa-solid' : 'fa-regular'} fa-heart text-[20px] text-black transition-colors group-hover/btn:font-black`}></i>
              </button>
            </div>

            <div className="property-overlay-bottom">
              {props.categoryName && (
                <span className="property-category-tag flex items-center gap-2">
                  {props.categoryName}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="property-details">
          <div className="property-info">
            <div className="property-specs flex items-center gap-4 text-xs font-semibold text-ink-secondary mb-3">
              {props.bedrooms !== undefined && (
                <div className="flex items-center gap-1">
                  <i className="fa fa-bed text-ink text-[14px]"></i> {props.bedrooms}
                </div>
              )}
              {props.bathrooms !== undefined && (
                <div className="flex items-center gap-1">
                  <i className="fa fa-bath text-ink text-[14px]"></i> {props.bathrooms}
                </div>
              )}
              {props.direction && (
                <div className="flex items-center gap-1">
                  <i className="fa fa-compass text-ink text-[14px]"></i> {props.direction}
                </div>
              )}
              {props.area && (
                <div className="flex items-center gap-1">
                  <i className="fa fa-ruler text-ink text-[14px]"></i> {props.area}
                </div>
              )}
            </div>

            <h5 className="property-title">{props.name}</h5>

            <div className="property-location">
              <i className="fa fa-map-marker-alt text-brand text-[16px] mr-1"></i>
              <span>{props.location}</span>
            </div>

            <div className="property-features">
              {props.features && props.features.length > 0 ? (
                props.features.slice(0, 3).map((f, i) => (
                  <span key={i} className="feature-item">
                    {f.name}
                  </span>
                ))
              ) : (
                <span className="feature-item !text-success border-success/20 bg-success/5">
                  Excellent amenities included
                </span>
              )}
            </div>

            <hr className="property-divider" />
            <div className="property-price text-brand">{priceFormatted}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
