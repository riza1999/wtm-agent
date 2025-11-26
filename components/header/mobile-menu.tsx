"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";

interface MenuItem {
  name: string;
  href: string;
  isPublic: boolean;
}

interface MobileMenuProps {
  menuState: boolean;
  setMenuState: (state: boolean) => void;
  filteredMenuItems: MenuItem[];
}

export function MobileMenu({
  menuState,
  setMenuState,
  filteredMenuItems,
}: MobileMenuProps) {
  return (
    <>
      <button
        onClick={() => setMenuState(!menuState)}
        aria-label={menuState ? "Close Menu" : "Open Menu"}
        className="relative z-20 -m-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-md p-2 transition-colors hover:bg-white/10 active:bg-white/20 sm:h-10 sm:w-10"
      >
        <Menu className="m-auto h-5 w-5 duration-200 in-data-[state=active]:scale-0 in-data-[state=active]:rotate-180 in-data-[state=active]:opacity-0 sm:h-6 sm:w-6" />
        <X className="absolute inset-0 m-auto h-5 w-5 scale-0 -rotate-180 opacity-0 duration-200 in-data-[state=active]:scale-100 in-data-[state=active]:rotate-0 in-data-[state=active]:opacity-100 sm:h-6 sm:w-6" />
      </button>

      {/* Menu Mobile */}
      <div className="bg-background absolute top-full right-0 left-0 mt-0 hidden w-full border-b p-4 shadow-lg shadow-zinc-300/20 in-data-[state=active]:block sm:p-6 dark:shadow-none">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-start space-y-4">
            <ul className="w-full space-y-3 text-base sm:space-y-4">
              {filteredMenuItems.map((item, index) => {
                return (
                  <li key={index}>
                    <Link
                      href={item.href}
                      onClick={() => setMenuState(false)}
                      className="text-muted-foreground hover:text-foreground block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 sm:text-base dark:hover:bg-gray-800"
                    >
                      <span>{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
