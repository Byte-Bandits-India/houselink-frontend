"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { getUserPropertiesWithParams, deleteProperty } from "@/lib/api/properties";
import { message } from "antd";
import { Button } from "@/components/ui/button";
import { DeletePropertyDialog } from "@/components/shared/DeletePropertyDialog";
import PurposeToggle from "@/components/shared/PurposeToggle";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

type Purpose = "sell" | "rent";
type OwnerType = "owner" | "builder" | "consultant";

import type { DashboardProperty as Property } from "@/types/dashboard";

const moderationBadge: Record<string, string> = {
  approved: "bg-primary/10 text-primary border border-primary/20",
  pending:  "bg-secondary/10 text-secondary border border-secondary/20",
  rejected: "bg-gray-100 text-gray-500 border border-gray-200",
  expired:  "bg-gray-100 text-gray-500 border border-gray-200",
};

const statusBadge: Record<string, string> = {
  Selling: "bg-primary/10 text-primary border border-primary/20",
  Renting: "bg-secondary/10 text-secondary border border-secondary/20",
};

export default function ExpiredPropertiesPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [purpose,   setPurpose]   = useState<Purpose>("sell");
  const [ownerType, setOwnerType] = useState<OwnerType>("owner");
  const [propertiesList, setPropertiesList] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = user?.id;
    if (!userId) return;
    async function loadProperties() {
      try {
        setLoading(true);
        const res = await getUserPropertiesWithParams(Number(userId), { moderation: "expired" });
        if (res.success && Array.isArray(res.data)) {
          const mapped: Property[] = res.data.map((p: any) => {
            const dateObj = p.createdAt ? new Date(p.createdAt) : new Date();
            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const year = dateObj.getFullYear();
            const createdStr = `${day}-${month}-${year}`;

            const expDateObj = p.expiredAt ? new Date(p.expiredAt) : null;
            const expStr = expDateObj
              ? `${String(expDateObj.getDate()).padStart(2, '0')}-${String(expDateObj.getMonth() + 1).padStart(2, '0')}-${expDateObj.getFullYear()}`
              : "expired";

            return {
              id: p.id,
              name: p.name,
              city: p.city || "-",
              state: p.state || "-",
              views: p.views ?? 0,
              expiredAt: expStr,
              createdAt: createdStr,
              status: p.propertyFor === "sell" ? "Selling" : "Renting",
              moderationStatus: p.moderationStatus || "expired",
              purpose: p.propertyFor === "sell" ? "sell" : "rent",
              ownerType: p.propertyOwnership ? p.propertyOwnership.toLowerCase() as OwnerType : "owner",
            };
          });
          setPropertiesList(mapped);
        } else {
          message.error("Failed to load expired properties.");
        }
      } catch (err: any) {
        console.error("Failed to fetch expired properties:", err);
        message.error("Error loading expired properties. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    loadProperties();
  }, [user?.id]);

  const handleDelete = async (id: number) => {
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
    (p) => p.purpose === purpose && p.ownerType === ownerType && p.moderationStatus !== "archived"
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
      <h1 className="text-2xl font-bold text-ink">Expired Property</h1>

      {/* Sell / Rent-Lease toggle */}
      <PurposeToggle value={purpose} onChange={(val) => { setPurpose(val); setOwnerType("owner"); }} />

      {/* Owner / Builder / Consultant tabs */}
      <div className="flex border border-gray-200 rounded-lg overflow-hidden">
        {ownerTypeTabs.map((tab) => (
          <Button
            key={tab.key}
            onClick={() => setOwnerType(tab.key)}
            className={cn(
              "flex-1 py-3 text-sm font-semibold transition-colors duration-200 border-r border-gray-200 last:border-r-0 rounded-none h-auto",
              ownerType === tab.key
                ? "bg-gradient-to-r from-primary to-secondary text-white border-transparent"
                : "bg-white text-ink hover:bg-slate-50 border-transparent"
            )}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-ink-muted">
          <p className="font-medium">No expired properties found for this type.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-primary to-secondary text-white hover:bg-transparent">
                <TableHead className="text-left font-bold text-white py-3">Property Name</TableHead>
                <TableHead className="text-center font-bold text-white w-20 py-3">Views</TableHead>
                <TableHead className="text-center font-bold text-white w-24 py-3">Unique ID</TableHead>
                <TableHead className="text-center font-bold text-white w-32 py-3">Expiry Date</TableHead>
                <TableHead className="text-center font-bold text-white w-28 py-3">Created At</TableHead>
                <TableHead className="text-center font-bold text-white w-28 py-3">Status</TableHead>
                <TableHead className="text-center font-bold text-white w-28 py-3">Moderation</TableHead>
                <TableHead className="text-center font-bold text-white w-32 py-3">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p, idx) => (
                <TableRow key={p.id} className="border-b border-gray-100 hover:bg-slate-50/50 transition-colors">
                  <TableCell className="py-4">
                    <p
                      className="font-bold text-ink hover:text-brand cursor-pointer transition-colors"
                      onClick={() => router.push(`/dashboard/properties/${p.id}`)}
                    >
                      {p.name}
                    </p>
                  </TableCell>
                  <TableCell className="text-center text-ink py-4">{p.views}</TableCell>
                  <TableCell className="text-center font-bold text-ink py-4">{p.id}</TableCell>
                  <TableCell className="text-center font-bold text-slate-500 py-4">{p.expiredAt}</TableCell>
                  <TableCell className="text-center text-ink-secondary py-4">{p.createdAt}</TableCell>
                  <TableCell className="text-center py-4">
                    <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", statusBadge[p.status] || "bg-gray-100 text-gray-700")}>
                      {p.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-center py-4">
                    <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full border", moderationBadge[p.moderationStatus] || "bg-gray-100 text-gray-700")}>
                      {p.moderationStatus}
                    </span>
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="flex flex-col gap-1.5 items-center">
                      <Button
                        onClick={() => router.push(`/dashboard/properties/${p.id}/edit`)}
                        variant="gradient"
                        className="flex items-center gap-1 text-xs font-semibold text-white px-3 py-1 rounded-[50px] transition-colors w-full justify-center"
                      >
                        <Pencil className="w-3 h-3" /> Edit
                      </Button>
                      <DeletePropertyDialog
                        propertyName={p.name}
                        onConfirm={() => handleDelete(p.id)}
                        trigger={
                          <Button className="flex items-center gap-1 text-xs text-danger hover:text-white hover:bg-danger font-semibold bg-white border border-danger px-3 py-1 rounded-[50px] transition-colors w-full justify-center">
                            <Trash2 className="w-3 h-3" /> Delete
                          </Button>
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
