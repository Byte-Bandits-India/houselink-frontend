"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { message } from "antd";
import { checkPermalinkAvailability } from "@/lib/api";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useFileUpload, type FileWithPreview, type FileMetadata } from "@/hooks/use-file-upload";
import { ImageIcon, UploadIcon, ZoomInIcon, XIcon } from "lucide-react";
import {
  PropertyFormData,
  HOUSE_TYPES,
  CONSTRUCTION_AGES,
  FURNISHING_TYPES,
  WATER_SUPPLY_OPTIONS,
  FOOD_PREF_OPTIONS,
  NOTICE_PERIODS,
  LEASE_DURATIONS,
  MAINTENANCE_RESP,
  OWNERSHIP_TYPES,
  getSchemaFields,
} from "@/types/property";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { Step2Props as Props } from "@/types/property-form";

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
      "px-5 py-2 rounded-full border text-sm font-medium transition-all duration-200",
      checked
        ? "bg-brand text-white border-brand shadow-sm"
        : "bg-white text-gray-600 border-gray-300 hover:border-brand hover:text-brand",
      disabled && "opacity-50 cursor-not-allowed hover:bg-white hover:text-gray-600 hover:border-gray-300"
    )}
  >
    {label}
  </button>
);

const CheckPill = ({
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
      "px-4 py-1.5 rounded-full border text-sm font-medium transition-all duration-200",
      checked
        ? "bg-brand text-white border-brand shadow-sm"
        : "bg-white text-gray-600 border-gray-300 hover:border-brand",
      disabled && "opacity-50 cursor-not-allowed hover:bg-white hover:text-gray-600"
    )}
  >
    {label}
  </button>
);

function toggleArray(arr: string[], val: string): string[] {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
}

function priceToWords(n: number): string {
  if (!n) return "";
  if (n >= 10000000) return `${(n / 10000000).toFixed(2)} Crore`;
  if (n >= 100000) return `${(n / 100000).toFixed(2)} Lakh`;
  if (n >= 1000) return `${(n / 1000).toFixed(2)} Thousand`;
  return String(n);
}

function formatNumberWithCommas(val: string | number): string {
  if (!val) return "";
  const numStr = String(val).replace(/,/g, "");
  const parts = numStr.split(".");
  let integerPart = parts[0];
  const decimalPart = parts.length > 1 ? "." + parts[1] : "";
  
  let lastThree = integerPart.substring(integerPart.length - 3);
  const otherDigits = integerPart.substring(0, integerPart.length - 3);
  if (otherDigits !== "") {
    lastThree = "," + lastThree;
  }
  const formattedInteger = otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
  return formattedInteger + decimalPart;
}

function convertNumberToWords(num: number | string): string {
  const value = typeof num === 'string' ? parseFloat(num.replace(/,/g, '')) : num;
  if (isNaN(value) || value <= 0) return "";
  
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  
  function helper(n: number): string {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "");
    return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " and " + helper(n % 100) : "");
  }

  let temp = Math.floor(value);
  let str = "";
  
  const crore = Math.floor(temp / 10000000);
  temp %= 10000000;
  
  const lakh = Math.floor(temp / 100000);
  temp %= 100000;
  
  const thousand = Math.floor(temp / 1000);
  temp %= 1000;
  
  if (crore > 0) {
    str += helper(crore) + " Crore ";
  }
  if (lakh > 0) {
    str += helper(lakh) + " Lakh ";
  }
  if (thousand > 0) {
    str += helper(thousand) + " Thousand ";
  }
  if (temp > 0) {
    str += helper(temp);
  }
  
  const trimmed = str.trim();
  if (!trimmed) return "";
  return trimmed + " Rupees Only";
}

/* ── Multi-image gallery upload (c-file-upload-4 pattern) ────── */
import type { PropertyImagesUploadProps } from "@/types/property-form";

