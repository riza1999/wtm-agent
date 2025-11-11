import { z } from "zod";

export interface ContactUsFormData {
  name: string;
  email: string;
  subject: string;
  inquiryType: "general" | "booking";
  message: string;
  bookingId?: string;
  subBookingId?: string;
}

export const contactUsSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Please enter a valid email"),
    subject: z.string().min(1, "Subject is required"),
    type: z.enum(["general", "booking"], {
      required_error: "Please select an inquiry type",
    }),
    message: z.string().min(10, "Message must be at least 10 characters"),
    booking_code: z.string().optional(),
    sub_booking_code: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.type === "booking") {
        return data.booking_code && data.booking_code.length > 0;
      }
      return true;
    },
    {
      message: "Booking ID is required for booking inquiries",
      path: ["bookingId"],
    },
  );
// Note: subBookingId is optional for booking inquiries
// Users can submit booking-related inquiries without specifying a particular sub-booking item

export type ContactUsSchema = z.infer<typeof contactUsSchema>;

export interface ContactUsResponse {
  success: boolean;
  message: string;
  ticketId?: string;
}

export interface UserAccountData {
  name: string;
  email: string;
  id: string;
}

export interface BookingOption {
  value: string;
  label: string;
  subBookings?: SubBookingOption[];
}

export interface SubBookingOption {
  value: string;
  label: string;
}
