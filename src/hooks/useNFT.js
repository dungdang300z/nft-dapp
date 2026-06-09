import { useState, useCallback } from "react";
import { Contract } from "ethers";
import { NFT_ABI, NFT_CONTRACT_ADDRESS } from "../utils/config";
import { uploadImageToIPFS, uploadMetadataToIPFS, fetchMetadata } from "../utils/ipfs";

const DEMO_MODE = NFT_CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000";

const DEMO_NFTS = [
  { tokenId: "1", name: "Cyber Phoenix #001", description: "A digital phoenix rising from blockchain ashes", image: "https://picsum.photos/seed/nft1/400/400", attributes: [{ trait_type: "Rarity", value: "Legendary" }], owner: "0xDemo...1234" },
  { tokenId: "2", name: "Neon Samurai #002", description: "Warrior of the digital realm", image: "https://picsum.photos/seed/nft2/400/400", attributes: [{ trait_type: "Rarity", value: "Epic" }], owner: "0xDemo...1234" },
  { tokenId: "3", name: "Void Walker #003", description: "Explorer of the metaverse voids", image: "https://picsum.photos/seed/nft3/400/400", attributes: [{ trait_type: "Rarity", value: "Rare" }], owner: "0xDemo...1234" }
];

export function useNFT(signer, address) {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [minting, setMinting] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState(null);

  const getContract = useCallback(() => {
    if (!signer) throw new Error("Wallet chưa kết nối");
    return new Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, signer);
  }, [signer]);

  const loadNFTs = useCallback(async () => {
    if (!address) return;
    setLoading(true); setError(null);
    if (DEMO_MODE) { setTimeout(() => { setNfts(DEMO_NFTS); setLoading(false); }, 800); return; }
    try {
      const contract = getContract();
      const balance = await contract.balanceOf(address);
      const count = Number(balance);
      const items = [];
      for (let i = 0; i < count; i++) {
        try {
          const tokenId = await contract.tokenOfOwnerByIndex(address, i);
          const uri = await contract.tokenURI(tokenId);
          const meta = await fetchMetadata(uri);
          items.push({ tokenId: tokenId.toString(), name: meta?.name || `NFT #${tokenId}`, description: meta?.description || "", image: meta?.image || `https://picsum.photos/seed/${tokenId}/400/400`, attributes: meta?.attributes || [], owner: address, tokenURI: uri });
        } catch (e) { console.warn(`Error loading token ${i}:`, e); }
      }
      setNfts(items);
    } catch (e) { setError(e.message || "Không thể tải NFT"); }
    finally { setLoading(false); }
  }, [address, getContract]);

  const mintNFT = useCallback(async ({ name, description, imageFile, attributes }) => {
    setMinting(true); setError(null); setTxHash(null);
    if (DEMO_MODE) {
      await new Promise(r => setTimeout(r, 2000));
      const newId = String(nfts.length + 1);
      const newNFT = { tokenId: newId, name, description, image: imageFile ? URL.createObjectURL(imageFile) : `https://picsum.photos/seed/new${newId}/400/400`, attributes: attributes || [], owner: address || "0xDemo..." };
      setNfts(prev => [newNFT, ...prev]); setTxHash("0xDEMO_TX_HASH_" + Date.now()); setMinting(false); return newNFT;
    }
    try {
      let imageUrl = "";
      if (imageFile) imageUrl = await uploadImageToIPFS(imageFile);
      const metadata = { name, description, image: imageUrl, attributes: attributes || [] };
      const metadataUri = await uploadMetadataToIPFS(metadata);
      const contract = getContract();
      const tx = await contract.mint(address, metadataUri);
      setTxHash(tx.hash);
      const receipt = await tx.wait();
      const transferEvent = receipt.logs.find(log => { try { return contract.interface.parseLog(log)?.name === "Transfer"; } catch { return false; } });
      const tokenId = transferEvent ? contract.interface.parseLog(transferEvent).args[2].toString() : "?";
      const newNFT = { tokenId, name, description, image: imageUrl, attributes, owner: address };
      setNfts(prev => [newNFT, ...prev]); setMinting(false); return newNFT;
    } catch (e) { setError(e.message || "Mint thất bại"); setMinting(false); throw e; }
  }, [address, getContract, nfts.length]);

  return { nfts, loading, minting, txHash, error, loadNFTs, mintNFT, setError };
}
