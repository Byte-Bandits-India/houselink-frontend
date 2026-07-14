"use client"

import { createContext, useContext, useMemo, useRef, useState } from "react"
import type { ComponentProps } from "react"
import * as BasePhoneInput from "react-phone-number-input"
import type { Value as PhoneValue, Country, FlagProps, Props as RPNProps } from "react-phone-number-input"
import flags from "react-phone-number-input/flags"
import { GlobeIcon, ChevronDownIcon, SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// ─── Types ─────────────────────────────────────────────────────────────────

type PhoneInputSize = "sm" | "default" | "lg"

const PhoneInputContext = createContext<{
  variant: PhoneInputSize
  popupClassName?: string
}>({
  variant: "default",
  popupClassName: undefined,
})

type PhoneInputProps = Omit<ComponentProps<"input">, "onChange" | "value" | "ref"> &
  Omit<RPNProps<typeof BasePhoneInput.default>, "onChange" | "variant" | "popupClassName"> & {
    onChange?: (value: PhoneValue) => void
    variant?: PhoneInputSize
    popupClassName?: string
  }

// ─── PhoneInput ─────────────────────────────────────────────────────────────

function PhoneInput({
  className,
  variant,
  popupClassName,
  onChange,
  value,
  ...props
}: PhoneInputProps) {
  const phoneInputSize = variant ?? "default"

  // Ensure the value starts with + for E.164 format if it is a digit-only local number.
  const formattedValue = useMemo(() => {
    if (value && typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed && !trimmed.startsWith("+")) {
        // If it starts with 91 and has 12 digits, prepend "+"
        if (trimmed.startsWith("91") && trimmed.length === 12) {
          return `+${trimmed}` as PhoneValue;
        }
        // If it's 10 digits, prepend "+91"
        if (trimmed.length === 10) {
          return `+91${trimmed}` as PhoneValue;
        }
      }
    }
    return value;
  }, [value]);

  return (
    <PhoneInputContext.Provider value={{ variant: phoneInputSize, popupClassName }}>
      <BasePhoneInput.default
        className={cn(
          "flex",
          props["aria-invalid"] &&
            "[&_button]:border-destructive [&_button]:ring-destructive/50",
          className
        )}
        flagComponent={FlagComponent}
        countrySelectComponent={CountrySelect}
        inputComponent={InputComponent}
        smartCaret={false}
        value={formattedValue ?? undefined}
        onChange={(val) => onChange?.(val ?? ("" as PhoneValue))}
        {...props}
      />
    </PhoneInputContext.Provider>
  )
}

// ─── InputComponent ──────────────────────────────────────────────────────────

function InputComponent({ className, ...props }: ComponentProps<typeof Input>) {
  const { variant } = useContext(PhoneInputContext)

  return (
    <Input
      className={cn(
        "rounded-l-none rounded-r-[50px] border-l-0 focus-visible:z-10",
        variant === "sm" && "h-8 text-sm",
        variant === "lg" && "h-12 text-base",
        className
      )}
      {...props}
    />
  )
}

// ─── CountrySelect ───────────────────────────────────────────────────────────

type CountryEntry = { label: string; value: Country | undefined }

type CountrySelectProps = {
  disabled?: boolean
  value: Country
  options: CountryEntry[]
  onChange: (country: Country) => void
}

function CountrySelect({ disabled, value: selectedCountry, options: countryList, onChange }: CountrySelectProps) {
  const { variant, popupClassName } = useContext(PhoneInputContext)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const searchRef = useRef<HTMLInputElement>(null)

  const filteredCountries = useMemo(() => {
    if (!search) return countryList
    return countryList.filter(({ label }) =>
      label.toLowerCase().includes(search.toLowerCase())
    )
  }, [countryList, search])

  function handleSelect(country: Country) {
    onChange(country)
    setOpen(false)
    setSearch("")
  }

  return (
    <Popover open={open} onOpenChange={(o) => { setOpen(o); if (!o) setSearch("") }}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label="Select country"
          className={cn(
            "inline-flex shrink-0 items-center justify-center gap-1 rounded-l-[50px] border border-r-0 border-input bg-background px-2.5 transition-colors hover:bg-accent focus:z-10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            variant === "sm" && "h-8",
            variant === "lg" && "h-12",
            !variant || variant === "default" ? "h-10" : ""
          )}
        >
          <FlagComponent country={selectedCountry} countryName={selectedCountry} />
          <ChevronDownIcon className="h-3 w-3 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className={cn("w-72 p-0", popupClassName)}
        onOpenAutoFocus={(e) => {
          e.preventDefault()
          searchRef.current?.focus()
        }}
      >
        {/* Search */}
        <div className="flex items-center border-b px-3">
          <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <input
            ref={searchRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search country…"
            className="flex h-10 w-full bg-white py-3 text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        {/* List */}
        <div className="max-h-[min(20rem,var(--radix-popover-content-available-height,20rem))] overflow-y-auto overscroll-contain py-1">
          {filteredCountries.length === 0 ? (
            <p className="px-4 py-2.5 text-sm text-muted-foreground">No country found.</p>
          ) : (
            filteredCountries.map((item) =>
              item.value ? (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => handleSelect(item.value!)}
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:outline-none",
                    item.value === selectedCountry && "bg-white font-medium"
                  )}
                >
                  <FlagComponent country={item.value} countryName={item.label} />
                  <span className="flex-1 truncate text-left">{item.label}</span>
                  <span className="text-xs text-muted-foreground">
                    +{BasePhoneInput.getCountryCallingCode(item.value)}
                  </span>
                </button>
              ) : null
            )
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

// ─── FlagComponent ───────────────────────────────────────────────────────────

function FlagComponent({ country, countryName }: FlagProps) {
  const Flag = flags[country]

  return (
    <span className="flex h-4 w-5 shrink-0 items-center justify-center overflow-hidden rounded-sm">
      {Flag ? (
        <Flag title={countryName} />
      ) : (
        <GlobeIcon className="h-4 w-4 opacity-60" />
      )}
    </span>
  )
}

export { PhoneInput }
