import { useEffect, useState } from "react";
import { watchContractEvent } from "@/services/contracts/watchContractEvent";
import { sliceFactoryAbi } from "@/services/contracts/abi/sliceFactoryAbi";
import { SLICE_FACTORY_ADDRESS } from "@/services/contracts/addresses";
import type { SliceData } from "@/types/erc3643/types";
import { fetchJsonFromIpfs } from "@/services/ipfsService";
import { readContract } from "@/services/contracts/readContract";
import { sliceAbi } from "@/services/contracts/abi/sliceAbi";
import { prepareStorageIPFSfileURL } from "@/utils/helpers";

/**
 * Reads slice details from SC.
 * @param address Slice address
 */
const readSliceMetdataUri = (sliceAddress: `0x${string}`) =>
	readContract({
		functionName: "metadataUri",
		address: sliceAddress,
		abi: sliceAbi,
		args: [],
	});

export function useSlicesData() {
	const [sliceAddresses, setSliceAddresses] = useState<`0x${string}`[]>([]);
	const [slices, setSlices] = useState<SliceData[]>([]);
	const [sliceLogs, setSliceLogs] = useState<any[]>([]);

	useEffect(() => {
		watchContractEvent({
			address: SLICE_FACTORY_ADDRESS,
			abi: sliceFactoryAbi,
			eventName: "SliceDeployed",
			onLogs: (data) => {
				setSliceLogs(data);
			},
		});
	}, [setSliceLogs]);

	const requestSlicesDetails = async () => {
		const slicesMetadataUris = await Promise.all(
			sliceLogs.map((log) => readSliceMetdataUri(log.args[0])),
		);
		const sliceMetdatas = await Promise.all(
			slicesMetadataUris.map((uri: string[]) => fetchJsonFromIpfs(uri[0])),
		);

		setSliceAddresses(sliceLogs.map((log) => log.args[0]));
		setSlices(
			sliceMetdatas.map((m, sliceId) => ({
				id: sliceLogs[sliceId].args[0],
				address: sliceLogs[sliceId].args[0],
				name: m.name,
				allocation: m.allocation,
				description: m.description,
				imageIpfsUrl: prepareStorageIPFSfileURL(
					m.sliceImageIpfsHash?.replace("ipfs://", ""),
				),
				endDate: m.endDate,
				estimatedPrice: 0,
			})),
		);
	};

	useEffect(() => {
		if (sliceLogs?.length) {
			requestSlicesDetails();
		}
	}, [sliceLogs?.length]);

	return {
		sliceAddresses,
		slices,
	};
}
