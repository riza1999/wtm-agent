"use client";

import { uploadProfilePhoto } from "@/app/(protected)/settings/actions";
import { AccountProfile } from "@/app/(protected)/settings/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface ProfilePhotoSectionProps {
  accountProfile: AccountProfile;
}

const ProfilePhotoSection = ({ accountProfile }: ProfilePhotoSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleEditPhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset the file input to allow re-uploading the same file
    event.target.value = "";

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("profilePhoto", file);

      const result = await uploadProfilePhoto(formData);

      if (result.success) {
        toast.success(result.message);
        // In a real app, you might want to refresh the user data or update the image
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to upload profile photo");
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Profile photo</Label>
      <div className="relative inline-block">
        <Avatar className="h-36 w-36 rounded-lg">
          <AvatarImage src={accountProfile.profileImage} alt="Profile" />
          <AvatarFallback className="text-lg">
            {accountProfile.firstName?.[0]}
            {accountProfile.lastName?.[0]}
          </AvatarFallback>
        </Avatar>
        <Button
          size="icon"
          className="absolute -right-2 -bottom-2 h-10 w-10 rounded-full bg-[#2d3e3f] text-white shadow-lg"
          onClick={handleEditPhoto}
          disabled={isUploading}
        >
          {isUploading ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              className="animate-spin"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="32"
                strokeDashoffset="32"
                className="opacity-25"
              />
              <path
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="#fff"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16.474 5.341a2.5 2.5 0 1 1 3.536 3.535M3 17.25V21h3.75l10.607-10.607a2.5 2.5 0 0 0-3.535-3.535L3 17.25Z"
              />
            </svg>
          )}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ProfilePhotoSection;
