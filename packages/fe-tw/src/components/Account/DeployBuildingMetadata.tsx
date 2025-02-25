import { UploadImageForm } from "@/components/Account/UploadImageForm";
import { uploadJsonToPinata } from "@/services/ipfsService";
import { prepareIPFSfileURL } from "@/utils/helpers";
import { pinata } from "@/utils/pinata";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { type Dispatch, type SetStateAction, useState } from "react";
import { Button } from "react-daisyui";
import { toast } from "react-hot-toast";
import * as Yup from "yup";

interface newBuildingFormProps {
	buildingTitle: string;
	buildingDescription?: string;
	buildingPurchaseDate?: string;
	buildingImageIpfsId: string;
	buildingImageIpfsFile?: File;
	buildingConstructedYear?: string;
	buildingType?: string;
	buildingLocation?: string;
	buildingLocationType?: string;
	buildingTokenSupply: number;
  
	copeConstructionMaterials?: string;
	copeConstructionYearBuilt?: string;
	copeConstructionRoofType?: string;
	copeConstructionNumFloors?: string;
  
	copeOccupancyType?: string;
	copeOccupancyPercentage?: string;
  
	copeProtectionFire?: string;
	copeProtectionSprinklers?: string;
	copeProtectionSecurity?: string;
  
	copeExposureNearbyRisks?: string;
	copeExposureFloodZone?: string;
  }
  
  const newBuildingFormInitialValues: newBuildingFormProps = {
	buildingTitle: "",
	buildingDescription: "",
	buildingPurchaseDate: "",
	buildingImageIpfsId: "",
	buildingConstructedYear: "",
	buildingType: "",
	buildingLocation: "",
	buildingLocationType: "",
	buildingTokenSupply: 1000000,
  
	copeConstructionMaterials: "",
	copeConstructionYearBuilt: "",
	copeConstructionRoofType: "",
	copeConstructionNumFloors: "",
	copeOccupancyType: "",
	copeOccupancyPercentage: "",
	copeProtectionFire: "",
	copeProtectionSprinklers: "",
	copeProtectionSecurity: "",
	copeExposureNearbyRisks: "",
	copeExposureFloodZone: "",
  };
  

interface deployBuildingMetadataProps {
	setDeployedMetadataIPFS: Dispatch<SetStateAction<string>>;
	onBuildingDeployed: () => void;
}

//@TODO preview metadata after deploy

