import type { BuildingInfo } from "@/types/erc3643/types";

export const BuildingDetailInfo = (props: BuildingInfo) => {
  const { demographics, financial } = props;

  return (
    <div className="flex flex-col md:flex-row md:justify-between max-w-(--breakpoint-sm) mt-10 space-y-8 md:space-y-0 md:space-x-12">
      {/* Financial Section */}
      <div>
        <article className="prose">
          <h3 className="font-semibold text-slate-700">Financial</h3>
        </article>
        <p>
          Percentage Owned by overall property: {financial.percentageOwned}%
        </p>
        <p>Token price: {financial.tokenPrice}$</p>
        <p>
          Direct exposure: {financial.directExposure} (
          {financial.directExposure * financial.tokenPrice}$)
        </p>
        <p>
          Yield:{" "}
          {financial.yield.map((yi) => (
            <span key={yi.percentage}>
              {"\n"} {yi.percentage}% ({yi.days} days)
            </span>
          ))}
        </p>
        <p>
          Treasury: {financial.treasury} (
          {financial.treasury * financial.tokenPrice}$)
        </p>
      </div>

      <div>
        <article className="prose">
          <h3 className="font-semibold text-slate-700">Demographics</h3>
        </article>
        <p>Constructed: {demographics.constructedYear}</p>
        <p>Type: {demographics.type}</p>
        <p>Location: {demographics.location}</p>
        <p>Location Type: {demographics.locationType}</p>
      </div>
    </div>
  );
};
