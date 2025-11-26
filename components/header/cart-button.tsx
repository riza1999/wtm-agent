"use client";

import { useQuery } from "@tanstack/react-query";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { fetchCart } from "@/app/(protected)/cart/fetch";

interface CartButtonProps {}

export function CartButton({}: CartButtonProps) {
  const {
    data: cartData,
    isLoading: isLoadingCart,
    isError: isErrorCart,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });

  const cartItemCount = cartData?.data?.detail?.length || 0;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={"/cart"}>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 cursor-pointer sm:h-10 sm:w-10"
              disabled={isLoadingCart}
            >
              {isLoadingCart ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent sm:h-5 sm:w-5" />
              ) : (
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
              {cartItemCount > 0 && !isLoadingCart && !isErrorCart && (
                <Badge
                  variant="destructive"
                  className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full p-0 text-[10px] font-medium sm:-top-1 sm:-right-1 sm:h-5 sm:w-5 sm:text-xs"
                >
                  {cartItemCount}
                </Badge>
              )}
              {isErrorCart && !isLoadingCart && (
                <Badge
                  variant="destructive"
                  className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full p-0 text-[10px] font-medium sm:-top-1 sm:-right-1 sm:h-5 sm:w-5 sm:text-xs"
                >
                  !
                </Badge>
              )}
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          {isErrorCart && !isLoadingCart ? (
            <p>Error loading cart data</p>
          ) : isLoadingCart ? (
            <p>Loading cart...</p>
          ) : (
            <p>Cart items: {cartItemCount}</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
