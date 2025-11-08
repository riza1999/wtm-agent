"use client";

import { RoomType } from "@/app/(protected)/hotel/[id]/types";
import { ChevronRight, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";
import { useState, useTransition } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { AdditionalServices } from "./additional-services";
import { PromoSelection } from "./promo-selection";
import RoomDetailsDialog from "./room-details-dialog";
import { RoomFeatures } from "./room-features";
import { RoomImageGallery } from "./room-image-gallery";
import { RoomOptions } from "./room-options";

export default function RoomCard({ room }: { room: RoomType }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false);
  const [selectedOption, setSelectedOption] = useState<number>(0);
  const [roomQuantity, setRoomQuantity] = useState(1);
  const [selectedAdditionals, setSelectedAdditionals] = useState<string[]>([]);
  const [selectedPromo, setSelectedPromo] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const roomImages = room.photos || [];

  // Get date parameters from URL
  const [from] = useQueryState("from", parseAsString);
  const [to] = useQueryState("to", parseAsString);

  // Generate unique radio group name for this room type
  const radioGroupName = `room-option-${room.name.toLowerCase().replace(/\s+/g, "-")}`;

  const handleAdditionalChange = (serviceId: string, checked: boolean) => {
    setSelectedAdditionals((prev) => {
      if (checked) {
        // Add serviceId to the array if not already present
        return prev.includes(serviceId) ? prev : [...prev, serviceId];
      } else {
        // Remove serviceId from the array
        return prev.filter((id) => id !== serviceId);
      }
    });
  };

  const handlePromoChange = (promoId: string | null) => {
    setSelectedPromo(promoId);
  };

  const handleAddToCart = () => {
    // Open confirmation dialog instead of directly adding to cart
    // setIsConfirmationDialogOpen(true);

    console.log({
      check_in_date: from,
      check_out_date: to,
      promo_id: selectedPromo,
      quantity: roomQuantity,
      room_price_id: selectedOption,
      room_type_additional_ids: selectedAdditionals,
    });
  };

  const handleConfirmAddToCart = () => {
    // startTransition(async () => {
    //   // Find the selected promo object
    //   const promo = availablePromos.find((p) => p.id === selectedPromo) || null;
    //   const cartData: AddToCartData = {
    //     hotelName,
    //     roomName: name,
    //     selectedOption: options[selectedOption],
    //     quantity: roomQuantity,
    //     selectedAdditionals,
    //     additionalServices: additionals || [],
    //     promoCode: promo ? promo.code : null,
    //   };
    //   const result = await addRoomToCart(cartData);
    //   if (result.success) {
    //     // Reset form to default values after successful submission
    //     resetForm();
    //     // Close confirmation dialog
    //     setIsConfirmationDialogOpen(false);
    //     toast.success(result.message, {
    //       action: {
    //         label: "View Cart",
    //         onClick: () => router.push("/cart"),
    //       },
    //       duration: 5000,
    //     });
    //   } else {
    //     // Close confirmation dialog
    //     setIsConfirmationDialogOpen(false);
    //     toast.error(result.message);
    //   }
    // });
  };

  // Function to reset form to default values
  const resetForm = () => {
    setSelectedOption(0);
    setRoomQuantity(1);
    setSelectedAdditionals([]);
    setSelectedPromo(null);
  };

  const features = [
    { icon: "Square", text: `${room.room_size} sqm` },
    { icon: "Users", text: `${room.max_occupancy} guests` },
    {
      icon: room.is_smoking_room ? "CigaretteOff" : "Cigarette",
      text: room.is_smoking_room ? "Non Smoking" : "Smoking",
    },
    { icon: "Bed", text: `${room.bed_types.join(", ")}` },
  ];

  return (
    <Card className="overflow-hidden rounded-lg bg-white shadow-sm">
      <div className="p-6">
        <h2 className="mb-6 text-2xl font-semibold text-gray-900">
          {room.name}
        </h2>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <RoomImageGallery
            images={roomImages}
            onImageClick={() => setIsDialogOpen(true)}
          />

          <div className="col-span-3 flex flex-col">
            <RoomOptions
              with_breakfast={room.with_breakfast}
              without_breakfast={room.without_breakfast}
              selectedOption={selectedOption}
              onOptionChange={setSelectedOption}
              radioGroupName={radioGroupName}
              promo={room.promos.find(
                (p) => String(p.promo_id) === selectedPromo,
              )}
            />

            <PromoSelection
              promos={room.promos}
              selectedPromo={selectedPromo}
              onPromoChange={handlePromoChange}
            />

            {room.additional && room.additional.length > 0 && (
              <AdditionalServices
                additionals={room.additional}
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
                className="px-8 py-2 text-white hover:bg-slate-700 disabled:opacity-50"
              >
                {isPending ? "Adding..." : "Add to Cart"}
              </Button>
            </div>
          </div>
        </div>

        <RoomDetailsDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          room={room}
          features={features}
        />

        {/* Add confirmation dialog */}
        {/* <AddToCartConfirmationDialog
          open={isConfirmationDialogOpen}
          onOpenChange={setIsConfirmationDialogOpen}
          onConfirm={handleConfirmAddToCart}
          isLoading={isPending} // Pass the loading state
          roomData={{
            hotelName,
            roomName: name,
            selectedOption: options[selectedOption],
            quantity: roomQuantity,
            selectedAdditionals,
            additionalServices: additionals || [],
            promoCode:
              availablePromos.find((p) => p.id === selectedPromo)?.code || null,
            totalPrice,
            roomTotal,
            servicesTotal,
            discount,
            numberOfNights,
          }}
        /> */}
      </div>
    </Card>
  );
}
