"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; 
import { HowToVote, AccessTime as ClockIcon } from "@mui/icons-material";
import { activeProposals } from "@/consts/proposals";
import moment from "moment";

export const BuildingVoteItem = ({ voteId }: { voteId: number }) => {
  const pathname = usePathname(); 
  const buildingId = pathname.split("/")[2]; 

  const vote = activeProposals.find((proposal) => proposal.id === voteId);

  if (!vote || !buildingId) return null; 

  return (
    <Link href={`/building/${buildingId}/proposals`} passHref>
      <div className="flex flex-row mt-5 borde p-4 rounded-lg bg-white cursor-pointer hover:bg-gray-100 transition">
        <div className="flex items-center justify-center w-16 h-16 bg-purple-100 text-purple-600 rounded-full">
          <HowToVote fontSize="large" />
        </div>

        <div className="flex flex-col ml-5 justify-between">
          <article>
            <p className="text-lg font-bold text-gray-800">{vote.title}</p>
            <p className="text-sm text-gray-600">{vote.description}</p>
          </article>

          <div className="flex flex-row items-center mt-3">
            <ClockIcon />
            <span className="text-xs ml-2 text-gray-700">
              {moment(vote.started).format("dddd, LT")}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
