import { buildingSlices } from "@/consts/props";
import { FeaturedSlices } from "@/components/FeaturedSlices";

export default function SliceDetailPage() {

  if (buildingSlices.length === 0) {
    return <div>Placeholder for all of user's slices - currently using FeaturedSlices</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">All Slices</h1>
      <p className="mb-4">Select a slice to view more details.</p>
      <FeaturedSlices />
    </div>
  );
}