"use client";

import { activeProposals } from "@/consts/proposals";
import { ClockFading, Vote } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const BuildingVoteItem = ({ voteAddress }: { voteAddress: number }) => {
   const pathname = usePathname();
   const buildingId = pathname.split("/")[2];

   const vote = activeProposals.find((proposal) => proposal.id === voteAddress);

   if (!vote || !buildingId) return null;

   return (
      <Link href={`/building/${buildingId}/proposals`} passHref>
         <div className="flex flex-row mt-5 borde p-4 rounded-lg bg-white cursor-pointer hover:bg-gray-100 transition">
            <div className="flex items-center justify-center w-16 h-16 bg-purple-100 text-purple-600 rounded-full">
               <Vote />
            </div>

            <div className="flex flex-col ml-5 justify-between">
               <article>
                  <p className="text-lg font-bold text-gray-800">{vote.title}</p>
                  <p className="text-sm text-gray-600">{vote.description}</p>
               </article>

               <div className="flex flex-row items-center mt-3">
                  <ClockFading />
                  <span className="text-xs ml-2 text-gray-700">
                     {moment(vote.started).format("dddd, LT")}
                  </span>
               </div>
            </div>
         </div>
      </Link>
   );
};
