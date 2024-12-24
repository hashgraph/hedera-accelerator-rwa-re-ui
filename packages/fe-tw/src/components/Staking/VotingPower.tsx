"use client";

export default function VotingPower({
  votingPower = 0,
  totalVotingPower = 1,
}: {
  votingPower?: number;
  totalVotingPower?: number;
}) {
  const percentage = ((votingPower / totalVotingPower) * 100).toFixed(2);

  return (
    <div className="card bg-neutral p-6 h-full flex flex-col justify-between">
      <div>
        <h2 className="card-title text-black mb-4">Your Voting Power</h2>
        <p className="text-sm mb-4">
          Voting power reflects your influence in decision-making for the
          buildings you have staked tokens in. By staking tokens, you earn
          governance rights, allowing you to participate in key decisions such
          as treasury management, proposal approvals, and other operational
          aspects of the building's tokenized ecosystem.
        </p>

        <div className="stats shadow text-xs grid grid-cols-3 gap-4">
          <div className="stat">
            <div className="stat-title whitespace-normal text-center">
              Your Voting Power
            </div>
            <div className="stat-value text-sm text-center">
              {votingPower.toLocaleString()} VP
            </div>
          </div>
          <div className="stat">
            <div className="stat-title whitespace-normal text-center">
              Total Voting Power
            </div>
            <div className="stat-value text-sm text-center">
              {totalVotingPower.toLocaleString()} VP
            </div>
          </div>
          <div className="stat">
            <div className="stat-title whitespace-normal text-center">
              Your Influence
            </div>
            <div className="stat-value text-sm text-center">{percentage}%</div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <button className="btn btn-primary w-full">Delegate Voting Power</button>
      </div>
    </div>
  );
}
