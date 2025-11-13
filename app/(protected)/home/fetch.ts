import { apiCall } from "@/lib/api";
import { buildQueryParams } from "@/lib/utils";
import { ApiResponse, SearchParams } from "@/types";
import { HotelListData } from "./types";
import { format } from "date-fns";

export const getHotels = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<ApiResponse<HotelListData>> => {
  // Get today and tomorrow dates
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const searchParamsWithDefaults = {
    ...searchParams,
    limit: searchParams.limit || "9",
    page: searchParams.page || "1",
    from: searchParams.from || format(today, "yyyy-MM-dd"),
    to: searchParams.to || format(tomorrow, "yyyy-MM-dd"),
  };

  const queryString = buildQueryParams(searchParamsWithDefaults);
  const url = `/hotels/agent${queryString ? `?${queryString}` : ""}`;
  const apiResponse = await apiCall<HotelListData>(url);

  return apiResponse;
};
