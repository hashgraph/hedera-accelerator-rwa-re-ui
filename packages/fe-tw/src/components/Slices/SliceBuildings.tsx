import {
   Carousel,
   CarouselContent,
   CarouselItem,
   CarouselNext,
   CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BuildingNFTData } from "@/types/erc3643/types";
import { isValidIPFSImageUrl } from "@/utils/helpers";
import { useRouter } from "next/navigation";

export const SliceBuildings = ({ buildingsData }: { buildingsData: BuildingNFTData[] }) => {
    const router = useRouter();
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Slice Buildings List</CardTitle>
            </CardHeader>

            <div className="p-6 w-full">
                <Carousel>
                    <CarouselContent>
                        {buildingsData.map((bld) => (
                            <CarouselItem
                                onClick={() => {
                                    router.push(`/building/${bld.address}`);
                                }}
                                key={bld.name}
                                className="hover:scale-105 hover:bg-accent-focus transition-all duration-300"
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
        </Card>
    );
};
