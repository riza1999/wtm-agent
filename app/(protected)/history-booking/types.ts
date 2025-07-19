import { SearchParams } from "@/types";

export interface HistoryBooking {
  id: string;
  number: number;
  guestName: string;
  bookingId: string;
  bookingStatus: "approved" | "waiting" | "rejected";
  paymentStatus: "paid" | "unpaid";
  notes?: string;
}

export interface HistoryBookingTableResponse {
  success: boolean;
  data: HistoryBooking[];
  pageCount: number;
}

export interface HistoryBookingPageProps {
  searchParams: Promise<SearchParams>;
}
