import { buildings } from "@/consts/buildings";
import Link from "next/link";

export default function BuildingIndexPage() {
  return (
    <div>
      <h1>All Buildings</h1>
      {buildings.map((b) => (
        <div key={b.id}>
          <Link href={`/building/${b.id}`}>
            {b.title}
          </Link>
        </div>
      ))}
    </div>
  );
}
