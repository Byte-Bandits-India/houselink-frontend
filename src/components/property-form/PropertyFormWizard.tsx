"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Save, Send, Eye } from "lucide-react";
import { PropertyFormData, defaultFormData, getSchemaFields } from "@/types/property";
import Step1BasicDetails from "./Step1BasicDetails";
import Step2PropertyProfile from "./Step2PropertyProfile";
import Step3Location from "./Step3Location";
import Step4Amenities from "./Step4Amenities";
import Step5Final from "./Step5Final";

const STEPS = [
  { label: "Basic Details" },
  { label: "Property Profile" },
  { label: "Location" },
  { label: "Amenities" },
  { label: "Summary" },
];

interface Props {
  initialData?: Partial<PropertyFormData>;
  isEditMode?: boolean;
  isViewMode?: boolean;
  onSubmit?: (data: PropertyFormData) => void;
  onEdit?: () => void;
}

export default function PropertyFormWizard({
  initialData,
  isEditMode = false,
  isViewMode = false,
  onSubmit,
  onEdit,
}: Props) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<PropertyFormData>({
    ...defaultFormData,
    ...initialData,
  });

  const patch = (update: Partial<PropertyFormData>) => {
    if (isViewMode) return; // block edits in view mode
    setFormData((prev) => ({ ...prev, ...update }));
  };

  const isStepValid = (stepIndex: number, data: PropertyFormData): boolean => {
    if (isViewMode) return true;
    const subtype = data.property_subtype || "";

    if (stepIndex === 0) {
      if (!data.property_for || !data.owner_type || !data.property_main_type || !subtype) {
        return false;
      }
      const showLandPlotDetails = ["villa", "individual_house", "plot", "land"].includes(subtype);
      if (showLandPlotDetails) {
        if (!data.plot_area || !data.plot_unit) return false;
      }
      const showAreaDetails = subtype !== "plot" && subtype !== "land";
      if (showAreaDetails) {
        if (!data.super_builtup_area || !data.builtup_unit) return false;
        const showStorageArea = ["godown", "warehouse"].includes(subtype);
        if (showStorageArea && !data.storage_area) return false;
      }
      const showFloorDetails = ["apartment", "shop", "building", "godown", "warehouse", "office_space"].includes(subtype);
      const isFloorRequired = ["apartment", "building"].includes(subtype);
      if (showFloorDetails) {
        if (isFloorRequired && (!data.total_floors || !data.property_on_floor)) return false;
        if (data.total_floors && data.property_on_floor) {
          const total = parseInt(data.total_floors, 10);
          const onFloor = parseInt(data.property_on_floor, 10);
          if (!isNaN(total) && !isNaN(onFloor) && onFloor > total) return false;
        }
      }
      return true;
    }

    if (stepIndex === 1) {
      const allowedFields = getSchemaFields(data.property_for, data.owner_type, subtype);
      if (allowedFields.name && !data.name) {
        console.log("Validation failed: name is empty", data.name);
        return false;
      }
      if (allowedFields.description && !data.description) {
        console.log("Validation failed: description is empty", data.description);
        return false;
      }
      if (allowedFields.house_type && !data.house_type) {
        console.log("Validation failed: house_type is empty", data.house_type);
        return false;
      }
      if (allowedFields.bedrooms && !data.bedrooms) {
        console.log("Validation failed: bedrooms is empty", data.bedrooms);
        return false;
      }
      if (allowedFields.bathrooms && !data.bathrooms) {
        console.log("Validation failed: bathrooms is empty", data.bathrooms);
        return false;
      }
      
      if (allowedFields.furnishing_type) {
        const isFurnishingRequired = ["apartment", "villa", "individual_house"].includes(subtype);
        if (isFurnishingRequired && !data.furnishing_type) {
          console.log("Validation failed: furnishing_type is empty", data.furnishing_type);
          return false;
        }
      }
      
      if (allowedFields.food_preference && !data.food_preference) {
        console.log("Validation failed: food_preference is empty", data.food_preference);
        return false;
      }
      if (allowedFields.ownership_type && !data.ownership_type) {
        console.log("Validation failed: ownership_type is empty", data.ownership_type);
        return false;
      }
      
      if (allowedFields.property_suitable_for) {
        const isSuitableRequired = data.property_for === "rent_lease" || subtype === "office_space";
        if (isSuitableRequired && !data.property_suitable_for) {
          console.log("Validation failed: property_suitable_for is empty", data.property_suitable_for);
          return false;
        }
      }
      
      if (allowedFields.loading_unloading_facility) {
        const isLoadingRequired = data.property_for === "rent_lease" && ["godown", "warehouse"].includes(subtype);
        if (isLoadingRequired && !data.loading_unloading_facility) {
          console.log("Validation failed: loading_unloading_facility is empty", data.loading_unloading_facility);
          return false;
        }
      }
      
      if (allowedFields.pet_policy && !data.pet_policy) {
        console.log("Validation failed: pet_policy is empty", data.pet_policy);
        return false;
      }
      
      if (allowedFields.tenant_preference) {
        if (!data.tenant_preference || data.tenant_preference.length === 0) {
          console.log("Validation failed: tenant_preference is empty or 0 length", data.tenant_preference);
          return false;
        }
      }
      
      if (allowedFields.parking_availability) {
        const isParkingRequired = data.property_for === "rent_lease" || ["apartment", "villa", "individual_house"].includes(subtype) || subtype === "office_space";
        if (isParkingRequired && !data.parking_availability) {
          console.log("Validation failed: parking_availability is empty", data.parking_availability);
          return false;
        }
      }
      
      if (allowedFields.rent_lease_type && !data.rent_lease_type) {
        console.log("Validation failed: rent_lease_type is empty", data.rent_lease_type);
        return false;
      }
      
      if (allowedFields.price) {
        if (data.property_for === "rent_lease" && !data.rent_lease_type) {
          console.log("Validation failed: price: rent_lease_type is empty for rent_lease", data.rent_lease_type);
          return false;
        }
        if (!data.price) {
          console.log("Validation failed: price is empty", data.price);
          return false;
        }
      }
      
      if (data.rent_lease_type === "lease") {
        if (allowedFields.lease_duration && !data.lease_duration) {
          console.log("Validation failed: lease_duration is empty", data.lease_duration);
          return false;
        }
        if (allowedFields.maintenance_responsibility && !data.maintenance_responsibility) {
          console.log("Validation failed: maintenance_responsibility is empty", data.maintenance_responsibility);
          return false;
        }
      }
      
      if (data.rent_lease_type === "rent") {
        if (allowedFields.security_deposit && !data.security_deposit) {
          console.log("Validation failed: security_deposit is empty", data.security_deposit);
          return false;
        }
        if (allowedFields.maintenance_charge_status) {
          if (!data.maintenance_charge_status) {
            console.log("Validation failed: maintenance_charge_status is empty", data.maintenance_charge_status);
            return false;
          }
        }
      }
      
      if (allowedFields.availability_status) {
        if (!data.availability_status) {
          console.log("Validation failed: availability_status is empty", data.availability_status);
          return false;
        }
        if (data.availability_status === "Available From" && allowedFields.availability_date && !data.availability_date) {
          console.log("Validation failed: availability_date is empty for Available From", data.availability_date);
          return false;
        }
      }
      
      return true;
    }

    if (stepIndex === 2) {
      if (!data.state || !data.city || !data.address) return false;
      return true;
    }

    if (stepIndex === 3) {
      const allowedFields = getSchemaFields(data.property_for, data.owner_type, subtype);
      if (allowedFields.direction_facing) {
        const isDirectionRequired = data.property_for === "sell" && (data.owner_type === "Builder" || data.owner_type === "Consultant") && subtype === "plot";
        if (isDirectionRequired && !data.direction_facing) return false;
      }
      return true;
    }

    if (stepIndex === 4) {
      const isConsultant = data.owner_type === "Consultant";
      if (isConsultant) {
        const allowedFields = getSchemaFields(data.property_for, data.owner_type, subtype);
        if (allowedFields.brokerage_type) {
          if (!data.brokerage_type) return false;
          if (data.brokerage_type === "fixed" && allowedFields.brokerage_fee && !data.brokerage_fee) return false;
          if (data.brokerage_type === "percentage" && allowedFields.brokerage_percentage && !data.brokerage_percentage) return false;
        }
      }
      return true;
    }

    return true;
  };

  const canGoNext = () => {
    return isStepValid(step, formData);
  };

  const canNavigateToStep = (targetStep: number): boolean => {
    if (isViewMode) return true;
    if (targetStep <= step) return true; // always allowed to go backward
    // to go forward to targetStep, all steps before targetStep must be valid
    for (let j = 0; j < targetStep; j++) {
      if (!isStepValid(j, formData)) return false;
    }
    return true;
  };

  const stepLabel = isViewMode
    ? STEPS[step].label
    : isEditMode
      ? `Edit: ${STEPS[step].label}`
      : `Step ${step + 1}: ${STEPS[step].label}`;

  return (
    <div className="max-w-full mx-auto">
      {/* ── Stepper ── */}
      <div className="relative flex items-start justify-between mb-8">
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0">
          <div
            className="h-full bg-brand transition-all duration-500"
            style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
          />
        </div>
        {STEPS.map((s, i) => {
          const done = i < step;
          const active = i === step;
          const clickable = canNavigateToStep(i);
          return (
            <div
              key={i}
              className={cn(
                "relative z-10 flex flex-col items-center gap-1.5",
                clickable ? "cursor-pointer" : "cursor-not-allowed opacity-60"
              )}
              onClick={() => { if (clickable) setStep(i); }}
            >
              <div className={cn(
                "w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-300",
                done ? "bg-brand border-brand text-white"
                  : active ? "bg-white border-brand text-brand shadow-md shadow-brand/20"
                    : "bg-white border-gray-300 text-gray-400"
              )}>
                {done ? (
                  <svg viewBox="0 0 10 8" className="w-3.5 h-3 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 4l3 3 5-6" />
                  </svg>
                ) : i + 1}
              </div>
              <span className={cn(
                "text-xs font-medium hidden sm:block",
                active ? "text-brand" : done ? "text-brand/70" : "text-gray-400"
              )}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Step title ── */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">{stepLabel}</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          {step === 0 && "Property type and key dimensions."}
          {step === 1 && "Property description and pricing details."}
          {step === 2 && "Property location details."}
          {step === 3 && "Amenities and searchable tags."}
          {step === 4 && "Listing summary."}
        </p>
      </div>

      {/* ── Step content ── */}
      <div className="relative">
        {/* Read-only overlay in view mode */}
        {isViewMode && (
          <div className="absolute inset-0 z-10 rounded-2xl cursor-not-allowed" />
        )}
        <div className={cn(
          "rounded-2xl border border-gray-200 bg-white shadow-sm p-6 min-h-[400px]",
          isViewMode && "bg-gray-50/50 opacity-85"
        )}>
          {step === 0 && <Step1BasicDetails data={formData} onChange={patch} disabled={isViewMode} />}
          {step === 1 && <Step2PropertyProfile data={formData} onChange={patch} disabled={isViewMode} />}
          {step === 2 && <Step3Location data={formData} onChange={patch} disabled={isViewMode} />}
          {step === 3 && <Step4Amenities data={formData} onChange={patch} disabled={isViewMode} />}
          {step === 4 && <Step5Final data={formData} onChange={patch} isEditMode={isEditMode} disabled={isViewMode} />}
        </div>
      </div>

      {/* ── Navigation ── */}
      <div className="flex items-center justify-between mt-6">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-lg border text-sm font-semibold transition-all duration-200",
            step === 0
              ? "opacity-0 pointer-events-none"
              : "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
          )}
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        <span className="text-xs text-gray-400">{step + 1} / {STEPS.length}</span>

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
            disabled={!canGoNext()}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200",
              canGoNext()
                ? "bg-brand text-white hover:bg-brand/90 shadow-sm"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            )}
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : isViewMode ? (
          <span className="text-xs text-gray-400 italic">End of listing</span>
        ) : (
          <button
            type="button"
            onClick={() => onSubmit?.(formData)}
            disabled={!isStepValid(step, formData)}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200",
              isStepValid(step, formData)
                ? "bg-brand text-white hover:bg-brand/90 transition-colors shadow-sm"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            )}
          >
            {isEditMode ? <><Save className="w-4 h-4" /> Save Changes</> : <><Send className="w-4 h-4" /> Submit Listing</>}
          </button>
        )}
      </div>
    </div>
  );
}
