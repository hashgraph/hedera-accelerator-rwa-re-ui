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

type Props = {
   createProposal: (values: CreateProposalPayload) => Promise<string | undefined>,
   onProposalSuccesseed: () => void,
};

export function CreateProposalForm({ createProposal, onProposalSuccesseed }: Props) {
   const handleSubmit = async (values: CreateProposalPayload) => {
      const { data, error } = await tryCatch(createProposal(values));

      if (!!data) {
         toast.success(`Proposal submitted ${data}`);
         onProposalSuccesseed();
      } else {
         toast.error(`Proposal submittion ${error?.message}`);
      }
   };

   return (
      <Formik
         initialValues={{
            description: "",
            amount: "",
            type: "text",
            to: "",
         }}
         onSubmit={(values, { setSubmitting }) => {
            setSubmitting(false);
            handleSubmit(values as CreateProposalPayload);
         }}
      >
         {({ getFieldProps, setFieldValue, handleSubmit, isSubmitting, values }) => (
            <Form onSubmit={handleSubmit} className="p-2 mt-4 space-y-4">
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

               {values.type === ProposalType.PaymentProposal && <div className="bg-purple-100">
                  <Label htmlFor="to">Proposal To</Label>
                  <Input
                     className="mt-1 w-full"
                     placeholder="e.g. 0x123"
                     type="text"
                     {...getFieldProps("to")}
                  />
               </div>}

               {(values.type === ProposalType.PaymentProposal || values.type === ProposalType.ChangeReserveProposal) && (
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
                        <SelectItem value={ProposalType.PaymentProposal}>Payment Proposal</SelectItem>
                        <SelectItem value={ProposalType.ChangeReserveProposal}>Change Reserve Proposal</SelectItem>
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
