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
  params: Promise<{ id: string; slug: string }>;
};

export default async function Page({ params }: Props) {
  const { id: buildingId, slug } = await params;

  try {
    const allSlices = await getAllSlices();
    const sliceData = allSlices.find(
      (slice) => slugify(slice.name) === slugify(slug)
    );

    if (!sliceData) {
      notFound();
    }

    const [tokensWithBuilding, sliceValuation, tokenPrice, userBalance] =
      await Promise.all([
        getSliceTokensData(sliceData.name),
        getSliceValuation(sliceData.name),
        getSliceTokenPrice(sliceData.name),
        getUserSliceBalance(sliceData.name, "0xMockUserAddress"),
      ]);

    return (
      <SliceDetailPage
        sliceData={{
          ...sliceData,
          sliceValuation,
          tokenPrice,
          tokenBalance: userBalance,
        }}
        tokensWithBuilding={[]}
        isInBuildingContext={true}
        buildingId={buildingId}
      />
    );
  } catch (error) {
    console.error("Error fetching slice data:", error);
    notFound();
  }
}
