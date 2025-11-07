import { apiCall } from "@/lib/api";
import { buildQueryParams } from "@/lib/utils";
import { ApiResponse, SearchParams } from "@/types";
import { HotelListData } from "./types";

export const getHotelsOld = async (): Promise<ApiResponse<HotelListData>> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    status: 200,
    message: "Success",
    data: {} as HotelListData,
  };
  // const data = [
  //   {
  //     id: "1",
  //     name: "Hotel Bali",
  //     location: "Kuta, Badung - Bali",
  //     price: 500000,
  //     star: 5,
  //     bedType: "Twin Bed",
  //     guestCount: 2,
  //     image: "/hotel-detail/WTM Prototype.png",
  //   },
  //   {
  //     id: "2",
  //     name: "Hotel Jakarta",
  //     location: "Blok M - Jakarta",
  //     price: 400000,
  //     star: 4,
  //     bedType: "King Size Bed",
  //     guestCount: 2,
  //     image: "/hotel-detail/WTM Prototype (1).png",
  //   },
  // ] as Hotel[];

  // return {
  //   success: true,
  //   data,
  //   pageCount: 2,
  // };
};

export const getHotels = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<ApiResponse<HotelListData>> => {
  const queryString = buildQueryParams(searchParams);
  const url = `/hotels/agent${queryString ? `?${queryString}` : ""}`;
  const apiResponse = await apiCall<HotelListData>(url);

  console.log({ hotels: apiResponse.data.hotels });

  return apiResponse;
};
