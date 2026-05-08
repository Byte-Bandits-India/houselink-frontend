"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PropertyFormData, INDIAN_STATES } from "@/types/property";

interface Props {
  data: PropertyFormData;
  onChange: (patch: Partial<PropertyFormData>) => void;
  disabled?: boolean;
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-sm font-semibold text-gray-800 mt-5 mb-2">{children}</h3>
);

export default function Step3Location({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <SectionTitle>Property Location</SectionTitle>

      <div className="space-y-1">
        <Label>
          City <span className="text-red-500">*</span>
        </Label>
        <Input
          value={data.city || ""}
          onChange={(e) => onChange({ city: e.target.value })}
          placeholder="e.g. Bengaluru"
        />
      </div>

      <div className="space-y-1">
        <Label>
          State <span className="text-red-500">*</span>
        </Label>
        <Select
          value={data.state || ""}
          onValueChange={(v) => onChange({ state: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select State" />
          </SelectTrigger>
          <SelectContent>
            {INDIAN_STATES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label>
          Address / Street <span className="text-red-500">*</span>
        </Label>
        <Input
          value={data.address || ""}
          onChange={(e) => onChange({ address: e.target.value })}
          placeholder="e.g. 12, MG Road"
        />
      </div>
    </div>
  );
}