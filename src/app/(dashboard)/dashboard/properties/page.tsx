"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertyCharts from "@/components/shared/PropertyCharts";
import PropertiesTable from "@/components/shared/PropertiesTable";
import { useAuth } from "@/context/AuthContext";
import { getUserProperties, deleteProperty } from "@/lib/api";
import { getLeads } from "@/lib/api/leads";

/* ── Types ───────────────────────────────────────────────── */
type Purpose = "sell" | "rent_lease";
type OwnerType = "owner" | "builder" | "consultant";

import type { DashboardProperty as Property } from "@/types/dashboard";

export default function PropertiesPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [properties, setProperties] = useState<Property[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProperties = async (
    showLoadingState: boolean | React.MouseEvent<any> = true,
  ) => {
    if (!user) return;
    const shouldShow =
      showLoadingState === true || typeof showLoadingState !== "boolean";
    if (shouldShow) {
      setIsLoading(true);
      setError(null);
    }
    try {
      const res = await getUserProperties(Number(user.id));
      if (res.success && Array.isArray(res.data)) {
        const mapped: Property[] = res.data.map((p: any) => {
          // purpose: Map backend propertyFor ('sell', 'rent', 'lease') to Purpose ('sell', 'rent_lease')
          const purposeVal: Purpose =
            p.propertyFor === "sell" ? "sell" : "rent_lease";

          // ownerType: Map backend propertyOwnership ('owner', 'builder', 'consultant')
          const ownerTypeVal: OwnerType = (p.propertyOwnership?.toLowerCase() ??
            "owner") as OwnerType;

          // state
          const stateName = p.state?.name || p.state || "N/A";

          // expiredAt
          let expiredAt = "N/A";
          if (p.expiredAt) {
            try {
              expiredAt = new Date(p.expiredAt)
                .toLocaleDateString("en-GB")
                .replace(/\//g, "-");
            } catch {
              expiredAt = "N/A";
            }
          }

          // createdAt
          let createdAt = "N/A";
          if (p.createdAt) {
            try {
              createdAt = new Date(p.createdAt)
                .toLocaleDateString("en-GB")
                .replace(/\//g, "-");
            } catch {
              createdAt = "N/A";
            }
          }

          // status
          const status =
            p.propertyFor === "sell"
              ? "Selling"
              : p.propertyFor === "rent"
                ? "Renting"
                : "Leasing";

          return {
            id: p.id,
            name: p.name || "Untitled Property",
            state: stateName,
            views: p.views ?? 0,
            expiredAt,
            createdAt,
            status,
            moderationStatus: p.moderationStatus || "pending",
            purpose: purposeVal,
            ownerType: ownerTypeVal,
            categoriesId: p.categoriesId ? Number(p.categoriesId) : 1,
          };
        });
        setProperties(mapped);
      } else {
        if (shouldShow) {
          setError("Failed to parse user properties from API response.");
        }
      }

      // Fetch leads
      try {
        const leadsRes = await getLeads();
        if (leadsRes.success && Array.isArray(leadsRes.data)) {
          setLeads(leadsRes.data);
        }
      } catch (leadsErr) {
        console.error("Error fetching leads:", leadsErr);
      }
    } catch (err: any) {
      console.error("Error fetching properties:", err);
      if (shouldShow) {
        setError(
          err?.message ||
            "An unexpected error occurred while fetching properties.",
        );
      }
    } finally {
      if (shouldShow) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        loadProperties(true);
      } else {
        setIsLoading(false);
        setProperties([]);
      }
    }
  }, [user, authLoading]);

  const handleDelete = async (id: number, name: string) => {
    try {
      const res = await deleteProperty(id);
      if (res.success) {
        loadProperties();
      } else {
        alert(res.message || "Failed to delete the property listing.");
      }
    } catch (err: any) {
      console.error("Error deleting property:", err);
      alert(
        err?.message ||
          "An unexpected error occurred while deleting the property.",
      );
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 text-brand animate-spin" />
        <p className="text-sm font-semibold text-ink-muted animate-pulse">
          Loading properties...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center bg-red-50/50 rounded-2xl border border-red-100 max-w-lg mx-auto">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-ink mb-2">
          Failed to load properties
        </h3>
        <p className="text-sm text-ink-muted mb-6">{error}</p>
        <Button
          onClick={loadProperties}
          variant="gradient"
          className="px-5 py-2.5 text-white font-semibold text-sm rounded-[50px] transition-colors shadow-sm"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Title */}
      <h1 className="text-2xl font-bold text-ink">Property</h1>

      <PropertyCharts
        properties={properties.filter((p) => p.moderationStatus !== "archived")}
      />

      {/* Extracted table and filters component */}
      <PropertiesTable
        properties={properties}
        leads={leads}
        onDelete={handleDelete}
      />
    </div>
  );
}
