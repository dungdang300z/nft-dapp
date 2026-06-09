import React, { useState } from "react";
import { useWallet } from "./hooks/useWallet";
import { useNFT } from "./hooks/useNFT";
import Header from "./components/Header";
import MintForm from "./components/MintForm";
import NFTGallery from "./components/NFTGallery";
import "./App.css";

const DEMO_MODE = !process.env.REACT_APP_CONTRACT_ADDRESS || process.env.REACT_APP_CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000";

export default function App() {
  const { address, signer, chainId, isCorrectChain, connecting, error: walletError, connect, disconnect, switchChain } = useWallet();
  const { nfts, loading, minting, txHash, error: nftError, loadNFTs, mintNFT, setError } = useNFT(signer, address);
  const [tab, setTab] = useState("gallery");
  return (
    <div className="app">
      <Header address={address} connecting={connecting} isCorrectChain={isCorrectChain} chainId={chainId} onConnect={connect} onDisconnect={disconnect} onSwitchChain={switchChain} />
      {DEMO_MODE && (
        <div className="demo-banner">
          ⚡ <strong>Chế độ Demo</strong> — Chưa có contract thực. Mint/Gallery hoạt động giả lập.
        </div>
      )}
      {walletError && <div className="global-error">⚠ {walletError}</div>}
      <main className="main">
        <div className="tabs">
          <button className={`tab ${tab === "gallery" ? "active" : ""}`} onClick={() => setTab("gallery")}>🖼 Bộ sưu tập</button>
          <button className={`tab ${tab === "mint" ? "active" : ""}`} onClick={() => setTab("mint")}>⬡ Mint NFT</button>
        </div>
        <div className="content">
          {tab === "gallery"
            ? <NFTGallery nfts={nfts} loading={loading} address={address || (DEMO_MODE ? "demo" : null)} onRefresh={loadNFTs} />
            : <MintForm onMint={mintNFT} minting={minting} txHash={txHash} error={nftError} onClearError={() => setError(null)} />}
        </div>
      </main>
      <footer className="footer">
        <span>NFT Studio © 2025</span><span>·</span><span>Sepolia Testnet</span><span>·</span>
        <a href="https://sepoliafaucet.com" target="_blank" rel="noreferrer">Lấy ETH test →</a>
      </footer>
    </div>
  );
}
