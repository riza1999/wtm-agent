"use client";

import type {
  AdditionalService,
  RoomCardProps,
  RoomOption,
} from "@/app/(protected)/hotel-detail/types";
import {
  IconArrowAutofitWidth,
  IconBed,
  IconFriends,
  IconSmoking,
  IconSmokingNo,
} from "@tabler/icons-react";
import { ChevronRight, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import RoomDetailsDialog from "./room-details-dialog";
import {
  addRoomToCart,
  type AddToCartData,
} from "@/app/(protected)/cart/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface ExtendedRoomCardProps extends RoomCardProps {
  hotelName?: string;
}

export function RoomCard({
  name,
  images,
  options,
  features,
  additionals,
  hotelName = "Grand Hotel", // Default fallback
}: ExtendedRoomCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number>(0);
  const [roomQuantity, setRoomQuantity] = useState(1);
  const [selectedAdditionals, setSelectedAdditionals] = useState<
    Record<string, boolean>
  >({});
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Generate unique radio group name for this room type
  const radioGroupName = `room-option-${name.toLowerCase().replace(/\s+/g, "-")}`;
  const roomData = { name, images, options, features, additionals };

  const handleAdditionalChange = (serviceId: string, checked: boolean) => {
    setSelectedAdditionals((prev) => ({
      ...prev,
      [serviceId]: checked,
    }));
  };

  const handleAddToCart = () => {
    startTransition(async () => {
      const cartData: AddToCartData = {
        hotelName,
        roomName: name,
        selectedOption: options[selectedOption],
        quantity: roomQuantity,
        selectedAdditionals,
        additionalServices: additionals || [],
      };

      const result = await addRoomToCart(cartData);

      if (result.success) {
        toast.success(result.message, {
          action: {
            label: "View Cart",
            onClick: () => router.push("/cart"),
          },
          duration: 5000,
        });
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <Card className="overflow-hidden rounded-lg bg-white shadow-sm">
      <div className="p-6">
        <h2 className="mb-6 text-2xl font-semibold text-gray-900">{name}</h2>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <RoomImageGallery images={images} />

          <div className="col-span-3 flex flex-col">
            <RoomOptions
              options={options}
              selectedOption={selectedOption}
              onOptionChange={setSelectedOption}
              radioGroupName={radioGroupName}
            />

            {/* Additional Services */}
            {additionals && additionals.length > 0 && (
              <AdditionalServices
                additionals={additionals}
                selectedAdditionals={selectedAdditionals}
                onAdditionalChange={handleAdditionalChange}
              />
            )}

            <RoomFeatures features={features} />

            <div className="mt-4">
              <button
                onClick={() => setIsDialogOpen(true)}
                className="inline-flex items-center text-xs text-gray-600 hover:text-gray-900"
              >
                See Room Details & Benefit
                <ChevronRight size={16} className="ml-1" />
              </button>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Room</span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setRoomQuantity(Math.max(1, roomQuantity - 1))
                    }
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center text-sm">
                    {roomQuantity}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRoomQuantity(roomQuantity + 1)}
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={isPending}
                className="bg-slate-800 px-8 py-2 text-white hover:bg-slate-700 disabled:opacity-50"
              >
                {isPending ? "Adding..." : "Add to Cart"}
              </Button>
            </div>
          </div>
        </div>

        <RoomDetailsDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          room={roomData}
          showThumbnails={true}
        />
      </div>
    </Card>
  );
}

function RoomImageGallery({ images }: { images: string[] }) {
  return (
    <div className="col-span-2 grid grid-cols-3 gap-2">
      <div className="group relative col-span-3 aspect-[4/3] overflow-hidden rounded-lg">
        <Image
          alt="Room main image"
          src={images[0]}
          className="absolute size-full object-cover transition-opacity group-hover:opacity-90"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      {images.slice(1, 4).map((image, index) => (
        <div
          key={index}
          className="group relative col-span-1 aspect-square overflow-hidden rounded-lg"
        >
          <Image
            alt={`Room image ${index + 2}`}
            src={image}
            className="absolute size-full object-cover transition-opacity group-hover:opacity-90"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      ))}
    </div>
  );
}

function RoomOptions({
  options,
  selectedOption,
  onOptionChange,
  radioGroupName,
}: {
  options: RoomOption[];
  selectedOption: number;
  onOptionChange: (index: number) => void;
  radioGroupName: string;
}) {
  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-gray-900">Room Options</h3>
      <div className="space-y-4">
        {options.map((option, index) => (
          <div
            key={index}
            className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50 ${
              selectedOption === index ? "border-primary" : "border-gray-200"
            }`}
            onClick={() => onOptionChange(index)}
          >
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                id={`option-${radioGroupName}-${index}`}
                name={radioGroupName}
                checked={selectedOption === index}
                onChange={() => onOptionChange(index)}
                className="h-4 w-4 cursor-pointer text-slate-800 focus:ring-slate-500"
              />
              <div className="cursor-pointer">
                <label
                  htmlFor={`option-${radioGroupName}-${index}`}
                  className="cursor-pointer font-medium text-gray-900"
                >
                  {option.label}
                </label>
                {option.includes && (
                  <p className="text-sm text-gray-600">{option.includes}</p>
                )}
              </div>
            </div>

            <div className="text-right">
              {option.originalPrice && (
                <p className="text-sm text-gray-500 line-through">
                  Rp {option.originalPrice.toLocaleString("id-ID")}
                </p>
              )}
              <p className="text-lg font-semibold text-gray-900">
                Rp {option.price.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdditionalServices({
  additionals,
  selectedAdditionals,
  onAdditionalChange,
}: {
  additionals: AdditionalService[];
  selectedAdditionals: Record<string, boolean>;
  onAdditionalChange: (serviceId: string, checked: boolean) => void;
}) {
  return (
    <div className="mt-6">
      <h4 className="mb-3 text-sm font-semibold text-gray-900">
        Additional Services
      </h4>
      <div className="space-y-3">
        {additionals.map((service) => (
          <div key={service.id} className="flex items-center space-x-3">
            <Checkbox
              id={service.id}
              checked={selectedAdditionals[service.id] || false}
              onCheckedChange={(checked) =>
                onAdditionalChange(service.id, checked as boolean)
              }
            />
            <label
              htmlFor={service.id}
              className="text-sm font-medium text-gray-900"
            >
              {service.label}
            </label>
            {service.price > 0 && (
              <span className="text-sm text-gray-600">
                Rp {service.price.toLocaleString("id-ID")}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function RoomFeatures({
  features,
}: {
  features: {
    icon: string;
    text: string;
  }[];
}) {
  const getIcon = (iconName: string) => {
    const icons = {
      Square: <IconArrowAutofitWidth className="h-4 w-4 text-gray-600" />,
      Users: <IconFriends className="h-4 w-4 text-gray-600" />,
      Cigarette: <IconSmoking className="h-4 w-4 text-gray-600" />,
      CigaretteOff: <IconSmokingNo className="h-4 w-4 text-gray-600" />,
      Bed: <IconBed className="h-4 w-4 text-gray-600" />,
    };
    return icons[iconName as keyof typeof icons] || null;
  };

  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-6">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            {getIcon(feature.icon)}
            <span className="text-sm font-semibold text-gray-600">
              {feature.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
