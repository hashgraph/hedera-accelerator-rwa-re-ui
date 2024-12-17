"use client";

import { Proposal } from "@/types/props";
import moment from "moment";

type ProposalsListProps = {
  title: string;
  proposals: Proposal[];
  emptyMessage: string;
  concluded?: boolean;
  className?: string;
};

export function ProposalsList({ title, proposals, emptyMessage, concluded = false, className = "" }: ProposalsListProps) {
  return (
    <section className={`mb-8 ${className}`}>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {proposals.length === 0 && <p>{emptyMessage}</p>}
      <ul className="space-y-4">
        {proposals.map((proposal) => (
          <li
            key={proposal.id}
            className="p-4 border rounded-lg bg-gray-50 shadow-sm"
          >
            <h4 className="text-lg font-semibold mb-1">{proposal.title}</h4>
            <p className="text-sm text-slate-700 mb-2">{proposal.description}</p>
            {!concluded ? (
              <>
                <p className="text-xs text-gray-500">
                  Starts: {moment(proposal.started).format("YYYY-MM-DD HH:mm")}
                </p>
                <p className="text-xs text-gray-500">
                  Ends: {moment(proposal.expiry).format("YYYY-MM-DD HH:mm")}
                </p>
                <div className="mt-2 text-sm">
                  <span className="mr-4">Votes Yes: {proposal.votesYes}</span>
                  <span>Votes No: {proposal.votesNo}</span>
                </div>
              </>
            ) : (
              <>
                <p className="text-xs text-gray-500">
                  Ended: {moment(proposal.expiry).format("YYYY-MM-DD HH:mm")}
                </p>
                <p className="mt-2 text-sm">This proposal has concluded.</p>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
