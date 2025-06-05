"use client";

import {
   Sidebar,
   SidebarContent,
   SidebarGroup,
   SidebarGroupContent,
   SidebarGroupLabel,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   useSidebar,
} from "@/components/ui/sidebar";
import {
   Blocks,
   BookOpenCheck,
   Building2,
   ChartCandlestick,
   HandCoins,
   ReceiptText,
   Slice,
   Vote,
   Asterisk,
   CoinsIcon,
   Droplet,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const BUILDING_NAV_ITEMS = [
   { title: "Overview", href: "", icon: Building2 },
   { title: "Staking", href: "staking", icon: Blocks },
   { title: "Proposals", href: "proposals", icon: Vote },
   { title: "Slices", href: "slices", icon: Slice },
   { title: "Payments", href: "payments", icon: HandCoins },
   { title: "Expenses", href: "expenses", icon: ReceiptText },
   { title: "COPE", href: "cope", icon: BookOpenCheck },
   { title: "Mint", href: "mint", icon: CoinsIcon },
   { title: "Trade", href: "trade", icon: ChartCandlestick },
   { title: "Liquidity", href: "liquidity", icon: Droplet },
];
export function BuildingSidebar() {
   const { id } = useParams();

   return (
      <Sidebar>
         <SidebarContent>
            <SidebarGroup>
               <SidebarGroupContent>
                  <SidebarMenu>
                     {BUILDING_NAV_ITEMS.map((item) => (
                        <SidebarMenuItem key={item.title}>
                           <SidebarMenuButton className="text-md" asChild>
                              <Link href={`/building/${id}/${item.href}`}>
                                 <item.icon />
                                 <span>{item.title}</span>
                              </Link>
                           </SidebarMenuButton>
                        </SidebarMenuItem>
                     ))}
                  </SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>
         </SidebarContent>
      </Sidebar>
   );
}
