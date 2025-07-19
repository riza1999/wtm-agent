import { HistoryBooking } from "@/app/(protected)/history-booking/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";

interface ViewNotesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: HistoryBooking | null;
}

const ViewNotesDialog: React.FC<ViewNotesDialogProps> = ({
  open,
  onOpenChange,
  booking,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Notes</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {booking ? (
            <>
              <div>
                <strong>Booking ID:</strong> {booking.bookingId}
              </div>
              <div>
                <strong>Guest Name:</strong> {booking.guestName}
              </div>
              <div>
                <strong>Notes:</strong> {booking.notes || "-"}
              </div>
            </>
          ) : (
            <div>No booking selected.</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewNotesDialog;
