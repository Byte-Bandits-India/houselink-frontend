"use client";

import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PropertyFormData, getSchemaFields } from "@/types/property";
import { cn } from "@/lib/utils";
import { useFileUpload } from "@/hooks/use-file-upload";
import { ImageIcon, UploadIcon, XIcon, ZoomInIcon, ScissorsIcon } from "lucide-react";
import { ImageCropModal } from "@/components/ui/ImageCropModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { Step5Props as Props } from "@/types/property-form";

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
import type { SingleImageUploadProps } from "@/types/property-form";

function SingleImageUpload({
  value,
  onValue,
  label,
  emptyLabel,
  disabled = false,
  accept = "image/jpeg,image/jpg,image/png,image/webp",
}: SingleImageUploadProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const isInitialized = useRef(false);

  const [{ files, isDragging }, { removeFile, handleDragEnter, handleDragLeave, handleDragOver, handleDrop, openFileDialog, getInputProps }] =
    useFileUpload({
      multiple: false,
      maxSize: 10 * 1024 * 1024, // 10 MB
      accept,
    });

  const prevFilesLen = useRef(files.length);

  // Auto-open cropper when a file is selected
  useEffect(() => {
    if (files.length > prevFilesLen.current && files[0]) {
      const src = files[0].preview ?? (files[0].file instanceof File ? URL.createObjectURL(files[0].file) : null);
      if (src) {
        setCropImageSrc(src);
        setCropModalOpen(true);
      }
    }
    prevFilesLen.current = files.length;
  }, [files]);

  // Sync file selection → parent AFTER render
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

  const handleCropSave = (file: File, dataUrl: string) => {
    if (files[0]) {
      files[0].preview = dataUrl;
      files[0].file = file;
    }
    onValue(dataUrl);
  };

  const previewUrl = value;

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
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setCropImageSrc(previewUrl);
                  setCropModalOpen(true);
                }}
                className="bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full p-1.5 transition-colors"
                title="Crop & Adjust"
              >
                <ScissorsIcon className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPreviewOpen(true)}
                className="bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full p-1.5 transition-colors"
                title="Preview"
              >
                <ZoomInIcon className="w-3.5 h-3.5" />
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
                <XIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Full preview dialog */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="bg-transparent border-none shadow-none p-0 sm:max-w-3xl flex items-center justify-center">
            <DialogHeader className="sr-only">
              <DialogTitle>{label} Preview</DialogTitle>
            </DialogHeader>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt={label}
              className="rounded-2xl max-h-[85vh] w-auto max-w-full object-contain shadow-2xl bg-black/40 mx-auto"
            />
          </DialogContent>
        </Dialog>

        {/* Image Crop Modal */}
        <ImageCropModal
          open={cropModalOpen}
          imageSrc={cropImageSrc}
          onClose={() => setCropModalOpen(false)}
          onCropSave={handleCropSave}
          aspectRatio={16 / 9}
          circular={false}
          imageSize="800px * 450px"
          targetWidth={800}
          targetHeight={450}
          title={`Crop ${label}`}
        />
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
              <p className="text-xs text-gray-400">
                PNG, JPG, WEBP · Recommended: 800×450 px (16:9) · Max 10MB
              </p>
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

      {/* Image Crop Modal */}
      <ImageCropModal
        open={cropModalOpen}
        imageSrc={cropImageSrc}
        onClose={() => setCropModalOpen(false)}
        onCropSave={handleCropSave}
        aspectRatio={16 / 9}
        circular={false}
        imageSize="800px * 450px"
        targetWidth={800}
        targetHeight={450}
        title={`Crop ${label}`}
      />
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────── */
export default function Step5Final({ data, onChange, isEditMode = false, disabled = false, showErrors = false }: Props) {
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
              <RequiredLabel>Brokerage Type</RequiredLabel>
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
              <ValidationError
                show={showErrors && !data.brokerage_type}
                message="Please select your brokerage type"
              />
            </div>

            {data.brokerage_type === "fixed" && allowedFields.brokerage_fee && (
              <div className="space-y-2 pt-2 border-t border-gray-50">
                <RequiredLabel>Broker Fee</RequiredLabel>
                <Input
                  disabled={disabled}
                  value={data.brokerage_fee || ""}
                  onChange={(e) => handleDecimalInput("brokerage_fee", e.target.value)}
                  placeholder="Enter amount"
                  className={cn(
                    "rounded-xl border-gray-200 focus-visible:ring-brand max-w-xl h-11",
                    showErrors && !data.brokerage_fee && "border-red-500 focus-visible:ring-red-500 focus:border-red-500"
                  )}
                />
                <ValidationError
                  show={showErrors && !data.brokerage_fee}
                  message="Please enter your broker fee"
                />
              </div>
            )}

            {data.brokerage_type === "percentage" && allowedFields.brokerage_percentage && (
              <div className="space-y-2 pt-2 border-t border-gray-50">
                <RequiredLabel>Brokerage Percentage</RequiredLabel>
                <Input
                  disabled={disabled}
                  value={data.brokerage_percentage || ""}
                  onChange={(e) => handleDecimalInput("brokerage_percentage", e.target.value)}
                  placeholder="Enter amount"
                  className={cn(
                    "rounded-xl border-gray-200 focus-visible:ring-brand max-w-xl h-11",
                    showErrors && !data.brokerage_percentage && "border-red-500 focus-visible:ring-red-500 focus:border-red-500"
                  )}
                />
                <ValidationError
                  show={showErrors && !data.brokerage_percentage}
                  message="Please enter your brokerage percentage"
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
