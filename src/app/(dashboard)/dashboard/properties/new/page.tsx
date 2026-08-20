"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, AlertCircle, Sparkles } from "lucide-react";
import PropertyFormWizard from "@/components/property-form/PropertyFormWizard";
import { PropertyFormData } from "@/types/property";
import { useAuth } from "@/context/AuthContext";
import { createProperty, ApiError, uploadFiles } from "@/lib/api";
import { message } from "antd";

export default function AddPropertyPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (data: PropertyFormData) => {
    if (!user) {
      setErrorMsg("You must be logged in to create a property listing.");
      return;
    }



    setIsSubmitting(true);
    setErrorMsg(null);
    
    try {
      const isLocalMediaUrl = (url?: string | null): boolean => {
        if (!url || typeof url !== "string") return false;
        return url.startsWith("blob:") || url.startsWith("data:");
      };

      const localMediaToFile = async (mediaUrl: string, defaultName: string): Promise<File> => {
        const response = await fetch(mediaUrl);
        const blob = await response.blob();
        let extension = blob.type.split("/")[1] || "jpg";
        if (extension === "jpeg") extension = "jpg";
        return new File([blob], `${defaultName}.${extension}`, { type: blob.type || "image/jpeg" });
      };

      // 1. Process property images
      const finalImages: string[] = [];
      if (data.images && data.images.length > 0) {
        const files: File[] = [];
        for (let i = 0; i < data.images.length; i++) {
          const img = data.images[i];
          if (isLocalMediaUrl(img)) {
            try {
              const f = await localMediaToFile(img, `property-image-${i}`);
              files.push(f);
            } catch (err: any) {
              console.error("Error converting image media", err);
              throw new Error(`Failed to process property image at index ${i + 1}. If the preview is broken, please re-upload.`);
            }
          } else if (typeof img === "string" && img.trim().length > 0) {
            finalImages.push(img);
          }
        }
        if (files.length > 0) {
          const uploaded = await uploadFiles(files, "property");
          finalImages.push(...uploaded);
        }
      }

      // 2. Process SEO image
      let finalSeoImg = data.seo_img;
      if (isLocalMediaUrl(data.seo_img)) {
        try {
          const f = await localMediaToFile(data.seo_img!, "seo-image");
          const uploaded = await uploadFiles([f], "seo");
          if (uploaded.length > 0) {
            finalSeoImg = uploaded[0];
          } else {
            throw new Error("No URL returned from server.");
          }
        } catch (err: any) {
          console.error("Error converting SEO image", err);
          throw new Error(`SEO Cover Image upload failed: ${err.message || err}. If the preview is broken, please re-upload the file.`);
        }
      }

      // 3. Process video thumbnail
      let finalVideoThumbnail = data.video_thumbnail;
      if (isLocalMediaUrl(data.video_thumbnail)) {
        try {
          const f = await localMediaToFile(data.video_thumbnail!, "video-thumbnail");
          const uploaded = await uploadFiles([f], "video");
          if (uploaded.length > 0) {
            finalVideoThumbnail = uploaded[0];
          } else {
            throw new Error("No URL returned from server.");
          }
        } catch (err: any) {
          console.error("Error converting video thumbnail", err);
          throw new Error(`Video Thumbnail upload failed: ${err.message || err}. If the preview is broken, please re-upload the file.`);
        }
      }

      // Assemble final data structure
      const finalData: PropertyFormData = {
        ...data,
        images: finalImages,
        seo_img: finalSeoImg,
        video_thumbnail: finalVideoThumbnail,
      };

      const result = await createProperty(finalData, user.id);
      console.log("Property created successfully:", result);

      message.success("Property listing created successfully!");
      
      router.refresh();
      router.push("/dashboard/properties");
    } catch (err: any) {
      console.error("Submission failed:", err);
      setIsSubmitting(false);
      
      if (err instanceof ApiError) {
        let msg = err.message || "Backend rejected property data. Please verify your fields.";
        const details = err.data as any;
        if (details?.errors?.fieldErrors) {
          const fieldMsgs = Object.entries(details.errors.fieldErrors)
            .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(", ")}`)
            .join(" | ");
          msg = `${msg} Details: [ ${fieldMsgs} ]`;
        } else if (details?.message) {
          msg = `${msg} Details: ${details.message}`;
        }
        setErrorMsg(msg);
      } else {
        setErrorMsg(err.message || "An unexpected error occurred during submission. Please try again.");
      }
    }
  };

  // If user auth state is still loading
  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
        <p className="text-sm text-gray-500 font-medium animate-pulse">Hydrating your secure session...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-slate-800 dark:hover:bg-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-slate-300" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Add Property</span>
            <Sparkles className="w-5 h-5 text-brand" />
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Fill in the details below to list your property on Houselink360.
          </p>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 flex items-start gap-3 shadow-sm animate-shake">
          <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm">Submission Error</h4>
            <p className="text-xs text-rose-700 leading-relaxed">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Wizard */}
      <PropertyFormWizard onSubmit={handleSubmit} disabled={isSubmitting} />
    </div>
  );
}

