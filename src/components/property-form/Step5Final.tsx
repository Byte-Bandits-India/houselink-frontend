"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PropertyFormData, getSchemaFields } from "@/types/property";
import { cn } from "@/lib/utils";

interface Props {
  data: PropertyFormData;
  onChange: (patch: Partial<PropertyFormData>) => void;
  isEditMode?: boolean;
  disabled?: boolean;
}

const RadioPill = ({
  checked,
  label,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  label: string;
  onChange: () => void;
  disabled?: boolean;
}) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onChange}
    className={cn(
      "px-6 py-2.5 rounded-full border text-sm font-medium transition-all duration-200",
      checked
        ? "bg-brand text-white border-brand shadow-sm font-semibold"
        : "bg-white text-gray-600 border-blue-100 hover:border-brand hover:text-brand",
      disabled && "opacity-50 cursor-not-allowed hover:bg-white hover:text-gray-600 hover:border-blue-100"
    )}
  >
    {label}
  </button>
);

export default function Step5Final({ data, onChange, isEditMode, disabled = false }: Props) {
  const subtype = data.property_subtype || "";
  const allowedFields = getSchemaFields(data.property_for, data.owner_type, subtype);
  const isConsultant = data.owner_type === "Consultant";

  const handleDecimalInput = (field: keyof PropertyFormData, val: string) => {
    if (/^\d*\.?\d*$/.test(val)) {
      onChange({ [field]: val });
    }
  };

  return (
    <div className="space-y-6">
      {isConsultant ? (
        /* Brokerage Details for Consultant */
        allowedFields.brokerage_type && (
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
            <div className="space-y-3">
              <Label className="text-gray-700 font-medium block">
                Brokerage Type <span className="text-red-500">*</span>
              </Label>
              <div className="flex flex-wrap gap-3">
                {[
                  { value: "no_brokerage", label: "No Brokerage" },
                  { value: "fixed", label: "Fixed" },
                  { value: "percentage", label: "Percentage" },
                ].map((item) => (
                  <RadioPill
                    key={item.value}
                    disabled={disabled}
                    checked={data.brokerage_type === item.value}
                    label={item.label}
                    onChange={() =>
                      onChange({
                        brokerage_type: item.value as any,
                        brokerage_fee: "",
                        brokerage_percentage: "",
                      })
                    }
                  />
                ))}
              </div>
            </div>

            {data.brokerage_type === "fixed" && allowedFields.brokerage_fee && (
              <div className="space-y-2 pt-2 border-t border-gray-50">
                <Label className="text-gray-700 font-medium block">
                  Broker Fee <span className="text-red-500">*</span>
                </Label>
                <Input
                  disabled={disabled}
                  value={data.brokerage_fee || ""}
                  onChange={(e) => handleDecimalInput("brokerage_fee", e.target.value)}
                  placeholder="Enter amount"
                  className="rounded-xl border-gray-200 focus-visible:ring-brand max-w-xl h-11"
                />
              </div>
            )}

            {data.brokerage_type === "percentage" && allowedFields.brokerage_percentage && (
              <div className="space-y-2 pt-2 border-t border-gray-50">
                <Label className="text-gray-700 font-medium block">
                  Brokerage Percentage <span className="text-red-500">*</span>
                </Label>
                <Input
                  disabled={disabled}
                  value={data.brokerage_percentage || ""}
                  onChange={(e) => handleDecimalInput("brokerage_percentage", e.target.value)}
                  placeholder="Enter amount"
                  className="rounded-xl border-gray-200 focus-visible:ring-brand max-w-xl h-11"
                />
              </div>
            )}
          </div>
        )
      ) : (
        /* Standard SEO & Video for non-consultants */
        <>
          {/* SEO */}
          {(allowedFields.seo_title || allowedFields.seo_desc) && (
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b font-semibold text-sm text-gray-700">
                SEO Settings (Optional)
              </div>
              <div className="p-4 space-y-4">
                {allowedFields.seo_title && (
                  <div className="space-y-1.5">
                    <Label className="text-gray-700 font-medium">SEO Title</Label>
                    <Input
                      disabled={disabled}
                      value={data.seo_title || ""}
                      onChange={(e) => onChange({ seo_title: e.target.value })}
                      placeholder="e.g. 3BHK Apartment for Sale in Bengaluru – Best Price"
                      className="rounded-xl border-gray-200 focus-visible:ring-brand"
                    />
                  </div>
                )}

                {allowedFields.seo_desc && (
                  <div className="space-y-1.5">
                    <Label className="text-gray-700 font-medium">SEO Description</Label>
                    <Textarea
                      disabled={disabled}
                      value={data.seo_desc || ""}
                      onChange={(e) => onChange({ seo_desc: e.target.value })}
                      placeholder="Provide a search-engine-friendly description of the property..."
                      className="resize-none rounded-xl border-gray-200 focus-visible:ring-brand"
                      rows={3}
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label className="text-gray-700 font-medium">SEO Image</Label>
                  {data.seo_img ? (
                    <div className="relative w-40 aspect-video rounded-lg overflow-hidden border border-gray-100 shadow-sm bg-gray-50 mb-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={data.seo_img} alt="SEO Preview" className="w-full h-full object-cover" />
                      {!disabled && (
                        <button
                          type="button"
                          onClick={() => onChange({ seo_img: "" })}
                          className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-md opacity-90 transition-opacity"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className={cn(
                      "border border-dashed border-gray-200 rounded-lg p-4 text-center bg-gray-50/50 hover:border-brand/40 transition-colors cursor-pointer relative max-w-sm",
                      disabled && "opacity-60 cursor-not-allowed hover:border-gray-200 bg-gray-100"
                    )}>
                      <p className="text-xs text-gray-500 font-medium">
                        {disabled ? "No SEO cover image uploaded" : "Upload SEO Cover Image"}
                      </p>
                      {!disabled && (
                        <label className="mt-2 inline-block cursor-pointer">
                          <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                const fileUrl = URL.createObjectURL(e.target.files[0]);
                                onChange({ seo_img: fileUrl });
                              }
                            }}
                          />
                          <span className="px-3 py-1 bg-brand text-white text-xs font-semibold rounded-md hover:bg-brand/90 transition-colors">
                            Browse
                          </span>
                        </label>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Video URL & Thumbnail */}
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b font-semibold text-sm text-gray-700">
              Video Presentation (Optional)
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-1.5">
                <Label className="text-gray-700 font-medium">Property Video URL</Label>
                <Input
                  disabled={disabled}
                  value={data.video_url || ""}
                  onChange={(e) => onChange({ video_url: e.target.value })}
                  placeholder="e.g. https://youtube.com/watch?v=..."
                  className="rounded-xl border-gray-200 focus-visible:ring-brand"
                />
              </div>

              <div className="space-y-1.5 pt-2 border-t border-gray-100">
                <Label className="text-gray-700 font-medium">Video Thumbnail Image</Label>
                {data.video_thumbnail ? (
                  <div className="relative w-40 aspect-video rounded-lg overflow-hidden border border-gray-100 shadow-sm bg-gray-50 mb-2 animate-in fade-in zoom-in-95 duration-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={data.video_thumbnail} alt="Video Thumbnail Preview" className="w-full h-full object-cover" />
                    {!disabled && (
                      <button
                        type="button"
                        onClick={() => onChange({ video_thumbnail: "" })}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-md opacity-90 transition-opacity"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className={cn(
                    "border border-dashed border-gray-200 rounded-lg p-4 text-center bg-gray-50/50 hover:border-brand/40 transition-colors cursor-pointer relative max-w-sm",
                    disabled && "opacity-60 cursor-not-allowed hover:border-gray-200 bg-gray-100"
                  )}>
                    <p className="text-xs text-gray-500 font-medium">
                      {disabled ? "No custom video thumbnail image uploaded" : "Upload Custom Video Thumbnail Image"}
                    </p>
                    {!disabled && (
                      <label className="mt-2 inline-block cursor-pointer">
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const fileUrl = URL.createObjectURL(e.target.files[0]);
                              onChange({ video_thumbnail: fileUrl });
                            }
                          }}
                        />
                        <span className="px-3 py-1 bg-brand text-white text-xs font-semibold rounded-md hover:bg-brand/90 transition-colors">
                          Browse
                        </span>
                      </label>
                    )}
                  </div>
                )}
                {!data.video_url && !disabled && (
                  <p className="text-xs text-amber-500 font-medium mt-1">
                    Note: Video thumbnail requires a Property Video URL to be saved.
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
