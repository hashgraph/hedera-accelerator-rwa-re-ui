import { notFound } from "next/navigation";
import { slugify } from "@/utils/slugify";
import { buildingSlices } from "@/consts/slices";
import { getSliceTokensData } from "@/services/sliceService";
import SliceAllocations from "./SliceAllocations";

type Props = {
  sliceName: string;
};

export async function SliceDetailPage({ sliceName }: Props) {
  const sliceData = buildingSlices.find((slice) => slugify(slice.name) === slugify(sliceName));
  
  if (!sliceData) {
    notFound();
  }
  

  const tokensWithBuilding = await getSliceTokensData(sliceData.name);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{sliceData.name}</h1>
      <div className="flex mb-4 gap-4">
        <img
          src={sliceData.imageUrl}
          alt={sliceData.name}
          className="mb-4 w-64 h-64 object-cover rounded-lg"
        />
        <p className="text-lg flex-1">{sliceData.description}</p>
      </div>

      <SliceAllocations sliceName={sliceData.name} tokensWithBuilding={tokensWithBuilding} />
    </div>
  );
}
