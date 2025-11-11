"use server";

import { type RegisterResponse } from "./type";
import { ApiResponse } from "@/types";

const AUTH_API_BASE_URL =
  process.env.AUTH_API_BASE_URL ?? "http://54.255.206.242:4816/api";

export async function registerAction(
  formData: FormData,
): Promise<RegisterResponse> {
  try {
    const response = await fetch(`${AUTH_API_BASE_URL}/register`, {
      method: "POST",
      body: formData,
      cache: "no-store",
    });

    if (response.status !== 200) {
      return {
        success: false,
        message: "Failed to register",
      };
    }

    const apiResponse: ApiResponse<{ message: string; status: number }> =
      await response.json();

    console.log({ apiResponse });

    if (apiResponse.status !== 200) {
      return {
        success: false,
        message: apiResponse.message || "Failed to register",
      };
    }

    return {
      success: true,
      message: apiResponse.message || "Registration successful",
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "An error occurred during registration. Please try again.",
    };
  }
}
