import { ethers } from "ethers";

interface ReadContractParameters {
   abi: ethers.InterfaceAbi;
   functionName: string;
   args: readonly unknown[];
   address: string;
}

interface ContractCallRequestBody {
   block: string;
   data: string;
   estimate: boolean;
   from: string;
   gas: number;
   gasPrice: number;
   to: string;
   value: number;
}

interface ContractCallResponse {
   result: string;
}

export async function readContract(parameters: ReadContractParameters): Promise<ethers.Result> {
    try {
         const contractInterface = new ethers.Interface(parameters.abi);

         const data = contractInterface.encodeFunctionData(
             parameters.functionName,
             parameters.args,
         );

         //@TODO check out the contract.viewOrPureMethod

         const requestBody: ContractCallRequestBody = {
             block: "latest",
             data: data,
             estimate: false,
             from: "0000000000000000000000000000000000000000",
             gas: 15000000,
             gasPrice: 1,
             to: parameters.address,
             value: 0,
         };

         const response = await fetch("https://testnet.mirrornode.hedera.com/api/v1/contracts/call", {
             method: "POST",
             headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
             },
             body: JSON.stringify(requestBody),
         });
         const result: ContractCallResponse = await response.json();

         return contractInterface.decodeFunctionResult(parameters.functionName, result.result);
    } catch (e) {
         console.error("Error loading data from contract call");
         throw e;
    }
}
