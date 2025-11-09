import { apiCall } from "@/lib/api";
import { buildQueryParams } from "@/lib/utils";
import { ApiResponse, SearchParams } from "@/types";
import { HistoryBooking } from "./types";

export const getData = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<ApiResponse<HistoryBooking[]>> => {
  // await new Promise((resolve) => setTimeout(resolve, 1000));

  // return {
  //   status: 200,
  //   message: "Success",
  //   data: [
  //     {
  //       booking_code: "BK-251108-y4m4",
  //       booking_id: 1,
  //       booking_status: "1 of 1 confirmed",
  //       detail: [
  //         {
  //           additional: ["string", "string2"],
  //           agent_name: "agent name",
  //           booking_status: "confirmed",
  //           cancellation_date: "2023-11-08",
  //           guest_name: "guest name",
  //           hotel_name: "hotel name",
  //           payment_status: "paid",
  //           sub_booking_id: "SB-251108-y4m4",
  //         },
  //       ],
  //       guest_name: ["guest name", "guest name 2"],
  //       payment_status: "paid",
  //     },
  //   ],
  // };

  const queryString = buildQueryParams(searchParams);
  const url = `/bookings/history${queryString ? `?${queryString}` : ""}`;
  const apiResponse = await apiCall<HistoryBooking[]>(url);

  console.log({ data: apiResponse.data });

  return apiResponse;

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const data: HistoryBooking[] = [
    {
      id: "1",
      number: 1,
      guestName: "John Doe",
      bookingId: "BK-001",
      bookingStatus: "approved",
      paymentStatus: "paid",
      notes: "VIP guest, early check-in.",
    },
    {
      id: "2",
      number: 2,
      guestName: "Jane Smith",
      bookingId: "BK-002",
      bookingStatus: "waiting",
      paymentStatus: "unpaid",
      notes: "Requires airport pickup.",
    },
    {
      id: "3",
      number: 3,
      guestName: "Alice Brown",
      bookingId: "BK-003",
      bookingStatus: "rejected",
      paymentStatus: "unpaid",
      notes: "Card declined.",
    },
  ];

  return {
    success: true,
    data,
    pageCount: 1,
  };
};
