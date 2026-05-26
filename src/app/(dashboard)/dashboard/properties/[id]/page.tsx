"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import PropertyFormWizard from "@/components/property-form/PropertyFormWizard";
import { PropertyFormData } from "@/types/property";
import { getProperty, mapApiPayloadToFormData } from "@/lib/api";

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

  const [data, setData] = useState<PropertyFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modStatus, setModStatus] = useState<string>("pending");

  useEffect(() => {
    async function loadProperty() {
      if (isNaN(propertyId)) {
        setError("Invalid property ID.");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const res = await getProperty(propertyId);
        if (res.success && res.data) {
          const mapped = mapApiPayloadToFormData(res.data);
          setData(mapped);
          setModStatus(res.data.moderationStatus || "pending");
        } else {
          setError("Failed to fetch property details.");
        }
      } catch (err: any) {
        console.error("Error loading property:", err);
        setError(err?.message || "An unexpected error occurred while loading property details.");
      } finally {
        setIsLoading(false);
      }
    }

    loadProperty();
  }, [propertyId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 text-brand animate-spin" />
        <p className="text-sm font-semibold text-ink-muted animate-pulse">Loading property details...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center bg-red-50/50 rounded-2xl border border-red-100 max-w-lg mx-auto">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-ink mb-2">Failed to load property details</h3>
        <p className="text-sm text-ink-muted mb-6">{error || "Property not found."}</p>
        <button
          onClick={() => router.back()}
          className="px-5 py-2.5 bg-brand text-white font-semibold text-sm rounded-xl hover:bg-brand/90 transition-colors shadow-sm"
        >
          Go Back
        </button>
      </div>
    );
  }

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
            moderationBadge[modStatus] || "bg-gray-100 text-gray-700"
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

