import { getPropertyByPermalink, getImageUrl } from "@/lib/api";
import PropertyGallery from "@/components/shared/PropertyGallery";
import PropertyEnquirySidebar from "@/components/shared/PropertyEnquirySidebar";
import PropertySaveButton from "@/components/shared/PropertySaveButton";
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
  GraduationCap,
  Activity,
  Train,
  ShoppingBag,
  ShoppingCart,
  Trees,
  Landmark,
  Building2,
} from "lucide-react";

const getFacilityConfig = (name: string) => {
  const norm = name.toLowerCase();
  if (norm.includes("school") || norm.includes("college") || norm.includes("education")) {
    return {
      icon: <GraduationCap size={18} className="text-blue-600" />,
      bg: "bg-blue-50 border-blue-100",
    };
  }
  if (norm.includes("hospital") || norm.includes("clinic") || norm.includes("medical")) {
    return {
      icon: <Activity size={18} className="text-rose-600" />,
      bg: "bg-rose-50 border-rose-100",
    };
  }
  if (norm.includes("railway") || norm.includes("metro") || norm.includes("station") || norm.includes("train") || norm.includes("bus")) {
    return {
      icon: <Train size={18} className="text-purple-600" />,
      bg: "bg-purple-50 border-purple-100",
    };
  }
  if (norm.includes("mall") || norm.includes("shopping")) {
    return {
      icon: <ShoppingBag size={18} className="text-pink-600" />,
      bg: "bg-pink-50 border-pink-100",
    };
  }
  if (norm.includes("supermarket") || norm.includes("market") || norm.includes("grocery")) {
    return {
      icon: <ShoppingCart size={18} className="text-orange-600" />,
      bg: "bg-orange-50 border-orange-100",
    };
  }
  if (norm.includes("park") || norm.includes("garden") || norm.includes("playground")) {
    return {
      icon: <Trees size={18} className="text-emerald-600" />,
      bg: "bg-emerald-50 border-emerald-100",
    };
  }
  if (norm.includes("bank") || norm.includes("atm")) {
    return {
      icon: <Landmark size={18} className="text-amber-600" />,
      bg: "bg-amber-50 border-amber-100",
    };
  }
  return {
    icon: <Building2 size={18} className="text-slate-600" />,
    bg: "bg-slate-50 border-slate-100",
  };
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

  const allRows: [string, string][] = [];

  if (property.houseType) {
    allRows.push(["House type", formatHouseType(property.houseType)]);
  }
  if (property.constructionAge) {
    allRows.push(["Construction age", formatConstructionAge(property.constructionAge)]);
  }
  if (property.ownershipType) {
    allRows.push(["Ownership", formatCapitalize(property.ownershipType)]);
  }
  if (property.availabilityStatus) {
    const val = property.availabilityStatus === "available_from" && property.availabilityDate
      ? `Available From ${new Date(property.availabilityDate).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}`
      : formatCapitalize(property.availabilityStatus);
    allRows.push(["Possession status", val]);
  }
  if (property.furnishingType) {
    allRows.push(["Furnishing", formatCapitalize(property.furnishingType)]);
  }
  if (property.category?.type?.toLowerCase() !== "commercial" && property.waterSupply) {
    allRows.push(["Water supply", formatCapitalize(property.waterSupply)]);
  }
  if (property.parkingAvailability != null) {
    const val = property.parkingAvailability
      ? `${
          property.parkingType?.toLowerCase() === "both"
            ? "Car & Bike"
            : property.parkingType
            ? formatCapitalize(property.parkingType)
            : "Yes"
        }${
          property.parkingSlots
            ? ` (${property.parkingSlots} slots)`
            : ""
        }`
      : "No";
    allRows.push(["Parking", val]);
  }
  if (property.directionFacing) {
    allRows.push(["Direction Facing", formatCapitalize(property.directionFacing)]);
  }
  if (property.totalFloors) {
    allRows.push(["Total Floors", String(property.totalFloors)]);
  }
  if (property.propertyOnFloor != null && property.propertyOnFloor !== "") {
    allRows.push(["Property on Floor", String(property.propertyOnFloor)]);
  }
  const formatBoolean = (val: any) => {
    if (val === true || String(val).toLowerCase() === "true" || String(val).toLowerCase() === "yes") return "Yes";
    if (val === false || String(val).toLowerCase() === "false" || String(val).toLowerCase() === "no") return "No";
    return "";
  };

  if (property.balcony != null) {
    allRows.push(["Has Balcony", formatBoolean(property.balcony)]);
  }
  if (property.garden != null) {
    allRows.push(["Garden / Lawn", formatBoolean(property.garden)]);
  }
  if (property.swimmingPool != null) {
    allRows.push(["Swimming Pool", formatBoolean(property.swimmingPool)]);
  }
  if (property.cornerProperty != null) {
    allRows.push(["Corner Property", formatBoolean(property.cornerProperty)]);
  }
  if (property.compoundWall != null) {
    allRows.push(["Compound Wall", formatBoolean(property.compoundWall)]);
  }
  if (property.utilityArea != null) {
    allRows.push(["Utility Area", formatBoolean(property.utilityArea)]);
  }
  if (property.pantryArea != null) {
    allRows.push(["Pantry Area", formatBoolean(property.pantryArea)]);
  }
  if (property.loadingUnloadingFacility != null) {
    allRows.push(["Loading / Unloading", formatBoolean(property.loadingUnloadingFacility)]);
  }
  if (property.petPolicy) {
    allRows.push(["Pet Policy", property.petPolicy === "not_allowed" ? "Not Allowed" : "Allowed"]);
  }
  if (property.foodPreference) {
    allRows.push(["Food Preference", formatCapitalize(property.foodPreference)]);
  }
  if (property.propertySuitableFor) {
    allRows.push(["Suitable For", formatCapitalize(property.propertySuitableFor)]);
  }
  if (property.plotLandLength != null && Number(property.plotLandLength) > 0) {
    allRows.push(["Plot Length", `${property.plotLandLength} Ft`]);
  }
  if (property.plotLandBreadth != null && Number(property.plotLandBreadth) > 0) {
    allRows.push(["Plot Breadth", `${property.plotLandBreadth} Ft`]);
  }
  if (property.carpetArea != null && Number(property.carpetArea) > 0) {
    allRows.push(["Carpet Area", `${property.carpetArea} Sq.Ft`]);
  }
  if (property.udsArea != null && Number(property.udsArea) > 0) {
    allRows.push(["UDS Area", `${property.udsArea} Sq.Ft`]);
  }
  if (property.storageArea != null && Number(property.storageArea) > 0) {
    allRows.push(["Storage Area", `${property.storageArea} Sq.Ft`]);
  }

  const half = Math.ceil(allRows.length / 2);
  const leftRows = allRows.slice(0, half);
  const rightRows = allRows.slice(half);

  return (
    <div className="min-h-screen bg-[#f5f4f0] pb-20">
      {/* ── Gallery ── */}
      <PropertyGallery images={images} />

      {/* ── Body ── */}
      <div className="container mx-auto px-4 py-6 bg-white rounded-xl -top-16 relative">
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
            {/* <span className="flex items-center gap-1.5">
              <Eye size={15} className="text-[#1a3c6b]" />
              {property.views ?? 0} Views
            </span> */}
            <PropertySaveButton propertyId={Number(property.id)} />
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
                <DetailsColumn rows={leftRows} />
                <DetailsColumn rows={rightRows} />
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
            </div>

            {/* Nearby Key Facilities */}
            {property.propertyFacilities && property.propertyFacilities.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h2 className="text-base font-semibold text-gray-900 mb-4">
                  Nearby Key Facilities
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {property.propertyFacilities.map((item: any, i: number) => {
                    if (!item.facility) return null;
                    const config = getFacilityConfig(item.facility.name);
                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3.5 bg-gray-50/50 hover:bg-gray-50 border border-gray-100 rounded-xl transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 transition-transform group-hover:scale-105 duration-200 ${config.bg}`}>
                            {config.icon}
                          </div>
                          <span className="text-sm font-medium text-gray-800 group-hover:text-gray-900">
                            {item.facility.name}
                          </span>
                        </div>
                        {item.facilityValue && (
                          <span className="inline-block px-3 py-1 bg-white border border-gray-200 text-gray-600 rounded-full text-xs font-semibold shadow-sm shrink-0">
                            {item.facilityValue}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Brokerage */}
            {property.propertyOwnership?.toLowerCase() === "consultant" && property.brokerageType && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h2 className="text-base font-semibold text-gray-900 mb-3">
                  Brokerage details
                </h2>
                <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-medium px-4 py-2 rounded-lg">
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