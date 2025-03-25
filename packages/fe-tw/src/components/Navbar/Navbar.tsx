"use client";

import { NavbarUserActionsMenu } from "@/components/Navbar/NavbarUserActionsMenu";
import { WalletConnectModalRW } from "@/components/Wallets/WalletConnectModalRW";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import {
  NavigationMenu, NavigationMenuContent,
  NavigationMenuItem, NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Wallet} from "lucide-react";

const SITE_LINKS = [
  { title: "FAQ", url: "/faq" },
  { title: "Admin", url: "/admin" },
];

export function Navbar() {
  return (
      <NavigationMenu className="justify-end p-4 min-w-[100vw]">
        <NavigationMenuList
            // className="flex justify-end p-4 min-w-[100vw]"
        >
          <NavigationMenuItem>
            <NavigationMenuTrigger>Explorer</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul
                  // className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]"
              >
                <ListItem
                    title="Featured"
                    href="/explorer"
                >
                  Dive into the world of our picks for You to explore
                </ListItem>
                <ListItem
                    title="Buildings"
                    href="/building"
                >
                  Open the door to the world of tokenized buildings
                </ListItem>
                <ListItem
                    title="Slices"
                    href="/slices"
                >
                  Optimize your portfolio with our building slices
                </ListItem>
              </ul>
            </NavigationMenuContent>

          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href='/faq' legacyBehavior>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>FAQ</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href='/admin' legacyBehavior>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Admin</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Button><Wallet />Connect</Button>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>);
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
      <li>
        <NavigationMenuLink asChild>
          <a
              ref={ref}
              className={cn(
                  "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                  className
              )}
              {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
  )
})
ListItem.displayName = "ListItem"
