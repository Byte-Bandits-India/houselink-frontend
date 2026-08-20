"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, AlertCircle, Sparkles } from "lucide-react";
import PropertyFormWizard from "@/components/property-form/PropertyFormWizard";
import { PropertyFormData } from "@/types/property";
import { useAuth } from "@/context/AuthContext";
import {
  getProperty,
  updateProperty,
  mapApiPayloadToFormData,
  uploadFiles,
  ApiError,
} from "@/lib/api";
import { message } from "antd";

export default function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const propertyId = Number(id);

  const [initialData, setInitialData] = useState<PropertyFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadProperty() {
      if (isNaN(propertyId)) {
        setErrorMsg("Invalid property ID.");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setErrorMsg(null);
      try {
        const res = await getProperty(propertyId);
        if (res.success && res.data) {
          if (res.data.moderationStatus === "pending") {
            setErrorMsg(
              "This listing is under moderation review and cannot be edited.",
            );
            setTimeout(() => {
              router.push(`/dashboard/properties/${propertyId}`);
            }, 2500);
            return;
          }
          const mapped = mapApiPayloadToFormData(res.data);
          setInitialData(mapped);
        } else {
          setErrorMsg("Failed to load property details.");
        }
      } catch (err: any) {
        console.error("Error loading property:", err);
        setErrorMsg(
          err?.message ||
            "An unexpected error occurred while loading property details.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    if (!authLoading && user) {
      loadProperty();
    }
  }, [propertyId, user, authLoading]);

  const handleSubmit = async (data: PropertyFormData) => {
    if (!user) {
      setErrorMsg("You must be logged in to update this property listing.");
      return;
    }

    if (data.property_for === "sell") {
      const ownership = data.owner_type?.toLowerCase();
      let credits = 0;
      if (ownership === "owner") {
        credits = user.creditPointsOwner ?? 0;
      } else if (ownership === "builder") {
        credits = user.creditPointsBuilder ?? 0;
      } else if (ownership === "consultant") {
        credits = user.creditPointsConsultant ?? 0;
      }

      if (credits <= 0) {
        setErrorMsg(
          `You do not have active credit points to update listing as a "${data.owner_type}". Please purchase a package first.`,
        );
        return;
      }
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const isLocalMediaUrl = (url?: string | null): boolean => {
        if (!url || typeof url !== "string") return false;
        return url.startsWith("blob:") || url.startsWith("data:");
      };

      const localMediaToFile = async (
        mediaUrl: string,
        defaultName: string,
      ): Promise<File> => {
        const response = await fetch(mediaUrl);
        const blob = await response.blob();
        let extension = blob.type.split("/")[1] || "jpg";
        if (extension === "jpeg") extension = "jpg";
        return new File([blob], `${defaultName}.${extension}`, {
          type: blob.type || "image/jpeg",
        });
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
              throw new Error(
                `Failed to process property image at index ${i + 1}. If the preview is broken, please re-upload.`,
              );
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
          throw new Error(
            `SEO Cover Image upload failed: ${err.message || err}. If the preview is broken, please re-upload the file.`,
          );
        }
      }

      // 3. Process video thumbnail
      let finalVideoThumbnail = data.video_thumbnail;
      if (isLocalMediaUrl(data.video_thumbnail)) {
        try {
          const f = await localMediaToFile(
            data.video_thumbnail!,
            "video-thumbnail",
          );
          const uploaded = await uploadFiles([f], "video");
          if (uploaded.length > 0) {
            finalVideoThumbnail = uploaded[0];
          } else {
            throw new Error("No URL returned from server.");
          }
        } catch (err: any) {
          console.error("Error converting video thumbnail", err);
          throw new Error(
            `Video Thumbnail upload failed: ${err.message || err}. If the preview is broken, please re-upload the file.`,
          );
        }
      }

      // Assemble final data structure
      const finalData: PropertyFormData = {
        ...data,
        images: finalImages,
        seo_img: finalSeoImg,
        video_thumbnail: finalVideoThumbnail,
      };

      const result = await updateProperty(propertyId, finalData, user.id);
      console.log("Property updated successfully:", result);

      message.success("Property listing updated successfully!");

      router.refresh();
      router.push("/dashboard/properties");
    } catch (err: any) {
      console.error("Submission failed:", err);
      setIsSubmitting(false);

      if (err instanceof ApiError) {
        let msg =
          err.message ||
          "Backend rejected property update. Please verify your fields.";
        const details = err.data as any;
        if (details?.errors?.fieldErrors) {
          const fieldMsgs = Object.entries(details.errors.fieldErrors)
            .map(
              ([field, msgs]) => `${field}: ${(msgs as string[]).join(", ")}`,
            )
            .join(" | ");
          msg = `${msg} Details: [ ${fieldMsgs} ]`;
        } else if (details?.message) {
          msg = `${msg} Details: ${details.message}`;
        }
        setErrorMsg(msg);
      } else {
        setErrorMsg(
          err.message ||
            "An unexpected error occurred during submission. Please try again.",
        );
      }
    }
  };

  // If user auth state is still loading
  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
        <p className="text-sm text-gray-500 font-medium animate-pulse">
          Hydrating your secure session...
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 text-brand animate-spin" />
        <p className="text-sm font-semibold text-ink-muted animate-pulse">
          Loading property details...
        </p>
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
            <span>Edit Property</span>
            <Sparkles className="w-5 h-5 text-brand" />
          </h1>
        </div>
      </div>

      {/* ── Error Banner ── */}
      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 flex items-start gap-3 shadow-sm animate-shake">
          <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm">Action Message</h4>
            <p className="text-xs text-rose-700 leading-relaxed">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Wizard in edit mode */}
      {initialData && (
        <PropertyFormWizard
          initialData={initialData}
          isEditMode
          onSubmit={handleSubmit}
          disabled={isSubmitting}
        />
      )}
    </div>
  );
}
