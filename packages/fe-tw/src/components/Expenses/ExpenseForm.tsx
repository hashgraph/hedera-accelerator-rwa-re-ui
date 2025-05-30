"use client";

import type React from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PaymentRequestPayload } from "@/types/erc3643/types";

type ExpenseFormProps = {
   handlePayment: (data: PaymentRequestPayload, actions: { resetForm: () => void }) => Promise<void>;
};

export function ExpenseForm({ handlePayment }: ExpenseFormProps) {
   return (
      <Formik
         initialValues={{
            title: '',
            amount: '',
            receiver: '',
            notes: '',
         }}
         validationSchema={Yup.object({
            title: Yup.string().required('Title is required'),
            amount: Yup.string().required('Amount is required'),
            receiver: Yup.string().required('Receiver is required'),
            notes: Yup.string().required('Notes is required'),
         })}
         onSubmit={handlePayment}
      >
         {({ getFieldProps }) => (
            <Form className="grid gap-4">

               <div>
                  <Label className="block mb-1 font-semibold" htmlFor="title">Title</Label>
                  <Input
                     id="title"
                     type="text"
                     className="mt-1"
                     placeholder="e.g. Electricity power"
                     required
                     {...getFieldProps('title')}
                  />
               </div>

               <div>
                  <Label className="block mb-1 font-semibold" htmlFor="amount">Amount</Label>
                  <Input
                     id="amount"
                     type="text"
                     className="mt-1"
                     placeholder="Enter amount in building USDC"
                     required
                     {...getFieldProps('amount')}
                  />
               </div>

               <div>
                  <Label className="block mb-1 font-semibold" htmlFor="receiver">Receiver</Label>
                  <Input
                     id="receiver"
                     className="mt-1"
                     placeholder="Receiver"
                     required
                     {...getFieldProps('receiver')}
                  />
               </div>

               <div>
                  <Label className="block mb-1 font-semibold" htmlFor="notes">
                     Notes
                  </Label>
                  <Textarea
                     id="notes"
                     placeholder="Optional notes or memo"
                     rows={2}
                     style={{ maxHeight: "120px" }}
                     {...getFieldProps('notes')}
                  />
               </div>

            <div className="flex justify-end">
               <Button type="submit">Submit</Button>
            </div>

            {/** <div>
               <Label className="block mb-1 font-semibold" htmlFor="expenseType">
                  Expense Type
               </Label>
               <Select onValueChange={(value) => setExpenseType(value as ExpenseType)}>
                  <SelectTrigger className="w-full mt-1">
                     <SelectValue placeholder="Expense type" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="once-off">Once-off</SelectItem>
                     <SelectItem value="recurring">Recurring</SelectItem>
                  </SelectContent>
               </Select>
            </div> **/}

            {/** expenseType === "recurring" && (
               <>
                  <div>
                     <Label className="block mb-1 font-semibold" htmlFor="period">
                        Recurring Period (days)
                     </Label>
                     <Input
                        id="period"
                        type="number"
                        min="1"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="mt-1"
                        placeholder="e.g. 30"
                        required
                     />
                  </div>

                  <div>
                     <Label className="block mb-1 font-semibold" htmlFor="endDate">
                        End Date
                     </Label>
                     <Input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="mt-1"
                        required
                     />
                  </div>
               </>
            ) **/}

            {/** <div>
               <Label className="block mb-1 font-semibold" htmlFor="method">
                  Expense Method
               </Label>

               <Select onValueChange={(value) => setMethod(value as ExpenseMethod)}>
                  <SelectTrigger className="w-full mt-1">
                     <SelectValue placeholder="Expense method" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="flat">Flat Amount</SelectItem>
                     <SelectItem value="percentage">% of Revenue</SelectItem>
                  </SelectContent>
               </Select>
            </div> **/}

            {/** method === "percentage" && (
               <div>
                  <Label className="block mb-1 font-semibold" htmlFor="percentage">
                     Percentage of Revenue (%)
                  </Label>
                  <Input
                     id="percentage"
                     type="number"
                     step="0.1"
                     min="0"
                     value={percentage}
                     onChange={(e) => setPercentage(e.target.value)}
                     className="mt-1"
                     placeholder="e.g. 10"
                     required
                  />
               </div>
            ) **/}
            </Form>
         )}
      </Formik>
   );
}
