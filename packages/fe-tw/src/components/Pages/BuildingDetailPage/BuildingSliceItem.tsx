import { ReusableAvatar } from "@/components/Avatars/ReusableAvatar";
import { buildingSlices } from "@/consts/props";
import { ClockIcon } from "@/resources/icons/ClockIcon";
import moment from "moment";

export const BuildingSlice = ({ sliceId }: { sliceId: number }) => {
    const slice = buildingSlices.find(({ id }) => sliceId === id);

    return (
        <div className="flex flex-row mt-5">
            <ReusableAvatar
                imageAlt={slice?.name!}
                imageSource={slice?.imageUrl}
                size="md"
                isRounded
                isFocusAvailable={false}
            />
            <div className="flex flex-col ml-5 justify-between">
                <article>
                    <p className="text-lg">{slice?.name}</p>
                    <p>{slice?.description}</p>
                </article>
                <div className="flex flex-row items-center">
                    <ClockIcon />
                    <span className="text-xs ml-2 text-slate-700">
                        {moment(slice?.timeToEnd).format('dddd, LT')}
                    </span>
                </div>
            </div>
        </div>
    );
};
