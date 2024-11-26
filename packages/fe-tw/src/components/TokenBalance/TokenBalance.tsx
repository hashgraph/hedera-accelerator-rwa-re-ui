import { useReadBalanceOf } from "@/hooks/useReadBalanceOf";
import { formatUnits } from "viem";

//@TODO remove test token value and pass it as param
const tokenAddress = "0x00000000000000000000000000000000004d0B03";
export default function TokenBalance() {
	const { data: balance, isLoading } = useReadBalanceOf(tokenAddress);

	//@TODO add dynamic decimals fetch
	return <>{!isLoading && formatUnits(balance, 8)}</>;
}
