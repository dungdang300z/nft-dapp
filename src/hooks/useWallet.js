import { useState, useEffect, useCallback } from "react";
import { BrowserProvider } from "ethers";
import { CHAIN_CONFIG } from "../utils/config";

export function useWallet() {
  const [address, setAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);

  const isCorrectChain = chainId === parseInt(CHAIN_CONFIG.chainId, 16);

  const connect = useCallback(async () => {
    if (!window.ethereum) { setError("MetaMask không được tìm thấy!"); return; }
    setConnecting(true); setError(null);
    try {
      const prov = new BrowserProvider(window.ethereum);
      await prov.send("eth_requestAccounts", []);
      const sign = await prov.getSigner();
      const addr = await sign.getAddress();
      const net = await prov.getNetwork();
      setProvider(prov); setSigner(sign); setAddress(addr); setChainId(Number(net.chainId));
    } catch (e) { setError(e.message || "Kết nối thất bại"); }
    finally { setConnecting(false); }
  }, []);

  const switchChain = useCallback(async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: CHAIN_CONFIG.chainId }] });
    } catch (e) {
      if (e.code === 4902) await window.ethereum.request({ method: "wallet_addEthereumChain", params: [CHAIN_CONFIG] });
    }
  }, []);

  const disconnect = useCallback(() => { setAddress(null); setProvider(null); setSigner(null); setChainId(null); }, []);

  useEffect(() => {
    if (!window.ethereum) return;
    const handleAccountsChanged = (accounts) => { if (accounts.length === 0) disconnect(); else setAddress(accounts[0]); };
    const handleChainChanged = (cid) => { setChainId(parseInt(cid, 16)); };
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);
    window.ethereum.request({ method: "eth_accounts" }).then((accounts) => { if (accounts.length > 0) connect(); });
    return () => { window.ethereum.removeListener("accountsChanged", handleAccountsChanged); window.ethereum.removeListener("chainChanged", handleChainChanged); };
  }, [connect, disconnect]);

  return { address, provider, signer, chainId, isCorrectChain, connecting, error, connect, disconnect, switchChain };
}
