import { getPropertyByPermalink, getImageUrl } from "@/lib/api";
import PropertyGallery from "@/components/shared/PropertyGallery";
import PropertyEnquirySidebar from "@/components/shared/PropertyEnquirySidebar";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
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
} from "lucide-react";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ permalink: string }>;
}) {
  const { permalink } = await params;

  let property: any = null;
  try {
    const res = await getPropertyByPermalink(permalink);
    property = res.data;
  } catch (err) {
    console.error("Error fetching property by permalink:", err);
  }

  if (!property) return notFound();

  const images = property.images && property.images.length > 0
    ? property.images.map((img: any) => ({ image_url: getImageUrl(img.image) }))
    : [{ image_url: "/assets/images/property_images/1746276498_pexels-kamo11235-667838.jpg" }];

  const priceFormatted =
    typeof property.price === "number" || typeof property.price === "string"
      ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(Number(property.price))
      : "Contact for Price";

  const listedDate = property.createdAt
    ? new Date(property.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Recently";

  const categoryName = property.category?.name
    ? property.category.name
        .replace(/_/g, " ")
        .split(" ")
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : "Apartment";

  const areaVal = property.builtUpArea
    ? `${property.builtUpArea} Sq.Ft`
    : property.plotLandArea
    ? `${property.plotLandArea} Sq.Ft`
    : "—";

  const formatHouseType = (t?: any) => {
    if (t == null) return "";
    return String(t).replace(/_/g, " ").toUpperCase();
  };

  const formatCapitalize = (s?: any) => {
    if (s == null) return "";
    return String(s).replace(/_/g, " ").split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  };

  const formatConstructionAge = (a?: any) => {
    if (a == null) return "";
    return String(a).replace(/_/g, " ").replace("years ", "").replace(" plus", "+ years");
  };

  const features = (property.propertyFeatures || [])
    .map((pf: any) => ({ name: pf.feature?.name }))
    .filter((f: any) => !!f.name);

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
              Listed: {listedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Tag size={15} className="text-[#1a3c6b]" />
              {categoryName}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye size={15} className="text-[#1a3c6b]" />
              {property.views ?? 0} Views
            </span>
            <button className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors text-sm">
              <Heart
                size={16}
                className="text-gray-400"
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
                {property.bedrooms !== undefined && property.bedrooms !== null && (
                  <OverviewCard
                    icon={<BedDouble size={18} className="text-[#1a3c6b]" />}
                    label="Bedrooms"
                    value={String(property.bedrooms)}
                  />
                )}
                {property.bathrooms !== undefined && property.bathrooms !== null && (
                  <OverviewCard
                    icon={<Bath size={18} className="text-[#1a3c6b]" />}
                    label="Bathrooms"
                    value={String(property.bathrooms)}
                  />
                )}
                <OverviewCard
                  icon={<Tag size={18} className="text-[#1a3c6b]" />}
                  label="Property type"
                  value={categoryName}
                  small
                />
                <OverviewCard
                  icon={<Ruler size={18} className="text-[#1a3c6b]" />}
                  label="Area"
                  value={areaVal}
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
                    property.houseType && ["House type", formatHouseType(property.houseType)],
                    property.constructionAge && [
                      "Construction age",
                      formatConstructionAge(property.constructionAge),
                    ],
                    property.ownershipType && [
                      "Ownership",
                      formatCapitalize(property.ownershipType),
                    ],
                    property.availabilityStatus && [
                      "Possession status",
                      property.availabilityStatus === "available_from" && property.availabilityDate
                        ? `Available From ${new Date(property.availabilityDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}`
                        : formatCapitalize(property.availabilityStatus),
                    ],
                  ]}
                />
                <DetailsColumn
                  rows={[
                    property.furnishingType && [
                      "Furnishing",
                      formatCapitalize(property.furnishingType),
                    ],
                    property.waterSupply && [
                      "Water supply",
                      formatCapitalize(property.waterSupply),
                    ],
                    property.parkingAvailability != null && [
                      "Parking",
                      property.parkingAvailability
                        ? `${property.parkingType ? formatCapitalize(property.parkingType) : "Yes"}${property.parkingSlots
                            ? ` (${property.parkingSlots} slots)`
                            : ""
                          }`
                        : "No",
                    ],
                  ]}
                />
              </div>
            </div>

            {/* Amenities */}
            {features.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h2 className="text-base font-semibold text-gray-900 mb-4">
                  Amenities &amp; features
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {features.map((f: any, i: number) => (
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
            {property.brokerageType && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h2 className="text-base font-semibold text-gray-900 mb-3">
                  Brokerage details
                </h2>
                <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-medium px-4 py-2 rounded-lg">
                  {property.brokerageType === "no_brokerage"
                    ? "No Brokerage"
                    : formatCapitalize(property.brokerageType)}
                </span>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="lg:sticky lg:top-16 h-fit">
            <PropertyEnquirySidebar property={property} />
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