"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export type AvatarSize = "lg" | "md" | "sm" | "extra-lg";

type Props = {
   imageAlt: string;
   imageSource?: string;
   size?: AvatarSize;
   isRounded?: boolean;
   isCircleCorners?: boolean;
};

const sizes = {
   lg: "w-32",
   md: "w-28",
   sm: "w-24",
   "extra-lg": "w-48",
};

export const ReusableAvatar = ({
   isRounded = false,
   isCircleCorners = false,
   size,
   imageSource,
   imageAlt,
}: Props) => {
   return (
      <div className="avatar">
         <div
            className={cn(
               "transition-transform duration-300 hover:scale-110",
               isRounded && "rounded-sm",
               isCircleCorners && "rounded-full",
               sizes[size ?? "md"],
            )}
         >
            <Image
               priority
               src={imageSource ?? "./assets/dome.jpeg"}
               width={500}
               height={500}
               alt={imageAlt}
            />
         </div>
      </div>
   );
};
