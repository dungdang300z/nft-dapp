import React, { useState, useRef } from "react";

export default function MintForm({ onMint, minting, txHash, error, onClearError }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [attributes, setAttributes] = useState([{ trait_type: "", value: "" }]);
  const [success, setSuccess] = useState(false);
  const fileRef = useRef();
  const handleImage = (e) => { const file = e.target.files[0]; if (!file) return; setImageFile(file); setImagePreview(URL.createObjectURL(file)); };
  const handleDrop = (e) => { e.preventDefault(); const file = e.dataTransfer.files[0]; if (file && file.type.startsWith("image/")) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); } };
  const addAttribute = () => setAttributes(prev => [...prev, { trait_type: "", value: "" }]);
  const removeAttribute = (i) => setAttributes(prev => prev.filter((_, idx) => idx !== i));
  const updateAttribute = (i, field, val) => setAttributes(prev => prev.map((a, idx) => idx === i ? { ...a, [field]: val } : a));
  const handleSubmit = async () => {
    if (!name.trim()) return;
    onClearError(); setSuccess(false);
    try {
      await onMint({ name: name.trim(), description: description.trim(), imageFile, attributes: attributes.filter(a => a.trait_type && a.value) });
      setSuccess(true); setName(""); setDescription(""); setImageFile(null); setImagePreview(null); setAttributes([{ trait_type: "", value: "" }]);
      setTimeout(() => setSuccess(false), 5000);
    } catch {}
  };
  return (
    <div className="mint-form">
      <div className="form-header"><h2 className="form-title">Tạo NFT Mới</h2><p className="form-subtitle">Upload ảnh, điền thông tin và mint lên blockchain</p></div>
      <div className="image-drop" onDrop={handleDrop} onDragOver={e => e.preventDefault()} onClick={() => fileRef.current.click()}>
        {imagePreview ? <img src={imagePreview} alt="preview" className="image-preview" /> : <div className="drop-placeholder"><span className="drop-icon">🖼</span><span className="drop-text">Kéo thả hoặc click để chọn ảnh</span><span className="drop-hint">PNG, JPG, GIF, SVG</span></div>}
        <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ display: "none" }} />
      </div>
      <div className="field"><label className="label">Tên NFT <span className="required">*</span></label><input className="input" placeholder="VD: Cosmic Dragon #001" value={name} onChange={e => setName(e.target.value)} maxLength={100} /></div>
      <div className="field"><label className="label">Mô tả</label><textarea className="textarea" placeholder="Mô tả về NFT của bạn..." value={description} onChange={e => setDescription(e.target.value)} rows={3} /></div>
      <div className="field">
        <label className="label">Thuộc tính</label>
        <div className="attributes-list">
          {attributes.map((attr, i) => (
            <div key={i} className="attribute-row">
              <input className="input attr-input" placeholder="Loại (VD: Màu)" value={attr.trait_type} onChange={e => updateAttribute(i, "trait_type", e.target.value)} />
              <input className="input attr-input" placeholder="Giá trị (VD: Đỏ)" value={attr.value} onChange={e => updateAttribute(i, "value", e.target.value)} />
              <button className="btn-icon" onClick={() => removeAttribute(i)}>✕</button>
            </div>
          ))}
          <button className="btn btn-ghost btn-sm" onClick={addAttribute}>+ Thêm thuộc tính</button>
        </div>
      </div>
      {error && <div className="alert alert-error"><span>⚠</span> {error}</div>}
      {success && txHash && <div className="alert alert-success"><span>✓</span> Mint thành công! {txHash.startsWith("0xDEMO") ? <span className="tx-demo">Chế độ Demo</span> : <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noreferrer" className="tx-link">Xem trên Etherscan ↗</a>}</div>}
      <button className="btn btn-mint" onClick={handleSubmit} disabled={minting || !name.trim()}>
        {minting ? <><span className="spinner" /> Đang mint...</> : <><span>⬡</span> Mint NFT</>}
      </button>
    </div>
  );
}
