import { AddBuildingTokenLiquidityForm } from "@/components/Admin/AddBuildingTokenLiquidityForm";
import { MintERC3643TokenForm } from "@/components/Admin/MintBuildingTokenForm";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { useState } from "react";
  
type Props = {
    buildingAddress: `0x${string}`,
};

export const BuildingMintAndAddLiquidity = (props: Props) => {
    const [currentTab, setCurrentTab] = useState('mintToken');

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Left Column: Description */}
                <div className="bg-purple-50 p-6 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">What You Can Do</h2>
                    <p className="text-sm sm:text-base text-gray-700">
                        This interface allows you to mint tokens & add liquidity.
                    </p>
                    <p className="mt-4 text-sm sm:text-base text-gray-700">
                        As you want to trade tokens you need to mint USDC and add liquidity pair first.
                    </p>
                </div>

                {/* Right Column: Mint & Liquidity */}
                <Tabs className="w-[400px]" value={currentTab}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="mintToken" onClick={() => {
                            setCurrentTab('mintToken');
                        }}>Mint Token</TabsTrigger>
                        <TabsTrigger value="addLiquidity" onClick={() => {
                            setCurrentTab('addLiquidity');
                        }}>Add Liquidity</TabsTrigger>
                    </TabsList>
                    <TabsContent value="mintToken">
                        <MintERC3643TokenForm buildingAddress={props.buildingAddress} onMintSuccess={() => {
                            setCurrentTab('addLiquidity');
                        }} />
                    </TabsContent>
                    <TabsContent value="addLiquidity">
                        <AddBuildingTokenLiquidityForm buildingAddress={props.buildingAddress} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};
