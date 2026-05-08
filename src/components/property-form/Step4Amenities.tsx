"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { X, Plus } from "lucide-react";
import { PropertyFormData, AMENITIES_LIST } from "@/types/property";

interface Props {
  data: PropertyFormData;
  onChange: (patch: Partial<PropertyFormData>) => void;
  disabled?: boolean;
}

function toggleItem(arr: string[], val: string): string[] {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
}

export default function Step4Amenities({ data, onChange }: Props) {
  const [tagInput, setTagInput] = useState("");
  const amenities = data.amenities || [];
  const tags = data.tags || [];

  const addTag = () => {
    const val = tagInput.trim();
    if (val && !tags.includes(val)) {
      onChange({ tags: [...tags, val] });
    }
    setTagInput("");
  };

  return (
    <div className="space-y-6">
      {/* Amenities */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3">
          Amenities
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {AMENITIES_LIST.map((a) => {
            const checked = amenities.includes(a);
            return (
              <button
                key={a}
                type="button"
                onClick={() => onChange({ amenities: toggleItem(amenities, a) })}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200 text-left",
                  checked
                    ? "bg-brand/10 border-brand text-brand"
                    : "bg-white border-gray-200 text-gray-600 hover:border-brand/50"
                )}
              >
                <span
                  className={cn(
                    "w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors",
                    checked ? "bg-brand border-brand" : "border-gray-300"
                  )}
                >
                  {checked && (
                    <svg viewBox="0 0 10 8" className="w-3 h-2.5 text-white fill-current">
                      <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                {a}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tags */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3">
          Property Tags
        </h3>
        <div className="flex gap-2 mb-3">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Add a tag and press Enter"
            className="flex-1"
          />
          <button
            type="button"
            onClick={addTag}
            className="flex items-center gap-1 px-4 py-2 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand/90 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1.5 bg-brand/10 text-brand text-xs font-semibold px-3 py-1.5 rounded-full"
              >
                {tag}
                <button
                  type="button"
                  onClick={() =>
                    onChange({ tags: tags.filter((t) => t !== tag) })
                  }
                  className="hover:text-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
