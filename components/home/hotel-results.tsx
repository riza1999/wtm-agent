"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  BedDouble,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { HotelListResponse } from "@/app/(protected)/home/types";
import { parseAsInteger, useQueryState } from "nuqs";

interface HotelResultsProps {
  promise: Promise<HotelListResponse>;
}

const HotelResults = ({ promise }: HotelResultsProps) => {
  const hotelsData = React.use(promise);
  return (
    <section className="grid auto-rows-min grid-cols-1 gap-4 sm:grid-cols-2 md:col-span-3 lg:grid-cols-3">
      <SearchByName />
      <HotelList hotels={hotelsData.data} pageCount={hotelsData.pageCount} />
    </section>
  );
};

const SearchByName = () => {
  return (
    <div className="col-span-1 flex gap-2 sm:col-span-2 lg:col-span-3">
      <Input placeholder={"Search Hotel Name Here..."} role="search" />
      <Button>
        <Search className="h-4 w-4" />
        <div className="hidden sm:inline">Search</div>
      </Button>
    </div>
  );
};

interface HotelListProps {
  hotels: HotelListResponse["data"];
  pageCount: HotelListResponse["pageCount"];
}

const HotelList = ({ hotels, pageCount }: HotelListProps) => {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const handleFirst = () => {
    if (page > 1) setPage(1);
  };

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };
  const handleNext = () => {
    if (page < pageCount) setPage(page + 1);
  };

  const handleLast = () => {
    if (page < pageCount) setPage(pageCount);
  };

  return (
    <>
      {hotels.map((hotel) => (
        <HotelCard key={hotel.id} hotel={hotel} />
      ))}
      <div className="col-span-full">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                aria-label="Go to first page"
                variant="ghost"
                size="icon"
                className="hidden size-8 lg:flex"
                disabled={page <= 1}
                onClick={() => {
                  handleFirst();
                }}
              >
                <ChevronsLeft />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePrev();
                }}
                aria-disabled={page <= 1}
                className={page <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                {page}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleNext();
                }}
                aria-disabled={page >= pageCount}
                className={
                  page >= pageCount ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
            <PaginationItem>
              <Button
                aria-label="Go to first page"
                variant="ghost"
                size="icon"
                className="hidden size-8 lg:flex"
                disabled={page >= pageCount}
                onClick={() => {
                  handleLast();
                }}
              >
                <ChevronsRight />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
};

interface HotelCardProps {
  hotel: HotelListResponse["data"][number];
}

const HotelCard = ({ hotel }: HotelCardProps) => {
  return (
    <Link href={`/hotel/${hotel.id}`}>
      <Card className="overflow-hidden py-0 hover:opacity-75">
        <div className="relative aspect-[4/3]">
          {/* <Image
            src={hotel.image}
            alt={`${hotel.name} hotel`}
            fill
            className="object-cover"
            sizes={"cover"}
          /> */}
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Image Placeholder</span>
          </div>
        </div>

        <div className="flex flex-col gap-1 p-4">
          <span className="text-yellow-500">{"★".repeat(hotel.star)}</span>
          <h3 className="text-lg font-semibold">{hotel.name}</h3>
          <p className="text-muted-foreground text-sm">{hotel.location}</p>

          <div className="mt-2 flex items-center gap-2 text-sm">
            <BedDouble className="h-4 w-4" />
            <span>{hotel.bedType}</span>
            <Users className="h-4 w-4" />
            <span>{hotel.guestCount} Guests</span>
          </div>

          <div className="mt-2 text-sm">
            <span className="text-muted-foreground">From</span>{" "}
            <span>{formatCurrency(hotel.price, "IDR")}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default HotelResults;
