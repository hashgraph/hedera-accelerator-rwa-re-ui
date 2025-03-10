import { buildingFactoryAbi } from "@/services/contracts/abi/buildingFactoryAbi";
import { BUILDING_FACTORY_ADDRESS } from "@/services/contracts/addresses";
import type { TransactionExtended } from "@/types/common";
import type { DeployedBuilding } from "@/types/erc3643/types";
import {
	useReadContract,
	useWatchTransactionReceipt,
	useWriteContract,
} from "@buidlerlabs/hashgraph-react-wallets";
import { ContractId } from "@hashgraph/sdk";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { Button, Link } from "react-daisyui";
import toast from "react-hot-toast";
import * as Yup from "yup";

export function DeployBuilding({
	deployedMetadataIPFS,
	onBuildingDeployed,
}: { deployedMetadataIPFS: string; onBuildingDeployed: () => void }) {
	const { readContract } = useReadContract();
	const { writeContract } = useWriteContract();
	const { watch } = useWatchTransactionReceipt({
		abi: buildingFactoryAbi,
	});

	const [isLoading, setIsLoading] = useState(false);
	const [buildingsList, setBuildingsList] = useState<DeployedBuilding[]>([]);

	const [lastDeployedBuilding, setLastDeployedBuilding] =
		useState<DeployedBuilding>();

	const loadBuildings = async () => {
		try {
			const buildings = (await readContract({
				address: BUILDING_FACTORY_ADDRESS,
				abi: buildingFactoryAbi,
				functionName: "getBuildingList",
			})) as DeployedBuilding[];

			setBuildingsList(buildings);
		} catch (e) {
			console.error(e);
		}
	};

	useEffect(() => {
		if (buildingsList?.length) {
			const [building] = buildingsList.slice(-1);
			setLastDeployedBuilding(building);
		}
	}, [buildingsList]);

	const onSubmitted = (hashOrTransactionId: string) => {
		watch(hashOrTransactionId, {
			onSuccess: (transaction) => {
				const label = (
					<div>
						<div>SUCCESS:</div>
						<a
							href={`https://hashscan.io/testnet/transaction/${(transaction as TransactionExtended).consensus_timestamp}`}
							target="_blank"
							rel="noreferrer"
						>
							https://hashscan.io/testnet/transaction/
							{(transaction as TransactionExtended).consensus_timestamp}
						</a>
					</div>
				);

				toast.success(label, {
					icon: "✅",
					style: { maxWidth: "unset" },
					duration: 6000,
				});

				loadBuildings();

				setIsLoading(false);

				onBuildingDeployed();

				return transaction;
			},
			onError: (transaction, error) => {
				const errorMessage =
					typeof error === "string"
						? error
						: error?.errorName && error?.abiItem
							? error.errorName
							: (transaction as TransactionExtended).result;

				const label = (
					<div>
						<div>FAILED: {errorMessage}</div>
						<a
							href={`https://hashscan.io/testnet/transaction/${(transaction as TransactionExtended).consensus_timestamp}`}
							target="_blank"
							rel="noreferrer"
						>
							https://hashscan.io/testnet/transaction/
							{(transaction as TransactionExtended).consensus_timestamp}
						</a>
					</div>
				);

				toast.error(label, {
					icon: "❌",
					style: { maxWidth: "unset" },
					duration: 6000,
				});

				setIsLoading(false);
				return transaction;
			},
		});
	};

	const deployNewBuilding = async () => {
		try {
			const transactionIdOrHash = await writeContract({
				contractId: ContractId.fromEvmAddress(0, 0, BUILDING_FACTORY_ADDRESS),
				abi: buildingFactoryAbi,
				functionName: "newBuilding",
				metaArgs: { gas: 1_200_000 },
				args: [deployedMetadataIPFS],
			});

			if (transactionIdOrHash && typeof transactionIdOrHash === "string") {
				onSubmitted(transactionIdOrHash);
			}
		} catch (e: unknown) {
			if (
				typeof e === "object" &&
				e &&
				"transactionId" in e &&
				e.transactionId
			) {
				const [account, consensusTimestamp] = e.transactionId
					.toString()
					.split("@");

				onSubmitted(`${account}-${consensusTimestamp.replace(".", "-")}`);
			}

			console.log(JSON.parse(JSON.stringify(e)));
			console.error(e);
			setIsLoading(false);
		}
	};

	return (
		<div className="bg-white rounded-lg p-8 border border-gray-300">
			<h3 className="text-xl font-semibold mb-5">Step 3 - Deploy Building</h3>

			<Formik
				initialValues={{
					buildingMetadataIPFS: deployedMetadataIPFS,
				}}
				enableReinitialize={true}
				validationSchema={Yup.object({
					buildingMetadataIPFS: Yup.string().required("Required"),
				})}
				onSubmit={async (values, { setSubmitting }) => {
					console.log("L114 deploy values ===", values);
					setIsLoading(true);

					await deployNewBuilding();

					setSubmitting(false);
				}}
			>
				<Form>
					<div className="form-control w-full max-w-xs">
						<label className="label" htmlFor="buildingMetadataIPFS">
							<span className="label-text">Building metadata IPFS Id</span>
						</label>
						<Field
							name="buildingMetadataIPFS"
							type="text"
							className="input input-bordered w-full max-w-xs"
						/>
						<label className="label" htmlFor="buildingMetadataIPFS">
							<ErrorMessage name="buildingMetadataIPFS">
								{(error) => (
									<span className="label-text-alt text-red-700">{error}</span>
								)}
							</ErrorMessage>
						</label>

						<Button type={"submit"} color={"primary"} loading={isLoading}>
							Deploy new building
						</Button>
					</div>
				</Form>
			</Formik>

			{lastDeployedBuilding && (
				<>
					<p className="pt-4">New building was successfully deployed! ✅</p>
					<Link
						href={`/building/${lastDeployedBuilding?.addr}`}
						style={{ color: "black" }}
					>
						Navigate to the building {lastDeployedBuilding?.addr}
					</Link>
				</>
			)}
		</div>
	);
}
