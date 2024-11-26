import { CTA_Hedera } from "@/app/landing/CTA_Hedera";
import { CTA_IncreaseTam } from "@/app/landing/CTA_IncreaseTam";
import { CTA_Web3 } from "@/app/landing/CTA_Web3";
import React from "react";

export function CTAs() {
	return (
		<div className="flex flex-wrap text-black">
			<CTA_Hedera />
			<CTA_IncreaseTam />
			<CTA_Web3 />
		</div>
	);
}
