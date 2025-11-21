import FilterSidebar from "@/components/home/filter-sidebar";
import HotelResults from "@/components/home/hotel-results";
import { PromoBanner } from "@/components/home/promo-banner";
import SearchFilter from "@/components/home/search-filter";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchListProvince } from "@/server/general";
import React from "react";
import { getHotels } from "./fetch";
import { HomePageProps } from "./types";

const HomePage = async (props: HomePageProps) => {
  const searchParams = await props.searchParams;

  const hotelsPromise = getHotels({
    searchParams,
  });

  const provincesPromise = fetchListProvince();

  return (
    <div className="space-y-16">
      <div className="relative">
        <PromoBanner />
        <div className="absolute right-0 bottom-0 left-0 z-10 translate-y-1/2">
          <React.Suspense
            fallback={
              <div className="container mx-auto px-4">
                <Card className="p-6 shadow-lg">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <Skeleton className="mt-4 h-10 w-full" />
                </Card>
              </div>
            }
          >
            <SearchFilter provincesPromise={provincesPromise} />
          </React.Suspense>
        </div>
      </div>
      <div>
        <div className="py-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <React.Suspense
              fallback={
                <Card className="p-6">
                  <Skeleton className="mb-4 h-6 w-32" />
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </Card>
              }
              key={`filter-${JSON.stringify(searchParams)}`}
            >
              <FilterSidebar promise={hotelsPromise} />
            </React.Suspense>

            <React.Suspense
              fallback={
                <section className="grid auto-rows-min grid-cols-1 gap-4 sm:grid-cols-2 md:col-span-3 lg:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <Skeleton className="aspect-[2/1] w-full" />
                      <div className="p-4">
                        <Skeleton className="mb-2 h-4 w-24" />
                        <Skeleton className="mb-2 h-6 w-3/4" />
                        <Skeleton className="mb-4 h-4 w-full" />
                        <Skeleton className="h-8 w-32" />
                      </div>
                    </Card>
                  ))}
                </section>
              }
              key={`results-${JSON.stringify(searchParams)}`}
            >
              <HotelResults promise={hotelsPromise} />
            </React.Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
