# ⬡ NFT Studio — DApp Mint & Quản lý NFT

DApp mint NFT đơn giản, chạy trên Sepolia testnet, deploy lên Vercel.

## 🚀 Tính năng

- **Kết nối ví** MetaMask
- **Mint NFT** với tên, mô tả, ảnh, thuộc tính
- **Gallery** xem toàn bộ NFT của ví
- **Tìm kiếm & sắp xếp** NFT
- Upload ảnh lên **IPFS qua Pinata**
- Chế độ **Demo** (không cần contract thực)
- Link trực tiếp **OpenSea & Etherscan**

---

## 📦 Cài đặt cục bộ

```bash
git clone https://github.com/YOUR_USERNAME/nft-dapp
cd nft-dapp
npm install
cp .env.example .env.local
npm start
```

---

## 🔧 Bước 1: Deploy Smart Contract

1. Mở **[Remix IDE](https://remix.ethereum.org)**
2. Tạo file `SimpleNFT.sol`, paste nội dung từ `contracts/SimpleNFT.sol`
3. Compile với **Solidity 0.8.20**
4. Chuyển MetaMask sang **Sepolia Testnet**
5. Lấy ETH test tại **[sepoliafaucet.com](https://sepoliafaucet.com)**
6. Deploy → Copy địa chỉ contract

---

## 🔧 Bước 2: Cấu hình .env.local

```env
REACT_APP_CONTRACT_ADDRESS=0xYourContractAddress
REACT_APP_PINATA_API_KEY=your_pinata_key
REACT_APP_PINATA_SECRET_KEY=your_pinata_secret
```

> **Pinata** (tùy chọn): Đăng ký miễn phí tại [pinata.cloud](https://pinata.cloud).
> Nếu không điền, ảnh sẽ không được upload IPFS (dùng URL trực tiếp).

---

## 🚀 Deploy lên Vercel

### Qua GitHub (khuyến nghị):

1. Push code lên GitHub
2. Vào **[vercel.com](https://vercel.com)** → Import project
3. Chọn repository `nft-dapp`
4. Trong **Environment Variables** thêm:
   - `REACT_APP_CONTRACT_ADDRESS`
   - `REACT_APP_PINATA_API_KEY` (tùy chọn)
   - `REACT_APP_PINATA_SECRET_KEY` (tùy chọn)
5. Click **Deploy** ✅

### Qua Vercel CLI:
```bash
npm i -g vercel
vercel --prod
```

---

## 🗂 Cấu trúc project

```
nft-dapp/
├── contracts/
│   └── SimpleNFT.sol        # Smart contract ERC721
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.jsx       # Navigation + wallet connect
│   │   ├── MintForm.jsx     # Form tạo NFT mới
│   │   ├── NFTGallery.jsx   # Grid hiển thị NFT
│   │   └── NFTCard.jsx      # Card từng NFT
│   ├── hooks/
│   │   ├── useWallet.js     # MetaMask connection
│   │   └── useNFT.js        # Contract interaction
│   ├── utils/
│   │   ├── config.js        # ABI + địa chỉ contract
│   │   └── ipfs.js          # Pinata IPFS upload
│   ├── App.js
│   └── App.css
├── .env.example
├── vercel.json
└── package.json
```

---

## 🌐 Mạng hỗ trợ

Mặc định: **Sepolia Testnet** (chainId: 11155111)

Để đổi mạng, sửa `CHAIN_CONFIG` trong `src/utils/config.js`.

---

## 📄 License

MIT
