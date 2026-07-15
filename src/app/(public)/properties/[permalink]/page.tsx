import { getPropertyByPermalink, getImageUrl } from "@/lib/api";
import RequestInfoCard from "@/components/shared/RequestInfoCard";
import PropertyTabs from "@/components/shared/PropertyTabs";
import PropertyEnquirySidebar from "@/components/shared/PropertyEnquirySidebar";
import PropertyImageGallery from "@/components/shared/PropertyImageGallery";
import { notFound } from "next/navigation";
import React from "react";
import Link from "next/link";
import {
  Tag,
  Eye,
  MapPin,
  BedDouble,
  Bath,
  CheckCircle,
  GraduationCap,
  Activity,
  Train,
  ShoppingBag,
  ShoppingCart,
  Trees,
  Landmark,
  Building2,
} from "lucide-react";

export const dynamic = "force-dynamic";

const getFacilityConfig = (name: string) => {
  const norm = name.toLowerCase();
  if (norm.includes("school") || norm.includes("college") || norm.includes("education")) {
    return { icon: <GraduationCap size={18} className="text-blue-600" />, bg: "bg-blue-50 border-blue-100" };
  }
  if (norm.includes("hospital") || norm.includes("clinic") || norm.includes("medical")) {
    return { icon: <Activity size={18} className="text-rose-600" />, bg: "bg-rose-50 border-rose-100" };
  }
  if (norm.includes("railway") || norm.includes("metro") || norm.includes("station") || norm.includes("train") || norm.includes("bus")) {
    return { icon: <Train size={18} className="text-purple-600" />, bg: "bg-purple-50 border-purple-100" };
  }
  if (norm.includes("mall") || norm.includes("shopping")) {
    return { icon: <ShoppingBag size={18} className="text-pink-600" />, bg: "bg-pink-50 border-pink-100" };
  }
  if (norm.includes("supermarket") || norm.includes("market") || norm.includes("grocery")) {
    return { icon: <ShoppingCart size={18} className="text-orange-600" />, bg: "bg-orange-50 border-orange-100" };
  }
  if (norm.includes("park") || norm.includes("garden") || norm.includes("playground")) {
    return { icon: <Trees size={18} className="text-emerald-600" />, bg: "bg-emerald-50 border-emerald-100" };
  }
  if (norm.includes("bank") || norm.includes("atm")) {
    return { icon: <Landmark size={18} className="text-amber-600" />, bg: "bg-amber-50 border-amber-100" };
  }
  return { icon: <Building2 size={18} className="text-slate-600" />, bg: "bg-slate-50 border-slate-100" };
};

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

  const images =
    property.images && property.images.length > 0
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

  const formatHouseType = (t?: any) => {
    if (t == null) return "";
    return String(t).replace(/_/g, " ").toUpperCase();
  };

  const formatCapitalize = (s?: any) => {
    if (s == null) return "";
    return String(s)
      .replace(/_/g, " ")
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const formatConstructionAge = (a?: any) => {
    if (a == null) return "";
    return String(a).replace(/_/g, " ").replace("years ", "").replace(" plus", "+ years");
  };

  const formatBoolean = (val: any) => {
    if (val === true || String(val).toLowerCase() === "true" || String(val).toLowerCase() === "yes") return "Yes";
    if (val === false || String(val).toLowerCase() === "false" || String(val).toLowerCase() === "no") return "No";
    return "";
  };

  const features = (property.propertyFeatures || [])
    .map((pf: any) => ({ name: pf.feature?.name }))
    .filter((f: any) => !!f.name);

  const allRows: [string, string][] = [];

  if (property.houseType) allRows.push(["House type", formatHouseType(property.houseType)]);
  if (property.constructionAge) allRows.push(["Construction age", formatConstructionAge(property.constructionAge)]);
  if (property.ownershipType) allRows.push(["Ownership", formatCapitalize(property.ownershipType)]);
  if (property.availabilityStatus) {
    const val =
      property.availabilityStatus === "available_from" && property.availabilityDate
        ? `Available From ${new Date(property.availabilityDate).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}`
        : formatCapitalize(property.availabilityStatus);
    allRows.push(["Possession status", val]);
  }
  if (property.furnishingType) allRows.push(["Furnishing", formatCapitalize(property.furnishingType)]);
  if (property.category?.type?.toLowerCase() !== "commercial" && property.waterSupply)
    allRows.push(["Water supply", formatCapitalize(property.waterSupply)]);
  if (property.parkingAvailability != null) {
    const val = property.parkingAvailability
      ? `${
          property.parkingType?.toLowerCase() === "both"
            ? "Car & Bike"
            : property.parkingType
            ? formatCapitalize(property.parkingType)
            : "Yes"
        }${property.parkingSlots ? ` (${property.parkingSlots} slots)` : ""}`
      : "No";
    allRows.push(["Parking", val]);
  }
  if (property.directionFacing) allRows.push(["Direction Facing", formatCapitalize(property.directionFacing)]);
  if (property.totalFloors) allRows.push(["Total Floors", String(property.totalFloors)]);
  if (property.propertyOnFloor != null && property.propertyOnFloor !== "")
    allRows.push(["Property on Floor", String(property.propertyOnFloor)]);
  if (property.balcony != null) allRows.push(["Has Balcony", formatBoolean(property.balcony)]);
  if (property.garden != null) allRows.push(["Garden / Lawn", formatBoolean(property.garden)]);
  if (property.swimmingPool != null) allRows.push(["Swimming Pool", formatBoolean(property.swimmingPool)]);
  if (property.cornerProperty != null) allRows.push(["Corner Property", formatBoolean(property.cornerProperty)]);
  if (property.compoundWall != null) allRows.push(["Compound Wall", formatBoolean(property.compoundWall)]);
  if (property.utilityArea != null) allRows.push(["Utility Area", formatBoolean(property.utilityArea)]);
  if (property.pantryArea != null) allRows.push(["Pantry Area", formatBoolean(property.pantryArea)]);
  if (property.loadingUnloadingFacility != null)
    allRows.push(["Loading / Unloading", formatBoolean(property.loadingUnloadingFacility)]);
  if (property.petPolicy)
    allRows.push(["Pet Policy", property.petPolicy === "not_allowed" ? "Not Allowed" : "Allowed"]);
  if (property.foodPreference) allRows.push(["Food Preference", formatCapitalize(property.foodPreference)]);
  if (property.propertySuitableFor) allRows.push(["Suitable For", formatCapitalize(property.propertySuitableFor)]);
  if (property.plotLandLength != null && Number(property.plotLandLength) > 0)
    allRows.push(["Plot Length", `${property.plotLandLength} Ft`]);
  if (property.plotLandBreadth != null && Number(property.plotLandBreadth) > 0)
    allRows.push(["Plot Breadth", `${property.plotLandBreadth} Ft`]);
  if (property.carpetArea != null && Number(property.carpetArea) > 0)
    allRows.push(["Carpet Area", `${property.carpetArea} Sq.Ft`]);
  if (property.udsArea != null && Number(property.udsArea) > 0)
    allRows.push(["UDS Area", `${property.udsArea} Sq.Ft`]);
  if (property.storageArea != null && Number(property.storageArea) > 0)
    allRows.push(["Storage Area", `${property.storageArea} Sq.Ft`]);

  const half = Math.ceil(allRows.length / 2);
  const leftRows = allRows.slice(0, half);
  const rightRows = allRows.slice(half);

  return (
    <div className="min-h-screen bg-white pb-20">

      {/* ── TOP SECTION ── */}
      <div className="container mx-auto px-4 md:px-6 pt-6 pb-0">

        {/* Breadcrumbs */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center flex-wrap gap-2 text-xs md:text-sm font-medium text-ink-muted">
            {[
              { label: "Home", href: "/" },
              { label: "Properties", href: "/properties" },
              { label: property.name, href: property.permalink ? `/properties/${property.permalink}` : `/properties/${property.id}` }
            ].map((crumb, idx, arr) => {
              const isLast = idx === arr.length - 1;
              return (
                <li key={crumb.href} className="flex items-center gap-2">
                  {idx > 0 && (
                    <i className="fi fi-rr-angle-small-right text-gray-400 text-sm leading-none shrink-0"></i>
                  )}
                  {isLast ? (
                    <span className="text-ink font-semibold">{crumb.label}</span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="hover:text-primary transition-colors flex items-center gap-1.5"
                    >
                      {idx === 0 && <i className="fi fi-rr-home text-xs leading-none"></i>}
                      <span>{crumb.label}</span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* ROW 1: Left = Title + Gallery | Right = Pills + RequestInfo card */}
        <div className="flex items-start justify-between pt-4 xl:h-[90dvh] mb-0">
          <div className="flex flex-col xl:flex-row gap-6 h-[90%] w-full">
            {/* LEFT: Title + location + Gallery */}
          <div className="flex-1 min-w-0 flex flex-col xl:h-full pb-4">
            <div className="md:flex items-center justify-between">
              <div>
              {/* Title + location */}
            <h1 className="text-lg md:text-2xl lg:text-[28px] font-black text-gray-900 leading-snug tracking-tight mb-1">
              {property.name}
            </h1>
            <p className="text-sm text-gray-500 font-medium flex items-center gap-1 mb-4">
              <MapPin size={13} className="text-gray-400 shrink-0" />
              {property.location}
            </p>
            </div>

            {/* Pills row */}
            <div className="flex items-center gap-3 flex-wrap  pb-4">
              {/* Last Updated */}
              <div className="border border-gray-200 rounded-lg px-4 py-2.5 flex flex-col bg-white shadow-xs flex-1 min-w-[120px]">
                <span className="text-[10px] text-gray-400 uppercase font-semibold tracking-wide leading-none mb-1">
                  Last Updated on:
                </span>
                <span className="text-sm font-black text-gray-900 leading-none">{listedDate}</span>
              </div>
            </div>
            </div>

            {/* Gallery — uses client component for lightbox + mobile carousel */}
            <PropertyImageGallery images={images} propertyName={property.name} />
          </div>

          {/* RIGHT: Pills on top, RequestInfo card below */}
          <div className="w-full xl:w-[380px] shrink-0 flex flex-col gap-4">
            {/* Request Info card */}
            <RequestInfoCard
              priceFormatted={priceFormatted}
              categoryName={categoryName}
              ownerType={formatCapitalize(property.propertyOwnership || "Consultant")}
              property={property}
            />
          </div>
          </div>
        </div>
      </div>

      {/* Tabs — sticky top below header */}
      <PropertyTabs />

      {/* ── BODY: Two-column layout ── */}
      <div className="container mx-auto px-4 md:px-6 mt-8 pb-8">
        <div className="flex flex-col xl:flex-row gap-8 items-start">

          {/* LEFT COLUMN */}
          <div className="flex-1 min-w-0 space-y-5">

            {/* Card: Description header + specs strip */}
            <div id="overview" className="border border-gray-200 rounded-xl p-5 bg-white scroll-mt-24">
              <h2 className="font-bold text-gray-900 text-base mb-4">Description</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 border border-gray-200 rounded-xl overflow-hidden divide-x divide-gray-200">
                {property.bedrooms !== undefined && property.bedrooms !== null && (
                  <OverviewCard
                    icon={<BedDouble size={18} className="text-gray-500" />}
                    label="Bedrooms"
                    value={String(property.bedrooms)}
                  />
                )}
                {property.bathrooms !== undefined && property.bathrooms !== null && (
                  <OverviewCard
                    icon={<Bath size={18} className="text-gray-500" />}
                    label="Bathrooms"
                    value={String(property.bathrooms)}
                  />
                )}
                <OverviewCard
                  icon={<Tag size={18} className="text-gray-500" />}
                  label="Property Type"
                  value={categoryName}
                  small
                />
                <OverviewCard
                  icon={<span className="text-gray-500 font-black text-base leading-none select-none">₹</span>}
                  label="Price"
                  value={priceFormatted}
                  small
                />
              </div>
            </div>

            {/* Card: Description text */}
            {property.description && (
              <div id="description" className="border border-gray-200 rounded-xl p-5 bg-white scroll-mt-24">
                <h2 className="font-bold text-gray-900 text-base mb-3">Description</h2>
                <div
                  className="text-sm text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: property.description }}
                />
              </div>
            )}

            {/* Card: Amenities */}
            {features.length > 0 && (
              <div id="amenities" className="border border-gray-200 rounded-xl p-5 bg-white scroll-mt-24">
                <h2 className="font-bold text-gray-900 text-base mb-4">Amenities &amp; Features</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {features.map((f: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5 text-sm text-gray-700 font-medium"
                    >
                      <CheckCircle size={15} className="text-emerald-500 shrink-0" />
                      {f.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Card: Additional Information */}
            <div id="details" className="border border-gray-200 rounded-xl p-5 bg-white scroll-mt-24">
              <h2 className="font-bold text-gray-900 text-base mb-4">Additional Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
                <DetailsColumn rows={leftRows} />
                <DetailsColumn rows={rightRows} />
              </div>
            </div>

            {/* Card: Location */}
            <div id="location" className="border border-gray-200 rounded-xl p-5 bg-white scroll-mt-24">
              <h2 className="font-bold text-gray-900 text-base mb-3">Location</h2>
              <p className="text-sm text-gray-600 flex items-start gap-2">
                <MapPin size={15} className="text-gray-400 mt-0.5 shrink-0" />
                {(() => {
                  if (!property.location) return "";
                  const stateName = property.state?.name || "";
                  const cityName = property.city?.name || "";
                  const parts = property.location.split(",").map((s: string) => s.trim());
                  const cleanParts = parts.filter(
                    (part: string) =>
                      part.toLowerCase() !== stateName.toLowerCase() &&
                      part.toLowerCase() !== cityName.toLowerCase()
                  );
                  return cleanParts.join(", ") || property.location;
                })()}.
              </p>
            </div>

            {/* Card: Nearby Facilities */}
            {property.propertyFacilities && property.propertyFacilities.length > 0 && (
              <div className="border border-gray-200 rounded-xl p-5 bg-white">
                <h2 className="font-bold text-gray-900 text-base mb-4">Nearby Key Facilities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {property.propertyFacilities.map((item: any, i: number) => {
                    if (!item.facility) return null;
                    const config = getFacilityConfig(item.facility.name);
                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100/70 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center border shrink-0 ${config.bg}`}>
                            {config.icon}
                          </div>
                          <span className="text-sm font-medium text-gray-700">{item.facility.name}</span>
                        </div>
                        {item.facilityValue && (
                          <span className="px-2.5 py-1 bg-white border border-gray-200 text-gray-500 rounded-full text-xs font-semibold shrink-0">
                            {item.facilityValue}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Card: Brokerage */}
            {property.propertyOwnership?.toLowerCase() === "consultant" && property.brokerageType && (
              <div className="border border-gray-200 rounded-xl p-5 bg-white">
                <h2 className="font-bold text-gray-900 text-base mb-3">Brokerage Details</h2>
                <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-semibold px-4 py-2 rounded-lg">
                  {property.brokerageType === "no_brokerage"
                    ? "No Brokerage"
                    : property.brokerageType === "fixed" && property.brokerageFee != null
                    ? `Fixed: ₹${new Intl.NumberFormat("en-IN").format(Number(property.brokerageFee))}`
                    : property.brokerageType === "percentage" && property.brokeragePercentage != null
                    ? `Percentage: ${property.brokeragePercentage}%`
                    : formatCapitalize(property.brokerageType)}
                </span>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Sticky enquiry form */}
          <div
            id="enquiry-form"
            className="w-full xl:w-[380px] shrink-0 xl:sticky transition-[top] duration-300 ease-in-out"
            style={{ top: "var(--sticky-offset, 144px)" }}
          >
            <div className="border border-gray-200 rounded-xl bg-white shadow-xs overflow-hidden">
              <PropertyEnquirySidebar property={{ ...property, id: Number(property.id) }} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ── Helper components ── */

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
    <div className="flex flex-col items-start px-4 py-3 select-none">
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <span className="text-[10px] uppercase tracking-wide font-semibold text-gray-400">{label}</span>
      </div>
      <p className={`font-black text-gray-900 ${small ? "text-sm" : "text-base"} truncate w-full`}>
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
          className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0 text-sm"
        >
          <span className="text-gray-500">{label}</span>
          <span className="font-semibold text-gray-900 capitalize">{value}</span>
        </div>
      ))}
    </div>
  );
}