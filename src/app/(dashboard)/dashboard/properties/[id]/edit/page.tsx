"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";
import PropertyFormWizard from "@/components/property-form/PropertyFormWizard";
import { PropertyFormData } from "@/types/property";
import { useAuth } from "@/context/AuthContext";
import { getProperty, updateProperty, mapApiPayloadToFormData, uploadFiles, ApiError } from "@/lib/api";

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
  const [submitStep, setSubmitStep] = useState<"location" | "payload" | "posting" | "success" | "">("");

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
            setErrorMsg("This listing is under moderation review and cannot be edited.");
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
        setErrorMsg(err?.message || "An unexpected error occurred while loading property details.");
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

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      // Step 1: Resolve location
      setSubmitStep("location");
      await new Promise((r) => setTimeout(r, 600));

      // Step 2: Structure payload & upload local blob files
      setSubmitStep("payload");

      const blobToFile = async (blobUrl: string, defaultName: string): Promise<File> => {
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        const extension = blob.type.split("/")[1] || "jpg";
        return new File([blob], `${defaultName}.${extension}`, { type: blob.type });
      };

      // 1. Process property images
      const finalImages: string[] = [];
      if (data.images && data.images.length > 0) {
        const files: File[] = [];
        for (let i = 0; i < data.images.length; i++) {
          const img = data.images[i];
          if (img.startsWith("blob:")) {
            try {
              const f = await blobToFile(img, `property-image-${i}`);
              files.push(f);
            } catch (err: any) {
              console.error("Error converting image blob", err);
              throw new Error(`Failed to process property image at index ${i + 1}. If the preview is broken, please re-upload.`);
            }
          } else {
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
      if (data.seo_img && data.seo_img.startsWith("blob:")) {
        try {
          const f = await blobToFile(data.seo_img, "seo-image");
          const uploaded = await uploadFiles([f], "seo");
          if (uploaded.length > 0) {
            finalSeoImg = uploaded[0];
          } else {
            throw new Error("No URL returned from server.");
          }
        } catch (err: any) {
          console.error("Error converting SEO image blob", err);
          throw new Error(`SEO Cover Image upload failed: ${err.message || err}. If the preview is broken, please re-upload the file.`);
        }
      }

      // 3. Process video thumbnail
      let finalVideoThumbnail = data.video_thumbnail;
      if (data.video_thumbnail && data.video_thumbnail.startsWith("blob:")) {
        try {
          const f = await blobToFile(data.video_thumbnail, "video-thumbnail");
          const uploaded = await uploadFiles([f], "video");
          if (uploaded.length > 0) {
            finalVideoThumbnail = uploaded[0];
          } else {
            throw new Error("No URL returned from server.");
          }
        } catch (err: any) {
          console.error("Error converting video thumbnail blob", err);
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

      await new Promise((r) => setTimeout(r, 400));

      // Step 3: Posting/Putting
      setSubmitStep("posting");
      const result = await updateProperty(propertyId, finalData, user.id);
      console.log("Property updated successfully:", result);

      // Step 4: Success state
      setSubmitStep("success");
      await new Promise((r) => setTimeout(r, 800));

      router.push("/dashboard/properties");
    } catch (err: any) {
      console.error("Submission failed:", err);
      setIsSubmitting(false);
      setSubmitStep("");

      if (err instanceof ApiError) {
        let msg = err.message || "Backend rejected property update. Please verify your fields.";
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 text-brand animate-spin" />
        <p className="text-sm font-semibold text-ink-muted animate-pulse">Loading property details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* ── Submission Overlay ── */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200/50 dark:border-slate-800/50 shadow-2xl rounded-2xl p-8 max-w-md w-full text-center space-y-6 transform scale-100 transition-all">
            
            {/* Spinning/Animating icon depending on sub-step */}
            <div className="flex justify-center">
              <div className="relative">
                {submitStep === "success" ? (
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 scale-100 transition-transform duration-500">
                    <CheckCircle2 className="w-8 h-8 animate-bounce" />
                  </div>
                ) : (
                  <div className="relative w-16 h-16">
                    {/* Ring animation */}
                    <div className="absolute inset-0 border-4 border-brand/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-brand border-r-brand rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-brand animate-pulse" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submitting text and progress steps */}
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {submitStep === "success" ? "Listing Updated!" : "Updating Property Listing"}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Please wait while we update your real estate upload.
              </p>
            </div>

            {/* Interactive Progress Indicators */}
            <div className="space-y-3 pt-2 text-left max-w-xs mx-auto text-xs font-semibold">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  submitStep === "location" ? "bg-brand animate-ping" : 
                  submitStep === "payload" || submitStep === "posting" || submitStep === "success" ? "bg-emerald-500" : "bg-slate-300"
                }`} />
                <span className={submitStep === "location" ? "text-brand" : submitStep === "payload" || submitStep === "posting" || submitStep === "success" ? "text-emerald-600" : "text-slate-400"}>
                  Resolving database location IDs...
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  submitStep === "payload" ? "bg-brand animate-ping" : 
                  submitStep === "posting" || submitStep === "success" ? "bg-emerald-500" : "bg-slate-300"
                }`} />
                <span className={submitStep === "payload" ? "text-brand" : submitStep === "posting" || submitStep === "success" ? "text-emerald-600" : "text-slate-400"}>
                  Structuring listing schema payload...
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  submitStep === "posting" ? "bg-brand animate-ping" : 
                  submitStep === "success" ? "bg-emerald-500" : "bg-slate-300"
                }`} />
                <span className={submitStep === "posting" ? "text-brand" : submitStep === "success" ? "text-emerald-600" : "text-slate-400"}>
                  Pushing API record to servers...
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

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
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Modify any fields below and save to update your active listing.
          </p>
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
        />
      )}
    </div>
  );
}
