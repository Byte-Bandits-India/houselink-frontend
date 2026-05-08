"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2 } from "lucide-react";
import { PropertyFormData } from "@/types/property";

interface Props {
  data: PropertyFormData;
  onChange: (patch: Partial<PropertyFormData>) => void;
  isEditMode?: boolean;
}

export default function Step5Final({ data, onChange, isEditMode }: Props) {
  return (
    <div className="space-y-6">
      {/* SEO */}
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b font-semibold text-sm text-gray-700">
          SEO Settings (Optional)
        </div>
        <div className="p-4 space-y-4">
          <div className="space-y-1">
            <Label>SEO Title</Label>
            <Input
              value={data.seo_title || ""}
              onChange={(e) => onChange({ seo_title: e.target.value })}
              placeholder="e.g. 3BHK Apartment for Sale in Bengaluru – Best Price"
            />
          </div>
          <div className="space-y-1">
            <Label>SEO Description</Label>
            <Textarea
              rows={3}
              value={data.seo_desc || ""}
              onChange={(e) => onChange({ seo_desc: e.target.value })}
              placeholder="Brief description for search engines (150–160 chars)"
              className="resize-none"
            />
          </div>
        </div>
      </div>

      {/* Images upload area */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3">
          Property Images{" "}
          <span className="text-gray-400 font-normal">(Max 2MB each, up to 15)</span>
        </h3>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 hover:border-brand/50 transition-colors cursor-pointer">
          <p className="text-sm text-gray-600 font-medium">
            Click or drag images here
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Accepted: JPG, JPEG, PNG only
          </p>
          <label className="mt-3 inline-block cursor-pointer">
            <input
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png"
              className="hidden"
              onChange={(e) => {
                /* handle image previews – placeholder for API integration */
                console.log("Files selected:", e.target.files?.length);
              }}
            />
            <span className="px-4 py-2 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand/90 transition-colors">
              Browse Files
            </span>
          </label>
        </div>
      </div>

      {/* Video URL */}
      <div className="space-y-1">
        <Label>Property Video URL (Optional)</Label>
        <Input
          value={data.video_url || ""}
          onChange={(e) => onChange({ video_url: e.target.value })}
          placeholder="e.g. https://youtube.com/watch?v=..."
        />
      </div>
    </div>
  );
}
