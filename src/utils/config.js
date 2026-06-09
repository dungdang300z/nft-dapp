export const NFT_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function mint(address to, string memory tokenURI) public returns (uint256)",
  "function safeMint(address to, string memory uri) public",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
];

export const NFT_CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";

export const CHAIN_CONFIG = {
  chainId: "0xaa36a7",
  chainName: "Sepolia Testnet",
  nativeCurrency: { name: "SepoliaETH", symbol: "ETH", decimals: 18 },
  rpcUrls: ["https://rpc.sepolia.org"],
  blockExplorerUrls: ["https://sepolia.etherscan.io"]
};

export const PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY || "";
export const PINATA_SECRET_KEY = process.env.REACT_APP_PINATA_SECRET_KEY || "";
