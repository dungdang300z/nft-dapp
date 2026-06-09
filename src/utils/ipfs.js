import { PINATA_API_KEY, PINATA_SECRET_KEY } from "./config";

export async function uploadImageToIPFS(file) {
  if (!PINATA_API_KEY) {
    return `https://picsum.photos/seed/${Date.now()}/400/400`;
  }
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: { pinata_api_key: PINATA_API_KEY, pinata_secret_api_key: PINATA_SECRET_KEY },
    body: formData
  });
  if (!res.ok) throw new Error("Failed to upload image to IPFS");
  const data = await res.json();
  return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
}

export async function uploadMetadataToIPFS(metadata) {
  if (!PINATA_API_KEY) {
    return `data:application/json;base64,${btoa(JSON.stringify(metadata))}`;
  }
  const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: { "Content-Type": "application/json", pinata_api_key: PINATA_API_KEY, pinata_secret_api_key: PINATA_SECRET_KEY },
    body: JSON.stringify({ pinataContent: metadata, pinataMetadata: { name: metadata.name } })
  });
  if (!res.ok) throw new Error("Failed to upload metadata to IPFS");
  const data = await res.json();
  return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
}

export async function fetchMetadata(tokenURI) {
  try {
    if (tokenURI.startsWith("data:application/json;base64,")) {
      const json = atob(tokenURI.replace("data:application/json;base64,", ""));
      return JSON.parse(json);
    }
    if (tokenURI.startsWith("ipfs://")) {
      tokenURI = `https://gateway.pinata.cloud/ipfs/${tokenURI.slice(7)}`;
    }
    const res = await fetch(tokenURI);
    return await res.json();
  } catch { return null; }
}
