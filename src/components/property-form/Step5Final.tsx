"use client";

import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PropertyFormData, getSchemaFields } from "@/types/property";
import { cn } from "@/lib/utils";
import { useFileUpload } from "@/hooks/use-file-upload";
import { ImageIcon, UploadIcon, XIcon, ZoomInIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

/* ── Single-image upload zone ───────────────────────────────── */
interface SingleImageUploadProps {
  /** The current image URL (controlled from parent) */
  value: string;
  /** Called with the new object URL when a file is selected, or "" to clear */
  onValue: (url: string) => void;
  label: string;
  emptyLabel: string;
  disabled?: boolean;
  accept?: string;
}

function SingleImageUpload({
  value,
  onValue,
  label,
  emptyLabel,
  disabled = false,
  accept = "image/jpeg,image/jpg,image/png,image/webp",
}: SingleImageUploadProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const isInitialized = useRef(false);

  const [{ files, isDragging }, { removeFile, handleDragEnter, handleDragLeave, handleDragOver, handleDrop, openFileDialog, getInputProps }] =
    useFileUpload({
      multiple: false,
      accept,
      // ⚠️ Do NOT use onFilesChange — hook calls it inside setState updater
      // which triggers parent setState during render. Use useEffect instead.
    });

  // Sync file selection → parent AFTER render (safe)
  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      return; // skip initial mount
    }
    if (files.length === 0) {
      onValue("");
    } else {
      onValue(files[0].preview ?? "");
    }
  }, [files]); // eslint-disable-line react-hooks/exhaustive-deps

  // When a value comes in from outside (e.g. edit-mode server URL) but our
  // internal files list is empty, show the value directly.
  const previewUrl = files[0]?.preview ?? value ?? null;

  if (previewUrl) {
    return (
      <div className="space-y-1.5">
        <Label className="text-gray-700 font-medium">{label}</Label>
        <div className="relative w-44 aspect-video rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt={label}
            className="w-full h-full object-cover"
          />
          {/* Hover overlay */}
          {!disabled && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setPreviewOpen(true)}
                className="bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full p-1.5 transition-colors"
                title="Preview"
              >
                <ZoomInIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (files[0]) removeFile(files[0].id);
                  onValue("");
                }}
                className="bg-red-500/80 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors"
                title="Remove"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Full preview dialog */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="bg-transparent border-none shadow-none p-0 sm:max-w-2xl">
            <DialogHeader className="sr-only">
              <DialogTitle>{label} Preview</DialogTitle>
            </DialogHeader>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt={label}
              className="rounded-xl w-full h-auto object-contain"
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <Label className="text-gray-700 font-medium">{label}</Label>
      {/* Drag-and-drop zone */}
      <div
        className={cn(
          "border border-dashed rounded-xl p-6 text-center transition-colors",
          disabled
            ? "opacity-60 cursor-not-allowed bg-gray-100 border-gray-200"
            : isDragging
            ? "border-brand bg-brand/5 cursor-pointer"
            : "border-gray-300 bg-gray-50/50 hover:border-brand/50 hover:bg-brand/5 cursor-pointer"
        )}
        onDragEnter={!disabled ? handleDragEnter : undefined}
        onDragLeave={!disabled ? handleDragLeave : undefined}
        onDragOver={!disabled ? handleDragOver : undefined}
        onDrop={!disabled ? handleDrop : undefined}
      >
        <input {...getInputProps()} className="sr-only" disabled={disabled} />

        <div className="flex flex-col items-center gap-3">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
              isDragging ? "bg-brand/15 text-brand" : "bg-gray-100 text-gray-400"
            )}
          >
            <ImageIcon className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-700">
              {disabled ? emptyLabel : "Drag & drop or click to upload"}
            </p>
            {!disabled && (
              <p className="text-xs text-gray-400">PNG, JPG, WEBP supported</p>
            )}
          </div>
          {!disabled && (
            <Button
              type="button"
              onClick={openFileDialog}
              variant="outline"
              className="flex items-center gap-1.5 text-xs font-semibold border-brand/40 text-brand hover:bg-brand/5 rounded-lg px-3 py-1.5 h-auto"
            >
              <UploadIcon className="h-3.5 w-3.5" />
              Browse
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────── */
export default function Step5Final({ data, onChange, isEditMode, disabled = false }: Props) {
  const subtype = data.property_subtype || "";
  const allowedFields = getSchemaFields(data.property_for, data.owner_type, subtype);
  const isConsultant = data.owner_type === "Consultant";

  const handleDecimalInput = (field: keyof PropertyFormData, val: string) => {
    if (/^\d*\.?\d*$/.test(val)) {
      if (field === "brokerage_percentage") {
        const num = parseFloat(val);
        if (!isNaN(num) && num > 100) return;
      }
      if (field === "brokerage_fee") {
        const parts = val.split(".");
        if (parts[0].length > 10) return;
      }
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
                      maxLength={70}
                      onChange={(e) => onChange({ seo_title: e.target.value.slice(0, 70) })}
                      placeholder="e.g. 3BHK Apartment for Sale in Bengaluru – Best Price"
                      className="rounded-xl border-gray-200 focus-visible:ring-brand"
                    />
                    <p className="text-xs text-gray-400 text-right">{(data.seo_title || "").length}/70</p>
                  </div>
                )}

                {allowedFields.seo_desc && (
                  <div className="space-y-1.5">
                    <Label className="text-gray-700 font-medium">SEO Description</Label>
                    <Textarea
                      disabled={disabled}
                      value={data.seo_desc || ""}
                      maxLength={160}
                      onChange={(e) => onChange({ seo_desc: e.target.value.slice(0, 160) })}
                      placeholder="Provide a search-engine-friendly description of the property..."
                      className="resize-none rounded-xl border-gray-200 focus-visible:ring-brand"
                      rows={3}
                    />
                    <p className="text-xs text-gray-400 text-right">{(data.seo_desc || "").length}/160</p>
                  </div>
                )}

                {/* SEO Image — file upload */}
                <SingleImageUpload
                  value={data.seo_img || ""}
                  onValue={(url) => onChange({ seo_img: url })}
                  label="SEO Image"
                  emptyLabel="No SEO cover image uploaded"
                  disabled={disabled}
                />
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
                  maxLength={500}
                  onChange={(e) => onChange({ video_url: e.target.value.slice(0, 500) })}
                  placeholder="e.g. https://youtube.com/watch?v=..."
                  className="rounded-xl border-gray-200 focus-visible:ring-brand"
                />
              </div>

              <div className="space-y-1.5 pt-2 border-t border-gray-100">
                {/* Video Thumbnail — file upload */}
                <SingleImageUpload
                  value={data.video_thumbnail || ""}
                  onValue={(url) => onChange({ video_thumbnail: url })}
                  label="Video Thumbnail Image"
                  emptyLabel="No custom video thumbnail image uploaded"
                  disabled={disabled}
                />
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
