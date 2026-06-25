"use client";

import { useState, useEffect } from "react";
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
import { getStates, getCities } from "@/lib/api";

interface Props {
  data: PropertyFormData;
  onChange: (patch: Partial<PropertyFormData>) => void;
  disabled?: boolean;
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-sm font-semibold text-gray-800 mt-5 mb-2">{children}</h3>
);

export default function Step3Location({ data, onChange, disabled = false }: Props) {
  const [states, setStates] = useState<{ id: number; name: string }[]>([]);
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);

  useEffect(() => {
    async function loadStates() {
      try {
        const res = await getStates();
        if (res.success && res.data) {
          setStates(res.data);
        }
      } catch (err) {
        console.error("Failed to load states:", err);
      }
    }
    loadStates();
  }, []);

  useEffect(() => {
    if (!data.state || states.length === 0) {
      setCities([]);
      return;
    }

    async function loadCities() {
      setLoadingCities(true);
      try {
        const matched = states.find(
          (s) => s.name.toLowerCase() === data.state?.toLowerCase()
        );

        if (matched) {
          const res = await getCities(matched.id);
          if (res.success && res.data) {
            setCities(res.data);
          }
        }
      } catch (err) {
        console.error("Failed to load cities:", err);
      } finally {
        setLoadingCities(false);
      }
    }

    loadCities();
  }, [data.state, states]);

  const stateOptions = states.length > 0 ? states.map((s) => s.name) : INDIAN_STATES;

  return (
    <div className="space-y-4">
      <SectionTitle>Property Location</SectionTitle>

      <div className="space-y-1">
        <Label>
          State <span className="text-red-500">*</span>
        </Label>
        <Select
          value={data.state || ""}
          onValueChange={(v) => {
            // When state changes, clear the selected city to prevent invalid combinations
            onChange({ state: v, city: "" });
          }}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select State" />
          </SelectTrigger>
          <SelectContent>
            {stateOptions.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label>
          City <span className="text-red-500">*</span>
        </Label>
        <Select
          value={data.city || ""}
          onValueChange={(v) => onChange({ city: v })}
          disabled={!data.state || loadingCities || disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder={
              !data.state ? "Select State First" : 
              loadingCities ? "Loading Cities..." : "Select City"
            } />
          </SelectTrigger>
          <SelectContent>
            {cities.map((c) => (
              <SelectItem key={c.id} value={c.name}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label>
          Location<span className="text-red-500">*</span>
        </Label>
        <Input
          value={data.address || ""}
          onChange={(e) => onChange({ address: e.target.value })}
          placeholder="e.g. 12, MG Road"
          disabled={disabled}
        />
      </div>
    </div>
  );
}