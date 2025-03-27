import { useAccountId, useTokensBalance } from "@buidlerlabs/hashgraph-react-wallets";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";

export function AccountOwnedTokensList() {
   const { data: accountId } = useAccountId();

   const { data: ownedTokens, isLoading: isLoadingTokens } = useTokensBalance({
      accountId: accountId,
      autoFetch: !!accountId,
   });

   return (
      <>
         <h3>Owned tokens</h3>
         {isLoadingTokens ? (
            "Fetching..."
         ) : ownedTokens?.length > 0 ? (
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead>Token ID</TableHead>
                     <TableHead>Balance</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {ownedTokens?.map((token) => (
                     <TableRow key={token.token_id}>
                        <TableCell>{token.token_id}</TableCell>
                        <TableCell>{token.balance}</TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         ) : (
            "Nothing to show"
         )}
      </>
   );
}
