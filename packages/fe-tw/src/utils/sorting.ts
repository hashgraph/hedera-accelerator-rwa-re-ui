import type { Proposal } from "@/types/props";
import moment from "moment";

export const sortProposals = (
  proposals: Proposal[],
  sortOption: "votes" | "alphabetical" | "endingSoon",
): Proposal[] => {
  switch (sortOption) {
    case "alphabetical":
      return [...proposals].sort((a, b) => a.title.localeCompare(b.title));
    case "endingSoon":
      return [...proposals].sort(
        (a, b) => moment(a.expiry).valueOf() - moment(b.expiry).valueOf(),
      );
    case "votes":
    default:
      return [...proposals].sort(
        (a, b) => b.votesYes + b.votesNo - (a.votesYes + a.votesNo),
      );
  }
};
