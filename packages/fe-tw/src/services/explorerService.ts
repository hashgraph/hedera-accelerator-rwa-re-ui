import { slices } from "@/consts/slices";
import { buildings} from "@/consts/buildings";
import { featuredDevelopments } from "@/consts/featuredDevelopments";

export function getExplorerData() {
  // replace with fetch calls/contract queries
  return {
    slices,
    buildings,
    featuredDevelopments
  };
}
