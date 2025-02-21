export const prepareIPFSfileURL = (ipfsHash: string) =>
	`https://${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL}/ipfs/${ipfsHash}`;

export const prepareStorageIPFSfileURL = (ipfsHash: string) =>
	`https://ipfs.io/ipfs/${ipfsHash}`;
