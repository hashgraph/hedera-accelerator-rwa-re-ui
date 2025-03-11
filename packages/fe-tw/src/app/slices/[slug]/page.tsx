"use client";

import { notFound } from "next/navigation";
import { slugify } from "@/utils/slugify";
import { SliceDetailPage } from "@/components/Slices/SliceDetailPage";
import { useSlicesData } from "@/hooks/useSlicesData";
import { SliceData } from "@/types/erc3643/types";
import { use, Usable } from "react";

type Props = {
  params: Promise<{ slug: string }>;
};

export default function Page({ params }: Props) {
  const { slug } = use<{ slug: string }>(params as unknown as Usable<{ slug: string }>);
  const { slices } = useSlicesData();

  const sliceData = slices.find((slice) => slugify(slice.id) === slugify(slug));

  if (!sliceData && slices?.length > 0) {
    notFound();
  }

  const sliceValuation = 0
  const tokenPrice = 0
  const userBalance = 0

  return (
    <SliceDetailPage
      sliceData={{
        ...sliceData as SliceData,
        sliceValuation,
        tokenPrice,
        tokenBalance: userBalance,
      }}
      tokensWithBuilding={[]}
    />
  );
}
