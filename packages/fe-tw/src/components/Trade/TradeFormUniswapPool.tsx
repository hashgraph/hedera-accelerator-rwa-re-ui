"use client";

import { SwapLiquidityPair, SwapUniswapTokensRequestBody } from "@/types/erc3643/types";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { ethers } from "ethers";
import Select, { SingleValue } from "react-select";

// todo: Change this hook mock to real uniswap hook in scope of (https://uti.unicsoft.com.ua/issues/50179).
const useUniswapSwaps = (_buildingAddress: `0x${string}`) => {
    const handleSwapTokens = (payload: SwapUniswapTokensRequestBody): Promise<string> => {
        return Promise.resolve('00000');
    }

    const liquidityPairs: SwapLiquidityPair[] = [];

    return { liquidityPairs, handleSwapTokens };
};

type Props = {
    buildingAddress: `0x${string}`;
}

export default function TradeFormUniswapPool({ buildingAddress }: Props) {
    const { liquidityPairs, handleSwapTokens } = useUniswapSwaps(buildingAddress);
    const [txResult, setTxResult] = useState<string>();
    const [txError, setTxError] = useState<string>();
    const [tradeFormData, setTradeFormData] = useState({
        amount: 0,
        tokenA: '',
        tokenB: '',
    });

    const [liquidityPairsTo, setLiquidityPairsTo] = useState<SwapLiquidityPair[]>([]);

    useEffect(() => {
        if (liquidityPairs?.length) {
            setTradeFormData({
                tokenA: liquidityPairs[0].tokenA,
                tokenB: liquidityPairs[0].tokenB,
                amount: 0,
            });
            setLiquidityPairsTo(liquidityPairs.filter(pair => pair.tokenA === liquidityPairs[0].tokenA));
        }
    }, [liquidityPairs]);

    const handleSelectPairFrom = (tokenA: SingleValue<{ value: `0x${string}`; label: `0x${string}`; }>) => {
        setTradeFormData((prev) => ({
            ...prev,
            tokenA: tokenA?.value as string,
        }));
        setLiquidityPairsTo(liquidityPairs.filter(pair => pair.tokenA === tokenA?.value as string));
    };

    const handleSwapSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const amount = tradeFormData.amount;
        const tokenB = tradeFormData.tokenB;

        if (!amount || !tradeFormData.tokenA || !tradeFormData.tokenB) {
            toast.error('All fields in trade form are required');
        } else {
            try {
                const transaction_id = await handleSwapTokens({
                    amountIn: ethers.parseEther(amount.toString()),
                    amountOut: ethers.parseEther(amount.toString()),
                    path: [tradeFormData.tokenA, tradeFormData.tokenB],
                });
                setTradeFormData({
                    amount: 0,
                    tokenA: '',
                    tokenB: '',
                });

                toast.success(`Successfully sold ${amount} tokens for ${tokenB}!`);
                setTxResult(transaction_id);
            } catch (err) {
                toast.error(`Failed to sell tokens: ${(err as { message: string })?.message}`);
                setTxError((err as unknown as { message: string }).message);
            }
        }
    };

    return (
        <div className="flex-1 flex-col gap-4 w-6/12">
            <form
                onSubmit={handleSwapSubmit}
                className="bg-white rounded-lg p-10 border border-gray-300"
            >
                <h1 className="text-2xl font-bold mb-4">Swap Token</h1>
                <span className="text-sm text-gray-900">
                    Select a building token you hold and swap it for another building token or USDC
                </span>
                <div>
                    <label className="text-gray-500 text-md block mb-1 font-semibold" htmlFor="tokenASelect">
                        Select token A
                    </label>
                    <Select
                        onChange={handleSelectPairFrom}
                        options={liquidityPairs.map(token => ({
                            value: token.tokenA,
                            label: token.tokenA,
                        }))}
                    />
                </div>
                <div>
                    <label className="text-gray-500 text-md block mb-1 font-semibold" htmlFor="tokenBSelect">
                        Select token B
                    </label>
                    <Select
                        onChange={(value) => {
                            setTradeFormData(prev => ({
                                ...prev,
                                tokenB: value?.value as `0x${string}`,
                            }))
                        }}
                        options={liquidityPairsTo.map(token => ({
                            value: token.tokenB,
                            label: token.tokenB,
                        }))}
                    />
                </div>
                <div className="mb-5">
                    <label className="text-gray-500 text-md block mb-1 font-semibold" htmlFor="amount">
                        Amount of tokens to sell
                    </label>
                    <input
                        id="amount"
                        type="number"
                        value={tradeFormData.amount}
                        onChange={(e) => setTradeFormData((prev) => ({
                            ...prev,
                            amount: !e.target.value ? 0 : parseFloat(e.target.value),
                        }))}
                        className="input input-bordered w-full py-7"
                        placeholder="e.g. 10"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full"
                >
                    Swap tokens
                </button>
            </form>
            {txResult && <div className="flex">
                <p className="text-sm font-bold text-purple-600">
                    Deployed Tx Hash: {txResult}
                </p>
            </div>}
            {txError && <div className="flex">
                <p className="text-sm font-bold text-purple-600">
                    Deployed Tx Error: {txError}
                </p>
            </div>}
        </div>
    );
}
