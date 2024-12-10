"use client";

import { ReusableAvatar } from "@/components/Avatars/ReusableAvatar";
import type { BuildingSliceData } from "@/types/erc3643/types";
import { useState } from "react";

interface SliceItemProps {
  slice: BuildingSliceData;
}

export function SliceItem({ slice }: SliceItemProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocusStateChange = (state: boolean) => {
    setIsFocused(state);
  };

  return (
    <div className="flex flex-col items-center cursor-pointer">
      <ReusableAvatar
        size="lg"
        isCircleCorners
        imageSource={slice.imageSource}
        imageAlt={slice.name}
        onFocusStateChange={handleFocusStateChange}
      />
      <p className={`my-2 ${isFocused ? "text-primary" : ""}`}>{slice.name}</p>
    </div>
  );
}
