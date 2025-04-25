export const prepareStorageIPFSfileURL = (ipfsHash: string) => `https://ipfs.io/ipfs/${ipfsHash}`;

export const isValidIPFSImageUrl = (imageUrl?: string): boolean => {
    if (!imageUrl) {
        return false;
    }

    const url = imageUrl?.replace("https://ipfs.io/ipfs/", "");

    if (!url || url === 'undefined') {
        return false;
    }

    return true;
}
