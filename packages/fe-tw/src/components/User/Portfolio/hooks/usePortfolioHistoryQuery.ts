import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { isEmpty, map } from "lodash";
import { generateMockHistory } from "@/components/User/Portfolio/helpers";
import {
   PortfolioHistoryData,
   HistoryPoint,
   TimeFrame,
   PortfolioToken,
} from "@/components/User/Portfolio/types";

export const usePortfolioHistoryQuery = (
   tokens: PortfolioToken[] | undefined | null,
   timeFrame: TimeFrame,
) => {
   const tokenAddresses = map(tokens, "tokenAddress").sort();
   const queryKey = ["portfolioHistory", tokenAddresses, timeFrame];

   return useQuery<PortfolioHistoryData | null>({
      queryKey: queryKey,
      queryFn: async () => {
         if (!tokens || tokens.length === 0 || !timeFrame) {
            return null;
         }

         const historyPromises = tokens.map(async (token) => {
            const tokenAddress = token.tokenAddress;
            const storageKey = `tokenHistory-${tokenAddress}-${timeFrame}`;
            let historyData: HistoryPoint[] | null = null;

            const storedData = localStorage.getItem(storageKey);
            if (storedData) {
               const parsedData = JSON.parse(storedData);
               historyData = parsedData as HistoryPoint[];
            }

            if (!historyData) {
               historyData = generateMockHistory(tokenAddress, timeFrame);
               localStorage.setItem(storageKey, JSON.stringify(historyData));
            }

            return { tokenAddress, history: historyData };
         });

         const results = await Promise.all(historyPromises);
         const portfolioHistory: PortfolioHistoryData = results.reduce(
            (acc, { tokenAddress, history }) => {
               acc[tokenAddress] = history;
               return acc;
            },
            {} as PortfolioHistoryData,
         );

         return portfolioHistory;
      },
      enabled: !isEmpty(tokens) && !!timeFrame,
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
   });
};
