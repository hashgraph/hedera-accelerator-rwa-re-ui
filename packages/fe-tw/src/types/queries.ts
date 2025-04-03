import type { QueryData } from "./erc3643/types";

export enum QueryKeys {
   ReadBalanceOf = "readBalanceOf",
   ReadUniswapPairs = "ReadUniswapPairs"
}

export type Log = QueryData<string[]>;
