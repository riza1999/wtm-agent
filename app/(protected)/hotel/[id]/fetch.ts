import { apiCall } from "@/lib/api";
import { ApiResponse } from "@/types";
import { HotelDetail } from "./types";

export async function fetchHotelDetail({
  hotel_id,
}: {
  hotel_id: string;
}): Promise<ApiResponse<HotelDetail>> {
  // const queryString = buildQueryParams(searchParams);
  const url = `/hotels/agent/${hotel_id}`;
  const apiResponse = await apiCall<HotelDetail>(url);

  return apiResponse;
}
