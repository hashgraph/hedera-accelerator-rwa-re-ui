export async function uploadJsonToPinata(
  jsonData: any,
  fileName: string = "no-name"
): Promise<string> {
  const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
  const pinataSecret = process.env.NEXT_PUBLIC_PINATA_SECRET;

  const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      pinata_api_key: pinataApiKey || "",
      pinata_secret_api_key: pinataSecret || "",
    },
    body: JSON.stringify({
      pinataOptions: { cidVersion: 1 },
      pinataMetadata: { name: fileName }, 
      pinataContent: jsonData,
    }),
  });

  if (!res.ok) {
    throw new Error(`Pinata upload failed with status ${res.status}`);
  }

  const result = await res.json();
  return result.IpfsHash;
}
