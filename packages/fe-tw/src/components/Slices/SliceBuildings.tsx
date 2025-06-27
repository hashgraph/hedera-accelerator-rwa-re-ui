import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BuildingNFTData } from "@/types/erc3643/types";
import Link from "next/link";

export const SliceBuildings = ({ buildingsData }: { buildingsData: BuildingNFTData[] }) => {
    return (
        <Card className="min-h-100">
            <CardHeader>
                <CardTitle>Slice Buildings List</CardTitle>
            </CardHeader>

            <CardContent>
                <div className="p-2 w-full flex flex-col gap-4">
                    {buildingsData.map((building) => (
                        <Link
                            key={building.address}
                            href={`/building/${building.address}`}
                            className="p-4 flex flex-col gap-2 justify-between rounded-lg transition-transform duration-200 hover:scale-[1.02] bg-purple-50 hover:bg-purple-100 cursor-pointer"
                        >
                            <p className="font-semibold text-gray-900">
                                {building.name}
                            </p>
                            <p className="text-sm text-gray-600">
                                {building.address?.slice(0, 25) + '...'}
                            </p>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
