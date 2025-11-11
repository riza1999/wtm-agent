"use server";

import { apiCall } from "@/lib/api";
import { UserAccountData } from "./types";

export async function fetchUserAccount(): Promise<UserAccountData> {
  // Simulate fetching user account data
  // In a real application, this would fetch from your authentication system/database
  await new Promise((resolve) => setTimeout(resolve, 100));

  return {
    id: "user_123",
    name: "John Doe",
    email: "john.doe@example.com",
  };
}

export async function fetchUserBookings(): Promise<
  { label: string; value: string }[]
> {
  return [
    { label: "Hotel Bali Paradise - Booking #BK001", value: "BK-001" },
    { label: "Hotel Jakarta Grand - Booking #BK002", value: "BK-002" },
    { label: "Hotel Yogyakarta Heritage - Booking #BK003", value: "BK-003" },
    { label: "Hotel Bandung Hills - Booking #BK004", value: "BK-004" },
  ];

  const url = `bookings/ids`;
  const apiResponse = await apiCall<string[]>(url);

  console.log({ data: apiResponse.data });

  if (apiResponse.status === 200 && Array.isArray(apiResponse.data)) {
    return apiResponse.data.map((id) => ({
      label: id,
      value: id,
    }));
  }

  return [];
}

export async function fetchUserSubBookings(
  booking_id: string,
): Promise<{ label: string; value: string }[]> {
  void booking_id;

  return [
    {
      label: `Booking ${booking_id}-SB-001`,
      value: `${booking_id}-SB-001`,
    },
    {
      label: `Booking ${booking_id}-SB-002`,
      value: `${booking_id}-SB-002`,
    },
  ];

  const url = `bookings/${booking_id}/sub-ids`;
  const apiResponse = await apiCall<string[]>(url);

  console.log({ data: apiResponse.data });

  if (apiResponse.status === 200 && Array.isArray(apiResponse.data)) {
    return apiResponse.data.map((id) => ({
      label: id,
      value: id,
    }));
  }

  return [];
}
