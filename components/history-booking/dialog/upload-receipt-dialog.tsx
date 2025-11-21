"use client";

import { uploadReceipt } from "@/app/(protected)/history-booking/action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { toast } from "sonner";

interface UploadReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId?: string;
  subBookingId?: string;
  onSuccess?: () => void;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export const UploadReceiptDialog: React.FC<UploadReceiptDialogProps> = ({
  open,
  onOpenChange,
  bookingId,
  subBookingId,
  onSuccess,
}) => {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewDataUrl, setPreviewDataUrl] = React.useState<string | null>(
    null,
  );
  const [isPending, startTransition] = React.useTransition();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const resetSelection = React.useCallback(() => {
    setSelectedFile(null);
    setPreviewDataUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      onOpenChange(nextOpen);
      if (!nextOpen) {
        resetSelection();
      }
    },
    [onOpenChange, resetSelection],
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      resetSelection();
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds 2MB. Please choose a smaller image.");
      resetSelection();
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : null;
      setPreviewDataUrl(result);
      setSelectedFile(file);
    };

    reader.onerror = () => {
      toast.error("Failed to read the selected file. Please try again.");
      resetSelection();
    };

    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast.error("Please select an image to upload.");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("receipt", selectedFile);

      if (bookingId) {
        formData.append("booking_id", bookingId);
      }

      if (subBookingId) {
        formData.append("booking_detail_id", subBookingId);
      }

      const { success, message } = await uploadReceipt(formData);

      if (!success) {
        toast.error(message ?? "Failed to upload receipt.");
        return;
      }

      toast.success(message ?? "Receipt uploaded successfully.");
      onSuccess?.();
      handleOpenChange(false);
      resetSelection();
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Payment Receipt</DialogTitle>
          <DialogDescription>
            Choose a JPG, PNG, or WEBP image that is no larger than 2MB.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="flex justify-center">
            <div className="bg-muted relative h-60 w-full overflow-hidden rounded-lg border">
              {previewDataUrl ? (
                <Image
                  src={previewDataUrl}
                  alt="Selected receipt preview"
                  fill
                  sizes="(max-width: 448px) 100vw, 448px"
                  className="object-contain"
                />
              ) : (
                <div className="text-muted-foreground flex h-full w-full items-center justify-center text-sm">
                  No image selected
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="receipt-input">Upload receipt</Label>
            <Input
              ref={fileInputRef}
              id="receipt-input"
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleFileChange}
            />
            <p className="text-muted-foreground text-xs">
              Maximum size 2MB. Accepted formats: JPG, PNG, WEBP.
            </p>
          </div>
        </div>
        <DialogFooter className="gap-2 sm:space-x-0">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={resetSelection}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleUpload}
            disabled={isPending || !selectedFile}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Upload Receipt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
