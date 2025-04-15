"use client";

import Link from "next/link";
import React, { type ReactNode } from "react";
import {
   NavigationMenu,
   NavigationMenuContent,
   NavigationMenuItem,
   NavigationMenuLink,
   NavigationMenuList,
   NavigationMenuTrigger,
   navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Building, Earth, Radar, Slice } from "lucide-react";
import { WalletConnectModalRW } from "../Wallets/WalletConnectModalRW";

export function Navbar() {
   return (
      <div className="min-w-[100vw] flex justify-end p-4 border-b border-base-200 items-center sticky top-0 z-50 bg-white">
         <Link href="/landing" className="mr-auto flex gap-1 items-center">
            <Earth />
            <p className="italic font-bold text-xl text-violet-700">RWA</p>
         </Link>
         <NavigationMenu>
            <NavigationMenuList className="gap-3">
               <NavigationMenuItem>
                  <NavigationMenuTrigger>Explorer</NavigationMenuTrigger>
                  <NavigationMenuContent asChild data-state="open">
                     <ul className="grid w-[300px] gap-2 p-1 md:w-[300px] md:grid-cols-1 lg:w-[300px]">
                        <ListItem icon={<Radar />} title="Featured" href="/explorer">
                           Dive into the world of our picks for You to explore
                        </ListItem>
                        <ListItem icon={<Building />} title="Buildings" href="/building">
                           Open the door to the world of tokenized buildings
                        </ListItem>
                        <ListItem icon={<Slice />} title="Slices" href="/slices">
                           Optimize your portfolio with our building slices
                        </ListItem>
                     </ul>
                  </NavigationMenuContent>
               </NavigationMenuItem>

               <NavigationMenuItem>
                  <Link href="/faq" legacyBehavior>
                     <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        FAQ
                     </NavigationMenuLink>
                  </Link>
               </NavigationMenuItem>

               <NavigationMenuItem>
                  <NavigationMenuTrigger>Admin</NavigationMenuTrigger>
                  <NavigationMenuContent asChild data-state="open">
                     <ul className="grid w-[300px] gap-2 p-1 md:w-[3d00px] md:grid-cols-1 lg:w-[300px]">
                        <ListItem icon={<Slice />} title="Slice Management" href="/admin/slicemanagement">
                           Create & manage Slice
                        </ListItem>
                        <ListItem icon={<Building />} title="Building Management" href="/admin/buildingmanagement">
                           Create & manage Building
                        </ListItem>
                        <ListItem icon={<Radar />} title="Token Management" href="/admin/tokenmanagement">
                           Create & manage Token
                        </ListItem>
                        <ListItem icon={<Radar />} title="Audit Management" href="/admin/auditmanagement">
                           Create & manage Audit
                        </ListItem>
                     </ul>
                  </NavigationMenuContent>
               </NavigationMenuItem>
               <NavigationMenuItem>
                  <WalletConnectModalRW />
               </NavigationMenuItem>
            </NavigationMenuList>
         </NavigationMenu>
      </div>
   );
}

const ListItem = React.forwardRef<
   React.ElementRef<"a">,
   React.ComponentPropsWithoutRef<"a"> & { icon: ReactNode }
>(({ className, icon, title, children, ...props }, ref) => {
   return (
      <li>
         <NavigationMenuLink asChild>
            <div className="flex ">
               <a
                  ref={ref}
                  className={cn(
                     "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                     className,
                  )}
                  {...props}
               >
                  <div className="flex flex-row gap-2">
                     <div>{icon}</div>
                     <div>
                        <div className="text-sm font-medium leading-none">{title}</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                           {children}
                        </p>
                     </div>
                  </div>
               </a>
            </div>
         </NavigationMenuLink>
      </li>
   );
});
ListItem.displayName = "ListItem";
