import { map, times } from "lodash";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
   Table,
   TableHeader,
   TableRow,
   TableHead,
   TableBody,
   TableCell,
} from "@/components/ui/table";
import { PortfolioToken } from "./types";
import {
   Pagination,
   PaginationContent,
   PaginationEllipsis,
   PaginationItem,
   PaginationLink,
   PaginationNext,
   PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";

interface PortfolioTableProps {
   data: PortfolioToken[] | undefined | null;
}

export const PortfolioTable = ({ data }: PortfolioTableProps) => {
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 10;
   const totalPages = Math.ceil((data?.length || 0) / itemsPerPage);

   const paginatedData = data?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

   return (
      <Card>
         <CardHeader>
            <CardTitle>Tokens Portfolio</CardTitle>
            <CardDescription>
               A list of your tokens in the portfolio. You can see the balance, exchange rate, and
               value in USDC.
            </CardDescription>
         </CardHeader>
         <CardContent>
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead className="w-[100px]">Symbol</TableHead>
                     <TableHead>Balance</TableHead>
                     <TableHead>Exchange Rate (USDC)</TableHead>
                     <TableHead className="text-right">Value (USDC)</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {map(paginatedData, (item) => (
                     <TableRow key={item.tokenAddress}>
                        <TableCell className="font-medium">{item.symbol}</TableCell>
                        <TableCell>{item.balance?.toFixed(4)}</TableCell>
                        <TableCell>{item.exchangeRateUSDC}</TableCell>
                        <TableCell className="text-right">
                           {item.balance && item.exchangeRateUSDC
                              ? (item.balance * item.exchangeRateUSDC).toFixed(2)
                              : "N/A"}
                        </TableCell>
                     </TableRow>
                  ))}
                  {(!data || data.length === 0) && (
                     <TableRow>
                        <TableCell colSpan={4} className="text-center">
                           No tokens in portfolio.
                        </TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>

            <Pagination>
               <PaginationContent>
                  <PaginationItem>
                     <PaginationPrevious
                        onClick={() => setCurrentPage((page) => (page === 1 ? 1 : page - 1))}
                     />
                  </PaginationItem>
                  {times(totalPages, (i) => (
                     <PaginationItem key={i}>
                        <PaginationLink
                           isActive={i + 1 === currentPage}
                           onClick={() => setCurrentPage(i + 1)}
                        >
                           {i + 1}
                        </PaginationLink>
                     </PaginationItem>
                  ))}
                  <PaginationItem>
                     <PaginationNext
                        onClick={() =>
                           setCurrentPage((page) => (page === totalPages ? totalPages : page + 1))
                        }
                     />
                  </PaginationItem>
               </PaginationContent>
            </Pagination>
         </CardContent>
      </Card>
   );
};
