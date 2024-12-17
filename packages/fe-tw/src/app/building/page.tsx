import { PageRedirect } from "@/components/Page/PageRedirect";
import { BuildingDetailPage } from "@/components/Pages/BuildingDetailsPage";
import { buildings } from "@/consts/buildings";
import { BuildingData } from "@/types/erc3643/types";

type Props = {
  params: { id: string };
};

export default async function Overview({ params }: Props) {
  const { id } = params;

  const buildingData = buildings.find((one) => one.id === parseInt(id, 10));

  return (
    <PageRedirect notFound={!buildingData}>
      <BuildingDetailPage {...(buildingData as BuildingData)} />
    </PageRedirect>
  );
}
