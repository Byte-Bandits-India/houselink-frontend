"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import PropertyFormWizard from "@/components/property-form/PropertyFormWizard";
import { PropertyFormData } from "@/types/property";

export default function AddPropertyPage() {
  const router = useRouter();

  const handleSubmit = (data: PropertyFormData) => {
    // TODO: POST to API
    console.log("New property submitted:", data);
    router.push("/dashboard/properties");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-ink">Add Property</h1>
          <p className="text-sm text-gray-500">
            Fill in the details below to list your property on Houselink360.
          </p>
        </div>
      </div>

      {/* Wizard */}
      <PropertyFormWizard onSubmit={handleSubmit} />
    </div>
  );
}
