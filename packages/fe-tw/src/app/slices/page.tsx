import { buildingSlices } from "@/consts/props";
import { Slices } from "@/components/Slices/Slices";

export default function SlicePage() {
  if (buildingSlices.length === 0) {
    return <div>No slices available currently.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">All Slices</h1>
      <p className="mb-4">Select a slice to view more details.</p>
      <Slices />
    </div>
  );
}
