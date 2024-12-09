import { buildingSlices } from "@/consts/props";
import { notFound } from "next/navigation";

type SliceDetailPageProps = {
  params: {
    slug: string;
  };
};

function slugify(input: string) {
  return input.toLowerCase().replace(/\s+/g, '-');
}

export default function SliceDetailPage({ params }: SliceDetailPageProps) {
  const { slug } = params;

  const sliceData = buildingSlices.find((slice) => slugify(slice.name) === slug);

  if (!sliceData) {
    return notFound();
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{sliceData.name}</h1>
      <img
        src={sliceData.imageSource}
        alt={sliceData.name}
        className="mb-4 w-64 h-64 object-cover rounded-lg"
      />
      <p className="mb-2">Estimated Price: {sliceData.estimatedPrice}</p>
      <p className="mb-2">Time to End: {sliceData.timeToEnd} seconds</p>
    </div>
  );
}
