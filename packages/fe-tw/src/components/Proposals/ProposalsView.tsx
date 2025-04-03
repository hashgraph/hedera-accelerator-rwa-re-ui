"use client";

import { activeProposals } from "@/consts/proposals";
import { sortProposals } from "@/utils/sorting";
import moment from "moment";
import React, { useMemo, useState } from "react";
import { CreateProposalForm } from "./CreateProposalForm";
import { ProposalsList } from "./ProposalsList";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { useGovernanceAndTreasuryDeployment } from "@/hooks/useGovernanceAndTreasuryDeployment";

type Props = {
   buildingAddress: `0x${string}`,
};

export function ProposalsView(props: Props) {
   const [showModal, setShowModal] = useState(false);
   const now = moment();

   const allActiveProposals = useMemo(
      () =>
         activeProposals.filter(
            (p) => now.isBefore(moment(p.expiry)) && now.isAfter(moment(p.started)),
         ),
      [now],
   );
   const allPastProposals = useMemo(
      () => activeProposals.filter((p) => now.isAfter(moment(p.expiry))),
      [now],
   );

   const [sortOption, setSortOption] = useState<"votes" | "alphabetical" | "endingSoon">("votes");

   const displayedActiveProposals = useMemo(
      () => sortProposals(allActiveProposals, sortOption),
      [allActiveProposals, sortOption],
   );
   const displayedPastProposals = useMemo(
      () => sortProposals(allPastProposals, sortOption),
      [allPastProposals, sortOption],
   );
   const { governanceAddress } = useGovernanceAndTreasuryDeployment(props.buildingAddress);

   return (
      <div className="p-2">
         <Tabs defaultValue="active">
            <TabsList>
               <TabsTrigger value="active">Account</TabsTrigger>
               <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>

            <div className="flex items-center justify-between gap-2 mb-6 flex-wrap">
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
               </div>

               {!!governanceAddress && <Button type="button" onClick={() => setShowModal(true)}>
                  Create New Proposal
               </Button>}
            </div>

            <TabsContent value="active">
               <ProposalsList
                  proposals={displayedActiveProposals}
                  emptyMessage="No active proposals."
               />
            </TabsContent>
            <TabsContent value="past">
               <ProposalsList
                  proposals={displayedPastProposals}
                  emptyMessage="No past proposals."
                  concluded
               />
            </TabsContent>
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

               {!!governanceAddress && <CreateProposalForm onProposalSuccesseed={() => {
                  setShowModal(false);
               }} buildingGovernanceAddress={governanceAddress} />}
            </DialogContent>
         </Dialog>
      </div>
   );
}
