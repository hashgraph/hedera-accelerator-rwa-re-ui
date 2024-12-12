import { ReusableAvatar } from "@/components/Avatars/ReusableAvatar";
import { TimeLabel } from "@/components/Typography/TimeLabel";
import { buildingSlices } from "@/consts/props";
import { ClockIcon } from "@/resources/icons/ClockIcon";

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
                    <TimeLabel date={slice?.endsAt as number} formatType="dateAsTimeRange" />
                </div>
            </div>
        </div>
    );
};
