"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Trash2, Plus } from "lucide-react";
import { PropertyFormData, getSchemaFields } from "@/types/property";
import { getFeatures, getFacilities } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { StepProps as Props } from "@/types/property-form";

const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <Label className="flex items-center gap-1">
    <span className="text-red-500 font-bold mr-1">*</span>
    <span>{children}</span>
    <span className="text-red-500 font-bold ml-1">*</span>
  </Label>
);

const ValidationError = ({ show, message }: { show: boolean; message: string }) => {
  if (!show) return null;
  return (
    <p className="text-red-500 text-xs font-semibold mt-1">
      {message}
    </p>
  );
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-sm font-semibold text-gray-800 mt-6 mb-3">{children}</h3>
);

const STATIC_FEATURES = [
  { id: 1, name: "Wifi" },
  { id: 2, name: "Swimming pool" },
  { id: 3, name: "Security" },
  { id: 4, name: "Garden" },
  { id: 5, name: "Balcony" },
  { id: 6, name: "Air Conditioning" },
  { id: 7, name: "Fitness center" },
  { id: 8, name: "Car Parking" },
  { id: 9, name: "Bike Parking" }
];

const STATIC_FACILITIES = [
  { id: 1, name: "School" },
  { id: 2, name: "Hospital" },
  { id: 3, name: "Railway Station" },
  { id: 4, name: "Metro Station" },
  { id: 5, name: "Shopping Mall" },
  { id: 6, name: "Supermarket" },
  { id: 7, name: "Park" },
  { id: 8, name: "Bank / ATM" }
];

const DIRECTIONS = [
  { value: "north", label: "North" },
  { value: "south", label: "South" },
  { value: "east", label: "East" },
  { value: "west", label: "West" },
  { value: "north_east", label: "North East" },
  { value: "north_west", label: "North West" },
  { value: "south_east", label: "South East" },
  { value: "south_west", label: "South West" },
];

