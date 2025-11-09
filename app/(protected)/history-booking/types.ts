import { SearchParams } from "@/types";

export interface HistoryBooking {
  booking_code: string;
  booking_id: number;
  booking_status: string;
  detail: [
    {
      additional: string[];
      agent_name: string;
      booking_status: string;
      cancellation_date: string;
      guest_name: string;
      hotel_name: string;
      payment_status: string;
      sub_booking_id: string;
    },
  ];
  guest_name: string[];
  payment_status: string;
}

export interface HistoryBookingPageProps {
  searchParams: Promise<SearchParams>;
}
