"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Save, Send } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  PropertyFormData,
  defaultFormData,
  getSchemaFields,
} from "@/types/property";
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

import type { PropertyFormWizardProps as Props } from "@/types/property-form";

export function getMissingFields(
  stepIndex: number,
  data: PropertyFormData,
  user?: any,
  permalinkStatus: string = "idle",
): string[] {
  const missing: string[] = [];
  const subtype = data.property_subtype || "";

  if (stepIndex === 0) {
    if (!data.property_for) missing.push("Property For (Sell / Rent / Lease)");
    if (!data.owner_type)
      missing.push("Owner Type (Owner / Builder / Consultant)");
    if (!data.property_main_type)
      missing.push("Property Type (Residential / Commercial)");
    if (!subtype) missing.push("Property Subtype");

    if (data.property_for === "sell" && user) {
      const role = data.owner_type;
      const credits =
        role === "Owner"
          ? (user.creditPointsOwner ?? 0)
          : role === "Builder"
            ? (user.creditPointsBuilder ?? 0)
            : (user.creditPointsConsultant ?? 0);
      if (credits <= 0) {
        missing.push(`Active Credits (No "${role}" credits available)`);
      }
    }

    const allowedFields = getSchemaFields(
      data.property_for,
      data.owner_type,
      subtype,
    );

    const showLandPlotDetails = allowedFields.plot_area;
    const showPlotAreaRequired = [
      "villa",
      "individual_house",
      "plot",
      "land",
    ].includes(subtype);
    if (showLandPlotDetails && showPlotAreaRequired) {
      if (!data.plot_area) missing.push("Plot / Land Area");
      if (!data.area_unit) missing.push("Area Unit");
    }

    const showAreaDetails = allowedFields.super_builtup_area;
    if (showAreaDetails) {
      if (!data.super_builtup_area) missing.push("Super Built-up Area");
      if (!data.area_unit) missing.push("Area Unit");
      if (allowedFields.storage_area && !data.storage_area)
        missing.push("Storage Area");
    }

    const showFloorDetails = allowedFields.total_floors;
    const isFloorRequired = ["apartment", "building"].includes(subtype);
    if (showFloorDetails) {
      if (isFloorRequired) {
        if (!data.total_floors) missing.push("Total Floors");
        if (!data.property_on_floor) missing.push("Property on Floor");
      }
      if (data.total_floors) {
        const total = parseInt(data.total_floors, 10);
        if (!isNaN(total) && total > 100)
          missing.push("Total Floors (cannot exceed 100)");
      }
      if (data.total_floors && data.property_on_floor) {
        const total = parseInt(data.total_floors, 10);
        const onFloor = parseInt(data.property_on_floor, 10);
        if (!isNaN(total) && !isNaN(onFloor) && onFloor > total) {
          missing.push(
            "Property on Floor (cannot be greater than Total Floors)",
          );
        }
      }
    }
    return missing;
  }

  if (stepIndex === 1) {
    const allowedFields = getSchemaFields(
      data.property_for,
      data.owner_type,
      subtype,
    );
    if (allowedFields.name && !data.name?.trim()) missing.push("Property Name");
    if (allowedFields.permalink) {
      if (!data.permalink?.trim()) missing.push("Custom Permalink");
      if (permalinkStatus === "taken")
        missing.push("Custom Permalink (already taken)");
      if (permalinkStatus === "checking")
        missing.push("Custom Permalink (checking...)");
    }
    if (allowedFields.description && !data.description?.trim())
      missing.push("Description");
    if (allowedFields.house_type && !data.house_type)
      missing.push("House / BHK Type");
    if (allowedFields.bedrooms && !data.bedrooms) missing.push("Bedrooms");
    if (data.bedrooms && Number(data.bedrooms) > 10)
      missing.push("Bedrooms (cannot exceed 10)");
    if (allowedFields.bathrooms && !data.bathrooms) missing.push("Bathrooms");
    if (data.bathrooms && Number(data.bathrooms) > 10)
      missing.push("Bathrooms (cannot exceed 10)");
    if (data.parking_slots_count && Number(data.parking_slots_count) > 10)
      missing.push("Parking Slots (cannot exceed 10)");

    if (allowedFields.furnishing_type) {
      const isFurnishingRequired = [
        "apartment",
        "villa",
        "individual_house",
      ].includes(subtype);
      if (isFurnishingRequired && !data.furnishing_type)
        missing.push("Furnishing Type");
    }

    if (allowedFields.food_preference && !data.food_preference)
      missing.push("Food Preference");
    if (allowedFields.ownership_type && !data.ownership_type)
      missing.push("Ownership Type");

    if (allowedFields.property_suitable_for) {
      const isSuitableRequired =
        data.property_for === "rent_lease" || subtype === "office_space";
      if (isSuitableRequired && !data.property_suitable_for)
        missing.push("Property Suitable For");
    }

    if (allowedFields.loading_unloading_facility) {
      const isLoadingRequired =
        data.property_for === "rent_lease" &&
        ["godown", "warehouse"].includes(subtype);
      if (isLoadingRequired && !data.loading_unloading_facility)
        missing.push("Loading / Unloading Facility");
    }

    if (allowedFields.pet_policy && !data.pet_policy)
      missing.push("Pet Policy");

    if (
      allowedFields.tenant_preference &&
      (!data.tenant_preference || data.tenant_preference.length === 0)
    ) {
      missing.push("Tenant Preference");
    }

    if (allowedFields.parking_availability) {
      const isParkingRequired =
        data.property_for === "rent_lease" ||
        ["apartment", "villa", "individual_house"].includes(subtype) ||
        subtype === "office_space";
      if (isParkingRequired && !data.parking_availability)
        missing.push("Parking Availability");
    }

    if (allowedFields.rent_lease_type && !data.rent_lease_type)
      missing.push("Rent / Lease Option");

    if (allowedFields.price) {
      if (data.property_for === "rent_lease" && !data.rent_lease_type) {
        missing.push("Rent / Lease Option");
      }
      if (!data.price) {
        const priceLabel =
          data.property_for === "sell"
            ? "Price"
            : data.rent_lease_type === "lease"
              ? "Lease Amount"
              : "Rent Amount";
        missing.push(priceLabel);
      }
    }

    if (data.price && Number(data.price) > 1_000_000_000)
      missing.push("Price (cannot exceed 100 Crores)");
    if (
      data.maintenance_charge_amount &&
      Number(data.maintenance_charge_amount) > 100_000
    ) {
      missing.push("Maintenance Charge Amount (cannot exceed 1,00,000)");
    }

    if (data.rent_lease_type === "lease") {
      if (allowedFields.lease_duration && !data.lease_duration)
        missing.push("Lease Duration");
      if (
        allowedFields.maintenance_responsibility &&
        !data.maintenance_responsibility
      ) {
        missing.push("Maintenance Responsibility");
      }
    }

    if (data.rent_lease_type === "rent") {
      if (allowedFields.security_deposit && !data.security_deposit)
        missing.push("Security Deposit");
      if (
        allowedFields.maintenance_charge_status &&
        !data.maintenance_charge_status
      ) {
        missing.push("Maintenance Charges");
      }
    }

    if (allowedFields.availability_status) {
      if (!data.availability_status)
        missing.push("Possession / Availability Status");
      if (
        data.availability_status === "Available From" &&
        allowedFields.availability_date &&
        !data.availability_date
      ) {
        missing.push("Available From Date");
      }
    }
    return missing;
  }

  if (stepIndex === 2) {
    if (!data.state) missing.push("State");
    if (!data.city) missing.push("City");
    if (!data.address?.trim()) missing.push("Address / Area / Locality");
    return missing;
  }

  if (stepIndex === 3) {
    const allowedFields = getSchemaFields(
      data.property_for,
      data.owner_type,
      subtype,
    );
    if (allowedFields.direction_facing) {
      const isDirectionRequired =
        data.property_for === "sell" && subtype === "plot";
      if (isDirectionRequired && !data.direction_facing)
        missing.push("Direction Facing");
    }
    if (data.facilities && data.facilities.length > 0) {
      const hasEmptyValue = data.facilities.some(
        (f) => !f.facilityValue || !f.facilityValue.trim(),
      );
      if (hasEmptyValue) missing.push("Distance / Value for added facilities");
    }
    return missing;
  }

  if (stepIndex === 4) {
    const isConsultant = data.owner_type === "Consultant";
    if (isConsultant) {
      const allowedFields = getSchemaFields(
        data.property_for,
        data.owner_type,
        subtype,
      );
      if (allowedFields.brokerage_type) {
        if (!data.brokerage_type) missing.push("Brokerage Type");
        if (
          data.brokerage_type === "fixed" &&
          allowedFields.brokerage_fee &&
          !data.brokerage_fee
        ) {
          missing.push("Fixed Brokerage Amount");
        }
        if (
          data.brokerage_type === "percentage" &&
          allowedFields.brokerage_percentage &&
          !data.brokerage_percentage
        ) {
          missing.push("Brokerage Percentage");
        }
      }
    }
    return missing;
  }

  return missing;
}

