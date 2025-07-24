"use client";

import React, { useTransition } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { delay } from "@/lib/utils";
import { toast } from "sonner";
import { Clock, Loader2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const BookingDetailsSection = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Booking Details</h2>
      </div>

      <div className="grid gap-6 sm:gap-8">
        <HotelRoomCard />
      </div>
    </div>
  );
};

const HotelRoomCard = () => {
  const [isPending, startTransition] = useTransition();

  const onRemove = async () => {
    startTransition(async () => {
      await delay(1000);
      toast.success("Reservation removed");
    });
  };

  return (
    <div className="grid gap-4 sm:gap-6 md:grid-cols-5">
      <Card className="gap-0 p-0 col-span-3">
        <div className="space-y-2 p-6">
          <span className="text-yellow-500">{"★".repeat(5)}</span>
          <h3 className="font-semibold">Hotel Name | Business King Room</h3>
        </div>
        <div className="flex flex-1" />
        <div className="relative aspect-[3/1] overflow-hidden rounded-b-xl">
          {/* <Image
            src={imageSrc}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          /> */}
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Image Placeholder</span>
          </div>
        </div>
      </Card>
      <Card className="relative flex flex-col gap-0 col-span-2 p-0">
        <div className="p-6 flex items-center justify-between">
          <h3 className="font-semibold">Reservation Summary</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin text-red-500" />
            ) : (
              <Trash2 className="h-5 w-5 cursor-pointer text-red-500" />
            )}
          </Button>
        </div>

        <div className="mt-2 flex flex-col items-center px-6 justify-between gap-4 md:flex-row md:gap-2">
          <div className="w-full rounded-lg bg-gray-200 p-4 text-center md:flex-1">
            <div className="text-muted-foreground text-xs">Check-in</div>
            <div className="font-medium text-sm">
              {format(new Date(), "eee, MMMM d yyyy")}
            </div>
            <div className="text-xs">14.00 WIB</div>
          </div>

          <div className="flex items-center md:flex-col">
            <div className="hidden items-center md:flex">
              <div className="h-[1px] w-4 bg-gray-600"></div>
              <div className="flex items-center justify-center rounded-full border border-gray-300 px-2 py-1 text-xs dark:border-gray-600">
                <Clock className="mr-1 h-3 w-3" />1 Night
              </div>
              <div className="h-[1px] w-4 bg-gray-600"></div>
            </div>
            <div className="flex items-center md:hidden">
              <div className="flex items-center justify-center rounded-full border border-gray-300 px-2 py-1 text-xs dark:border-gray-600">
                <Clock className="mr-1 h-3 w-3" />1 Night
              </div>
            </div>
          </div>

          <div className="w-full rounded-lg bg-gray-200 p-4 text-center md:flex-1">
            <div className="text-muted-foreground text-xs">Check-out</div>
            <div className="font-medium text-sm">
              {format(new Date(), "eee, MMMM d yyyy")}
            </div>
            <div className="text-xs">
              Before <br />
              11.00 WIB
            </div>
          </div>
        </div>

        <div className="my-4 px-6 grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-0">
          <span className="text-muted-foreground col-span-1 text-xs md:col-span-3">
            Room Selected
          </span>

          {/* Business King Room Row */}
          <div className="col-span-1 md:col-span-2">
            <div className="leading-tight">
              <div className="font-medium text-sm leading-tight">
                (2x) Business King Room
              </div>
              <div className="text-xs font-extralight leading-tight">
                Include Breakfast | Smoking Room
              </div>
            </div>
          </div>
          <div className="flex text-sm md:flex-col md:justify-start">
            <span className="font-medium text-sm text-right">
              Rp. 2.800.000
            </span>
          </div>

          {/* Additional Lunch Row */}
          <div className="col-span-1 md:col-span-2">
            <span className="font-medium text-sm">Additional Lunch</span>
          </div>
          <div className="flex text-sm md:flex-col md:justify-start">
            <span className="font-medium text-sm text-right">
              Rp. 1.000.000
            </span>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <span className="whitespace-nowrap text-sm">Guest Name</span>
            <Select>
              <SelectTrigger className="w-[180px] border-none shadow-none">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BookingDetailsSection;
