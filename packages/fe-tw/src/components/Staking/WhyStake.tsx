"use client";

import React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const WhyStake = () => (
   <Card className="mt-6">
      <CardHeader>
         <CardTitle>Why Stake?</CardTitle>
         <CardDescription>
            When you stake, you earn vTOKENs representing both your ownership and governance rights,
            enabling you to help shape the future of the building's treasury, proposals, and
            returns. This is a great way to participate in the governance of the building and earn
            rewards. Also, by staking, you can help secure the network and earn rewards in the
            process.
         </CardDescription>
      </CardHeader>
   </Card>
);

export default WhyStake;
