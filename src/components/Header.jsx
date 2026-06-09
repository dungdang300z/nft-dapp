import React from "react";
import { CHAIN_CONFIG } from "../utils/config";

export default function Header({ address, connecting, isCorrectChain, chainId, onConnect, onDisconnect, onSwitchChain }) {
  const short = addr => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";
  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo">
          <span className="logo-icon">⬡</span>
          <span className="logo-text">NFT<span className="logo-accent">Studio</span></span>
        </div>
        <nav className="nav-links">
          <span className="chain-badge">
            <span className="chain-dot" style={{ background: isCorrectChain ? "#22d3ee" : "#f97316" }} />
            {isCorrectChain ? CHAIN_CONFIG.chainName : chainId ? `Chain ${chainId}` : "Not connected"}
          </span>
        </nav>
        <div className="wallet-area">
          {!address ? (
            <button className="btn btn-connect" onClick={onConnect} disabled={connecting}>
              {connecting ? <><span className="spinner" /> Đang kết nối...</> : <><span>🦊</span> Kết nối Ví</>}
            </button>
          ) : (
            <div className="wallet-connected">
              {!isCorrectChain && <button className="btn btn-warn" onClick={onSwitchChain}>⚠ Đổi mạng</button>}
              <button className="btn btn-address" onClick={onDisconnect} title="Click để ngắt kết nối">
                <span className="wallet-dot" />{short(address)}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
