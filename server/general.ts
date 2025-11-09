"use server";

import { apiCall } from "@/lib/api";

export async function fetchListBookingStatus() {
  const url = `bookings/booking-status`;
  const apiResponse = await apiCall<{ id: number; status: string }[]>(url);

  if (apiResponse.status === 200 && Array.isArray(apiResponse.data)) {
    return apiResponse.data.map((agent) => ({
      label: agent.status,
      value: agent.id.toString(),
    }));
  }

  return [];
}

export async function fetchListPaymentStatus() {
  const url = `bookings/payment-status`;
  const apiResponse = await apiCall<{ id: number; status: string }[]>(url);

  if (apiResponse.status === 200 && Array.isArray(apiResponse.data)) {
    return apiResponse.data.map((agent) => ({
      label: agent.status,
      value: agent.id.toString(),
    }));
  }

  return [];
}
