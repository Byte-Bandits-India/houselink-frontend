"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  HOUSE_TYPES,
  CONSTRUCTION_AGES,
  FURNISHING_TYPES,
  WATER_SUPPLY_OPTIONS,
  FOOD_PREF_OPTIONS,
  NOTICE_PERIODS,
  LEASE_DURATIONS,
  MAINTENANCE_RESP,
  OWNERSHIP_TYPES,
} from "@/types/property";

interface Props {
  data: PropertyFormData;
  onChange: (patch: Partial<PropertyFormData>) => void;
  disabled?: boolean;
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-sm font-semibold text-gray-800 mt-5 mb-2">{children}</h3>
);

const RadioPill = ({
  checked,
  label,
  onChange,
}: {
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

const CheckPill = ({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: () => void;
}) => (
  <button
    type="button"
    onClick={onChange}
    className={cn(
      "px-4 py-1.5 rounded-full border text-sm font-medium transition-all duration-200",
      checked
        ? "bg-brand text-white border-brand"
        : "bg-white text-gray-600 border-gray-300 hover:border-brand"
    )}
  >
    {label}
  </button>
);

function toggleArray(arr: string[], val: string): string[] {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
}

function formatIndianPrice(val: string): string {
  const raw = val.replace(/[^0-9]/g, "").slice(0, 12);
  if (!raw) return "";
  return Number(raw).toLocaleString("en-IN");
}

function priceToWords(n: number): string {
  if (!n) return "";
  if (n >= 10000000) return `${(n / 10000000).toFixed(2)} Crore`;
  if (n >= 100000) return `${(n / 100000).toFixed(2)} Lakh`;
  if (n >= 1000) return `${(n / 1000).toFixed(2)} Thousand`;
  return String(n);
}

export default function Step2PropertyProfile({ data, onChange }: Props) {
  const isRentLease = data.property_for === "rent_lease";
  const isLand = ["plot", "land"].includes(data.property_subtype || "");
  const isCommercial = ["shop", "building", "godown", "warehouse", "office_space", "land"].includes(
    data.property_subtype || ""
  );
  const showResidentialFields = !isLand && !isCommercial;
  const showParkingCard = true;
  const tenantPrefs = data.tenant_preference || [];
  const parkingTypes = data.parking_type || [];

  return (
    <div className="space-y-1">
      {/* Property Name */}
      <SectionTitle>
        Property Name <span className="text-red-500">*</span>
      </SectionTitle>
      <Input
        value={data.name}
        onChange={(e) => {
          const name = e.target.value;
          const slug = name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-");
          onChange({ name, permalink: slug });
        }}
        placeholder="e.g. Greenwood Heights Apartment"
      />

      {/* Permalink */}
      <SectionTitle>
        Permalink <span className="text-red-500">*</span>
      </SectionTitle>
      <div className="flex items-center rounded-lg border border-gray-300 overflow-hidden">
        <span className="bg-gray-100 px-3 py-2 text-xs text-gray-500 border-r border-gray-300 whitespace-nowrap">
          houselink360.com/properties/
        </span>
        <Input
          className="border-0 rounded-none focus-visible:ring-0"
          value={data.permalink}
          onChange={(e) => onChange({ permalink: e.target.value })}
          placeholder="your-property-slug"
        />
      </div>

      {/* Description */}
      <SectionTitle>
        Description <span className="text-red-500">*</span>
      </SectionTitle>
      <Textarea
        rows={4}
        value={data.description}
        onChange={(e) => onChange({ description: e.target.value })}
        placeholder="Describe your property..."
        className="resize-none"
      />

      {/* Residential-only fields */}
      {showResidentialFields && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-1">
            <Label>
              House Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={data.house_type || ""}
              onValueChange={(v) => onChange({ house_type: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                {HOUSE_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Construction Age</Label>
            <Select
              value={data.construction_age || ""}
              onValueChange={(v) => onChange({ construction_age: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Age" />
              </SelectTrigger>
              <SelectContent>
                {CONSTRUCTION_AGES.map((a) => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>
              Bedrooms <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              min={0}
              value={data.bedrooms || ""}
              onChange={(e) => onChange({ bedrooms: e.target.value })}
              placeholder="e.g. 3"
            />
          </div>
          <div className="space-y-1">
            <Label>
              Bathrooms <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              min={0}
              value={data.bathrooms || ""}
              onChange={(e) => onChange({ bathrooms: e.target.value })}
              placeholder="e.g. 2"
            />
          </div>
        </div>
      )}

      {/* Balcony */}
      {showResidentialFields && (
        <>
          <SectionTitle>Balcony</SectionTitle>
          <div className="flex gap-3">
            {["Yes", "No"].map((v) => (
              <RadioPill
                key={v}
                checked={data.balcony === v}
                label={v}
                onChange={() => onChange({ balcony: v as any })}
              />
            ))}
          </div>
        </>
      )}

      {/* Villa-specific: Garden & Pool */}
      {data.property_subtype === "villa" && (
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <SectionTitle>Garden / Lawn</SectionTitle>
            <div className="flex gap-3">
              {["Yes", "No"].map((v) => (
                <RadioPill
                  key={v}
                  checked={data.garden === v}
                  label={v}
                  onChange={() => onChange({ garden: v as any })}
                />
              ))}
            </div>
          </div>
          <div>
            <SectionTitle>Swimming Pool</SectionTitle>
            <div className="flex gap-3">
              {["Yes", "No"].map((v) => (
                <RadioPill
                  key={v}
                  checked={data.swimming_pool === v}
                  label={v}
                  onChange={() => onChange({ swimming_pool: v as any })}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Furnishing */}
      {!isLand && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>
              Furnishing <span className="text-red-500">*</span>
            </Label>
            <Select
              value={data.furnishing_type || ""}
              onValueChange={(v) => onChange({ furnishing_type: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {FURNISHING_TYPES.map((f) => (
                  <SelectItem key={f} value={f}>{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {showResidentialFields && (
            <>
              <div className="space-y-1">
                <Label>Water Supply</Label>
                <Select
                  value={data.water_supply || ""}
                  onValueChange={(v) => onChange({ water_supply: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {WATER_SUPPLY_OPTIONS.map((w) => (
                      <SelectItem key={w} value={w}>{w}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>
                  Food Preference <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={data.food_preference || ""}
                  onValueChange={(v) => onChange({ food_preference: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {FOOD_PREF_OPTIONS.map((f) => (
                      <SelectItem key={f} value={f}>{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
      )}

      {/* Pet Policy (residential only) */}
      {showResidentialFields && (
        <>
          <SectionTitle>
            Pet Policy <span className="text-red-500">*</span>
          </SectionTitle>
          <div className="flex gap-3">
            {["Allowed", "Not Allowed"].map((v) => (
              <RadioPill
                key={v}
                checked={data.pet_policy === v}
                label={v}
                onChange={() => onChange({ pet_policy: v as any })}
              />
            ))}
          </div>
        </>
      )}

      {/* Tenant Preference (rent only) */}
      {isRentLease && (
        <>
          <SectionTitle>
            Tenant Preference <span className="text-red-500">*</span>
          </SectionTitle>
          <div className="flex gap-2 flex-wrap">
            {(isCommercial
              ? ["Individual", "Company", "Any"]
              : ["Family", "Bachelor", "Students", "Working Professionals", "Any"]
            ).map((t) => (
              <CheckPill
                key={t}
                checked={tenantPrefs.includes(t)}
                label={t}
                onChange={() =>
                  onChange({ tenant_preference: toggleArray(tenantPrefs, t) })
                }
              />
            ))}
          </div>
        </>
      )}

      {/* Parking */}
      <SectionTitle>
        Parking Availability <span className="text-red-500">*</span>
      </SectionTitle>
      <div className="flex gap-3">
        {["Yes", "No"].map((v) => (
          <RadioPill
            key={v}
            checked={data.parking_availability === v}
            label={v}
            onChange={() =>
              onChange({ parking_availability: v as any })
            }
          />
        ))}
      </div>
      {data.parking_availability === "Yes" && (
        <div className="mt-3 grid grid-cols-2 gap-4">
          <div>
            <Label className="mb-2 block">Parking Type</Label>
            <div className="flex gap-3">
              {["Bike", "Car"].map((t) => (
                <CheckPill
                  key={t}
                  checked={parkingTypes.includes(t)}
                  label={t}
                  onChange={() =>
                    onChange({ parking_type: toggleArray(parkingTypes, t) })
                  }
                />
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <Label>No. of Slots</Label>
            <Input
              type="number"
              value={data.parking_slots_count || ""}
              onChange={(e) => onChange({ parking_slots_count: e.target.value })}
              placeholder="e.g. 2"
            />
          </div>
        </div>
      )}

      {/* Rent/Lease specific */}
      {isRentLease && (
        <div className="mt-4 p-4 rounded-xl border border-gray-200 bg-gray-50">
          <SectionTitle>
            Are you going to… <span className="text-red-500">*</span>
          </SectionTitle>
          <div className="flex gap-3">
            {["rent", "lease"].map((v) => (
              <RadioPill
                key={v}
                checked={data.rent_lease_type === v}
                label={v.charAt(0).toUpperCase() + v.slice(1)}
                onChange={() => onChange({ rent_lease_type: v as any })}
              />
            ))}
          </div>
        </div>
      )}

      {/* Pricing */}
      {(!isRentLease || data.rent_lease_type) && (
        <div className="mt-4 rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b font-semibold text-sm text-gray-700">
            Pricing Details
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>
                  {isRentLease
                    ? data.rent_lease_type === "lease"
                      ? "Lease Amount"
                      : "Rent Amount"
                    : "Price"}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={data.price || ""}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, "").slice(0, 12);
                    onChange({ price: raw });
                  }}
                  placeholder="Enter amount"
                />
                {data.price && (
                  <p className="text-xs text-gray-500 mt-1">
                    {priceToWords(Number(data.price))}
                  </p>
                )}
              </div>
            </div>

            {/* Security Deposit (rent only) */}
            {isRentLease && data.rent_lease_type === "rent" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>
                    Security Deposit <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={data.security_deposit || ""}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^0-9]/g, "").slice(0, 12);
                      onChange({ security_deposit: raw });
                    }}
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Deposit Type</Label>
                  <div className="flex gap-3">
                    {["Fixed", "Negotiable"].map((v) => (
                      <RadioPill
                        key={v}
                        checked={data.security_deposit_type === v}
                        label={v}
                        onChange={() => onChange({ security_deposit_type: v as any })}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Maintenance */}
            {isRentLease && data.rent_lease_type === "rent" && (
              <div>
                <Label className="mb-2 block">
                  Maintenance Charge <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-3 mb-2">
                  {["Yes", "No"].map((v) => (
                    <RadioPill
                      key={v}
                      checked={data.maintenance_charge_status === v}
                      label={v}
                      onChange={() => onChange({ maintenance_charge_status: v as any })}
                    />
                  ))}
                </div>
                {data.maintenance_charge_status === "Yes" && (
                  <Input
                    value={data.maintenance_charge_amount || ""}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^0-9]/g, "").slice(0, 12);
                      onChange({ maintenance_charge_amount: raw });
                    }}
                    placeholder="Enter amount"
                  />
                )}
              </div>
            )}

            {/* Lease specific */}
            {isRentLease && data.rent_lease_type === "lease" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>
                    Lease Duration <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={data.lease_duration || ""}
                    onValueChange={(v) => onChange({ lease_duration: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {LEASE_DURATIONS.map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>
                    Maintenance Responsibility <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={data.maintenance_responsibility || ""}
                    onValueChange={(v) => onChange({ maintenance_responsibility: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {MAINTENANCE_RESP.map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Notice Period & Availability */}
            {isRentLease && data.rent_lease_type === "rent" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Notice Period</Label>
                  <Select
                    value={data.notice_period || ""}
                    onValueChange={(v) => onChange({ notice_period: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Period" />
                    </SelectTrigger>
                    <SelectContent>
                      {NOTICE_PERIODS.map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>
                    Availability <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={data.availability_status || "Ready to occupy"}
                    onValueChange={(v) => onChange({ availability_status: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ready to occupy">Ready to Occupy</SelectItem>
                      <SelectItem value="Available From">Available From</SelectItem>
                    </SelectContent>
                  </Select>
                  {data.availability_status === "Available From" && (
                    <Input
                      type="date"
                      className="mt-2"
                      value={data.availability_date || ""}
                      onChange={(e) => onChange({ availability_date: e.target.value })}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ownership (commercial) */}
      {isCommercial && (
        <div className="mt-4 space-y-1">
          <Label>
            Ownership <span className="text-red-500">*</span>
          </Label>
          <Select
            value={data.ownership_type || ""}
            onValueChange={(v) => onChange({ ownership_type: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {OWNERSHIP_TYPES.map((o) => (
                <SelectItem key={o} value={o}>{o}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
