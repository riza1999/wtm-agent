import React from "react";
import { getHotels } from "./fetch";
import FilterSidebar from "@/components/home/filter-sidebar";
import HotelResults from "@/components/home/hotel-results";
import { PromoBanner } from "@/components/home/promo-banner";
import SearchFilter from "@/components/home/search-filter";

const HomePage = async () => {
  const hotelsPromise = getHotels();
  return (
    <div className="space-y-8">
      <PromoBanner />
      <SearchFilter />
      <div className="w-full">
        <div className="py-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <FilterSidebar />
            <HotelResults promise={hotelsPromise} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
