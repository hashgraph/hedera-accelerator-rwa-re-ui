"use client";

import { ArrowBack } from "@mui/icons-material";

type Props = {
  onGetDeployBuilding: () => void;
  onGetDeployAToken: () => void;
  onGetAddLiquidity: () => void,
  activeStepOn: number;
};

export const BuildingManagementViewBreadcrumbs = ({
  onGetDeployAToken,
  onGetDeployBuilding,
  onGetAddLiquidity,
  activeStepOn,
}: Props) => {
  const activeTextStyle = "flex items-center text-purple-800 hover:underline";
  const textStyle = "font-semibold";

  return (
    <div className="breadcrumbs text-sm text-gray-700 mb-4">
      <ul>
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
        <li onClick={onGetDeployBuilding}>
          <p className={activeStepOn === 1 ? activeTextStyle : textStyle}>
            <ArrowBack fontSize="small" />
            <span className="ml-2">Deploy Building</span>
          </p>
        </li>
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
        <li onClick={onGetDeployAToken}>
          <p className={activeStepOn === 6 ? activeTextStyle : textStyle}>
            <span>Deploy A Token</span>
          </p>
        </li>
        <li onClick={onGetAddLiquidity}>
          <p className={activeStepOn === 6 ? activeTextStyle : textStyle}>
            <span>Add Liquidity</span>
          </p>
        </li>
      </ul>
    </div>
  );
};
