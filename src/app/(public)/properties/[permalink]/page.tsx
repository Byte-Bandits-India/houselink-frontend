import { mockProperties } from "@/data/mockProperties";
import PropertyGallery from "@/components/shared/PropertyGallery";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  Heart,
  Calendar,
  Tag,
  Eye,
  MapPin,
  BedDouble,
  Bath,
  Ruler,
  CheckCircle,
  Lock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ permalink: string }>;
}) {
  const { permalink } = await params;
  const property = mockProperties.find((p) => p.permalink === permalink);

  if (!property) return notFound();

  const images =
    property.images && property.images.length > 0
      ? property.images
      : [{ image_url: property.image }];

  const priceFormatted =
    typeof property.price === "number"
      ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(property.price)
      : property.price;

  return (
    <div className="min-h-screen bg-[#f5f4f0] pb-20">
      {/* ── Gallery ── */}
      <PropertyGallery images={images} />

      {/* ── Body ── */}
      <div className="container mx-auto px-4 pt-6 bg-white rounded-xl -top-16 relative">
        {/* Header card */}
        <div className="bg-white rounded-2xl p-5 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start gap-4 justify-between">
            <h1 className="text-xl md:text-4xl font-semibold text-gray-900 leading-snug flex-1">
              {property.name}
            </h1>
            <div className="bg-[#1a3c6b] text-white px-5 py-3 rounded-xl whitespace-nowrap self-start">
              <span className="text-xl font-semibold">{priceFormatted}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <Calendar size={15} className="text-[#1a3c6b]" />
              Listed: {property.created_at || "Recently"}
            </span>
            <span className="flex items-center gap-1.5">
              <Tag size={15} className="text-[#1a3c6b]" />
              {property.categoryName}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye size={15} className="text-[#1a3c6b]" />
              {property.views ?? 0} Views
            </span>
            <button className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors text-sm">
              <Heart
                size={16}
                className={
                  property.isInWishlist
                    ? "fill-red-500 text-red-500"
                    : "text-gray-400"
                }
              />
              Save
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* ── Left column ── */}
          <div className="space-y-4">
            {/* Description */}
            {property.description && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h2 className="text-base font-semibold text-gray-900 mb-3">
                  Description
                </h2>
                <div
                  className="text-sm text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: property.description }}
                />
              </div>
            )}

            {/* Overview */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900 mb-4">
                Overview
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {property.bedrooms !== undefined && (
                  <OverviewCard
                    icon={<BedDouble size={18} className="text-[#1a3c6b]" />}
                    label="Bedrooms"
                    value={String(property.bedrooms)}
                  />
                )}
                {property.bathrooms !== undefined && (
                  <OverviewCard
                    icon={<Bath size={18} className="text-[#1a3c6b]" />}
                    label="Bathrooms"
                    value={String(property.bathrooms)}
                  />
                )}
                <OverviewCard
                  icon={<Tag size={18} className="text-[#1a3c6b]" />}
                  label="Property type"
                  value={property.categoryName || "—"}
                  small
                />
                <OverviewCard
                  icon={<Ruler size={18} className="text-[#1a3c6b]" />}
                  label="Area"
                  value={property.area || "—"}
                  small
                />
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900 mb-4">
                Property details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <DetailsColumn
                  rows={[
                    property.house_type && ["House type", property.house_type],
                    property.construction_age && [
                      "Construction age",
                      property.construction_age,
                    ],
                    property.ownership_type && [
                      "Ownership",
                      property.ownership_type,
                    ],
                  ]}
                />
                <DetailsColumn
                  rows={[
                    property.furnishing_type && [
                      "Furnishing",
                      property.furnishing_type,
                    ],
                    property.water_supply && [
                      "Water supply",
                      property.water_supply,
                    ],
                    property.parking_availability && [
                      "Parking",
                      `${property.parking_availability}${property.parking_slots_count
                        ? ` (${property.parking_slots_count} slots)`
                        : ""
                      }`,
                    ],
                  ]}
                />
              </div>
            </div>

            {/* Amenities */}
            {property.features && property.features.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h2 className="text-base font-semibold text-gray-900 mb-4">
                  Amenities &amp; features
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {property.features.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5 text-sm text-gray-800"
                    >
                      <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                      {f.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900 mb-3">
                Location
              </h2>
              <div className="flex items-start gap-2.5">
                <MapPin size={18} className="text-[#1a3c6b] mt-0.5 shrink-0" />
                <p className="text-sm text-gray-700">
                  {property.location}
                  {property.city ? `, ${property.city.name}` : ""}
                  {property.state ? `, ${property.state.name}` : ""}.
                </p>
              </div>
            </div>

            {/* Brokerage */}
            {property.brokerage_type && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h2 className="text-base font-semibold text-gray-900 mb-3">
                  Brokerage details
                </h2>
                <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-medium px-4 py-2 rounded-lg">
                  {property.brokerage_type === "no_brokerage"
                    ? "No Brokerage"
                    : property.brokerage_type}
                </span>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="lg:sticky lg:top-16 h-fit">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                Login/Signup to Request Info
              </h3>

              <p className="text-xs text-gray-400 mb-1 mt-3">Property Name</p>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 mb-4">
                <span className="text-xs text-gray-500 truncate flex-1">
                  {property.name}
                </span>
                <Lock size={13} className="text-gray-400 shrink-0" />
              </div>

              <p className="text-xs text-gray-400 mb-2">Phone Number</p>
              <div className="flex gap-2 mb-3">
                <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 whitespace-nowrap">
                  🇮🇳 +91
                </div>
                <input
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 placeholder-gray-400 outline-none focus:border-[#1a3c6b] focus:bg-white transition-colors min-w-0"
                />
                <button className="bg-[#1a3c6b] hover:bg-[#142e52] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap">
                  Send OTP
                </button>
              </div>

              <div className="flex items-start gap-2 mb-4">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-0.5 accent-[#1a3c6b]"
                />
                <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed">
                  By clicking you agree to our{" "}
                  <a href="#" className="text-[#1a3c6b] underline">
                    Terms &amp; Conditions
                  </a>
                </label>
              </div>

              <button className="w-full bg-[#1a3c6b] hover:bg-[#142e52] text-white font-semibold py-3.5 rounded-xl transition-colors text-sm">
                Verify and Enquire
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Small helper components ── */

function OverviewCard({
  icon,
  label,
  value,
  small,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
      <div className="bg-white w-8 h-8 rounded-lg border border-gray-100 flex items-center justify-center mb-2">
        {icon}
      </div>
      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-0.5">
        {label}
      </p>
      <p className={`font-semibold text-gray-900 ${small ? "text-sm" : "text-base"} truncate`}>
        {value}
      </p>
    </div>
  );
}

function DetailsColumn({
  rows,
}: {
  rows: (string | false | null | undefined | [string, string])[];
}) {
  const valid = rows.filter(Boolean) as [string, string][];
  return (
    <div>
      {valid.map(([label, value], i) => (
        <div
          key={i}
          className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0 text-sm"
        >
          <span className="text-gray-500">{label}</span>
          <span className="font-medium text-gray-900 capitalize">{value}</span>
        </div>
      ))}
    </div>
  );
}