export default function PropertyFormWizard({
  initialData,
  isEditMode = false,
  isViewMode = false,
  disabled = false,
  onSubmit,
}: Props) {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<PropertyFormData>({
    ...defaultFormData,
    ...initialData,
  });
  const [permalinkStatus, setPermalinkStatus] = useState<
    "idle" | "checking" | "available" | "taken" | "error"
  >("idle");
  const [showErrors, setShowErrors] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    const doScroll = () => {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      } catch {
        window.scrollTo(0, 0);
      }
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
      if (document.body) {
        document.body.scrollTop = 0;
      }
    };

    doScroll();
    setTimeout(doScroll, 40);
    setTimeout(doScroll, 120);
  };

  useEffect(() => {
    scrollToTop();
  }, [step]);

  const patch = (update: Partial<PropertyFormData>) => {
    if (isViewMode) return; // block edits in view mode
    setFormData((prev) => ({ ...prev, ...update }));
  };

  const isStepValid = (stepIndex: number, data: PropertyFormData): boolean => {
    if (isViewMode) return true;
    return (
      getMissingFields(stepIndex, data, user, permalinkStatus).length === 0
    );
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
    <div ref={topRef} className="space-y-6 scroll-mt-6">
      {/* ── Steps Indicator ── */}
      <div className="flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0" />
        {STEPS.map((s, i) => {
          const isDone = i < step;
          const isCurrent = i === step;
          const allowed = canNavigateToStep(i);

          return (
            <button
              key={s.label}
              type="button"
              disabled={!allowed || disabled}
              onClick={() => {
                if (allowed) {
                  setShowErrors(false);
                  setStep(i);
                  scrollToTop();
                }
              }}
              className={cn(
                "relative z-10 flex flex-col items-center gap-1.5 group transition-all",
                allowed && !disabled
                  ? "cursor-pointer"
                  : "cursor-not-allowed opacity-50",
              )}
            >
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200",
                  isDone
                    ? "bg-brand-600 text-white shadow-sm"
                    : isCurrent
                      ? "bg-brand text-white ring-4 ring-brand/20 shadow-md"
                      : "bg-gray-100 text-gray-400 border border-gray-200 group-hover:border-gray-300",
                )}
              >
                {isDone ? "✓" : i + 1}
              </div>
              <span
                className={cn(
                  "text-xs font-semibold whitespace-nowrap hidden sm:block",
                  isCurrent
                    ? "text-brand"
                    : isDone
                      ? "text-brand-700"
                      : "text-gray-400",
                )}
              >
                {s.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Step Content ── */}
      <div className="relative">
        {isViewMode && (
          <div className="absolute inset-0 z-10 rounded-2xl cursor-not-allowed" />
        )}
        <div
          className={cn(
            "rounded-2xl border border-gray-200 bg-white shadow-sm p-6 min-h-[400px]",
            (isViewMode || disabled) && "bg-gray-50/50 opacity-85",
          )}
        >
          {step === 0 && (
            <Step1BasicDetails
              data={formData}
              onChange={patch}
              disabled={isViewMode || disabled}
              showErrors={showErrors}
            />
          )}
          {step === 1 && (
            <Step2PropertyProfile
              data={formData}
              onChange={patch}
              disabled={isViewMode || disabled}
              showErrors={showErrors}
              permalinkStatus={permalinkStatus}
              onPermalinkStatusChange={setPermalinkStatus}
            />
          )}
          {step === 2 && (
            <Step3Location
              data={formData}
              onChange={patch}
              disabled={isViewMode || disabled}
              showErrors={showErrors}
            />
          )}
          {step === 3 && (
            <Step4Amenities
              data={formData}
              onChange={patch}
              disabled={isViewMode || disabled}
              showErrors={showErrors}
            />
          )}
          {step === 4 && (
            <Step5Final
              data={formData}
              onChange={patch}
              isEditMode={isEditMode}
              disabled={isViewMode || disabled}
              showErrors={showErrors}
            />
          )}
        </div>
      </div>

      {/* ── Navigation ── */}
      <div className="flex items-center justify-between mt-6">
        <button
          type="button"
          onClick={() => {
            setShowErrors(false);
            setStep((s) => Math.max(0, s - 1));
            scrollToTop();
          }}
          disabled={disabled || step === 0}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-lg border text-sm font-semibold transition-all duration-200",
            step === 0
              ? "opacity-0 pointer-events-none"
              : disabled
                ? "opacity-50 border-gray-300 text-gray-400 cursor-not-allowed"
                : "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50",
          )}
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        <span className="text-xs text-gray-400">
          {step + 1} / {STEPS.length}
        </span>

        <div className="flex items-center gap-3">
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => {
                if (isStepValid(step, formData)) {
                  setShowErrors(false);
                  setStep((s) => Math.min(STEPS.length - 1, s + 1));
                  scrollToTop();
                } else {
                  setShowErrors(true);
                  scrollToTop();
                }
              }}
              disabled={disabled}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200",
                disabled
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-brand text-white hover:bg-brand/90 shadow-sm",
              )}
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : isViewMode ? (
            <span className="text-xs text-gray-400 italic">End of listing</span>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (isStepValid(step, formData)) {
                  setShowErrors(false);
                  onSubmit?.(formData);
                } else {
                  setShowErrors(true);
                  scrollToTop();
                }
              }}
              disabled={disabled}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200",
                disabled
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-brand text-white hover:bg-brand/90 transition-colors shadow-sm",
              )}
            >
              {disabled ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Submitting...
                </span>
              ) : isEditMode ? (
                <>
                  <Save className="w-4 h-4" /> Save Changes
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Submit Listing
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