function PropertyImagesUpload({ images, imageLimit, disabled = false, onChange }: PropertyImagesUploadProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const isInitialized = useRef(false);

  // Seed existing image URLs as FileMetadata so the hook shows them on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialFiles: FileMetadata[] = useMemo(() => images.map((url, i) => ({
    id: `existing-${i}-${url.slice(-20)}`,
    name: `image-${i + 1}.jpg`,
    size: 0,
    type: "image/jpeg",
    url,
  })), []); // intentionally empty deps — only seed once on mount

  const [
    { files, isDragging },
    { removeFile, handleDragEnter, handleDragLeave, handleDragOver, handleDrop, openFileDialog, getInputProps },
  ] = useFileUpload({
    multiple: true,
    maxFiles: imageLimit,
    maxSize: 2 * 1024 * 1024, // 2 MB
    accept: "image/jpeg,image/jpg,image/png,image/webp",
    initialFiles,
    // ⚠️ Do NOT use onFilesChange here — the hook calls it inside a setState
    // updater which triggers parent setState during render (React error).
    // We use a useEffect below instead.
  });

  // Sync files → parent AFTER render (safe, avoids setState-in-render)
  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      return; // skip initial mount — images already seeded via initialFiles
    }
    const urls = files
      .map((f) => f.preview ?? (f.file as FileMetadata).url ?? "")
      .filter(Boolean);
    onChange(urls);
  }, [files]); // eslint-disable-line react-hooks/exhaustive-deps

  const canAdd = !disabled && files.length < imageLimit;

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
      <h4 className="text-sm font-semibold text-gray-800 border-b border-gray-50 pb-2">
        Property Images{" "}
        <span className="text-gray-400 font-normal text-xs ml-1">
          (Max 2MB each, up to {imageLimit})
        </span>
      </h4>

      {/* Drag-and-drop zone — only shown when can add more */}
      {canAdd && (
        <div
          className={cn(
            "border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer",
            isDragging
              ? "border-brand bg-brand/5"
              : "border-gray-200 bg-gray-50/50 hover:border-brand/40 hover:bg-brand/5"
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input {...getInputProps()} className="sr-only" disabled={disabled} />
          <div className="flex flex-col items-center gap-3">
            <div className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
              isDragging ? "bg-brand/15 text-brand" : "bg-gray-100 text-gray-400"
            )}>
              <ImageIcon className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700">Drag & drop images here</p>
              <p className="text-xs text-gray-400">
                JPG, PNG, WEBP · Max 2MB each · {files.length}/{imageLimit} uploaded
              </p>
            </div>
            <button
              type="button"
              onClick={openFileDialog}
              className="flex items-center gap-1.5 px-4 py-2 bg-brand text-white text-xs font-semibold rounded-lg hover:bg-brand/90 transition-colors"
            >
              <UploadIcon className="h-3.5 w-3.5" />
              Browse Files
            </button>
          </div>
        </div>
      )}

      {/* Disabled empty state */}
      {disabled && files.length === 0 && (
        <div className="border border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50/50">
          <p className="text-sm text-gray-400 font-medium">No images uploaded for this listing.</p>
        </div>
      )}

      {/* Image grid */}
      {files.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {files.map((fileItem) => {
            const previewUrl = fileItem.preview ?? "";
            return (
              <div
                key={fileItem.id}
                className="group/item relative aspect-square rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt={fileItem.file.name}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover/item:scale-105"
                />
                {/* Hover overlay */}
                {!disabled && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedImage(previewUrl)}
                      className="bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full p-1.5 transition-colors"
                      title="Preview"
                    >
                      <ZoomInIcon className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFile(fileItem.id)}
                      className="bg-red-500/80 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors"
                      title="Remove"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Full-size preview dialog */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="bg-transparent border-none shadow-none p-0 sm:max-w-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={selectedImage}
              alt="Preview"
              className="rounded-xl w-full h-auto object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function Step2PropertyProfile({
  data,
  onChange,
  disabled = false,
  permalinkStatus = "idle",
  onPermalinkStatusChange,
}: Props) {
  const subtype = data.property_subtype || "";
  const allowedFields = getSchemaFields(data.property_for, data.owner_type, subtype);

  const tenantPrefs = data.tenant_preference || [];
  const parkingTypes = data.parking_type || [];

  const isConsultant = data.owner_type === "Consultant";
  const imageLimit = isConsultant ? 5 : 15;

  // Debounced Permalink Availability Check
  useEffect(() => {
    const permalink = data.permalink?.trim();
    if (!permalink) {
      onPermalinkStatusChange?.("idle");
      return;
    }

    onPermalinkStatusChange?.("idle");

    const timer = setTimeout(() => {
      onPermalinkStatusChange?.("checking");
      checkPermalinkAvailability(permalink, data.id)
        .then(res => {
          if (res.success) {
            onPermalinkStatusChange?.(res.available ? "available" : "taken");
          } else {
            onPermalinkStatusChange?.("error");
          }
        })
        .catch(() => {
          onPermalinkStatusChange?.("error");
        });
    }, 500);

    return () => clearTimeout(timer);
  }, [data.permalink, data.id, onPermalinkStatusChange]);

  const currentImagesCount = data.images?.length || 0;
  useEffect(() => {
    if (data.images && data.images.length > imageLimit) {
      const truncated = data.images.slice(0, imageLimit);
      onChange({ images: truncated });
      message.warning(`Number of images limited to ${imageLimit} for ${data.owner_type || "Owner"}.`);
    }
  }, [currentImagesCount, imageLimit, data.owner_type, onChange, data.images]);

  const handleNumberInput = (field: keyof PropertyFormData, value: string, max = 999999999) => {
    const clean = value.replace(/[^0-9]/g, "");
    const num = parseInt(clean, 10);
    if (clean !== "" && (!isNaN(num) && num > max)) return;
    onChange({ [field]: clean });
  };

  const handleDecimalInput = (field: keyof PropertyFormData, value: string) => {
    const clean = value.replace(/[^0-9.]/g, "");
    const parts = clean.split(".");
    const sanitized = parts.length > 2 ? parts[0] + "." + parts.slice(1).join("") : clean;
    if (field === "price" || field === "security_deposit" || field === "maintenance_charge_amount") {
      const sanitizedParts = sanitized.split(".");
      if (sanitizedParts[0].length > 10) return;
    }
    if (field === "brokerage_percentage") {
      const num = parseFloat(sanitized);
      if (!isNaN(num) && num > 100) return;
    }
    onChange({ [field]: sanitized });
  };

  const getTitlePlaceholder = () => {
    switch (subtype) {
      case "apartment":
        return "e.g. Greenwood Heights Apartment";
      case "villa":
        return "e.g. Luxury 4 BHK Villa in ECR";
      case "individual_house":
        return "e.g. Spacious 3 BHK Individual House in Velachery";
      case "plot":
        return "e.g. 2400 Sq.Ft Residential Plot in Tambaram";
      case "land":
        return "e.g. 2 Acres Commercial Land near Highway";
      case "shop":
        return "e.g. Commercial Shop in T-Nagar Main Road";
      case "building":
        return "e.g. Multi-storey Commercial Building in OMR";
      case "godown":
        return "e.g. Spacious Godown in Redhills";
      case "warehouse":
        return "e.g. 10,000 Sq.Ft Warehouse in Sriperumbudur";
      case "office_space":
        return "e.g. Modern Office Space in Guindy Tech Park";
      default:
        return "e.g. Greenwood Heights Apartment";
    }
  };

  return (
    <div className="space-y-4">
      {/* ─── SECTION 1: BASIC DETAILS (Name, Slug, Description) ─── */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        {allowedFields.name && (
          <div className="space-y-1.5">
            <Label className="text-gray-700 font-medium">
              Property Title <span className="text-red-500">*</span>
            </Label>
            <Input
              disabled={disabled}
              value={data.name}
              maxLength={100}
              onChange={(e) => {
                const name = e.target.value.slice(0, 100);
                const slug = name
                  .toLowerCase()
                  .trim()
                  .replace(/[^a-z0-9\s-]/g, "")
                  .replace(/\s+/g, "-");
                onChange({ name, permalink: slug });
              }}
              placeholder={getTitlePlaceholder()}
              className="rounded-xl border-gray-200 focus-visible:ring-brand"
            />
            <p className="text-xs text-gray-400 text-right">{(data.name || "").length}/100</p>
          </div>
        )}

        {allowedFields.permalink && (
          <div className="space-y-1.5">
            <Label className="text-gray-700 font-medium">
              Permalink
            </Label>
            <div className="flex items-center rounded-xl border border-gray-200 overflow-hidden shadow-sm focus-within:ring-1 focus-within:ring-brand focus-within:border-brand">
              <span className="bg-gray-50 px-3.5 py-2 text-xs font-semibold text-gray-500 border-r border-gray-200 whitespace-nowrap select-none">
                houselink360.com/properties/
              </span>
              <Input
                disabled={disabled}
                className="border-0 rounded-none focus-visible:ring-0 shadow-none h-9 py-1 px-3 text-sm"
                value={data.permalink}
                maxLength={100}
                onChange={(e) => onChange({ permalink: e.target.value.slice(0, 100).toLowerCase().replace(/[^a-z0-9-]/g, "-") })}
                placeholder="your-property-slug"
              />
            </div>
            <div className="mt-1 min-h-[18px]">
              {permalinkStatus === "checking" ? (
                <span className="text-xs text-amber-600 flex items-center gap-1.5">
                  <span className="animate-spin inline-block w-3 h-3 border-2 border-amber-600 border-t-transparent rounded-full"></span>
                  Checking availability...
                </span>
              ) : permalinkStatus === "available" ? (
                <span className="text-xs text-emerald-600 flex items-center gap-1">
                  ✓ Permalink is available
                </span>
              ) : permalinkStatus === "taken" ? (
                <span className="text-xs text-red-500 flex items-center gap-1 font-medium">
                  ✕ Already in use
                </span>
              ) : permalinkStatus === "error" ? (
                <span className="text-xs text-amber-500 flex items-center gap-1">
                  ⚠️ Error checking availability
                </span>
              ) : null}
            </div>
          </div>
        )}

        {allowedFields.description && (
          <div className="space-y-1.5">
            <Label className="text-gray-700 font-medium">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              disabled={disabled}
              rows={4}
              maxLength={2000}
              value={data.description}
              onChange={(e) => onChange({ description: e.target.value.slice(0, 2000) })}
              placeholder="Provide a detailed description of the property, key selling points, neighborhood highlights, etc..."
              className="resize-none rounded-xl border-gray-200 focus-visible:ring-brand"
            />
            <p className="text-xs text-gray-400 text-right">{(data.description || "").length}/2000</p>
          </div>
        )}
      </div>

      {/* ─── SECTION 2: SPECIFICATIONS (Grid Layout) ─── */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <h4 className="text-sm font-semibold text-gray-800 mb-4 border-b border-gray-50 pb-2">
          Property Specifications
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allowedFields.house_type && (
            <div className="space-y-1.5">
              <Label className="text-gray-700 font-medium">
                BHK Configuration (House Type) <span className="text-red-500">*</span>
              </Label>
              <Select
                disabled={disabled}
                value={data.house_type || ""}
                onValueChange={(v) => onChange({ house_type: v })}
              >
                <SelectTrigger className="rounded-xl border-gray-200">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  {HOUSE_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {allowedFields.construction_age && (
            <div className="space-y-1.5">
              <Label className="text-gray-700 font-medium">Construction Age</Label>
              <Select
                disabled={disabled}
                value={data.construction_age || ""}
                onValueChange={(v) => onChange({ construction_age: v })}
              >
                <SelectTrigger className="rounded-xl border-gray-200">
                  <SelectValue placeholder="Select Age" />
                </SelectTrigger>
                <SelectContent>
                  {CONSTRUCTION_AGES.map((a) => (
                    <SelectItem key={a} value={a}>{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {allowedFields.bedrooms && (
            <div className="space-y-1.5">
              <Label className="text-gray-700 font-medium">
                Bedrooms <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                min={0}
                max={50}
                disabled={disabled}
                value={data.bedrooms || ""}
                onChange={(e) => handleNumberInput("bedrooms", e.target.value, 50)}
                placeholder="e.g. 3"
                className="rounded-xl border-gray-200 focus-visible:ring-brand"
              />
            </div>
          )}

          {allowedFields.bathrooms && (
            <div className="space-y-1.5">
              <Label className="text-gray-700 font-medium">
                Bathrooms <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                min={0}
                max={50}
                disabled={disabled}
                value={data.bathrooms || ""}
                onChange={(e) => handleNumberInput("bathrooms", e.target.value, 50)}
                placeholder="e.g. 2"
                className="rounded-xl border-gray-200 focus-visible:ring-brand"
              />
            </div>
          )}

          {allowedFields.furnishing_type && (
            <div className="space-y-1.5">
              <Label className="text-gray-700 font-medium">
                Furnishing {["apartment", "villa", "individual_house"].includes(subtype) && <span className="text-red-500">*</span>}
              </Label>
              <Select
                disabled={disabled}
                value={data.furnishing_type || ""}
                onValueChange={(v) => onChange({ furnishing_type: v })}
              >
                <SelectTrigger className="rounded-xl border-gray-200">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  {FURNISHING_TYPES.map((f) => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {allowedFields.water_supply && (
            <div className="space-y-1.5">
              <Label className="text-gray-700 font-medium">Water Supply</Label>
              <Select
                disabled={disabled}
                value={data.water_supply || ""}
                onValueChange={(v) => onChange({ water_supply: v === "__none__" ? "" : v })}
              >
                <SelectTrigger className="rounded-xl border-gray-200">
                  <SelectValue placeholder="Select Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">
                    <span className="text-gray-400 italic">Not specified</span>
                  </SelectItem>
                  {WATER_SUPPLY_OPTIONS.map((w) => (
                    <SelectItem key={w} value={w}>{w}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {allowedFields.food_preference && (
            <div className="space-y-1.5">
              <Label className="text-gray-700 font-medium">
                Food Preference <span className="text-red-500">*</span>
              </Label>
              <Select
                disabled={disabled}
                value={data.food_preference || ""}
                onValueChange={(v) => onChange({ food_preference: v })}
              >
                <SelectTrigger className="rounded-xl border-gray-200">
                  <SelectValue placeholder="Select Preference" />
                </SelectTrigger>
                <SelectContent>
                  {FOOD_PREF_OPTIONS.map((f) => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {allowedFields.ownership_type && (
            <div className="space-y-1.5">
              <Label className="text-gray-700 font-medium">
                Ownership Type <span className="text-red-500">*</span>
              </Label>
              <Select
                disabled={disabled}
                value={data.ownership_type || ""}
                onValueChange={(v) => onChange({ ownership_type: v })}
              >
                <SelectTrigger className="rounded-xl border-gray-200">
                  <SelectValue placeholder="Select Ownership" />
                </SelectTrigger>
                <SelectContent>
                  {OWNERSHIP_TYPES.filter((o) => o !== "Company Owned" || data.property_main_type === "commercial").map((o) => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {allowedFields.property_suitable_for && (
            <div className="space-y-1.5">
              <Label className="text-gray-700 font-medium">
                Suitable For {(data.property_for === "rent_lease" || subtype === "office_space") && <span className="text-red-500">*</span>}
              </Label>
              <Input
                disabled={disabled}
                maxLength={100}
                value={data.property_suitable_for || ""}
                onChange={(e) => onChange({ property_suitable_for: e.target.value.slice(0, 100) })}
                placeholder="e.g. Office, Clinic, Restaurant, Gym"
                className="rounded-xl border-gray-200 focus-visible:ring-brand"
              />
            </div>
          )}
        </div>
      </div>

      {/* ─── SECTION 3: FEATURES & AMENITIES (Booleans / Pills) ─── */}
      {(allowedFields.balcony ||
        allowedFields.garden ||
        allowedFields.swimming_pool ||
        allowedFields.corner_property ||
        allowedFields.compound_wall ||
        allowedFields.utility_area ||
        allowedFields.pantry_area ||
        allowedFields.loading_unloading_facility ||
        allowedFields.pet_policy ||
        allowedFields.tenant_preference ||
        allowedFields.parking_availability) && (
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h4 className="text-sm font-semibold text-gray-800 border-b border-gray-50 pb-2 mb-2">
              Features & Preferences
            </h4>

            {/* Toggle button specs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allowedFields.balcony && (
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium block">Has Balcony?</Label>
                  <div className="flex gap-2">
                    {["Yes", "No"].map((v) => (
                      <RadioPill
                        key={v}
                        disabled={disabled}
                        checked={data.balcony === v}
                        label={v}
                        onChange={() => onChange({ balcony: data.balcony === v ? ("" as any) : (v as any) })}
                      />
                    ))}
                  </div>
                </div>
              )}

              {allowedFields.garden && (
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium block">Garden / Lawn?</Label>
                  <div className="flex gap-2">
                    {["Yes", "No"].map((v) => (
                      <RadioPill
                        key={v}
                        disabled={disabled}
                        checked={data.garden === v}
                        label={v}
                        onChange={() => onChange({ garden: data.garden === v ? ("" as any) : (v as any) })}
                      />
                    ))}
                  </div>
                </div>
              )}

              {allowedFields.swimming_pool && (
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium block">Swimming Pool?</Label>
                  <div className="flex gap-2">
                    {["Yes", "No"].map((v) => (
                      <RadioPill
                        key={v}
                        disabled={disabled}
                        checked={data.swimming_pool === v}
                        label={v}
                        onChange={() => onChange({ swimming_pool: data.swimming_pool === v ? ("" as any) : (v as any) })}
                      />
                    ))}
                  </div>
                </div>
              )}

              {allowedFields.corner_property && (
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium block">Corner Property?</Label>
                  <div className="flex gap-2">
                    {["Yes", "No"].map((v) => (
                      <RadioPill
                        key={v}
                        disabled={disabled}
                        checked={data.corner_property === v}
                        label={v}
                        onChange={() => onChange({ corner_property: data.corner_property === v ? ("" as any) : (v as any) })}
                      />
                    ))}
                  </div>
                </div>
              )}

              {allowedFields.compound_wall && (
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium block">Compound Wall?</Label>
                  <div className="flex gap-2">
                    {["Yes", "No"].map((v) => (
                      <RadioPill
                        key={v}
                        disabled={disabled}
                        checked={data.compound_wall === v}
                        label={v}
                        onChange={() => onChange({ compound_wall: data.compound_wall === v ? ("" as any) : (v as any) })}
                      />
                    ))}
                  </div>
                </div>
              )}

              {allowedFields.utility_area && (
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium block">Utility Area?</Label>
                  <div className="flex gap-2">
                    {["Yes", "No"].map((v) => (
                      <RadioPill
                        key={v}
                        disabled={disabled}
                        checked={data.utility_area === v}
                        label={v}
                        onChange={() => onChange({ utility_area: data.utility_area === v ? ("" as any) : (v as any) })}
                      />
                    ))}
                  </div>
                </div>
              )}

              {allowedFields.pantry_area && (
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium block">Pantry Area?</Label>
                  <div className="flex gap-2">
                    {["Yes", "No"].map((v) => (
                      <RadioPill
                        key={v}
                        disabled={disabled}
                        checked={data.pantry_area === v}
                        label={v}
                        onChange={() => onChange({ pantry_area: data.pantry_area === v ? ("" as any) : (v as any) })}
                      />
                    ))}
                  </div>
                </div>
              )}

              {allowedFields.loading_unloading_facility && (
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium block">
                    Loading/Unloading Facility? {data.property_for === "rent_lease" && (subtype === "godown" || subtype === "warehouse") && <span className="text-red-500">*</span>}
                  </Label>
                  <div className="flex gap-2">
                    {["Yes", "No"].map((v) => (
                      <RadioPill
                        key={v}
                        disabled={disabled}
                        checked={data.loading_unloading_facility === v}
                        label={v}
                        onChange={() => onChange({ loading_unloading_facility: data.loading_unloading_facility === v ? ("" as any) : (v as any) })}
                      />
                    ))}
                  </div>
                </div>
              )}

              {allowedFields.pet_policy && (
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium block">
                    Pet Policy <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2">
                    {["Allowed", "Not Allowed"].map((v) => (
                      <RadioPill
                        key={v}
                        disabled={disabled}
                        checked={data.pet_policy === v}
                        label={v}
                        onChange={() => onChange({ pet_policy: data.pet_policy === v ? ("" as any) : (v as any) })}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tenant Preferences (checkboxes) */}
            {allowedFields.tenant_preference && (
              <div className="space-y-2 pt-2">
                <Label className="text-gray-700 font-medium block">
                  Tenant Preference <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2 flex-wrap">
                  {(["shop", "building", "godown", "warehouse", "office_space", "land"].includes(subtype)
                    ? ["Individual", "Company", "Any"]
                    : ["Family", "Bachelor", "Students", "Working Professionals", "Any"]
                  ).map((t) => (
                    <CheckPill
                      key={t}
                      disabled={disabled}
                      checked={tenantPrefs.includes(t)}
                      label={t}
                      onChange={() =>
                        onChange({ tenant_preference: toggleArray(tenantPrefs, t) })
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Parking Availability Details */}
            {allowedFields.parking_availability && (
              <div className="space-y-3 pt-2 border-t border-gray-50">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium block">
                    Parking Availability {(data.property_for === "rent_lease" || ["apartment", "villa", "individual_house"].includes(subtype) || subtype === "office_space") && <span className="text-red-500">*</span>}
                  </Label>
                  <div className="flex gap-2">
                    {["Yes", "No"].map((v) => (
                      <RadioPill
                        key={v}
                        disabled={disabled}
                        checked={data.parking_availability === v}
                        label={v}
                        onChange={() =>
                          onChange({
                            parking_availability: v as any,
                            parking_type: v === "No" ? [] : data.parking_type,
                            parking_slots_count: v === "No" ? "" : data.parking_slots_count,
                          })
                        }
                      />
                    ))}
                  </div>
                </div>

                {data.parking_availability === "Yes" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    <div className="space-y-2">
                      <Label className="text-gray-700 font-medium block">Parking Type</Label>
                      <div className="flex gap-2">
                        {["Bike", "Car"].map((t) => (
                          <CheckPill
                            key={t}
                            disabled={disabled}
                            checked={parkingTypes.includes(t)}
                            label={t}
                            onChange={() =>
                              onChange({ parking_type: toggleArray(parkingTypes, t) })
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-gray-700 font-medium">No. of Slots</Label>
                      <Input
                        type="number"
                        min={1}
                        max={500}
                        disabled={disabled}
                        value={data.parking_slots_count || ""}
                        onChange={(e) => handleNumberInput("parking_slots_count", e.target.value, 500)}
                        placeholder="e.g. 2"
                        className="rounded-xl border-gray-200 focus-visible:ring-brand"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      {/* ─── SECTION 4: KEY SPECIFICATIONS ─── */}
      {allowedFields.key_specifications && (
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h4 className="text-sm font-semibold text-gray-800 border-b border-gray-50 pb-2">
            Key Specifications{" "}
            <span className="text-gray-400 font-normal text-xs ml-1">
              ({subtype === "shop" ? "Highlight key features of your shop" : 
                subtype === "office_space" ? "Highlight key features of your office" :
                ["godown", "warehouse"].includes(subtype) ? "Highlight key features of your warehouse" :
                subtype === "plot" ? "Highlight key features of your land" :
                "Highlight key features of your property"})
            </span>
          </h4>
          <div className="space-y-3">
            {(data.key_specifications && data.key_specifications.length > 0 ? data.key_specifications : [""]).map((spec, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  disabled={disabled}
                  value={spec}
                  maxLength={150}
                  onChange={(e) => {
                    const currentSpecs = data.key_specifications && data.key_specifications.length > 0
                      ? [...data.key_specifications]
                      : [""];
                    currentSpecs[index] = e.target.value.slice(0, 150);
                    onChange({ key_specifications: currentSpecs });
                  }}
                  placeholder="e.g. Double-height entrance, High ceiling, Heavy load bearing floor"
                  className="rounded-xl border-gray-200 focus-visible:ring-brand flex-1"
                />
                {((data.key_specifications || []).length > 1 || index > 0) && (
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      const currentSpecs = [...(data.key_specifications || [])];
                      const nextSpecs = currentSpecs.filter((_, i) => i !== index);
                      onChange({ key_specifications: nextSpecs.length > 0 ? nextSpecs : [""] });
                    }}
                    className="p-2.5 rounded-xl border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 transition-all duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            {!disabled && (
              <button
                type="button"
                onClick={() => {
                  const currentSpecs = data.key_specifications && data.key_specifications.length > 0
                    ? [...data.key_specifications]
                    : [""];
                  onChange({ key_specifications: [...currentSpecs, ""] });
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-dashed border-brand/40 bg-brand/5 text-brand text-xs font-semibold hover:bg-brand/10 hover:border-brand/60 transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
                Add Key Specification
              </button>
            )}
          </div>
        </div>
      )}

      {/* ─── SECTION 5: AGREEMENTS & TERMS (Rent / Lease Selection) ─── */}
      {allowedFields.rent_lease_type && (
        <div className="bg-brand/5 p-5 rounded-2xl border border-brand/10 space-y-3">
          <Label className="text-brand font-semibold text-sm block">
            Agreement Type <span className="text-red-500">*</span>
          </Label>
          <div className="flex gap-3">
            {["rent", "lease"].map((v) => (
              <RadioPill
                key={v}
                disabled={disabled}
                checked={data.rent_lease_type === v}
                label={v.charAt(0).toUpperCase() + v.slice(1)}
                onChange={() =>
                  onChange({
                    rent_lease_type: v as any,
                    price: "",
                    security_deposit: "",
                    maintenance_charge_amount: "",
                  })
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* ─── SECTION 6: PRICING DETAILS ─── */}
      {allowedFields.price && (!allowedFields.rent_lease_type || data.rent_lease_type) && (
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h4 className="text-sm font-semibold text-gray-800 border-b border-gray-50 pb-2">
            Pricing Details
          </h4>

          {data.property_for === "rent_lease" ? (
            <div className="space-y-6">
              {/* Rent / Lease Amount row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div className="space-y-1.5">
                  <Label className="text-gray-700 font-medium">
                    {data.rent_lease_type === "lease" ? "Lease Amount" : "Rent Amount"}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    disabled={disabled}
                    value={formatNumberWithCommas(data.price || "")}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/,/g, "");
                      handleDecimalInput("price", rawValue);
                    }}
                    placeholder="Enter amount (₹)"
                    className="rounded-xl border-gray-200 focus-visible:ring-brand font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-gray-500 font-medium">Amount in Words</Label>
                  <Input
                    disabled
                    value={convertNumberToWords(data.price || "")}
                    placeholder="Rupees in words"
                    className="rounded-xl border-gray-200 bg-gray-50 text-gray-500 font-medium cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Lease-Specific Fields: Lease Duration & Maintenance Paid By */}
              {data.rent_lease_type === "lease" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-50">
                  {allowedFields.lease_duration && (
                    <div className="space-y-1.5">
                      <Label className="text-gray-700 font-medium">
                        Lease Duration <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        disabled={disabled}
                        value={data.lease_duration || ""}
                        onValueChange={(v) => onChange({ lease_duration: v })}
                      >
                        <SelectTrigger className="rounded-xl border-gray-200">
                          <SelectValue placeholder="Select Duration" />
                        </SelectTrigger>
                        <SelectContent>
                          {LEASE_DURATIONS.map((d) => (
                            <SelectItem key={d} value={d}>{d}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {allowedFields.maintenance_responsibility && (
                    <div className="space-y-1.5">
                      <Label className="text-gray-700 font-medium">
                        Maintenance Paid By <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        disabled={disabled}
                        value={data.maintenance_responsibility || ""}
                        onValueChange={(v) => onChange({ maintenance_responsibility: v })}
                      >
                        <SelectTrigger className="rounded-xl border-gray-200">
                          <SelectValue placeholder="Select Party" />
                        </SelectTrigger>
                        <SelectContent>
                          {MAINTENANCE_RESP.map((r) => (
                            <SelectItem key={r} value={r}>{r}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              )}

              {/* Security Deposit (Rent Only) */}
              {data.rent_lease_type === "rent" && allowedFields.security_deposit && (
                <div className="space-y-4 pt-2 border-t border-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    <div className="space-y-1.5">
                      <Label className="text-gray-700 font-medium">
                        Security Deposit <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        disabled={disabled}
                        value={formatNumberWithCommas(data.security_deposit || "")}
                        onChange={(e) => {
                          const rawValue = e.target.value.replace(/,/g, "");
                          handleDecimalInput("security_deposit", rawValue);
                        }}
                        placeholder="Enter deposit (₹)"
                        className="rounded-xl border-gray-200 focus-visible:ring-brand font-medium"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-gray-500 font-medium">Amount in Words</Label>
                      <Input
                        disabled
                        value={convertNumberToWords(data.security_deposit || "")}
                        placeholder="Rupees in words"
                        className="rounded-xl border-gray-200 bg-gray-50 text-gray-500 font-medium cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {allowedFields.security_deposit_type && (
                    <div className="flex gap-2">
                      {["Fixed", "Negotiable"].map((v) => (
                        <RadioPill
                          key={v}
                          disabled={disabled}
                          checked={data.security_deposit_type === v}
                          label={v}
                          onChange={() => onChange({ security_deposit_type: v as any })}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Maintenance Charge (Rent Only) */}
              {data.rent_lease_type === "rent" && allowedFields.maintenance_charge_status && (
                <div className="space-y-4 pt-2 border-t border-gray-50">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium block">
                      Maintenance Charge <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2">
                      {["Yes", "No"].map((v) => (
                        <RadioPill
                          key={v}
                          disabled={disabled}
                          checked={data.maintenance_charge_status === v}
                          label={v}
                          onChange={() =>
                            onChange({
                              maintenance_charge_status: v as any,
                              maintenance_charge_amount: v === "No" ? "" : data.maintenance_charge_amount,
                            })
                          }
                        />
                      ))}
                    </div>
                  </div>

                  {data.maintenance_charge_status === "Yes" && allowedFields.maintenance_charge_amount && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                      <div className="space-y-1.5">
                        <Input
                          disabled={disabled}
                          value={formatNumberWithCommas(data.maintenance_charge_amount || "")}
                          onChange={(e) => {
                            const rawValue = e.target.value.replace(/,/g, "");
                            handleDecimalInput("maintenance_charge_amount", rawValue);
                          }}
                          placeholder="Enter amount (₹)"
                          className="rounded-xl border-gray-200 focus-visible:ring-brand font-medium"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-gray-500 font-medium">Amount in Words</Label>
                        <Input
                          disabled
                          value={convertNumberToWords(data.maintenance_charge_amount || "")}
                          placeholder="Rupees in words"
                          className="rounded-xl border-gray-200 bg-gray-50 text-gray-500 font-medium cursor-not-allowed"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Notice Period & Availability Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-50">
                {allowedFields.notice_period && (
                  <div className="space-y-1.5">
                    <Label className="text-gray-700 font-medium">Notice Period</Label>
                    <Select
                      disabled={disabled}
                      value={data.notice_period || ""}
                      onValueChange={(v) => onChange({ notice_period: v })}
                    >
                      <SelectTrigger className="rounded-xl border-gray-200">
                        <SelectValue placeholder="Select Notice" />
                      </SelectTrigger>
                      <SelectContent>
                        {NOTICE_PERIODS.map((p) => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {allowedFields.availability_status && (
                  <div className="space-y-1.5">
                    <Label className="text-gray-700 font-medium">
                      Availability <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      disabled={disabled}
                      value={data.availability_status || "Ready to Occupy"}
                      onValueChange={(v) => onChange({ availability_status: v })}
                    >
                      <SelectTrigger className="rounded-xl border-gray-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ready to Occupy">Ready to Occupy</SelectItem>
                        <SelectItem value="Available From">Available From</SelectItem>
                      </SelectContent>
                    </Select>
                    {data.availability_status === "Available From" && allowedFields.availability_date && (
                      <Input
                        type="date"
                        disabled={disabled}
                        className="rounded-xl border-gray-200 mt-2 focus-visible:ring-brand"
                        value={data.availability_date || ""}
                        onChange={(e) => onChange({ availability_date: e.target.value })}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Selling Price Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div className="space-y-1.5">
                  <Label className="text-gray-700 font-medium">
                    Selling Price <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    disabled={disabled}
                    value={formatNumberWithCommas(data.price || "")}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/,/g, "");
                      handleDecimalInput("price", rawValue);
                    }}
                    placeholder="Enter amount (₹)"
                    className="rounded-xl border-gray-200 focus-visible:ring-brand font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-gray-500 font-medium">Amount in Words</Label>
                  <Input
                    disabled
                    value={convertNumberToWords(data.price || "")}
                    placeholder="Rupees in words"
                    className="rounded-xl border-gray-200 bg-gray-50 text-gray-500 font-medium cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Availability Status for Sell */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-50">
                {allowedFields.availability_status && (
                  <div className="space-y-1.5">
                    <Label className="text-gray-700 font-medium">
                      Availability <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      disabled={disabled}
                      value={data.availability_status || "Ready to Occupy"}
                      onValueChange={(v) => onChange({ availability_status: v })}
                    >
                      <SelectTrigger className="rounded-xl border-gray-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ready to Occupy">Ready to Occupy</SelectItem>
                        <SelectItem value="Available From">Available From</SelectItem>
                      </SelectContent>
                    </Select>
                    {data.availability_status === "Available From" && allowedFields.availability_date && (
                      <Input
                        type="date"
                        disabled={disabled}
                        className="rounded-xl border-gray-200 mt-2 focus-visible:ring-brand"
                        value={data.availability_date || ""}
                        onChange={(e) => onChange({ availability_date: e.target.value })}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}


      {/* ─── SECTION 7: PROPERTY IMAGES ─── */}
      <PropertyImagesUpload
        images={data.images || []}
        imageLimit={imageLimit}
        disabled={disabled}
        onChange={(imgs) => onChange({ images: imgs })}
      />

      {/* ─── SECTION: AUTO-RENEWAL OPTIONS ─── */}
      {data.property_for === "sell" && (
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h4 className="text-sm font-semibold text-gray-800 border-b border-gray-50 pb-2">
            Auto-Renewal Options <span className="text-gray-400 font-normal text-xs ml-1">(Optional)</span>
          </h4>
          <div className="flex flex-col sm:flex-row gap-4 pt-1">
            <div
              onClick={() => {
                if (disabled) return;
                const nextVal = !data.renew_24_hours;
                onChange({
                  renew_24_hours: nextVal,
                  renew_30_days: false,
                });
              }}
              className={cn(
                "flex items-start gap-3 p-3.5 rounded-xl border transition-all duration-200 cursor-pointer select-none flex-1",
                data.renew_24_hours
                  ? "bg-brand/5 border-brand/40 shadow-sm"
                  : "bg-gray-50/50 border-gray-100 hover:bg-gray-50 hover:border-gray-200",
                disabled && "opacity-60 cursor-not-allowed"
              )}
            >
              <div className={cn(
                "w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 transition-colors duration-200 flex-shrink-0",
                data.renew_24_hours
                  ? "border-brand bg-brand"
                  : "border-gray-300 bg-white"
              )}>
                {data.renew_24_hours && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
              <div className="space-y-0.5">
                <span className="text-sm font-semibold text-gray-700">Renew every 24 Hours</span>
              </div>
            </div>

            <div
              onClick={() => {
                if (disabled) return;
                const nextVal = !data.renew_30_days;
                onChange({
                  renew_30_days: nextVal,
                  renew_24_hours: false,
                });
              }}
              className={cn(
                "flex items-start gap-3 p-3.5 rounded-xl border transition-all duration-200 cursor-pointer select-none flex-1",
                data.renew_30_days
                  ? "bg-brand/5 border-brand/40 shadow-sm"
                  : "bg-gray-50/50 border-gray-100 hover:bg-gray-50 hover:border-gray-200",
                disabled && "opacity-60 cursor-not-allowed"
              )}
            >
              <div className={cn(
                "w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 transition-colors duration-200 flex-shrink-0",
                data.renew_30_days
                  ? "border-brand bg-brand"
                  : "border-gray-300 bg-white"
              )}>
                {data.renew_30_days && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
              <div className="space-y-0.5">
                <span className="text-sm font-semibold text-gray-700">Renew every 30 Days</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
