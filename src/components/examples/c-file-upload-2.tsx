"use client";

import { useState, useEffect } from "react";
import {
  formatBytes,
  useFileUpload,
  type FileWithPreview,
} from "@/hooks/use-file-upload";
import { Alert, AlertDescription, AlertTitle } from "@/components/reui/alert";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UserIcon, XIcon, CircleAlertIcon, ScissorsIcon } from "lucide-react";
import { ImageCropModal } from "@/components/ui/ImageCropModal";

interface AvatarUploadProps {
  maxSize?: number;
  className?: string;
  onFileChange?: (file: FileWithPreview | null) => void;
  defaultAvatar?: string;
}

export function Pattern({
  maxSize = 5 * 1024 * 1024, // 5MB
  className,
  onFileChange,
  defaultAvatar,
}: AvatarUploadProps) {
  const [croppedFile, setCroppedFile] = useState<FileWithPreview | null>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);

  const [
    { files, isDragging, errors },
    {
      removeFile,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
    },
  ] = useFileUpload({
    maxFiles: 1,
    maxSize,
    accept: "image/*",
    multiple: false,
    onFilesChange: (newFiles) => {
      const selected = newFiles[0];
      if (selected) {
        // Automatically open crop modal when a new file is picked
        const src = selected.preview || (selected.file instanceof File ? URL.createObjectURL(selected.file) : null);
        if (src) {
          setCropImageSrc(src);
          setCropModalOpen(true);
        }
      } else {
        setCroppedFile(null);
        onFileChange?.(null);
      }
    },
  });

  const rawFile = files[0];
  const currentPreview = croppedFile?.preview || rawFile?.preview || defaultAvatar;

  const handleRemove = () => {
    setCroppedFile(null);
    if (rawFile) {
      removeFile(rawFile.id);
    }
    onFileChange?.(null);
  };

  const handleOpenCrop = (e: React.MouseEvent) => {
    e.stopPropagation();
    const srcToCrop = croppedFile?.preview || rawFile?.preview || defaultAvatar;
    if (srcToCrop) {
      setCropImageSrc(srcToCrop);
      setCropModalOpen(true);
    }
  };

  const handleCropSave = (file: File, dataUrl: string) => {
    const fileWithPreview: FileWithPreview = {
      id: rawFile?.id || `cropped-${Date.now()}`,
      file,
      preview: dataUrl,
    };
    setCroppedFile(fileWithPreview);
    onFileChange?.(fileWithPreview);
  };

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {/* Avatar Preview */}
      <div className="relative group/avatar-container">
        <div
          className={cn(
            "group/avatar relative h-28 w-28 cursor-pointer overflow-hidden rounded-full border-2 border-dashed transition-all shadow-xs",
            isDragging
              ? "border-primary bg-primary/5 scale-105"
              : "border-muted-foreground/25 hover:border-brand/40",
            currentPreview && "border-solid border-white shadow-md",
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input {...getInputProps()} className="sr-only" />

          {currentPreview ? (
            <img
              src={currentPreview}
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-50">
              <UserIcon className="text-muted-foreground size-8" />
            </div>
          )}

          {/* Hover overlay hint */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-medium">
            <span>Change</span>
          </div>
        </div>

        {/* Action Controls: Remove & Crop */}
        {currentPreview && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10 bg-white/90 backdrop-blur-xs p-0.5 rounded-full shadow-md border border-slate-200">
            <button
              type="button"
              onClick={handleOpenCrop}
              className="p-1 rounded-full text-slate-700 hover:bg-slate-100 hover:text-brand transition-colors"
              title="Crop Image"
            >
              <ScissorsIcon className="size-3.5" />
            </button>
            {(rawFile || croppedFile) && (
              <button
                type="button"
                onClick={handleRemove}
                className="p-1 rounded-full text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                title="Remove Avatar"
              >
                <XIcon className="size-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Upload & Crop Instructions */}
      <div className="space-y-1 text-center">
        <p className="text-sm font-semibold text-slate-800">
          {croppedFile ? "Avatar cropped" : rawFile ? "Avatar uploaded" : "Upload Profile Picture"}
        </p>
        <p className="text-muted-foreground text-xs">
          PNG, JPG up to {formatBytes(maxSize)}
        </p>
        {currentPreview && (
          <button
            type="button"
            onClick={handleOpenCrop}
            className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline pt-0.5"
          >
            <ScissorsIcon className="size-3" />
            <span>Crop & adjust image</span>
          </button>
        )}
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <Alert variant="destructive" className="mt-3">
          <CircleAlertIcon />
          <AlertTitle>File upload error(s)</AlertTitle>
          <AlertDescription>
            {errors.map((error, index) => (
              <p key={index} className="last:mb-0">
                {error}
              </p>
            ))}
          </AlertDescription>
        </Alert>
      )}

      {/* Crop Modal */}
      <ImageCropModal
        open={cropModalOpen}
        imageSrc={cropImageSrc}
        onClose={() => setCropModalOpen(false)}
        onCropSave={handleCropSave}
        aspectRatio={1}
        circular={true}
        imageSize="400px * 400px"
        targetWidth={400}
        targetHeight={400}
        title="Crop Profile Picture"
      />
    </div>
  );
}