export function DeployBuildingMetadata({
	setDeployedMetadataIPFS,
	onBuildingDeployed,
  }: deployBuildingMetadataProps) {
	const [isUploading, setIsUploading] = useState(false);
  
	const uploadMetadata = async (formValues: newBuildingFormProps) => {
	  setIsUploading(true);
  
	  const formDataJson = {
		name: formValues.buildingTitle,
		description: formValues.buildingDescription,
		image: formValues.buildingImageIpfsId,
		purchasedAt: formValues.buildingPurchaseDate,
		attributes: [
		  {
			trait_type: "constructedYear",
			value: formValues.buildingConstructedYear,
		  },
		  { trait_type: "type", value: formValues.buildingType },
		  { trait_type: "location", value: formValues.buildingLocation },
		  { trait_type: "locationType", value: formValues.buildingLocationType },
		  {
			trait_type: "tokenSupply",
			value: formValues.buildingTokenSupply.toString(),
		  },
		],
  
		cope: {
		  construction: {
			materials: formValues.copeConstructionMaterials,
			yearBuilt: formValues.copeConstructionYearBuilt,
			roofType: formValues.copeConstructionRoofType,
			numFloors: formValues.copeConstructionNumFloors,
		  },
		  occupancy: {
			type: formValues.copeOccupancyType,
			percentageOccupied: formValues.copeOccupancyPercentage,
		  },
		  protection: {
			fire: formValues.copeProtectionFire,
			sprinklers: formValues.copeProtectionSprinklers,
			security: formValues.copeProtectionSecurity,
		  },
		  exposure: {
			nearbyRisks: formValues.copeExposureNearbyRisks,
			floodZone: formValues.copeExposureFloodZone,
		  },
		},
	  };
  
	  const sanitizedBuildingName = formValues.buildingTitle
		.replace(/\s+/g, "-")
		.toLowerCase();
  
	  try {
		const ipfsHash = await uploadJsonToPinata(
		  formDataJson,
		  `metadata-${sanitizedBuildingName}`,
		);
  
		setDeployedMetadataIPFS(ipfsHash);
		onBuildingDeployed();
		setIsUploading(false);
	  } catch (e) {
		toast.error("Metadata JSON upload to IPFS failed");
		setIsUploading(false);
	  }
	};

	return (
		<>
			<h3>Add building metadata details</h3>

			<Formik
				initialValues={newBuildingFormInitialValues}
				//@TODO add validation
				validationSchema={Yup.object({
					buildingTitle: Yup.string().required("Required"),
				})}
				onSubmit={async (values, { setSubmitting }) => {
					setSubmitting(true);

					await uploadMetadata(values);

					setSubmitting(false);
				}}
			>
				<Form>
					<div className="form-control w-full max-w-xs">
						<label className="label" htmlFor="buildingTitle">
							<span className="label-text">Building title</span>
						</label>
						<Field
							name="buildingTitle"
							type="text"
							className="input input-bordered w-full max-w-xs"
						/>
						<label className="label" htmlFor="buildingTitle">
							<ErrorMessage name="buildingTitle">
								{(error) => (
									<span className="label-text-alt text-red-700">{error}</span>
								)}
							</ErrorMessage>
						</label>

						<label className="label" htmlFor="buildingDescription">
							<span className="label-text">Building description</span>
						</label>

						<Field
							as={"textarea"}
							name="buildingDescription"
							type="textarea"
							className="textarea textarea-bordered w-full max-w-xs"
						/>
						<label className="label" htmlFor="buildingDescription">
							<ErrorMessage name="buildingDescription">
								{(error) => (
									<span className="label-text-alt text-red-700">{error}</span>
								)}
							</ErrorMessage>
						</label>

						<label className="label" htmlFor="buildingPurchaseDate">
							<span className="label-text">Building purchase date</span>
						</label>
						<Field
							name="buildingPurchaseDate"
							type="text"
							className="input input-bordered w-full max-w-xs"
						/>
						<label className="label" htmlFor="buildingPurchaseDate">
							<ErrorMessage name="buildingPurchaseDate">
								{(error) => (
									<span className="label-text-alt text-red-700">{error}</span>
								)}
							</ErrorMessage>
						</label>

						<label className="label" htmlFor="buildingImageIpfsId">
							<span className="label-text">Building image IPFS Id</span>
						</label>
						<Field
							name="buildingImageIpfsId"
							type="text"
							className="input input-bordered w-full max-w-xs"
						/>
						<label className="label" htmlFor="buildingImageIpfsId">
							<ErrorMessage name="buildingImageIpfsId">
								{(error) => (
									<span className="label-text-alt text-red-700">{error}</span>
								)}
							</ErrorMessage>
						</label>

						<UploadImageForm />

						<label className="label" htmlFor="buildingConstructedYear">
							<span className="label-text">Building year of construction</span>
						</label>
						<Field
							name="buildingConstructedYear"
							type="text"
							className="input input-bordered w-full max-w-xs"
						/>
						<label className="label" htmlFor="buildingConstructedYear">
							<ErrorMessage name="buildingConstructedYear">
								{(error) => (
									<span className="label-text-alt text-red-700">{error}</span>
								)}
							</ErrorMessage>
						</label>

						<label className="label" htmlFor="buildingType">
							<span className="label-text">Building type</span>
						</label>
						<Field
							name="buildingType"
							type="text"
							className="input input-bordered w-full max-w-xs"
						/>
						<label className="label" htmlFor="buildingType">
							<ErrorMessage name="buildingType">
								{(error) => (
									<span className="label-text-alt text-red-700">{error}</span>
								)}
							</ErrorMessage>
						</label>

						<label className="label" htmlFor="buildingLocation">
							<span className="label-text">Building location</span>
						</label>
						<Field
							name="buildingLocation"
							type="text"
							className="input input-bordered w-full max-w-xs"
						/>
						<label className="label" htmlFor="buildingLocation">
							<ErrorMessage name="buildingLocation">
								{(error) => (
									<span className="label-text-alt text-red-700">{error}</span>
								)}
							</ErrorMessage>
						</label>

						<label className="label" htmlFor="buildingLocationType">
							<span className="label-text">Building location type</span>
						</label>
						<Field
							name="buildingLocationType"
							type="text"
							className="input input-bordered w-full max-w-xs"
						/>
						<label className="label" htmlFor="buildingLocationType">
							<ErrorMessage name="buildingLocationType">
								{(error) => (
									<span className="label-text-alt text-red-700">{error}</span>
								)}
							</ErrorMessage>
						</label>

						<label className="label" htmlFor="buildingTokenSupply">
							<span className="label-text">Token Supply</span>
						</label>
						<Field
							name="buildingTokenSupply"
							type="number"
							className="input input-bordered w-full max-w-xs"
						/>
						<label className="label" htmlFor="buildingTokenSupply">
							<ErrorMessage name="buildingTokenSupply">
								{(error) => (
									<span className="label-text-alt text-red-700">{error}</span>
								)}
							</ErrorMessage>
						</label>

						<label className="label" htmlFor="copeConstructionMaterials">
              <span className="label-text">COPE: Construction Materials</span>
            </label>
            <Field
              name="copeConstructionMaterials"
              type="text"
              className="input input-bordered w-full max-w-xs"
            />

            <label className="label" htmlFor="copeConstructionYearBuilt">
              <span className="label-text">COPE: Construction Year Built</span>
            </label>
            <Field
              name="copeConstructionYearBuilt"
              type="text"
              className="input input-bordered w-full max-w-xs"
            />

            <label className="label" htmlFor="copeConstructionRoofType">
              <span className="label-text">COPE: Construction Roof Type</span>
            </label>
            <Field
              name="copeConstructionRoofType"
              type="text"
              className="input input-bordered w-full max-w-xs"
            />

            <label className="label" htmlFor="copeConstructionNumFloors">
              <span className="label-text">COPE: Construction # Floors</span>
            </label>
            <Field
              name="copeConstructionNumFloors"
              type="text"
              className="input input-bordered w-full max-w-xs"
            />

            <label className="label" htmlFor="copeOccupancyType">
              <span className="label-text">COPE: Occupancy Type</span>
            </label>
            <Field
              name="copeOccupancyType"
              type="text"
              className="input input-bordered w-full max-w-xs"
            />

            <label className="label" htmlFor="copeOccupancyPercentage">
              <span className="label-text">COPE: Occupancy Percentage</span>
            </label>
            <Field
              name="copeOccupancyPercentage"
              type="text"
              className="input input-bordered w-full max-w-xs"
            />

            <label className="label" htmlFor="copeProtectionFire">
              <span className="label-text">COPE: Protection Fire</span>
            </label>
            <Field
              name="copeProtectionFire"
              type="text"
              className="input input-bordered w-full max-w-xs"
            />

            <label className="label" htmlFor="copeProtectionSprinklers">
              <span className="label-text">COPE: Protection Sprinklers</span>
            </label>
            <Field
              name="copeProtectionSprinklers"
              type="text"
              className="input input-bordered w-full max-w-xs"
            />

            <label className="label" htmlFor="copeProtectionSecurity">
              <span className="label-text">COPE: Protection Security</span>
            </label>
            <Field
              name="copeProtectionSecurity"
              type="text"
              className="input input-bordered w-full max-w-xs"
            />

            <label className="label" htmlFor="copeExposureNearbyRisks">
              <span className="label-text">COPE: Exposure Nearby Risks</span>
            </label>
            <Field
              name="copeExposureNearbyRisks"
              type="text"
              className="input input-bordered w-full max-w-xs"
            />

            <label className="label" htmlFor="copeExposureFloodZone">
              <span className="label-text">COPE: Exposure Flood Zone</span>
            </label>
            <Field
              name="copeExposureFloodZone"
              type="text"
              className="input input-bordered w-full max-w-xs"
            />

            <Button
              type={"submit"}
              color={"primary"}
              loading={isUploading}
              disabled={isUploading}
            >
              Submit building metadata
            </Button>
          </div>
        </Form>
      </Formik>
    </>
  );
}