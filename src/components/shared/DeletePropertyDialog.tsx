"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertTriangleIcon } from "lucide-react";
import { useState } from "react";

interface DeletePropertyDialogProps {
  propertyName: string;
  onConfirm: () => void | Promise<void>;
  /** Uncontrolled: provide a trigger node and the dialog manages its own open state */
  trigger?: React.ReactNode;
  /** Controlled: provide open + onOpenChange when you manage state externally */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DeletePropertyDialog({
  propertyName,
  onConfirm,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: DeletePropertyDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled
    ? (val: boolean) => controlledOnOpenChange?.(val)
    : setInternalOpen;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <div className="flex items-start gap-3">
            {/* Icon circle — uses project's danger color directly */}
            <div className="bg-red-100 text-danger rounded-full flex size-10 shrink-0 items-center justify-center">
              <AlertTriangleIcon className="size-5 text-danger" />
            </div>
            <div className="flex flex-col gap-1">
              <DialogTitle className="text-ink">Are you sure?</DialogTitle>
              <DialogDescription className="text-ink-secondary">
                This action cannot be undone. This will permanently delete{" "}
                <span className="font-semibold text-ink">
                  &quot;{propertyName}&quot;
                </span>{" "}
                and remove all associated data from our servers.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              disabled={loading}
              className="border border-gray-300 bg-white text-ink hover:bg-gray-50 font-semibold"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            disabled={loading}
            onClick={handleConfirm}
            className="bg-danger text-white hover:bg-red-600 font-semibold rounded-md"
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
