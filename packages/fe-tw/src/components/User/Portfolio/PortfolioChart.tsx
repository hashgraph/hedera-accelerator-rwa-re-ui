import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
   ChartConfig,
   ChartContainer,
   ChartLegend,
   ChartLegendContent,
   ChartTooltip,
   ChartTooltipContent,
} from "@/components/ui/chart";
import { PortfolioHistoryData, PortfolioToken } from "./types";

interface PortfolioChartProps {
   historyData: PortfolioHistoryData | null | undefined;
   tokens: PortfolioToken[] | null | undefined;
}

export const PortfolioChart = ({ historyData, tokens }: PortfolioChartProps) => {
   const dynamicChartConfig = useMemo(
      () =>
         tokens?.reduce((acc, token, index) => {
            acc[token.tokenAddress] = {
               label: token.symbol || token.tokenAddress.slice(0, 6),
               color: `var(--chart-${(index % 5) + 1})`,
            };
            return acc;
         }, {} as ChartConfig) || {},
      [tokens],
   );

   const transformedChartData = useMemo(() => {
      if (!historyData || !tokens || tokens.length === 0) return [];

      const allDates = new Set<string>();
      tokens.forEach((token) => {
         const tokenHistory = historyData[token.tokenAddress];
         if (tokenHistory) {
            tokenHistory.forEach((point) => allDates.add(point.date));
         }
      });

      const sortedDates = Array.from(allDates).sort();

      return sortedDates.map((date) => {
         const dataPoint: { date: string; [key: string]: number | string | null } = { date };
         tokens.forEach((token) => {
            const tokenHistory = historyData[token.tokenAddress];
            const point = tokenHistory?.find((p) => p.date === date);
            dataPoint[token.tokenAddress] = point?.value ?? null;
         });
         return dataPoint;
      });
   }, [historyData, tokens]);

   const dateRange = useMemo(() => {
      if (!transformedChartData || transformedChartData.length === 0) return "";
      const firstDate = transformedChartData[0].date;
      const lastDate = transformedChartData[transformedChartData.length - 1].date;
      return `${firstDate} - ${lastDate}`;
   }, [transformedChartData]);

   if (!tokens || tokens.length === 0) {
      return (
         <Card>
            <CardHeader>
               <CardTitle>Portfolio Performance</CardTitle>
            </CardHeader>
            <CardContent>
               <p>No token data available to display chart.</p>
            </CardContent>
         </Card>
      );
   }

   return (
      <Card>
         <CardHeader>
            <CardTitle>Portfolio Performance</CardTitle>
            <CardDescription>{dateRange}</CardDescription>
         </CardHeader>
         <CardContent>
            <ChartContainer
               config={dynamicChartConfig}
               className="min-h-[200px] max-h-[300px] w-full"
            >
               <LineChart
                  accessibilityLayer
                  data={transformedChartData}
                  margin={{ left: 12, right: 12 }}
               >
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                  {tokens.map((token) => (
                     <Line
                        key={token.tokenAddress}
                        dataKey={token.tokenAddress}
                        type="monotone"
                        stroke={`var(--color-${token.tokenAddress})`}
                        strokeWidth={2}
                        dot={false}
                        connectNulls
                     />
                  ))}
                  <ChartLegend content={<ChartLegendContent className="flex-wrap" />} />
               </LineChart>
            </ChartContainer>
         </CardContent>
      </Card>
   );
};
