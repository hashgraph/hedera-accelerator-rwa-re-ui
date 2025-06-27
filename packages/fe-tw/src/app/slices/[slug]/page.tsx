"use client";

import { LoadingView } from "@/components/LoadingView/LoadingView";
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
   const [loadingTimeout, setLoadingTimeout] = useState(false);

   useEffect(() => {
      if (slices?.length > 0) {
         const sliceFound = slices.find((slice) => slugify(slice.id) === slugify(slug));

         if (!!sliceFound) {
            setSlice(sliceFound);
         }
      }
   }, [slices?.length]);

   useEffect(() => {
      if (loadingTimeout) {
         const sliceFound = slices.find((slice) => slugify(slice.id) === slugify(slug));

         if (!sliceFound) {
            setSliceNotFound(true);
         }
      }
   }, [loadingTimeout, slices?.length]);

   useEffect(() => {
      setTimeout(() => {
         setLoadingTimeout(true);
      }, 10000);
   });

   if (sliceNotFound) {
      return notFound();
   }

   else if (slice) {
      return <SliceDetailPage slice={slice!} />;
   }

   return <LoadingView isLoading />
}
