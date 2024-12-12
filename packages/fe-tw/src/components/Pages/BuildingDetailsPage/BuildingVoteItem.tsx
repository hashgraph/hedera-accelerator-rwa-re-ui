import { ReusableAvatar } from "@/components/Avatars/ReusableAvatar";
import { activeProposals } from "@/consts/props";
import { ClockIcon } from "@/resources/icons/ClockIcon";
import { TimeLabel } from "@/components/Typography/TimeLabel";

export const BuildingVoteItem = ({ voteId }: { voteId: number }) => {
    const vote = activeProposals.find(proposal => proposal.id === voteId);

    return (
        <div className="flex flex-row mt-5">
            <ReusableAvatar
                imageAlt={vote?.title!}
                size="md"
                isRounded
                isFocusAvailable={false}
            />
            <div className="flex flex-col ml-5 justify-between">
                <article>
                    <p className="text-lg">{vote?.title}</p>
                    <p>{vote?.description}</p>
                </article>
                <div className="flex flex-row items-center">
                    <ClockIcon />
                    <TimeLabel date={vote?.started as Date} formatType="dateAsTimeRange" />
                </div>
            </div>
        </div>
    );
};
