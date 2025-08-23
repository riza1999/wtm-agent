"use client";

import {
  changeLanguage,
  uploadCertificate,
  uploadNameCard,
} from "@/app/(protected)/settings/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface AdditionalSettingsSectionProps {
  defaultLanguage?: string;
}

const AdditionalSettingsSection = ({
  defaultLanguage = "english",
}: AdditionalSettingsSectionProps) => {
  const [language, setLanguage] = useState(defaultLanguage);
  const [isLanguageLoading, setIsLanguageLoading] = useState(false);
  const [isCertificateLoading, setIsCertificateLoading] = useState(false);
  const [isNameCardLoading, setIsNameCardLoading] = useState(false);

  const certificateFileRef = useRef<HTMLInputElement>(null);
  const nameCardFileRef = useRef<HTMLInputElement>(null);

  const handleLanguageChange = async (newLanguage: string) => {
    setIsLanguageLoading(true);
    try {
      const result = await changeLanguage({ language: newLanguage });
      if (result.success) {
        setLanguage(newLanguage);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to change language");
    } finally {
      setIsLanguageLoading(false);
    }
  };

  const handleCertificateUpload = async (file: File) => {
    setIsCertificateLoading(true);
    try {
      const formData = new FormData();
      formData.append("certificate", file);

      const result = await uploadCertificate(formData);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to upload certificate");
    } finally {
      setIsCertificateLoading(false);
    }
  };

  const handleNameCardUpload = async (file: File) => {
    setIsNameCardLoading(true);
    try {
      const formData = new FormData();
      formData.append("nameCard", file);

      const result = await uploadNameCard(formData);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to upload name card");
    } finally {
      setIsNameCardLoading(false);
    }
  };

  const handleFileSelect = (type: "certificate" | "nameCard") => {
    if (type === "certificate") {
      certificateFileRef.current?.click();
    } else {
      nameCardFileRef.current?.click();
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "certificate" | "nameCard",
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === "certificate") {
        handleCertificateUpload(file);
      } else {
        handleNameCardUpload(file);
      }
    }
  };
  return (
    <div className="space-y-6">
      {/* Language Setting */}
      <div>
        <Label className="text-sm font-medium">Language Setting</Label>
        <Select
          value={language}
          onValueChange={handleLanguageChange}
          disabled={isLanguageLoading}
        >
          <SelectTrigger className="mt-2 bg-gray-200">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="indonesian">Indonesian</SelectItem>
            <SelectItem value="korean">Korean</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Certificate Upload */}
      <div>
        <Label className="text-sm font-medium">Certificate</Label>
        <Card className="mt-2 border-2 border-dashed border-gray-300">
          <CardContent className="flex h-32 items-center justify-center">
            <Button
              className="flex items-center gap-2"
              onClick={() => handleFileSelect("certificate")}
              disabled={isCertificateLoading}
            >
              <Upload className="h-4 w-4" />
              {isCertificateLoading ? "Uploading..." : "Upload Certificate"}
            </Button>
            <input
              ref={certificateFileRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={(e) => handleFileChange(e, "certificate")}
              className="hidden"
            />
          </CardContent>
        </Card>
      </div>

      {/* Name Card Upload */}
      <div>
        <Label className="text-sm font-medium">Name Card</Label>
        <Card className="mt-2 border-2 border-dashed border-gray-300">
          <CardContent className="flex h-32 items-center justify-center">
            <Button
              className="flex items-center gap-2"
              onClick={() => handleFileSelect("nameCard")}
              disabled={isNameCardLoading}
            >
              <Upload className="h-4 w-4" />
              {isNameCardLoading ? "Uploading..." : "Upload Name Card"}
            </Button>
            <input
              ref={nameCardFileRef}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(e) => handleFileChange(e, "nameCard")}
              className="hidden"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdditionalSettingsSection;
