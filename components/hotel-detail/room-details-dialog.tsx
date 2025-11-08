"use client";

import { RoomType } from "@/app/(protected)/hotel/[id]/types";
import { type CarouselApi } from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getIcon } from "@/lib/utils";
import React, { useEffect, useState } from "react";

interface RoomDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room: RoomType | null;
  showThumbnails?: boolean;
  features: {
    icon: string;
    text: string;
  }[];
}

const RoomDetailsDialog: React.FC<RoomDetailsDialogProps> = ({
  open,
  onOpenChange,
  room,
  showThumbnails = false,
  features,
}) => {
  const [mainApi, setMainApi] = useState<CarouselApi>();
  const [thumbnailApi, setThumbnailApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

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

  // Thumbnail navigation functions (simplified for showing all images)
  const handleThumbnailClick = (index: number) => {
    mainApi?.scrollTo(index);
  };

  // Determine grid layout based on image count
  // const getThumbnailGridCols = () => {
  //   if (room.images.length <= 2) return "grid-cols-2";
  //   if (room.images.length === 3) return "grid-cols-3";
  //   return "grid-cols-4";
  // };

  // const shouldShowThumbnails = showThumbnails && room.images.length > 1;

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
              {/* <Carousel setApi={setMainApi} className="w-full">
                <CarouselContent>
                  {room.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                        <Image
                          src={image}
                          alt={`${room.name} - Image ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {room.images.length > 1 && (
                  <>
                    <CarouselPrevious className="left-2 h-8 w-8 bg-white/90 shadow-md hover:bg-white" />
                    <CarouselNext className="right-2 h-8 w-8 bg-white/90 shadow-md hover:bg-white" />
                  </>
                )}
              </Carousel> */}

              {/* Image counter */}
              <div className="absolute right-2 bottom-2 rounded bg-black/50 px-2 py-1 text-sm text-white">
                {current} / {count}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {/* {shouldShowThumbnails && (
              <div className="space-y-2">
                {room.images.length <= 4 ? (
                  // Simple grid for 4 or fewer images 
                  <div className={`grid gap-2 ${getThumbnailGridCols()}`}>
                    {room.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => handleThumbnailClick(index)}
                        className={`relative aspect-square overflow-hidden rounded border-2 transition-all ${
                          current === index + 1
                            ? "border-blue-500"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="100px"
                        />
                      </button>
                    ))}
                  </div>
                ) : (
                  // Scrollable carousel showing all images
                  <div className="relative">
                    <Carousel
                      setApi={setThumbnailApi}
                      className="w-full"
                      opts={{
                        align: "start",
                        slidesToScroll: 2,
                      }}
                    >
                      <CarouselContent className="-ml-2">
                        {room.images.map((image, index) => (
                          <CarouselItem key={index} className="basis-1/4 pl-2">
                            <button
                              onClick={() => handleThumbnailClick(index)}
                              className={`relative aspect-square w-full overflow-hidden rounded border-2 transition-all ${
                                current === index + 1
                                  ? "border-blue-500"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <Image
                                src={image}
                                alt={`Thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="100px"
                              />
                            </button>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="left-0 h-6 w-6 bg-white/90 shadow-md hover:bg-white" />
                      <CarouselNext className="right-0 h-6 w-6 bg-white/90 shadow-md hover:bg-white" />
                    </Carousel>
                  </div>
                )}
              </div>
            )} */}
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
