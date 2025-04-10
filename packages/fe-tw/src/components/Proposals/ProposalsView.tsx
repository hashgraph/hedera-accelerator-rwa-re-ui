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
import { useBuildingDetails } from "@/hooks/useBuildingDetails";
import { ethers } from "ethers";
import { LoadingView } from "../LoadingView/LoadingView";
import { useGovernanceProposals } from "@/hooks/useGovernanceProposals";

type Props = {
   buildingAddress: `0x${string}`,
};

export function ProposalsView(props: Props) {
   const [showModal, setShowModal] = useState(false);
   const [pageLoading, setPageLoading] = useState(true);
   const { replace } = useRouter();
   const { buildingDetails, buildingDetailsLoading } = useBuildingDetails(props.buildingAddress);

   const buildingGovernance: `0x${string}` | undefined = buildingDetails?.[0]?.[6];
   const buildingToken: `0x${string}` | undefined = buildingDetails?.[0]?.[4];

   const { createProposal, voteProposal, proposalStates, proposalVotes, governanceProposals } =
      useGovernanceProposals(buildingGovernance, buildingToken);

   useEffect(() => {
      if (!buildingDetailsLoading) {
         if (buildingGovernance === ethers.ZeroAddress) {
            toast.warning("Governance needs to be deployed before you can start submitting proposals");
            replace(`/admin/buildingmanagement?governance=true&bAddress=${props.buildingAddress}`);
         } else {
            setPageLoading(false);
         }
      }
   }, [buildingGovernance, buildingDetailsLoading]);

   return pageLoading ? <LoadingView isLoading /> : (
      <div className="p-2">
         <Tabs defaultValue="active">
            <TabsList>
               <TabsTrigger value="active">Active</TabsTrigger>
               {/** <TabsTrigger value="past">Past</TabsTrigger> **/}
            </TabsList>

            <div className="flex items-center justify-between gap-2 mb-6 flex-wrap">
               {/**
                * We don't have filters for a proposals for now
               <div className="flex gap-4">
                  <Select>
                     <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Any day" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="any">Any day</SelectItem>
                        <SelectItem value="Today">Today</SelectItem>
                        <SelectItem value="Next 7 days">Next 7 days</SelectItem>
                     </SelectContent>
                  </Select>

                  <Select onValueChange={(value) => setSortOption(value as any)}>
                     <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Sort by Votes" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="votes">Sort by Votes</SelectItem>
                        <SelectItem value="alphabetical">Sort by Alphabetical</SelectItem>
                        <SelectItem value="endingSoon">Sort by Ending Soon</SelectItem>
                     </SelectContent>
                  </Select>
               </div> **/}
               <div className="flex gap-4"></div>

               <Button type="button" onClick={() => setShowModal(true)}>
                  Create New Proposal
               </Button>
            </div>

            <TabsContent value="active">
               <ProposalsList
                  proposals={governanceProposals}
                  proposalVotes={proposalVotes}
                  voteProposal={voteProposal}
                  proposalStates={proposalStates}
               />
            </TabsContent>
            {/** We don't have past proposals for now
             * <TabsContent value="past">
               <ProposalsList
                  proposals={displayedPastProposals}
                  emptyMessage="No past proposals."
                  concluded
               />
            </TabsContent> **/}
         </Tabs>

         {/* Filter/sort bar */}

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
