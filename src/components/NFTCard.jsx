import React, { useState } from "react";
import { CHAIN_CONFIG, NFT_CONTRACT_ADDRESS } from "../utils/config";

const DEMO_MODE = NFT_CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000";

export default function NFTCard({ nft }) {
  const [imgErr, setImgErr] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const openseaUrl = DEMO_MODE ? "#" : `https://testnets.opensea.io/assets/sepolia/${NFT_CONTRACT_ADDRESS}/${nft.tokenId}`;
  const etherscanUrl = DEMO_MODE ? "#" : `${CHAIN_CONFIG.blockExplorerUrls[0]}/token/${NFT_CONTRACT_ADDRESS}?a=${nft.tokenId}`;
  return (
    <div className={`nft-card ${expanded ? "expanded" : ""}`}>
      <div className="nft-image-wrap">
        {!imgErr ? <img src={nft.image} alt={nft.name} className="nft-image" onError={() => setImgErr(true)} /> : <div className="nft-image-fallback"><span>🖼</span></div>}
        <div className="nft-id-badge">#{nft.tokenId}</div>
      </div>
      <div className="nft-body">
        <h3 className="nft-name">{nft.name}</h3>
        {nft.description && <p className="nft-desc">{nft.description}</p>}
        {nft.attributes && nft.attributes.length > 0 && (
          <div className="nft-attrs">
            {nft.attributes.slice(0, expanded ? undefined : 2).map((a, i) => (
              <span key={i} className="attr-tag"><span className="attr-key">{a.trait_type}</span><span className="attr-val">{a.value}</span></span>
            ))}
            {!expanded && nft.attributes.length > 2 && <button className="attr-more" onClick={() => setExpanded(true)}>+{nft.attributes.length - 2} more</button>}
          </div>
        )}
        <div className="nft-actions">
          <a href={openseaUrl} target="_blank" rel="noreferrer" className="nft-link">🌊 OpenSea</a>
          <a href={etherscanUrl} target="_blank" rel="noreferrer" className="nft-link">🔍 Etherscan</a>
        </div>
      </div>
    </div>
  );
}
