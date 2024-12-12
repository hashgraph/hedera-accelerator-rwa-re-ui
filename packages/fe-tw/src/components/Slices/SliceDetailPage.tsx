import { notFound } from "next/navigation";
import { slugify } from "@/utils/slugify";
import {
  getAllSlices,
  getSliceTokensData,
  getSliceValuation,
  getSliceTokenPrice,
  getUserSliceBalance,
} from "@/services/sliceService";
import SliceAllocations from "./SliceAllocations";

type Props = {
  sliceName: string;
};

export async function SliceDetailPage({ sliceName }: Props) {
  const allSlices = await getAllSlices();
  const sliceData = allSlices.find((slice) => slugify(slice.name) === slugify(sliceName));

  if (!sliceData) {
    notFound();
  }

  const tokensWithBuilding = await getSliceTokensData(sliceData.name);
  const sliceValuation = await getSliceValuation(sliceData.name);
  const tokenPrice = await getSliceTokenPrice(sliceData.name);
  const userBalance = await getUserSliceBalance(sliceData.name, "0xMockUserAddress");

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

      <div className="my-4">
        <h2 className="text-xl font-semibold mb-2">Slice Info</h2>
        <p className="mb-1">Slice Valuation: ${sliceValuation}</p>
        <p className="mb-1">Token Price: ${tokenPrice}</p>
        <p className="mb-4">Your Balance: {userBalance} tokens</p>
      </div>

      <SliceAllocations sliceName={sliceData.name} tokensWithBuilding={tokensWithBuilding} />
    </div>
  );
}
