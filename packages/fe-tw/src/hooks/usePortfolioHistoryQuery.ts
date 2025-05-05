import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { map } from "lodash";
import { generateMockHistory } from "@/components/User/Portfolio/helpers";
import {
   PortfolioHistoryData,
   HistoryPoint,
   TimeFrame,
   PortfolioToken,
} from "@/components/User/Portfolio/types";

export const usePortfolioHistoryQuery = (
   tokens: PortfolioToken[] | undefined,
   timeFrame: TimeFrame,
) => {
   const [isLocalStorageAvailable, setIsLocalStorageAvailable] = useState(false);

   useEffect(() => {
      try {
         localStorage.setItem("test", "test");
         localStorage.removeItem("test");
         setIsLocalStorageAvailable(true);
      } catch (e) {
         setIsLocalStorageAvailable(false);
         console.warn("localStorage is not available.");
      }
   }, []);

   const tokenAddresses = map(tokens, "tokenAddress").sort();
   const queryKey = ["portfolioHistory", tokenAddresses, timeFrame];

   return useQuery<PortfolioHistoryData | null>({
      queryKey: queryKey,
      queryFn: async () => {
         if (!tokens || tokens.length === 0 || !timeFrame || !isLocalStorageAvailable) {
            return null;
         }

         const historyPromises = tokens.map(async (token) => {
            const tokenAddress = token.tokenAddress;
            const storageKey = `tokenHistory-${tokenAddress}-${timeFrame}`;
            let historyData: HistoryPoint[] | null = null;

            try {
               const storedData = localStorage.getItem(storageKey);
               if (storedData) {
                  try {
                     const parsedData = JSON.parse(storedData);
                     if (Array.isArray(parsedData)) {
                        console.log(`Found history in localStorage for ${storageKey}`);
                        historyData = parsedData as HistoryPoint[];
                     } else {
                        console.warn(
                           `Invalid data format in localStorage for ${storageKey}. Regenerating.`,
                        );
                     }
                  } catch (parseError) {
                     console.warn(
                        `Failed to parse localStorage data for ${storageKey}. Regenerating.`,
                        parseError,
                     );
                  }
               }

               if (!historyData) {
                  console.log(`No valid history in localStorage for ${storageKey}. Generating...`);
                  historyData = generateMockHistory(tokenAddress, timeFrame);
                  try {
                     localStorage.setItem(storageKey, JSON.stringify(historyData));
                     console.log(`Stored generated history in localStorage for ${storageKey}`);
                  } catch (storageError) {
                     console.error(
                        `Failed to store history in localStorage for ${storageKey}`,
                        storageError,
                     );
                  }
               }
            } catch (error) {
               console.error(`Error accessing localStorage for ${storageKey}`, error);
               historyData = generateMockHistory(tokenAddress, timeFrame);
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
      enabled: !!tokens && tokens.length > 0 && !!timeFrame && isLocalStorageAvailable,
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
   });
};
