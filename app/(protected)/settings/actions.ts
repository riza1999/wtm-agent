"use server";

import {
  AccountProfile,
  AccountSettingResponse,
  LanguageChange,
  PasswordChange,
} from "./types";

// Simulate updating account profile
export async function updateAccountProfile(
  input: AccountProfile,
): Promise<AccountSettingResponse> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log(input);

  // Simulate success response
  return { success: true, message: "Profile updated successfully" };
}

// Simulate changing password
export async function changePassword(
  input: PasswordChange,
): Promise<AccountSettingResponse> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate validation
  if (input.newPassword !== input.confirmPassword) {
    return { success: false, message: "New passwords do not match" };
  }

  if (input.newPassword.length < 8) {
    return {
      success: false,
      message: "Password must be at least 8 characters long",
    };
  }

  // Simulate success response
  return { success: true, message: "Password changed successfully" };
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

// Simulate profile photo upload
export async function uploadProfilePhoto(
  formData: FormData,
): Promise<AccountSettingResponse> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const file = formData.get("profilePhoto") as File;
  console.log("Profile photo upload input:", {
    fileName: file?.name,
    fileSize: file?.size,
    fileType: file?.type,
  });

  if (!file) {
    return { success: false, message: "No profile photo file provided" };
  }

  // Simulate file type validation (only images)
  if (!file.type.startsWith("image/")) {
    return { success: false, message: "Please upload a valid image file" };
  }

  // Simulate file size validation (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return {
      success: false,
      message: "Profile photo must be smaller than 5MB",
    };
  }

  // Simulate success response
  return { success: true, message: "Profile photo uploaded successfully" };
}
