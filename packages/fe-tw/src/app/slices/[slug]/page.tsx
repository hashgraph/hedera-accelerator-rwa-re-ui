"use client";

import { SliceDetailPage } from "@/components/Slices/SliceDetailPage";
import { useSlicesData } from "@/hooks/useSlicesData";
import type { SliceData } from "@/types/erc3643/types";
import { slugify } from "@/utils/slugify";
import { notFound } from "next/navigation";
import { type Usable, use, useEffect, useState } from "react";

type Props = {
   params: Promise<{ slug: string }>;
};

export default function Page({ params }: Props) {
   const { slug } = use<{ slug: string }>(params as unknown as Usable<{ slug: string }>);
   const { slices } = useSlicesData();
   const [slice, setSlice] = useState<SliceData>();
   const [sliceNotFound, setSliceNotFound] = useState(false);

   useEffect(() => {
      if (slices?.length > 0) {
         const sliceData = slices.find((slice) => slugify(slice.id) === slugify(slug));

         if (!!sliceData) {
            setSlice(sliceData);
         } else {
            setSliceNotFound(true);
         }
      }
   }, [slices?.length]);

   if (sliceNotFound) {
      return notFound();
   }

   return !!slice && <SliceDetailPage slice={slice!} />;
}
