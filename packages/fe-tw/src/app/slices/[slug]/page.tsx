import { notFound } from "next/navigation";
import { slugify } from "@/utils/slugify";
import {
  getAllSlices,
  getSliceTokensData,
  getSliceValuation,
  getSliceTokenPrice,
  getUserSliceBalance,
} from "@/services/sliceService";
import { SliceDetailPage } from "@/components/Slices/SliceDetailPage";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: Props) {
  const { slug } = await params;

  const allSlices = await getAllSlices();
  const sliceData = allSlices.find(
    (slice) => slugify(slice.name) === slugify(slug)
  );

  if (!sliceData) {
    notFound();
  }

  const _tokensWithBuilding = await getSliceTokensData(sliceData.name);
  const sliceValuation = await getSliceValuation(sliceData.name);
  const tokenPrice = await getSliceTokenPrice(sliceData.name);
  const userBalance = await getUserSliceBalance(sliceData.name, "0xMockUserAddress");

  return (
    <SliceDetailPage
      sliceData={{
        ...sliceData,
        sliceValuation,
        tokenPrice,
        tokenBalance: userBalance,
      }}
      tokensWithBuilding={[]}
    />
  );
}
