"use server";

import { PasswordChangeSchema } from "@/components/settings/account-setting-form";
import { ProfileSchema } from "@/components/settings/edit-profile-form";
import { apiCall } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { AccountSettingResponse, LanguageChange } from "./types";

export async function updateAccountProfile(
  input: ProfileSchema,
): Promise<AccountSettingResponse> {
  try {
    const { agent_company, ...body } = input;

    console.log({ body });

    const response = await apiCall(`profile`, {
      method: "PUT",
      body: JSON.stringify(body),
    });

    if (response.status !== 200) {
      return {
        success: false,
        message: response.message || "Failed to update profile",
      };
    }

    revalidatePath("/settings", "layout");

    return {
      success: true,
      message: response.message || "Profile has been successfully updated",
    };
  } catch (error) {
    console.error("Error updating profile:", error);

    // Handle API error responses with specific messages
    if (error && typeof error === "object" && "message" in error) {
      return {
        success: false,
        message: error.message as string,
      };
    }

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update profile",
    };
  }
}

export async function changePassword(
  input: PasswordChangeSchema,
): Promise<AccountSettingResponse> {
  try {
    const body = {
      ...input,
    };

    const response = await apiCall(`profile/setting`, {
      method: "PUT",
      body: JSON.stringify(body),
    });

    if (response.status !== 200) {
      return {
        success: false,
        message: response.message || "Failed to change password",
      };
    }

    revalidatePath("/setting/account-setting", "layout");

    return {
      success: true,
      message: response.message || "Password has been successfully changed",
    };
  } catch (error) {
    console.error("Error changing password:", error);

    // Handle API error responses with specific messages
    if (error && typeof error === "object" && "message" in error) {
      return {
        success: false,
        message: error.message as string,
      };
    }

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to change password",
    };
  }
}

// Simulate changing language setting
export async function changeLanguage(
  input: LanguageChange,
): Promise<AccountSettingResponse> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  console.log("Language change input:", input);

  // Simulate success response
  return {
    success: true,
    message: `Language changed to ${input.language} successfully`,
  };
}

export async function updateAccountProfilePhoto(
  formData: FormData,
): Promise<AccountSettingResponse> {
  try {
    const file = formData.get("photo_profile");

    if (!file || !(file instanceof File)) {
      return {
        success: false,
        message: "Please provide a valid image file.",
      };
    }

    const body = new FormData();

    body.append("file_type", "photo");
    body.append("photo", file);

    const response = await apiCall("profile/file", {
      method: "PUT",
      body,
    });

    console.log({ response });

    if (response.status !== 200) {
      return {
        success: false,
        message: response.message || "Failed to update profile photo",
      };
    }

    revalidatePath("/setting/account-setting", "layout");

    return {
      success: true,
      message: response.message || "Profile photo updated successfully",
    };
  } catch (error) {
    console.error("Error updating profile photo:", error);
    if (error && typeof error === "object" && "message" in error) {
      return {
        success: false,
        message: error.message as string,
      };
    }

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update profile photo",
    };
  }
}

// Simulate certificate upload
export async function uploadCertificate(
  formData: FormData,
): Promise<AccountSettingResponse> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const file = formData.get("certificate") as File;
  console.log("Certificate upload input:", {
    fileName: file?.name,
    fileSize: file?.size,
    fileType: file?.type,
  });

  if (!file) {
    return { success: false, message: "No certificate file provided" };
  }

  // Simulate success response
  return { success: true, message: "Certificate uploaded successfully" };
}

// Simulate name card upload
export async function uploadNameCard(
  formData: FormData,
): Promise<AccountSettingResponse> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const file = formData.get("nameCard") as File;
  console.log("Name card upload input:", {
    fileName: file?.name,
    fileSize: file?.size,
    fileType: file?.type,
  });

  if (!file) {
    return { success: false, message: "No name card file provided" };
  }

  // Simulate success response
  return { success: true, message: "Name card uploaded successfully" };
}
