import { QueryData } from "./erc3643/types";

export enum QueryKeys {
   ReadBalanceOf = "readBalanceOf",
}

export type Log = QueryData<string[]>;
