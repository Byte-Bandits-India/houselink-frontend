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
import { useAuth } from "@/context/AuthContext";
import { message } from "antd";
import {
  PropertyFormData,
  PropertySubtype,
  AREA_UNITS,
  RESIDENTIAL_SUBTYPES,
  COMMERCIAL_SUBTYPES,
  getSchemaFields,
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
  disabled = false,
  onDisabledClick,
}: {
  name: string;
  value: string;
  checked: boolean;
  label: string;
  onChange: () => void;
  disabled?: boolean;
  onDisabledClick?: () => void;
}) => (
  <button
    type="button"
    onClick={disabled && onDisabledClick ? onDisabledClick : onChange}
    className={cn(
      "px-5 py-2 rounded-full border text-sm font-medium transition-all duration-200",
      checked
        ? "bg-brand text-white border-brand shadow-sm"
        : "bg-white text-gray-600 border-gray-300 hover:border-brand hover:text-brand",
      disabled && "opacity-50 hover:border-gray-300 hover:text-gray-600"
    )}
  >
    {label}
  </button>
);

const SubtypeButton = ({
  active,
  label,
  onClick,
  disabled = false,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={cn(
      "px-4 py-2 rounded-lg border text-sm font-semibold transition-all duration-200",
      active
        ? "bg-brand text-white border-brand"
        : "bg-white text-brand border-brand/50 hover:bg-brand hover:text-white",
      disabled && "opacity-50 cursor-not-allowed hover:bg-white hover:text-brand"
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
  const { user } = useAuth();
  const subtype = data.property_subtype || "";

  const hasOwnerCredits = (user?.creditPointsOwner ?? 0) > 0;
  const hasBuilderCredits = (user?.creditPointsBuilder ?? 0) > 0;
  const hasConsultantCredits = (user?.creditPointsConsultant ?? 0) > 0;

  // ── Step 1 fields based strictly on step1.MD ──
  const allowedFields = getSchemaFields(data.property_for, data.owner_type, subtype);
  const showLandPlotDetails = allowedFields.plot_area;
  const showPlotAreaRequired = ["villa", "individual_house", "plot", "land"].includes(subtype);

  const showAreaDetails = allowedFields.super_builtup_area;
  const showCarpetArea = allowedFields.carpet_area;
  const showStorageArea = allowedFields.storage_area;

  const showFloorDetails = allowedFields.total_floors;
  const isFloorRequired = ["apartment", "building"].includes(subtype);
  const showUdsArea = allowedFields.uds_area;

  const showAdditionalDetails = allowedFields.plot_length || allowedFields.plot_breadth;

  const totalFloorsNum = data.total_floors ? parseInt(data.total_floors, 10) : NaN;
  const propertyOnFloorNum = data.property_on_floor ? parseInt(data.property_on_floor, 10) : NaN;
  const isFloorInvalid = !isNaN(totalFloorsNum) && !isNaN(propertyOnFloorNum) && propertyOnFloorNum > totalFloorsNum;

  const isResidential = data.property_main_type === "residential";
  const showResidential =
    isResidential
      ? RESIDENTIAL_SUBTYPES.filter((s) =>
        data.property_for === "sell" ? true : s.value !== "plot"
      )
      : [];
  const showCommercial = !isResidential ? COMMERCIAL_SUBTYPES : [];

  const handleSubtype = (val: PropertySubtype) => {
    const isNewCommercial = ["shop", "building", "godown", "warehouse", "office_space", "land"].includes(val);
    const allowed = isNewCommercial ? ["Individual", "Company", "Any"] : ["Family", "Bachelor", "Students", "Working Professionals", "Any"];
    onChange({
      property_subtype: val,
      tenant_preference: (data.tenant_preference || []).filter(tp => allowed.includes(tp))
    });
  };

  const handleDecimalInput = (field: keyof PropertyFormData, value: string) => {
    const clean = value.replace(/[^0-9.]/g, "");
    const parts = clean.split(".");
    const sanitized = parts.length > 2 ? parts[0] + "." + parts.slice(1).join("") : clean;
    onChange({ [field]: sanitized });
  };

  const handleTotalFloorsChange = (val: string) => {
    onChange({ total_floors: val });
  };

  const handlePropertyOnFloorChange = (val: string) => {
    const onFloor = parseInt(val, 10);
    const total = parseInt(data.total_floors || "", 10);
    
    if (!isNaN(onFloor) && !isNaN(total) && onFloor > total) {
      message.error("Property Floor cannot be greater than Total Floors.");
      onChange({ total_floors: "", property_on_floor: "" });
    } else {
      onChange({ property_on_floor: val });
    }
  };

  const handleFloorBlur = () => {
    const total = parseInt(data.total_floors || "", 10);
    const onFloor = parseInt(data.property_on_floor || "", 10);
    
    if (!isNaN(total) && !isNaN(onFloor) && onFloor > total) {
      message.error("Property Floor cannot be greater than Total Floors.");
      onChange({ total_floors: "", property_on_floor: "" });
    }
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
          disabled={disabled}
          onChange={() => onChange({ property_for: "sell", property_subtype: "", tenant_preference: [] })}
        />
        <RadioPill
          name="property_for"
          value="rent_lease"
          checked={data.property_for === "rent_lease"}
          label="Rent / Lease"
          disabled={disabled}
          onChange={() => {
            const nextOwnerType = data.owner_type === "Builder" ? "Owner" : data.owner_type;
            onChange({ property_for: "rent_lease", property_subtype: "", tenant_preference: [], owner_type: nextOwnerType });
          }}
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
        ).map((t) => {
          let isOptionDisabled = disabled;
          if (user && data.property_for === "sell") {
            if (t === "Owner" && !hasOwnerCredits) isOptionDisabled = true;
            if (t === "Builder" && !hasBuilderCredits) isOptionDisabled = true;
            if (t === "Consultant" && !hasConsultantCredits) isOptionDisabled = true;
          }
          return (
            <RadioPill
              key={t}
              name="owner_type"
              value={t}
              checked={data.owner_type === t}
              label={t}
              disabled={isOptionDisabled}
              onChange={() => onChange({ owner_type: t as any })}
              onDisabledClick={() => {
                message.warning(`You do not have active credit points to list as a ${t}. Please purchase a package first.`);
              }}
            />
          );
        })}
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
          disabled={disabled}
          onChange={() => {
            const patch: Partial<PropertyFormData> = { property_main_type: "residential", property_subtype: "", tenant_preference: [] };
            if (data.ownership_type === "Company Owned") {
              patch.ownership_type = "";
            }
            onChange(patch);
          }}
        />
        <RadioPill
          name="main_type"
          value="commercial"
          checked={data.property_main_type === "commercial"}
          label="Commercial"
          disabled={disabled}
          onChange={() => onChange({ property_main_type: "commercial", property_subtype: "", tenant_preference: [] })}
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
            disabled={disabled}
            onClick={() => handleSubtype(s.value)}
          />
        ))}
      </div>

      {/* Dynamic Area Fields */}
      {subtype && (
        <div className="mt-4 rounded-xl space-y-4">
          <h4 className="font-semibold text-sm text-gray-700">
            {["plot", "land"].includes(subtype) ? (subtype === "plot" ? "Plot Details" : "Land Details") : "Area Details"}
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {/* Unit * (Always rendered first in the grid) */}
            <div className="space-y-1">
              <Label>
                Unit <span className="text-red-500">*</span>
              </Label>
              <Select
                disabled={disabled}
                value={data.area_unit || ""}
                onValueChange={(v) => onChange({ area_unit: v })}
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

            {/* Plot/Land Area Input */}
            {showLandPlotDetails && (
              <div className="space-y-1">
                <Label>
                  {subtype === "plot" ? "Plot Area" : "Land Area"}{" "}
                  {showPlotAreaRequired && <span className="text-red-500">*</span>}
                </Label>
                <Input
                  type="number"
                  disabled={disabled}
                  value={data.plot_area || ""}
                  onChange={(e) => onChange({ plot_area: e.target.value })}
                  placeholder="Enter area"
                />
              </div>
            )}

            {/* Built-Up Area Input */}
            {showAreaDetails && (
              <div className="space-y-1">
                <Label>
                  Built-Up Area <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  disabled={disabled}
                  value={data.super_builtup_area || ""}
                  onChange={(e) => onChange({ super_builtup_area: e.target.value })}
                  placeholder="Enter area"
                />
              </div>
            )}

            {/* Carpet Area (Optional) */}
            {showAreaDetails && showCarpetArea && (
              <div className="space-y-1">
                <Label>Carpet Area (Sq. Ft)</Label>
                <Input
                  disabled={disabled}
                  value={data.carpet_area || ""}
                  onChange={(e) => handleDecimalInput("carpet_area", e.target.value)}
                  placeholder="Enter carpet area"
                />
              </div>
            )}

            {/* Storage Area (Required for Godown/Warehouse) */}
            {showAreaDetails && showStorageArea && (
              <div className="space-y-1">
                <Label>
                  Storage Area (Sq. Ft) <span className="text-red-500">*</span>
                </Label>
                <Input
                  disabled={disabled}
                  value={data.storage_area || ""}
                  onChange={(e) => handleDecimalInput("storage_area", e.target.value)}
                  placeholder="Enter storage area"
                />
              </div>
            )}
          </div>

          {/* Floor Details */}
          {showFloorDetails && (
            <>
              <h4 className="font-semibold text-sm text-gray-700 mt-2">
                Floor Details
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>
                    Total Floors {isFloorRequired && <span className="text-red-500">*</span>}
                  </Label>
                  <Input
                    type="number"
                    disabled={disabled}
                    value={data.total_floors || ""}
                    onChange={(e) => handleTotalFloorsChange(e.target.value)}
                    onBlur={handleFloorBlur}
                    placeholder="e.g. 10"
                    className={cn(isFloorInvalid && "border-red-500 focus-visible:ring-red-500 text-red-500")}
                  />
                </div>
                <div className="space-y-1">
                  <Label>
                    Property on Floor {isFloorRequired && <span className="text-red-500">*</span>}
                  </Label>
                  <Input
                    type="number"
                    disabled={disabled}
                    value={data.property_on_floor || ""}
                    onChange={(e) => handlePropertyOnFloorChange(e.target.value)}
                    onBlur={handleFloorBlur}
                    placeholder="e.g. 3"
                    className={cn(isFloorInvalid && "border-red-500 focus-visible:ring-red-500 text-red-500")}
                  />
                </div>

                {/* UDS Area (Optional, Apartment only) */}
                {showUdsArea && (
                  <div className="space-y-1">
                    <Label>UDS Area (Sq. Ft)</Label>
                    <Input
                      disabled={disabled}
                      value={data.uds_area || ""}
                      onChange={(e) => handleDecimalInput("uds_area", e.target.value)}
                      placeholder="Enter undivided share area"
                    />
                  </div>
                )}
              </div>
              {isFloorInvalid && (
                <p className="text-red-500 text-xs font-semibold mt-1">
                  Property Floor cannot be greater than Total Floors.
                </p>
              )}
            </>
          )}

          {/* Additional Details (Length/Breadth for Plot/Land) */}
          {showAdditionalDetails && (
            <>
              <h4 className="font-semibold text-sm text-gray-700 mt-2">
                Additional Details
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Length (Ft)</Label>
                  <Input
                    type="number"
                    disabled={disabled}
                    value={data.plot_length || ""}
                    onChange={(e) => onChange({ plot_length: e.target.value })}
                    placeholder="e.g. 60"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Breadth (Ft)</Label>
                  <Input
                    type="number"
                    disabled={disabled}
                    value={data.plot_breadth || ""}
                    onChange={(e) => onChange({ plot_breadth: e.target.value })}
                    placeholder="e.g. 40"
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
