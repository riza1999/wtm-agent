"use server";

import { User } from "@/types/user";
import { getContactDetails, saveContactDetails } from "./fetch";
import type {
  AdditionalService,
  RoomOption,
} from "@/app/(protected)/hotel-detail/types";

export interface AddToCartData {
  hotelName: string;
  roomName: string;
  selectedOption: RoomOption;
  quantity: number;
  selectedAdditionals: Record<string, boolean>;
  additionalServices: AdditionalService[];
}

export async function addRoomToCart(data: AddToCartData) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    // Simulate validation
    if (
      !data.hotelName ||
      !data.roomName ||
      !data.selectedOption ||
      data.quantity < 1
    ) {
      return {
        success: false,
        message: "Invalid room data provided",
      };
    }

    // Calculate selected additional services
    const selectedServices = data.additionalServices.filter(
      (service) => data.selectedAdditionals[service.id],
    );

    // Calculate total price
    const roomTotal = data.selectedOption.price * data.quantity;
    const servicesTotal = selectedServices.reduce(
      (sum, service) => sum + service.price,
      0,
    );
    const totalPrice = roomTotal + servicesTotal;

    // Simulate adding to cart (in a real app, this would save to database)
    console.log("Adding to cart:", {
      hotel: data.hotelName,
      room: data.roomName,
      option: data.selectedOption.label,
      quantity: data.quantity,
      selectedServices: selectedServices.map((s) => s.label),
      totalPrice,
    });

    // Simulate success response
    return {
      success: true,
      message: `${data.roomName} (${data.selectedOption.label}) has been added to cart`,
      data: {
        roomTotal,
        servicesTotal,
        totalPrice,
        itemCount: data.quantity,
      },
    };
  } catch (error) {
    console.error("Error adding room to cart:", error);
    return {
      success: false,
      message: "Failed to add room to cart. Please try again.",
    };
  }
}

export async function addUserAsGuest(user: User) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    // Simulate validation
    if (!user.id || !user.name || !user.email) {
      return {
        success: false,
        message: "Invalid user data provided",
      };
    }

    // Simulate success response
    return {
      success: true,
      message: `${user.name} has been added as a guest`,
    };
  } catch (error) {
    console.error("Error adding user as guest:", error);
    return {
      success: false,
      message: "Failed to add user as guest. Please try again.",
    };
  }
}

export async function deleteContactDetail(
  id: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const current = await getContactDetails();
    const exists = current.some((c) => c.id === id);
    if (!exists) {
      return {
        success: false,
        message: "Contact not found.",
      };
    }
    const updated = current.filter((c) => c.id !== id);
    const result = await saveContactDetails(updated);
    if (result.success) {
      return {
        success: true,
        message: "Contact deleted successfully.",
      };
    } else {
      return {
        success: false,
        message: result.message || "Failed to delete contact.",
      };
    }
  } catch (error) {
    console.error("Error deleting contact detail:", error);
    return {
      success: false,
      message: "An error occurred while deleting the contact.",
    };
  }
}
