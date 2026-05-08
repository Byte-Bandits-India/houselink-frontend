"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Save, Send, Eye } from "lucide-react";
import { PropertyFormData, defaultFormData } from "@/types/property";
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
  /** Read-only view — all fields disabled, no submit button */
  isViewMode?: boolean;
  onSubmit?: (data: PropertyFormData) => void;
  /** Called when user clicks "Edit Listing" in view mode */
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

  const canGoNext = () => {
    if (isViewMode) return true; // always allow navigation in view mode
    if (step === 0) return !!formData.property_subtype && !!formData.owner_type;
    if (step === 1) return !!formData.name && !!formData.description;
    if (step === 2) return !!formData.state && !!formData.city;
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
          return (
            <div
              key={i}
              className="relative z-10 flex flex-col items-center gap-1.5 cursor-pointer"
              onClick={() => { if (done || isViewMode) setStep(i); }}
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
          {step === 4 && <Step5Final data={formData} onChange={patch} isEditMode={isEditMode || isViewMode} />}
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
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-brand text-white text-sm font-bold hover:bg-brand/90 transition-colors shadow-sm"
          >
            {isEditMode ? <><Save className="w-4 h-4" /> Save Changes</> : <><Send className="w-4 h-4" /> Submit Listing</>}
          </button>
        )}
      </div>
    </div>
  );
}
