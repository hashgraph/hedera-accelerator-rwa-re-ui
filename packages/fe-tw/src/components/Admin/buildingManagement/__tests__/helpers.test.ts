import { transformValuesToContractFormat, getNewBuildingAddress } from "../helpers";
import { BuildingFormProps } from "../types";
import { readBuildingsList } from "@/services/buildingService";
import { INITIAL_VALUES } from "../constants";

jest.mock("@/utils/pinata");
jest.mock("@/services/contracts/watchContractEvent");
jest.mock("@/services/buildingService");
const mockReadBuildingsList = readBuildingsList as jest.Mock;

describe("helpers", () => {
   const mockValues: BuildingFormProps = {
      ...INITIAL_VALUES,
      info: {
         ...INITIAL_VALUES.info,
         buildingTitle: "Test Building",
         buildingDescription: "Test Description",
         buildingPurchaseDate: "2024-01-01",
         buildingConstructedYear: "2000",
         buildingType: "Residential",
         buildingLocation: "Test Location",
         buildingLocationType: "Urban",
         buildingTokenSupply: 1000000,
         copeConstructionMaterials: "Brick",
         copeConstructionYearBuilt: "2000",
         copeConstructionRoofType: "Tile",
         copeConstructionNumFloors: "2",
         copeOccupancyType: "Owner",
         copeOccupancyPercentage: "100",
         copeProtectionFire: "Yes",
         copeProtectionSprinklers: "Yes",
         copeProtectionSecurity: "Yes",
         copeExposureNearbyRisks: "None",
         copeExposureFloodZone: "No",
      },
   };
   const mockImageIpfsHash = "mockImageHash";

   beforeEach(() => {
      jest.clearAllMocks();
   });

   describe("transformValuesToContractFormat", () => {
      it("should transform form values to the expected contract format", () => {
         const expectedFormat = {
            name: "Test Building",
            description: "Test Description",
            image: mockImageIpfsHash,
            purchasedAt: "2024-01-01",
            attributes: [
               { trait_type: "constructedYear", value: "2000" },
               { trait_type: "type", value: "Residential" },
               { trait_type: "location", value: "Test Location" },
               { trait_type: "locationType", value: "Urban" },
               { trait_type: "tokenSupply", value: "1000000" },
            ],
            cope: {
               construction: {
                  materials: "Brick",
                  yearBuilt: "2000",
                  roofType: "Tile",
                  numFloors: "2",
               },
               occupancy: {
                  type: "Owner",
                  percentageOccupied: "100",
               },
               protection: {
                  fire: "Yes",
                  sprinklers: "Yes",
                  security: "Yes",
               },
               exposure: {
                  nearbyRisks: "None",
                  floodZone: "No",
               },
            },
         };
         const result = transformValuesToContractFormat(mockValues, mockImageIpfsHash);
         expect(result).toEqual(expectedFormat);
      });
   });

   describe("getNewBuildingAddress", () => {
      it("should return the address of the last building from the list", async () => {
         const mockBuildings = [
            ["0xBuilding1", "ipfs1"],
            ["0xBuilding2", "ipfs2"],
         ];
         mockReadBuildingsList.mockResolvedValueOnce([mockBuildings]);
         const result = await getNewBuildingAddress();
         expect(mockReadBuildingsList).toHaveBeenCalledTimes(1);
         expect(result).toBe("0xBuilding2");
      });

      it("should throw an error if no buildings are found", async () => {
         mockReadBuildingsList.mockResolvedValueOnce([]);
         await expect(getNewBuildingAddress()).rejects.toThrow("No building found");
      });
   });
});
