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
import { cn } from "@/lib/utils";

import type { StepProps as Props } from "@/types/property-form";

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

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-sm font-semibold text-gray-800 mt-5 mb-2">{children}</h3>
);

export default function Step3Location({ data, onChange, disabled = false, showErrors = false }: Props) {
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
        <RequiredLabel>State</RequiredLabel>
        <Select
          value={data.state || ""}
          onValueChange={(v) => {
            // When state changes, clear the selected city to prevent invalid combinations
            onChange({ state: v, city: "" });
          }}
          disabled={disabled}
        >
          <SelectTrigger className={cn(
            showErrors && !data.state && "border-red-500 focus:border-red-500"
          )}>
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
        <ValidationError
          show={showErrors && !data.state}
          message="Please select your state"
        />
      </div>

      <div className="space-y-1">
        <RequiredLabel>City</RequiredLabel>
        <Select
          value={data.city || ""}
          onValueChange={(v) => onChange({ city: v })}
          disabled={!data.state || loadingCities || disabled}
        >
          <SelectTrigger className={cn(
            showErrors && !data.city && "border-red-500 focus:border-red-500"
          )}>
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
        <ValidationError
          show={showErrors && !data.city}
          message="Please select your city"
        />
      </div>

      <div className="space-y-1">
        <RequiredLabel>Location</RequiredLabel>
        <Input
          value={data.address || ""}
          maxLength={200}
          onChange={(e) => onChange({ address: e.target.value.slice(0, 200) })}
          placeholder="e.g. 12, MG Road"
          disabled={disabled}
          className={cn(
            showErrors && !data.address && "border-red-500 focus-visible:ring-red-500 focus:border-red-500"
          )}
        />
        <ValidationError
          show={showErrors && !data.address}
          message="Please enter your location"
        />
      </div>
    </div>
  );
}