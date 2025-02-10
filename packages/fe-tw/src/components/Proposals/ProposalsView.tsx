"use client";

import { useState, useMemo } from "react";
import moment from "moment";
import { ProposalType } from "@/types/props";
import { activeProposals } from "@/consts/proposals";
import { ProposalsList } from "./ProposalsList";
import { CreateProposalForm } from "./CreateProposalForm";
import { sortProposals } from "@/utils/sorting";
import { getFutureDate, getCurrentDate } from "@/utils/date";

export function ProposalsView() {
  const [selectedTab, setSelectedTab] = useState<"active" | "past">("active");
  const [showModal, setShowModal] = useState(false);
  const now = moment();

  const allActiveProposals = useMemo(
    () =>
      activeProposals.filter(
        (p) => now.isBefore(moment(p.expiry)) && now.isAfter(moment(p.started))
      ),
    [now]
  );
  const allPastProposals = useMemo(
    () => activeProposals.filter((p) => now.isAfter(moment(p.expiry))),
    [now]
  );

  const [sortOption, setSortOption] = useState<"votes" | "alphabetical" | "endingSoon">(
    "votes"
  );

  const displayedActiveProposals = useMemo(
    () => sortProposals(allActiveProposals, sortOption),
    [allActiveProposals, sortOption]
  );
  const displayedPastProposals = useMemo(
    () => sortProposals(allPastProposals, sortOption),
    [allPastProposals, sortOption]
  );

  const handleCreateProposal = (newProposal: {
    title: string;
    description: string;
    propType: ProposalType;
    amount?: number;
    to?: string;
    frequency?: number;
    numPayments?: number;
  }) => {
    const newProposalId = activeProposals.length + 1;

    if (newProposal.propType === ProposalType.RecurringProposal) {
      activeProposals.push({
        id: newProposalId,
        title: newProposal.title,
        description: newProposal.description,
        propType: ProposalType.RecurringProposal,
        started: getCurrentDate(),
        expiry: getFutureDate(3),
        votesYes: 0,
        votesNo: 0,

        amount: newProposal.amount ?? 0,
        to: newProposal.to ?? "",
        frequency: newProposal.frequency ?? 0,
        numPayments: newProposal.numPayments ?? 0,
        startPayment: getCurrentDate(),

        imageUrl: "/assets/budget.jpeg",
      });
    } else if (newProposal.propType === ProposalType.PaymentProposal) {
      activeProposals.push({
        id: newProposalId,
        title: newProposal.title,
        description: newProposal.description,
        propType: ProposalType.PaymentProposal,
        started: getCurrentDate(),
        expiry: getFutureDate(3),
        votesYes: 0,
        votesNo: 0,

        amount: newProposal.amount ?? 0,
        to: newProposal.to ?? "",
        imageUrl: "/assets/budget.jpeg",
      });
    } else {
      activeProposals.push({
        id: newProposalId,
        title: newProposal.title,
        description: newProposal.description,
        propType: ProposalType.TextProposal,
        started: getCurrentDate(),
        expiry: getFutureDate(3),
        votesYes: 0,
        votesNo: 0,
        imageUrl: "/assets/budget.jpeg",
      });
    }

    setShowModal(false);
  };

  return (
    <div className="p-2">
      {/* Tabs titles*/}
      <div className="flex space-x-8 mb-4">
        <button
          className={`text-2l ${selectedTab === "active" ? "font-bold text-black" : "text-gray-400"
            }`}
          onClick={() => setSelectedTab("active")}
        >
          Active Proposals
        </button>
        <button
          className={`text-2l ${selectedTab === "past" ? "font-bold text-black" : "text-gray-400"
            }`}
          onClick={() => setSelectedTab("past")}
        >
          Past Proposals
        </button>
      </div>

      {/* Filter/sort bar */}
      <div className="flex items-center justify-between gap-2 mb-6 flex-wrap">
        <div className="flex gap-4">
          <select className="select select-bordered w-auto">
            <option>Any day</option>
            <option>Today</option>
            <option>Next 7 days</option>
          </select>

          {/* Sort dropdown */}
          <select
            className="select select-bordered w-auto"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as any)}
          >
            <option value="votes">Sort by Votes</option>
            <option value="alphabetical">Sort by Alphabetical</option>
            <option value="endingSoon">Sort by Ending Soon</option>
          </select>
        </div>

        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Create New Proposal
        </button>
      </div>

      {/* Tab content */}
      {selectedTab === "active" ? (
        <ProposalsList
          proposals={displayedActiveProposals}
          emptyMessage="No active proposals."
        />
      ) : (
        <ProposalsList
          proposals={displayedPastProposals}
          emptyMessage="No past proposals."
          concluded
        />
      )}

      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box relative max-w-lg">
            <button
              className="btn btn-sm btn-circle absolute right-2 top-2"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            <h3 className="font-bold text-lg mb-4">Create New Proposal</h3>
            <CreateProposalForm onSubmit={handleCreateProposal} />
          </div>
        </div>
      )}
    </div>
  );
}
