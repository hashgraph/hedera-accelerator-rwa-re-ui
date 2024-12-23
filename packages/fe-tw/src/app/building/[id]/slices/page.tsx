import { notFound } from "next/navigation";
import { buildings } from "@/consts/buildings";
import SliceCardGrid from "@/components/Slices/SliceCardGrid";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function SlicesPage({ params }: Props) {
  const { id } = await params;
  const buildingId = parseInt(id, 10);
  const building = buildings.find((b) => b.id === buildingId);

  if (!building) {
    notFound();
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Slices for Building: {building.title}
      </h1>

      <SliceCardGrid sliceIds={building.partOfSlices || []} />
    </div>
  );
}
