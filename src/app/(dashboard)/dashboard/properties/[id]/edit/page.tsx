"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye } from "lucide-react";
import PropertyFormWizard from "@/components/property-form/PropertyFormWizard";
import { PropertyFormData } from "@/types/property";

/* Mock pre-filled data — replace with real API fetch */
const MOCK_EDIT_DATA: Record<number, Partial<PropertyFormData>> = {
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
      "A beautiful 3BHK apartment in the heart of Bengaluru with modern amenities, great connectivity, and scenic views.",
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
      "Luxurious standalone villa with a private garden, swimming pool, and dedicated parking.",
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
    amenities: ["Swimming Pool", "Garden", "Security", "Power Backup"],
    tags: ["Villa", "Luxury", "Sarjapur"],
  },
};

export default function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const propertyId = Number(id);

  const initialData = MOCK_EDIT_DATA[propertyId] ?? {};

  const handleSubmit = (data: PropertyFormData) => {
    // TODO: PATCH /api/properties/:id
    console.log("Updated property:", propertyId, data);
    router.push(`/dashboard/properties/${propertyId}`);
  };

  return (
    <div className="space-y-6">
      {/* Wizard in edit mode */}
      <PropertyFormWizard
        initialData={initialData}
        isEditMode
        onSubmit={handleSubmit}
      />
    </div>
  );
}
