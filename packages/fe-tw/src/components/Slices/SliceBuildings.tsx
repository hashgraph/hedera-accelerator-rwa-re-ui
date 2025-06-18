import {
   Carousel,
   CarouselContent,
   CarouselItem,
   CarouselNext,
   CarouselPrevious,
} from "@/components/ui/carousel";
import { BuildingNFTData } from "@/types/erc3643/types";
import { Card, CardContent } from "../ui/card";
import { isValidIPFSImageUrl } from "@/utils/helpers";
import { useRouter } from "next/navigation";

export const SliceBuildings = ({ buildingsData }: { buildingsData: BuildingNFTData[] }) => {
    const router = useRouter();
    
    return (
        <div className="pt-10">
            <div className="bg-white rounded-xl shadow-lg border border-indigo-100 w-full">
                <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-xl border-b border-indigo-100 p-6">
                    <h1 className="text-2xl font-bold">Slice Buildings List</h1> 
                </div>
                
                <div className="p-6">
                <Carousel>
                    <CarouselContent className="p-4">
                        {buildingsData.map((bld) => (
                            <CarouselItem
                                onClick={() => {
                                    router.push(`/building/${bld.address}`);
                                }}
                                key={bld.name}
                                className="hover:scale-105 hover:bg-accent-focus transition-all duration-300 basis-1/4"
                            >
                                <Card>
                                    <CardContent>
                                        <img
                                            src={isValidIPFSImageUrl(bld.image) ? bld.image : "assets/dome.jpeg"}
                                            alt={bld.name}
                                            className="rounded-md object-cover w-full h-40 mb-2"
                                        />
                                        <span className="text-xl font-bold">{bld.name}</span>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>
            </div>
        </div>
    );
};
