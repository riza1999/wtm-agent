"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import React from "react";
import { Logo } from "../logo";
import { CartButton } from "./cart-button";
import { DesktopNavigation } from "./desktop-navigation";
import { MobileMenu } from "./mobile-menu";
import { NavUser } from "./nav-user";
import { NotificationButton } from "./notification-button";

const menuItems = [
  {
    name: "Home",
    href: "/home",
    isPublic: true,
  },
  {
    name: "History Booking",
    href: "/history-booking",
    isPublic: false,
  },
  {
    name: "Contact Us",
    href: "/contact-us",
    isPublic: false,
  },
];

export const Header = () => {
  const [menuState, setMenuState] = React.useState(false);
  const { accessToken } = useAuth();

  const isAuthenticated = !!accessToken;

  // Filter menu items based on authentication status
  const filteredMenuItems = menuItems.filter(
    (item) => item.isPublic || isAuthenticated,
  );

  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className="bg-primary fixed z-20 w-full border-b text-white backdrop-blur-3xl"
      >
        <div className="mx-auto max-w-7xl px-4 transition-all duration-300 sm:px-6">
          <div className="relative flex flex-wrap items-center justify-between gap-3 py-2.5 sm:gap-6 sm:py-3 lg:gap-0 lg:py-4">
            {/* Left side - Navigation Menu (Desktop only) */}
            <DesktopNavigation filteredMenuItems={filteredMenuItems} />

            {/* Center - Logo */}
            <div className="order-2 flex w-auto items-center justify-center lg:order-none lg:w-auto">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2"
              >
                <div className="scale-90 sm:scale-100">
                  <Logo />
                </div>
              </Link>
            </div>

            {/* Right side - Mobile menu button and user controls */}
            <div className="order-3 flex w-auto items-center justify-end gap-2 sm:gap-3 lg:order-none lg:w-auto lg:gap-6">
              {/* Mobile menu toggle */}
              <div className="lg:hidden">
                <MobileMenu
                  menuState={menuState}
                  setMenuState={setMenuState}
                  filteredMenuItems={filteredMenuItems}
                />
              </div>

              {/* User controls */}
              <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
                {isAuthenticated ? (
                  <>
                    <div className="lg:block">
                      <CartButton />
                    </div>
                    <div className="lg:block">
                      <NotificationButton />
                    </div>
                    <div className="lg:block">
                      <NavUser />
                    </div>
                  </>
                ) : (
                  <div className="lg:block">
                    <NavUser />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
