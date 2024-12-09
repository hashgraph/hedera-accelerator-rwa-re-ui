import { ReusableAvatar } from "@/components/Avatars/ReusableAvatar";
import { activeProposals } from "@/consts/props";
import { ClockIcon } from "@/resources/icons/ClockIcon";
import moment from "moment";

export const BuildingVoteItem = ({ voteId }: { voteId: number }) => {
    const vote = activeProposals.find(proposal => proposal.id === voteId)

    return (
        <div className="flex flex-row mt-5">
            <ReusableAvatar
                imageAlt={vote?.title!}
                imageSource={vote?.imageUrl}
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
                    <span className="text-xs ml-2 text-slate-700">
                        {moment(vote?.started).format('dddd, LT')}
                    </span>
                </div>
            </div>
        </div>
    );
}
