import { buildingSlices } from "@/consts/props";
import { notFound } from "next/navigation";
import { slugify } from "@/utils/slugify";
import { getSliceTokens, getBuildingForToken } from "@/services/mockSliceService";
import SliceAllocations from "@/components/SliceAllocations/SliceAllocations";

type SliceDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SliceDetailPage({ params }: SliceDetailPageProps) {
  const { slug } = await params;
  const sliceData = buildingSlices.find((slice) => slugify(slice.name) === slug);
  if (!sliceData) {
    return notFound();
  }

  const tokens = await getSliceTokens(sliceData.name);
  const tokensWithBuilding = await Promise.all(
    tokens.map(async (token) => {
      const building = await getBuildingForToken(token.tokenAddress);
      return {
        ...token,
        building,
      };
    })
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{sliceData.name}</h1>
      <img
        src={sliceData.imageSource}
        alt={sliceData.name}
        className="mb-4 w-64 h-64 object-cover rounded-lg"
      />

      <SliceAllocations sliceName={sliceData.name} tokensWithBuilding={tokensWithBuilding} />
    </div>
  );
}
