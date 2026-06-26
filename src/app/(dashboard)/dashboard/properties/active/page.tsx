"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash2, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { getUserProperties, deleteProperty } from "@/lib/api";
import { message } from "antd";

type Purpose = "sell" | "rent";
type OwnerType = "owner" | "builder" | "consultant";

interface ActiveProperty {
  id: number;
  name: string;
  state: string;
  views: number;
  expiredAt: string;
  createdAt: string;
  status: string;
  moderationStatus: string;
  purpose: Purpose;
  ownerType: OwnerType;
}

const moderationBadge: Record<string, string> = {
  approved: "bg-blue-100 text-blue-700",
  pending:  "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700",
};

const statusBadge: Record<string, string> = {
  Selling: "bg-cyan-100 text-cyan-700",
  Renting: "bg-purple-100 text-purple-700",
};

export default function ActivePropertiesPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [purpose,   setPurpose]   = useState<Purpose>("sell");
  const [ownerType, setOwnerType] = useState<OwnerType>("owner");
  const [propertiesList, setPropertiesList] = useState<ActiveProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = user?.id;
    if (!userId) return;

    async function loadProperties() {
      try {
        setLoading(true);
        const res = await getUserProperties(Number(userId));
        if (res.success && Array.isArray(res.data)) {
          const mapped: ActiveProperty[] = res.data.map((p: any) => {
            const purposeVal: Purpose = p.propertyFor === "sell" ? "sell" : "rent";
            const ownerTypeVal: OwnerType = (p.propertyOwnership?.toLowerCase() ?? "owner") as OwnerType;
            const stateName = p.state?.name || p.state || "N/A";

            let expiredAt = "N/A";
            if (p.expiredAt) {
              try {
                expiredAt = new Date(p.expiredAt).toLocaleDateString("en-GB").replace(/\//g, "-");
              } catch {
                expiredAt = "N/A";
              }
            }

            let createdAt = "N/A";
            if (p.createdAt) {
              try {
                createdAt = new Date(p.createdAt).toLocaleDateString("en-GB").replace(/\//g, "-");
              } catch {
                createdAt = "N/A";
              }
            }

            const status = p.propertyFor === "sell" ? "Selling" : "Renting";

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
            };
          });
          setPropertiesList(mapped);
        } else {
          message.error("Failed to load active properties.");
        }
      } catch (err: any) {
        console.error("Failed to fetch active properties:", err);
        message.error("Error loading active properties. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    loadProperties();
  }, [user?.id]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this property listing?")) return;
    try {
      const res = await deleteProperty(id);
      if (res.success) {
        message.success("Property deleted successfully.");
        setPropertiesList((prev) => prev.filter((p) => p.id !== id));
      } else {
        message.error(res.message || "Failed to delete property.");
      }
    } catch (err: any) {
      console.error("Error deleting property:", err);
      message.error("An error occurred while deleting the property.");
    }
  };

  const ownerTypeTabs: { key: OwnerType; label: string }[] = [
    { key: "owner", label: "Owner" },
    ...(purpose === "sell" ? [{ key: "builder" as OwnerType, label: "Builder" }] : []),
    { key: "consultant", label: "Consultant" },
  ];

  const filtered = propertiesList.filter(
    (p) => p.purpose === purpose &&
           p.ownerType === ownerType &&
           (p.moderationStatus === "approved" || p.moderationStatus === "pending")
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Active Properties</h1>
          <p className="text-sm text-gray-500 mt-0.5">All your currently live and pending listings</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm font-semibold px-3 py-1.5 rounded-lg">
          <CheckCircle className="w-4 h-4" />
          {filtered.length} Active
        </div>
      </div>

      {/* Sell / Rent toggle */}
      <div className="flex gap-2">
        {(["sell", "rent"] as const).map((f) => (
          <button
            key={f}
            onClick={() => { setPurpose(f); setOwnerType("owner"); }}
            className={cn(
              "px-6 py-2 rounded-lg text-sm font-bold border-2 transition-colors duration-200",
              purpose === f
                ? "bg-brand border-brand text-white"
                : "bg-white border-brand text-brand hover:bg-brand hover:text-white"
            )}
          >
            {f === "sell" ? "Sell" : "Rent/Lease"}
          </button>
        ))}
      </div>

      {/* Owner type tabs */}
      <div className="flex border border-gray-200 rounded-lg overflow-hidden">
        {ownerTypeTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setOwnerType(tab.key)}
            className={cn(
              "flex-1 py-3 text-sm font-semibold transition-colors duration-200 border-r border-gray-200 last:border-r-0",
              ownerType === tab.key ? "bg-brand text-white" : "bg-white text-brand hover:bg-brand/10"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-ink-muted">
          <p className="font-medium">No active properties for this category.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand text-white">
                <th className="text-left px-4 py-3 font-semibold">Property Name</th>
                <th className="text-center px-4 py-3 font-semibold w-20">Views</th>
                <th className="text-center px-4 py-3 font-semibold w-24">Unique ID</th>
                <th className="text-center px-4 py-3 font-semibold w-32">Expiry Date</th>
                <th className="text-center px-4 py-3 font-semibold w-28">Created At</th>
                <th className="text-center px-4 py-3 font-semibold w-28">Status</th>
                <th className="text-center px-4 py-3 font-semibold w-28">Moderation</th>
                <th className="text-center px-4 py-3 font-semibold w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, idx) => (
                <tr
                  key={p.id}
                  className={cn("border-t border-gray-100", idx % 2 === 0 ? "bg-white" : "bg-gray-50")}
                >
                  <td className="px-4 py-4">
                    <p
                      className="font-bold text-ink hover:text-brand cursor-pointer transition-colors"
                      onClick={() => router.push(`/dashboard/properties/${p.id}`)}
                    >
                      {p.name}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-center text-ink">{p.views}</td>
                  <td className="px-4 py-4 text-center font-bold text-ink">{p.id}</td>
                  <td className="px-4 py-4 text-center font-bold text-emerald-600">{p.expiredAt}</td>
                  <td className="px-4 py-4 text-center text-ink-secondary">{p.createdAt}</td>
                  <td className="px-4 py-4 text-center">
                    <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", statusBadge[p.status] || "bg-gray-100 text-gray-700")}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", moderationBadge[p.moderationStatus] || "bg-gray-100 text-gray-700")}>
                      {p.moderationStatus}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1.5 items-center">
                      {p.moderationStatus === "pending" ? (
                        <button
                          onClick={() => router.push(`/dashboard/properties/${p.id}`)}
                          className="flex items-center gap-1 text-xs font-semibold border border-brand text-brand px-3 py-1.5 rounded-lg hover:bg-brand hover:text-white transition-colors w-full justify-center"
                        >
                          <Eye className="w-3 h-3" /> View
                        </button>
                      ) : (
                        <button
                          onClick={() => router.push(`/dashboard/properties/${p.id}/edit`)}
                          className="flex items-center gap-1 text-xs font-semibold border border-brand text-brand px-3 py-1.5 rounded-lg hover:bg-brand hover:text-white transition-colors w-full justify-center"
                        >
                          <Pencil className="w-3 h-3" /> Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="flex items-center gap-1 text-xs font-semibold border border-red-400 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-600 hover:text-white transition-colors w-full justify-center"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
