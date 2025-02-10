"use client";

import { BuildingVoteItem } from "./BuildingVoteItem";

export const BuildingVotes = ({ votes }: { votes: number[] }) => {
  return (
    <div className="flex flex-col mt-10">
      <article className="prose mb-6">
        <h2>Vote Items</h2>
      </article>

      <div className="flex flex-col gap-4">
        {votes?.map((voteAddress) => (
          <BuildingVoteItem key={voteAddress} voteAddress={voteAddress} />
        ))}
      </div>
    </div>
  );
};
