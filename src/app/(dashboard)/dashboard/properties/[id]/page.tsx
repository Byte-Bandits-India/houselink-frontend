"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import PropertyFormWizard from "@/components/property-form/PropertyFormWizard";
import { PropertyFormData } from "@/types/property";

/* ─── Mock pre-filled data (same source as edit page) ─────── */
const MOCK_DATA: Record<number, Partial<PropertyFormData>> = {
  101: {
    property_for: "sell",
    owner_type: "Owner",
    property_main_type: "residential",
    property_subtype: "apartment",
    super_builtup_area: "1450",
    builtup_unit: "1",
    carpet_area: "1200",
    total_floors: "12",
    property_on_floor: "7",
    name: "Greenwood Heights Apartment",
    permalink: "greenwood-heights-apartment",
    description:
      "A beautiful 3BHK apartment in the heart of Bengaluru with modern amenities, great connectivity, and scenic views. Close to major tech parks and schools.",
    house_type: "3BHK",
    construction_age: "3-5 years",
    bedrooms: "3",
    bathrooms: "2",
    balcony: "Yes",
    furnishing_type: "Semi-Furnished",
    water_supply: "Corporation",
    food_preference: "No Restrictions",
    pet_policy: "Allowed",
    parking_availability: "Yes",
    parking_type: ["Car"],
    parking_slots_count: "1",
    price: "8500000",
    state: "Karnataka",
    city: "Bengaluru",
    area: "Whitefield",
    address: "12, Greenwood Layout, Whitefield",
    pincode: "560066",
    amenities: ["Lift", "Power Backup", "Security", "CCTV", "Gym", "Club House"],
    tags: ["Apartment", "Bengaluru", "Whitefield", "3BHK"],
  },
  102: {
    property_for: "sell",
    owner_type: "Owner",
    property_main_type: "residential",
    property_subtype: "villa",
    super_builtup_area: "3200",
    builtup_unit: "1",
    name: "Sunrise Villa",
    permalink: "sunrise-villa",
    description:
      "Luxurious standalone villa with a private garden, swimming pool, and dedicated parking. Ideal for families seeking premium living.",
    house_type: "4BHK",
    construction_age: "New Construction",
    bedrooms: "4",
    bathrooms: "4",
    garden: "Yes",
    swimming_pool: "Yes",
    furnishing_type: "Furnished",
    parking_availability: "Yes",
    price: "22000000",
    state: "Karnataka",
    city: "Bengaluru",
    area: "Sarjapur Road",
    address: "45, Palm Grove, Sarjapur",
    pincode: "560035",
    amenities: ["Swimming Pool", "Garden", "Security", "Power Backup", "CCTV"],
    tags: ["Villa", "Luxury", "Sarjapur"],
  },
};

const moderationStatus: Record<number, string> = {
  101: "approved",
  102: "pending",
  103: "approved",
};

const moderationBadge: Record<string, string> = {
  approved: "bg-blue-100 text-blue-700",
  pending:  "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700",
};

export default function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const propertyId = Number(id);

  const data = MOCK_DATA[propertyId] ?? MOCK_DATA[101];
  const modStatus = moderationStatus[propertyId] ?? "approved";
  const isPending = modStatus === "pending";

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-ink">
              {data.name || "Property Detail"}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {[data.area, data.city, data.state].filter(Boolean).join(", ")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={cn(
            "text-xs font-semibold px-3 py-1 rounded-full capitalize",
            moderationBadge[modStatus]
          )}>
            {modStatus}
          </span>
          {/* Pending listings cannot be edited */}
          {isPending && (
            <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full font-medium">
              Under Review — editing locked
            </span>
          )}
        </div>
      </div>

      {/* Wizard in view mode — fields are read-only, Edit button redirects to edit page */}
      <PropertyFormWizard
        initialData={data}
        isViewMode
        onEdit={isPending ? undefined : () => router.push(`/dashboard/properties/${propertyId}/edit`)}
      />
    </div>
  );
}
