import type { PropertyFormData } from "@/types/property";

// ─── Property form component prop types ───────────────────────────────────────

export type StepProps = {
  data: PropertyFormData;
  onChange: (patch: Partial<PropertyFormData>) => void;
  disabled?: boolean;
  showErrors?: boolean;
};

export type Step2Props = {
  data: PropertyFormData;
  onChange: (patch: Partial<PropertyFormData>) => void;
  disabled?: boolean;
  permalinkStatus?: "idle" | "checking" | "available" | "taken" | "error";
  onPermalinkStatusChange?: (status: "idle" | "checking" | "available" | "taken" | "error") => void;
};

export type Step5Props = {
  data: PropertyFormData;
  onChange: (patch: Partial<PropertyFormData>) => void;
  isEditMode?: boolean;
  disabled?: boolean;
  showErrors?: boolean;
};

export type PropertyFormWizardProps = {
  initialData?: Partial<PropertyFormData>;
  isEditMode?: boolean;
  isViewMode?: boolean;
  disabled?: boolean;
  onSubmit?: (data: PropertyFormData) => void;
  onEdit?: () => void;
};

export type PropertyImagesUploadProps = {
  images: string[];
  imageLimit: number;
  disabled?: boolean;
  onChange: (images: string[]) => void;
};

export type SingleImageUploadProps = {
  /** The current image URL (controlled from parent) */
  value: string;
  /** Called with the new object URL when a file is selected, or "" to clear */
  onValue: (url: string) => void;
  label: string;
  emptyLabel: string;
  disabled?: boolean;
  accept?: string;
};
