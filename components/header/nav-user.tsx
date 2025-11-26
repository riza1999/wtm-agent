"use client";

import { fetchAccountProfile } from "@/app/(protected)/settings/fetch";
import { useAuth } from "@/context/AuthContext";
import { formatUrl } from "@/lib/url-utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronsUpDown, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Spinner } from "../ui/spinner";

export const NavUser = () => {
  const [isPending, startTransition] = React.useTransition();
  const { accessToken, logout } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const isAuthenticated = !!accessToken;

  const {
    data: dataProfile,
    isLoading: isLoadingProfile,
    isError: isErrorProfile,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchAccountProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    enabled: isAuthenticated,
  });

  const user = {
    name: dataProfile?.data?.full_name || "User",
    email: dataProfile?.data?.email || "",
    avatar: formatUrl(dataProfile?.data?.photo_profile) || "",
  };

  const handleLogout = async (
    event: React.MouseEvent | React.KeyboardEvent,
  ) => {
    event.preventDefault();

    startTransition(async () => {
      try {
        await logout();
        queryClient.clear();
        toast.success("Logout successfully");
      } catch (error) {
        console.error("Logout error", error);
        toast.error("Something went wrong while logging out");
      } finally {
        router.push("/login");
      }
    });
  };

  const handleSignIn = () => {
    router.push("/login");
  };

  if (isLoadingProfile) {
    return (
      <div className="h-9 w-9 animate-pulse rounded-full bg-gray-300 sm:h-10 sm:w-10" />
    );
  }

  if (!isAuthenticated) {
    return (
      <Button
        onClick={handleSignIn}
        variant={"ghost"}
        size="sm"
        className="h-9 gap-2 px-2 sm:h-10 sm:px-3"
      >
        <Avatar className="h-7 w-7 rounded-lg sm:h-8 sm:w-8">
          <AvatarImage src={""} alt={"Not logged In"} />
          <AvatarFallback className="rounded-lg"></AvatarFallback>
        </Avatar>
        <div className="grid-1 hidden text-left text-sm leading-tight sm:grid">
          <span className="truncate font-medium">Sign in</span>
        </div>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"ghost"}
          size={"sm"}
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-9 gap-2 px-2 sm:h-10 sm:gap-2 sm:px-3 lg:gap-2"
        >
          <Avatar className="h-7 w-7 rounded-lg sm:h-8 sm:w-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-primary rounded-lg text-xs sm:text-sm">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="grid-1 hidden text-left text-sm leading-tight sm:grid">
            <span className="truncate text-xs font-medium sm:text-sm">
              {user.name}
            </span>
            <span className="truncate text-[10px] sm:text-xs">
              {user.email}
            </span>
          </div>
          <ChevronsUpDown className="ml-auto hidden h-4 w-4 sm:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-30 rounded-lg"
        align="end"
      >
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={"/settings"}>
              <Settings />
              Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} disabled={isPending}>
          {isPending ? <Spinner /> : <LogOut className="size-4" />}
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
