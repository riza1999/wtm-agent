"use server";

import { apiCall } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function cancelBookingAction(
  bookingId: string,
): Promise<{ success: boolean; message: string }> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Dummy implementation - in real app, this would make API call
    console.log(`Cancelling booking: ${bookingId}`);

    // Simulate random success/failure for demonstration
    const isSuccess = Math.random() > 0.1; // 90% success rate

    if (isSuccess) {
      return {
        success: true,
        message: `Booking ${bookingId} has been successfully cancelled.`,
      };
    } else {
      return {
        success: false,
        message: "Failed to cancel booking. Please try again.",
      };
    }
  } catch (error) {
    console.error("Cancel booking error:", error);
    return {
      success: false,
      message: "An unexpected error occurred while cancelling the booking.",
    };
  }
}

export async function uploadReceipt(formData: FormData) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value || "";

  try {
    const receipt = formData.get("receipt") as File | null;
    const bookingId = formData.get("booking_id") as string | null;
    const subBookingId = formData.get("sub_booking_id") as string | null;

    if (!receipt) {
      return {
        success: false,
        message: "No file provided",
      };
    }

    const response = await apiCall("bookings/receipt", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status !== 200) {
      return {
        success: false,
        message: response.message || "Failed to upload receipt",
      };
    }

    revalidatePath("/history-booking", "layout");

    // For now, just return success without actual processing
    return {
      success: true,
      message: response.message || "Receipt uploaded successfully",
    };
  } catch (error) {
    console.error("Error uploading receipt:", error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to upload receipt",
    };
  }
}
