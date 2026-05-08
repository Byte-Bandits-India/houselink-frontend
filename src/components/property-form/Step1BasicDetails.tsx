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
import { cn } from "@/lib/utils";
import {
  PropertyFormData,
  PropertySubtype,
  AREA_UNITS,
  RESIDENTIAL_SUBTYPES,
  COMMERCIAL_SUBTYPES,
} from "@/types/property";

interface Props {
  data: PropertyFormData;
  onChange: (patch: Partial<PropertyFormData>) => void;
  disabled?: boolean;
}

const RadioPill = ({
  name,
  value,
  checked,
  label,
  onChange,
}: {
  name: string;
  value: string;
  checked: boolean;
  label: string;
  onChange: () => void;
}) => (
  <button
    type="button"
    onClick={onChange}
    className={cn(
      "px-5 py-2 rounded-full border text-sm font-medium transition-all duration-200",
      checked
        ? "bg-brand text-white border-brand shadow-sm"
        : "bg-white text-gray-600 border-gray-300 hover:border-brand hover:text-brand"
    )}
  >
    {label}
  </button>
);

const SubtypeButton = ({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "px-4 py-2 rounded-lg border text-sm font-semibold transition-all duration-200",
      active
        ? "bg-brand text-white border-brand"
        : "bg-white text-brand border-brand/50 hover:bg-brand hover:text-white"
    )}
  >
    {label}
  </button>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-sm font-semibold text-gray-800 mt-5 mb-2">
    {children}
  </h3>
);

export default function Step1BasicDetails({ data, onChange, disabled = false }: Props) {
  const isPlotOrLand = ["plot", "land"].includes(data.property_subtype || "");
  const isApartmentOrShop = ["apartment", "shop"].includes(data.property_subtype || "");
  const isResidential = data.property_main_type === "residential";
  const showResidential =
    isResidential
      ? RESIDENTIAL_SUBTYPES.filter((s) =>
        data.property_for === "sell" ? true : s.value !== "plot"
      )
      : [];
  const showCommercial = !isResidential ? COMMERCIAL_SUBTYPES : [];

  const handleSubtype = (val: PropertySubtype) => {
    onChange({ property_subtype: val });
  };

  return (
    <div className="space-y-1">
      {/* Property For */}
      <SectionTitle>
        Property For <span className="text-red-500">*</span>
      </SectionTitle>
      <div className="flex gap-3 flex-wrap">
        <RadioPill
          name="property_for"
          value="sell"
          checked={data.property_for === "sell"}
          label="Sell"
          onChange={() => !disabled && onChange({ property_for: "sell", property_subtype: "" })}
        />
        <RadioPill
          name="property_for"
          value="rent_lease"
          checked={data.property_for === "rent_lease"}
          label="Rent / Lease"
          onChange={() => !disabled && onChange({ property_for: "rent_lease", property_subtype: "" })}
        />
      </div>

      {/* Owner Type */}
      <SectionTitle>
        Are you? <span className="text-red-500">*</span>
      </SectionTitle>
      <div className="flex gap-3 flex-wrap">
        {(data.property_for === "sell"
          ? ["Owner", "Builder", "Consultant"]
          : ["Owner", "Consultant"]
        ).map((t) => (
          <RadioPill
            key={t}
            name="owner_type"
            value={t}
            checked={data.owner_type === t}
            label={t}
            onChange={() => onChange({ owner_type: t as any })}
          />
        ))}
      </div>

      {/* Main Type */}
      <SectionTitle>
        And it&apos;s a… <span className="text-red-500">*</span>
      </SectionTitle>
      <div className="flex gap-3 flex-wrap">
        <RadioPill
          name="main_type"
          value="residential"
          checked={data.property_main_type === "residential"}
          label="Residential"
          onChange={() => onChange({ property_main_type: "residential", property_subtype: "" })}
        />
        <RadioPill
          name="main_type"
          value="commercial"
          checked={data.property_main_type === "commercial"}
          label="Commercial"
          onChange={() => onChange({ property_main_type: "commercial", property_subtype: "" })}
        />
      </div>

      {/* Property Type Buttons */}
      <SectionTitle>
        Property Type <span className="text-red-500">*</span>
      </SectionTitle>
      <div className="flex gap-2 flex-wrap">
        {[...showResidential, ...showCommercial].map((s) => (
          <SubtypeButton
            key={s.value}
            active={data.property_subtype === s.value}
            label={s.label}
            onClick={() => handleSubtype(s.value)}
          />
        ))}
      </div>

      {/* Dynamic Area Fields */}
      {data.property_subtype && (
        <div className="mt-4 rounded-xl space-y-4">
          {/* Plot / Land */}
          {isPlotOrLand && (
            <>
              <h4 className="font-semibold text-sm text-gray-700">
                {data.property_subtype === "plot" ? "Plot Details" : "Land Details"}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>
                    {data.property_subtype === "plot" ? "Plot Area" : "Land Area"}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="number"
                    value={data.plot_area || ""}
                    onChange={(e) => onChange({ plot_area: e.target.value })}
                    placeholder="Enter area"
                  />
                </div>
                <div className="space-y-1">
                  <Label>
                    Unit <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={data.plot_unit || ""}
                    onValueChange={(v) => onChange({ plot_unit: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {AREA_UNITS.map((u) => (
                        <SelectItem key={u.value} value={u.value}>
                          {u.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Length</Label>
                  <Input
                    type="number"
                    value={data.plot_length || ""}
                    onChange={(e) => onChange({ plot_length: e.target.value })}
                    placeholder="Length"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Breadth</Label>
                  <Input
                    type="number"
                    value={data.plot_breadth || ""}
                    onChange={(e) => onChange({ plot_breadth: e.target.value })}
                    placeholder="Breadth"
                  />
                </div>
              </div>
            </>
          )}

          {/* Structure Area (non-plot) */}
          {!isPlotOrLand && (
            <>
              <h4 className="font-semibold text-sm text-gray-700">Area Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>
                    Built-Up Area <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="number"
                    value={data.super_builtup_area || ""}
                    onChange={(e) => onChange({ super_builtup_area: e.target.value })}
                    placeholder="Enter area"
                  />
                </div>
                <div className="space-y-1">
                  <Label>
                    Unit <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={data.builtup_unit || ""}
                    onValueChange={(v) => onChange({ builtup_unit: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {AREA_UNITS.map((u) => (
                        <SelectItem key={u.value} value={u.value}>
                          {u.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Carpet Area</Label>
                  <Input
                    type="number"
                    value={data.carpet_area || ""}
                    onChange={(e) => onChange({ carpet_area: e.target.value })}
                    placeholder="Enter area"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Unit</Label>
                  <Select
                    value={data.carpet_unit || data.builtup_unit || ""}
                    onValueChange={(v) => onChange({ carpet_unit: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {AREA_UNITS.map((u) => (
                        <SelectItem key={u.value} value={u.value}>
                          {u.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          {/* Floor Details (apartment/shop) */}
          {isApartmentOrShop && (
            <>
              <h4 className="font-semibold text-sm text-gray-700 mt-2">
                Floor Details
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Total Floors</Label>
                  <Input
                    type="number"
                    value={data.total_floors || ""}
                    onChange={(e) => onChange({ total_floors: e.target.value })}
                    placeholder="e.g. 10"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Property on Floor</Label>
                  <Input
                    type="number"
                    value={data.property_on_floor || ""}
                    onChange={(e) => onChange({ property_on_floor: e.target.value })}
                    placeholder="e.g. 3"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
