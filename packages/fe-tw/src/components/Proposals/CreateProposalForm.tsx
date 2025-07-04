"use client";

import React from "react";
import { toast } from "sonner";
import { Form, Formik } from "formik";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CreateProposalPayload } from "@/types/erc3643/types";
import { tryCatch } from "@/services/tryCatch";
import { ProposalType } from "@/types/props";
import { TxResultToastView } from "../CommonViews/TxResultView";
import { FormInput } from "@/components/ui/formInput";
import { TransactionExtended } from "@/types/common";

type Props = {
   createProposal: (values: CreateProposalPayload) => Promise<TransactionExtended | undefined>;
   onProposalSuccesseed: () => void;
};

export function CreateProposalForm({ createProposal, onProposalSuccesseed }: Props) {
   const handleSubmit = async (values: CreateProposalPayload & { title: string }) => {
      const { data, error } = await tryCatch<TransactionExtended | undefined, any>(createProposal(values));

      if (!!data) {
         toast.success(
            <TxResultToastView title="Proposal submitted successfully!" txSuccess={data} />,
            {
               duration: 5000,
            },
         );
         onProposalSuccesseed();
      } else {
         toast.error(`Proposal submission ${error?.message}`);
      }
   };

   return (
      <Formik
         initialValues={{
            title: "",
            description: "",
            amount: "",
            type: "" as ProposalType,
            to: "",
         }}
         onSubmit={(values, { setSubmitting }) => {
            setSubmitting(false);
            handleSubmit(values);
         }}
      >
         {({ getFieldProps, setFieldValue, handleSubmit, isSubmitting, values }) => (
            <Form onSubmit={handleSubmit} className="p-2 mt-4 space-y-4">
               <div>
                  <FormInput
                     required
                     label="Proposal Title"
                     placeholder="Enter proposal title"
                     {...getFieldProps("title")}
                  />
               </div>

               <div>
                  <Label htmlFor="description">Proposal Description</Label>
                  <Textarea
                     className="mt-1"
                     placeholder="Proposal Description"
                     {...getFieldProps("description")}
                     onChange={(e) => {
                        setFieldValue("description", e.target.value);
                     }}
                  />
               </div>

               {values.type === ProposalType.PaymentProposal && (
                  <div className="bg-purple-100">
                     <Label htmlFor="to">Proposal To</Label>
                     <Input
                        className="mt-1 w-full"
                        placeholder="e.g. 0x123"
                        type="text"
                        {...getFieldProps("to")}
                     />
                  </div>
               )}

               {(values.type === ProposalType.PaymentProposal ||
                  values.type === ProposalType.ChangeReserveProposal) && (
                  <div>
                     <Label htmlFor="amount">Proposal Amount</Label>
                     <Input
                        className="mt-1 w-full"
                        placeholder="e.g. 10"
                        {...getFieldProps("amount")}
                     />
                  </div>
               )}

               <div>
                  <Label htmlFor="propType">Proposal Type</Label>
                  <Select
                     onValueChange={(value) => {
                        setFieldValue("type", value);
                     }}
                     {...getFieldProps("type")}
                  >
                     <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Select Proposal Type" />
                     </SelectTrigger>
                     <SelectContent className="mt-1">
                        <SelectItem value={ProposalType.TextProposal}>Text Proposal</SelectItem>
                        <SelectItem value={ProposalType.PaymentProposal}>
                           Payment Proposal
                        </SelectItem>
                        <SelectItem value={ProposalType.ChangeReserveProposal}>
                           Change Reserve Proposal
                        </SelectItem>
                     </SelectContent>
                  </Select>
               </div>

               <Button className="mt-6" isLoading={isSubmitting} type="submit">
                  Submit
               </Button>
            </Form>
         )}
      </Formik>
   );
}
