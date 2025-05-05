import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { reduce } from "lodash";
import { PortfolioToken } from "./types";

interface IProps {
   data: PortfolioToken[] | undefined | null;
}

export function SectionCards({ data }: IProps) {
   const totalPortfolioValue = reduce(
      data,
      (acc, item) => acc + item.balance * item.exchangeRateUSDC,
      0,
   );

   const combinedPendingRewards = reduce(data, (acc, item) => acc + (item.pendingRewards || 0), 0);

   return (
      <div className="grid grid-cols-3 gap-4">
         <Card className="@container/card">
            <CardHeader className="relative">
               <CardDescription>Total Portfolio Value, USDC</CardDescription>
               <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                  ${totalPortfolioValue.toFixed(2)}
               </CardTitle>
            </CardHeader>
         </Card>
         <Card className="@container/card">
            <CardHeader className="relative">
               <CardDescription>Revenue, USDC</CardDescription>
               <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                  $674.83
               </CardTitle>
            </CardHeader>
         </Card>
         <Card className="@container/card">
            <CardHeader className="relative">
               <CardDescription>Pending Rewards</CardDescription>
               <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
                  {combinedPendingRewards.toFixed(4)}
               </CardTitle>
            </CardHeader>
         </Card>
      </div>
   );
}
