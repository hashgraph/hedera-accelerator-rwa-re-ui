"use client";

import { ReusableAvatar } from "@/components/Avatars/ReusableAvatar";
import type { BuildingSliceData } from "@/types/erc3643/types";
import { useState } from "react";

export const FeaturedSlice = (props: BuildingSliceData) => {
	const [isFocused, setIsFocused] = useState(false);

	const handleFocusStateChange = (state: boolean) => {
		setIsFocused(state);
	};

	return (
		<div className="flex flex-col items-center">
			<ReusableAvatar
				size="lg"
				isCircleCorners
				imageSource={props.imageSource}
				imageAlt={props.name}
				onFocusStateChange={handleFocusStateChange}
			/>
			<p className={`my-2 ${isFocused ? "text-primary" : ""}`}>{props.name}</p>
		</div>
	);
};