export default function Step4Amenities({ data, onChange, disabled = false, showErrors = false }: Props) {
  const subtype = data.property_subtype || "";
  const allowedFields = getSchemaFields(data.property_for, data.owner_type, subtype);

  const isDirectionRequired =
    data.property_for === "sell" &&
    subtype === "plot";

  const [dbFeatures, setDbFeatures] = useState<Array<{ id: number; name: string }>>([]);
  const [dbFacilities, setDbFacilities] = useState<Array<{ id: number; name: string }>>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const featuresRes = await getFeatures();
        if (featuresRes.success && featuresRes.data) {
          setDbFeatures(featuresRes.data);
        }
      } catch (err) {
        console.error("Failed to fetch features:", err);
      }
      try {
        const facilitiesRes = await getFacilities();
        if (facilitiesRes.success && facilitiesRes.data) {
          setDbFacilities(facilitiesRes.data);
        }
      } catch (err) {
        console.error("Failed to fetch facilities:", err);
      }
    }
    loadData();
  }, []);

  const featuresList = dbFeatures.length > 0 ? dbFeatures : STATIC_FEATURES;
  const facilitiesList = dbFacilities.length > 0 ? dbFacilities : STATIC_FACILITIES;

  const selectedFeatures = data.features || [];
  const selectedFacilities = data.facilities || [];

  const handleToggleFeature = (featureId: number) => {
    if (disabled) return;
    const exists = selectedFeatures.some((f) => f.featureId === featureId);
    let updated;
    if (exists) {
      updated = selectedFeatures.filter((f) => f.featureId !== featureId);
    } else {
      updated = [...selectedFeatures, { featureId }];
    }
    onChange({ features: updated });
  };

  const handleAddFacility = () => {
    if (disabled) return;
    const defaultId = facilitiesList[0]?.id || 1;
    onChange({
      facilities: [...selectedFacilities, { facilityId: defaultId, facilityValue: "" }]
    });
  };

  const handleUpdateFacility = (index: number, patch: Partial<{ facilityId: number; facilityValue: string }>) => {
    if (disabled) return;
    const updated = selectedFacilities.map((f, idx) => {
      if (idx === index) {
        return { ...f, ...patch };
      }
      return f;
    });
    onChange({ facilities: updated });
  };

  const handleRemoveFacility = (index: number) => {
    if (disabled) return;
    const updated = selectedFacilities.filter((_, idx) => idx !== index);
    onChange({ facilities: updated });
  };

  return (
    <div className="space-y-6">
      {/* Nearby Key Facilities */}
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-gray-800 mt-2 mb-3">Nearby Key Facilities</h3>
        <div className="space-y-3">
          {selectedFacilities.map((fac, index) => {
            const currentVal = fac.facilityValue || "";
            const isEmpty = !currentVal.trim();
            return (
              <div key={index} className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-[200px]">
                    <Select
                      value={String(fac.facilityId)}
                      onValueChange={(v) => handleUpdateFacility(index, { facilityId: Number(v) })}
                      disabled={disabled}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Facility" />
                      </SelectTrigger>
                      <SelectContent>
                        {facilitiesList.map((f) => {
                          const isAlreadyChosen = selectedFacilities.some((sf, sIdx) => sf.facilityId === f.id && sIdx !== index);
                          return (
                            <SelectItem key={f.id} value={String(f.id)} disabled={isAlreadyChosen}>
                              {f.name} {isAlreadyChosen ? "(Already selected)" : ""}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-[2] relative">
                    <Input
                      value={currentVal}
                      onChange={(e) => {
                        const sanitized = e.target.value.replace(/[^a-zA-Z0-9\s.-]/g, "");
                        handleUpdateFacility(index, { facilityValue: sanitized.slice(0, 50) });
                      }}
                      placeholder="Distance (E.g: 200m , 1km..) from here"
                      maxLength={50}
                      disabled={disabled}
                      className={cn(
                        "pr-16",
                        isEmpty && "border-red-500 focus-visible:ring-red-500"
                      )}
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-gray-400">
                      {currentVal.length}/50
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFacility(index)}
                    disabled={disabled}
                    className={cn(
                      "p-2.5 rounded-lg border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors bg-white",
                      disabled && "cursor-not-allowed opacity-50"
                    )}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {isEmpty && (
                  <p className="text-[10px] text-red-500 font-semibold ml-1">
                    Distance is required
                  </p>
                )}
              </div>
            );
          })}

          <button
            type="button"
            onClick={handleAddFacility}
            disabled={disabled}
            className={cn(
              "flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm",
              disabled && "cursor-not-allowed opacity-50 hover:bg-white"
            )}
          >
            <Plus className="w-4 h-4" /> Add Facility
          </button>
        </div>
      </div>

      {/* Features / Amenities */}
      <div>
        <SectionTitle>Features</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {featuresList.map((f) => {
            const checked = selectedFeatures.some((sf) => sf.featureId === f.id);
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => handleToggleFeature(f.id)}
                disabled={disabled}
                className={cn(
                  "px-5 py-2.5 rounded-full border text-sm font-semibold transition-all duration-200",
                  checked
                    ? "bg-brand text-white border-brand shadow-sm"
                    : "bg-white border-gray-200 text-gray-600 hover:border-brand/50",
                  disabled && "cursor-not-allowed opacity-60"
                )}
              >
                {f.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Direction Facing */}
      {allowedFields.direction_facing && (
        <div className="space-y-1">
          <div className="mt-5 mb-2">
            {isDirectionRequired ? (
              <RequiredLabel>Direction Facing</RequiredLabel>
            ) : (
              <Label>Direction Facing</Label>
            )}
          </div>
          <Select
            value={data.direction_facing || ""}
            onValueChange={(v) => onChange({ direction_facing: v })}
            disabled={disabled}
          >
            <SelectTrigger className={cn(
              "w-full",
              showErrors && isDirectionRequired && !data.direction_facing && "border-red-500 focus:border-red-500"
            )}>
              <SelectValue placeholder="Select Direction" />
            </SelectTrigger>
            <SelectContent>
              {DIRECTIONS.map((dir) => (
                <SelectItem key={dir.value} value={dir.value}>
                  {dir.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ValidationError
            show={showErrors && isDirectionRequired && !data.direction_facing}
            message="Please select your direction facing"
          />
        </div>
      )}
    </div>
  );
}
