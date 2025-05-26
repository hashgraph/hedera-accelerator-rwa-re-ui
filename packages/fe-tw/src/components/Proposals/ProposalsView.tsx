"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CreateProposalForm } from "./CreateProposalForm";
import { ProposalsList } from "./ProposalsList";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { ethers } from "ethers";
import { LoadingView } from "../LoadingView/LoadingView";
import { useGovernanceProposals } from "./hooks/useGovernanceProposals";
import { ProposalState } from "@/types/props";
import { useBuildingInfo } from "@/hooks/useBuildingInfo";

type Props = {
   buildingAddress: `0x${string}`;
};

const activeProposalStatuses = [
   ProposalState.ActiveProposal,
   ProposalState.PendingProposal,
   ProposalState.SucceededProposal,
   ProposalState.QueuedProposal,
];

export function ProposalsView(props: Props) {
   const [showModal, setShowModal] = useState(false);
   const [pageLoading, setPageLoading] = useState(true);
   const { replace } = useRouter();
   const {
      governanceAddress: buildingGovernance,
      tokenAddress: buildingToken,
      isLoading,
   } = useBuildingInfo(props.buildingAddress);

   const {
      createProposal,
      voteProposal,
      execProposal,
      proposalStates,
      proposalVotes,
      governanceDefinedProposals,
      governanceCreatedProposals,
      proposalDeadlines,
   } = useGovernanceProposals(buildingGovernance, buildingToken);

   const activeProposals = governanceCreatedProposals
      .filter((proposal) => activeProposalStatuses.includes(proposalStates[proposal.id]))
      .map((proposal) => ({
         ...proposal,
         ...(governanceDefinedProposals.find((prop) => prop.id === proposal.id) ?? {}),
      }));
   const pastProposals = governanceCreatedProposals
      .filter((proposal) => !activeProposalStatuses.includes(proposalStates[proposal.id]))
      .map((proposal) => ({
         ...proposal,
         ...(governanceDefinedProposals.find((prop) => prop.id === proposal.id) ?? {}),
      }));

   useEffect(() => {
      if (!isLoading) {
         if (buildingGovernance === ethers.ZeroAddress) {
            toast.warning(
               "Governance needs to be deployed before you can start submitting proposals",
            );
            replace(`/admin/buildingmanagement?governance=true&bAddress=${props.buildingAddress}`);
         } else {
            setPageLoading(false);
         }
      }
   }, [buildingGovernance, isLoading]);

   return pageLoading ? (
      <LoadingView isLoading />
   ) : (
      <div className="p-2">
         <Tabs defaultValue="active">
            <TabsList>
               <TabsTrigger value="active">Active</TabsTrigger>
               <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>

            <div className="flex items-center justify-between gap-2 mb-6 flex-wrap">
               <div className="flex gap-4"></div>

               <Button type="button" onClick={() => setShowModal(true)}>
                  Create New Proposal
               </Button>
            </div>

            <TabsContent value="active">
               <ProposalsList
                  proposalDeadlines={proposalDeadlines}
                  proposals={activeProposals}
                  proposalVotes={proposalVotes}
                  proposalStates={proposalStates}
                  voteProposal={voteProposal}
                  execProposal={execProposal}
               />
            </TabsContent>
            <TabsContent value="past">
               <ProposalsList
                  isPastProposals
                  proposalDeadlines={proposalDeadlines}
                  proposals={pastProposals}
                  proposalVotes={proposalVotes}
                  voteProposal={voteProposal}
                  execProposal={execProposal}
                  proposalStates={proposalStates}
               />
            </TabsContent>
         </Tabs>

         <Dialog open={showModal} onOpenChange={(state) => setShowModal(state)}>
            <DialogContent className="sm:max-w-[425px]">
               <DialogHeader>
                  <DialogTitle>Create New Proposal</DialogTitle>
                  <DialogDescription>
                     Fill in the details below to create a new proposal.
                  </DialogDescription>
               </DialogHeader>

               <CreateProposalForm
                  onProposalSuccesseed={() => {
                     setShowModal(false);
                  }}
                  createProposal={createProposal}
               />
            </DialogContent>
         </Dialog>
      </div>
   );
}
