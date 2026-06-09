import React, { useEffect, useState } from "react";
import NFTCard from "./NFTCard";

export default function NFTGallery({ nfts, loading, address, onRefresh }) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  useEffect(() => { if (address) onRefresh(); }, [address]);
  const filtered = nfts
    .filter(n => !search || n.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sort === "newest" ? Number(b.tokenId) - Number(a.tokenId) : sort === "oldest" ? Number(a.tokenId) - Number(b.tokenId) : a.name.localeCompare(b.name));
  return (
    <div className="gallery">
      <div className="gallery-header">
        <div className="gallery-title-row">
          <h2 className="gallery-title">Bộ Sưu Tập Của Tôi{nfts.length > 0 && <span className="count-badge">{nfts.length}</span>}</h2>
          <button className="btn btn-ghost btn-sm" onClick={onRefresh} disabled={loading}>↻ Làm mới</button>
        </div>
        {nfts.length > 0 && (
          <div className="gallery-controls">
            <input className="search-input" placeholder="🔍  Tìm kiếm NFT..." value={search} onChange={e => setSearch(e.target.value)} />
            <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="name">Tên A–Z</option>
            </select>
          </div>
        )}
      </div>
      {!address ? <div className="empty-state"><span className="empty-icon">🦊</span><p>Kết nối ví để xem NFT của bạn</p></div>
        : loading ? <div className="loading-grid">{[1,2,3].map(i => <div key={i} className="skeleton-card" />)}</div>
        : filtered.length === 0 ? <div className="empty-state"><span className="empty-icon">{search ? "🔍" : "🖼"}</span><p>{search ? "Không tìm thấy NFT phù hợp" : "Chưa có NFT nào. Hãy mint NFT đầu tiên!"}</p></div>
        : <div className="nft-grid">{filtered.map(nft => <NFTCard key={nft.tokenId} nft={nft} />)}</div>}
    </div>
  );
}
