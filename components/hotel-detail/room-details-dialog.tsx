"use client";

import { RoomType } from "@/app/(protected)/hotel/[id]/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getIcon } from "@/lib/utils";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface RoomDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room: RoomType | null;
  features: {
    icon: string;
    text: string;
  }[];
}

// Custom image component with fallback
function ImageWithFallback({
  src,
  alt,
  className,
  fill,
  sizes,
}: {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
}) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Handle cases where src is empty or undefined
  if (!src) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-gray-100`}
      >
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">No Image Available</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-gray-100`}
      >
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">Failed to load image</p>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      fill={fill}
      sizes={sizes}
      onError={() => setError(true)}
      onLoad={() => setIsLoading(false)}
      style={{ display: isLoading ? "none" : "block" }}
    />
  );
}

const RoomDetailsDialog: React.FC<RoomDetailsDialogProps> = ({
  open,
  onOpenChange,
  room,
  features,
}) => {
  const [mainApi, setMainApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(1);
  const [count, setCount] = useState(1);

  useEffect(() => {
    if (!mainApi) return;

    setCount(mainApi.scrollSnapList().length);
    setCurrent(mainApi.selectedScrollSnap() + 1);

    mainApi.on("select", () => {
      setCurrent(mainApi.selectedScrollSnap() + 1);
    });
  }, [mainApi]);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setCurrent(1);
    }
  }, [open]);

  if (!room) return null;

  // Check if room has photos
  const hasPhotos = room.photos && room.photos.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] min-w-7xl overflow-y-auto bg-white px-8">
        <DialogHeader>
          <DialogTitle className="text-left text-2xl font-bold">
            {room.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Main Image Carousel */}
          <div className="space-y-4">
            <div className="relative">
              {hasPhotos ? (
                <Carousel setApi={setMainApi} className="w-full">
                  <CarouselContent>
                    {room.photos?.map((photo, index) => (
                      <CarouselItem key={index}>
                        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                          <ImageWithFallback
                            src={photo}
                            alt={`${room.name} - Image ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {room.photos?.length > 1 && (
                    <>
                      <CarouselPrevious className="left-2 h-8 w-8 bg-white/90 shadow-md hover:bg-white" />
                      <CarouselNext className="right-2 h-8 w-8 bg-white/90 shadow-md hover:bg-white" />
                    </>
                  )}
                </Carousel>
              ) : (
                // Fallback when no photos are available
                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      No Images Available
                    </p>
                  </div>
                </div>
              )}

              {/* Image counter - only show if there are photos */}
              {hasPhotos && (
                <div className="absolute right-2 bottom-2 rounded bg-black/50 px-2 py-1 text-sm text-white">
                  {current} / {count}
                </div>
              )}
            </div>
          </div>

          {/* Room Information Section */}
          <div className="space-y-6">
            <div>
              <h3 className="mb-4 text-lg font-semibold">Room Information</h3>
              <div className="grid grid-cols-3 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {getIcon(feature.icon)}
                    <span className="text-sm capitalize">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">About This Room</h3>
              <div className="space-y-3">
                {/* {roomDetails.aboutRoom.map((detail, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" />
                    <span className="text-sm leading-relaxed text-gray-700">
                      {detail.includes(" - ") ? (
                        <>
                          <span className="font-medium">
                            {detail.split(" - ")[0]}
                          </span>
                          {" - "}
                          {detail.split(" - ").slice(1).join(" - ")}
                        </>
                      ) : (
                        detail
                      )}
                    </span>
                  </div>
                ))} */}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoomDetailsDialog;
