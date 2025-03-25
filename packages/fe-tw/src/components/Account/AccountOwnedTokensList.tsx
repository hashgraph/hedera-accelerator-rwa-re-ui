import { useAccountId, useTokensBalance } from "@buidlerlabs/hashgraph-react-wallets";
import { Table } from "react-daisyui";

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
            <div className="overflow-x-auto">
               <Table>
                  <Table.Head>
                     <span>Token ID</span>
                     <span>Balance</span>
                  </Table.Head>

                  <Table.Body>
                     {ownedTokens.map(
                        ({ token_id, balance }: { token_id: string; balance: number }) => (
                           <Table.Row key={token_id}>
                              <span className={"text-primary-content"}>{token_id}</span>
                              <span className={"text-primary-content"}>{balance}</span>
                           </Table.Row>
                        ),
                     )}
                  </Table.Body>
               </Table>
            </div>
         ) : (
            "Nothing to show"
         )}
      </>
   );
}
