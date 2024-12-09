import { BuildingVoteItem } from "./BuildingVoteItem";

export const BuildingVotings = (props: { votings: number[] }) => {
    return (
        <div className="flex flex-col mt-10">
            <article className="prose">
                <h2>Voting Items</h2>
            </article>
            <div className="flex flex-col">
                {props.votings?.map(vot => (
                    <BuildingVoteItem voteId={vot} />
                ))}
            </div>
        </div>
    )
};
