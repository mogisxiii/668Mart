import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

import logo from "../assets/logo.png";
import banner1 from "../assets/products/banner_1.jpg";
import banner2 from "../assets/products/banner_2.jpg";
import banner3 from "../assets/products/banner_3.jpg";
import banner4 from "../assets/products/banner_4.jpg";

import xoai from "../assets/products/xoai.jpg";
import sauRieng from "../assets/products/sau_rieng.jpg";
import cam from "../assets/products/cam.jpg";
import buoi from "../assets/products/buoi.jpg";
import duaHau from "../assets/products/dua_hau.jpg";
import thanhLong from "../assets/products/thanh_long.jpg";
import mangCut from "../assets/products/mang_cut.jpg";
import chomChom from "../assets/products/chom_chom.jpg";
import dauTay from "../assets/products/dau_tay.jpg";
import tao from "../assets/products/tao.jpg";
import nho from "../assets/products/nho.jpg";
import kiwi from "../assets/products/kiwi.jpg";
import le from "../assets/products/le.jpg";
import chuoi from "../assets/products/chuoi.jpg";

function Home({ cart = [], setCart = () => {} }) {

  const flashProducts = [2, 7, 11];
  const [flashEnd] = useState(Date.now() + 1000 * 60 * 60 * 6);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = flashEnd - Date.now();
      if (diff <= 0) return setTimeLeft("Hết giờ");
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(timer);
  }, [flashEnd]);

  const banners = [banner1, banner2, banner3, banner4];
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % banners.length), 4000);
    return () => clearInterval(t);
  }, []);

  const allProducts = useMemo(() => [
    { id: 1, name: "Xoài Cát Hòa Lộc", price: 85000, img: xoai, origin: "Việt Nam", best: true },
    { id: 2, name: "Sầu Riêng Ri6", price: 120000, img: sauRieng, origin: "Việt Nam", best: true },
    { id: 3, name: "Cam Sành", price: 45000, img: cam, origin: "Việt Nam" },
    { id: 4, name: "Bưởi Da Xanh", price: 65000, img: buoi, origin: "Việt Nam" },
    { id: 5, name: "Dưa Hấu", price: 30000, img: duaHau, origin: "Việt Nam" },
    { id: 6, name: "Thanh Long", price: 40000, img: thanhLong, origin: "Việt Nam" },
    { id: 7, name: "Măng Cụt", price: 95000, img: mangCut, origin: "Việt Nam" },
    { id: 8, name: "Chôm Chôm", price: 55000, img: chomChom, origin: "Việt Nam" },
    { id: 9, name: "Dâu Tây", price: 110000, img: dauTay, origin: "Đà Lạt" },
    { id: 10, name: "Táo Mỹ", price: 75000, img: tao, origin: "Mỹ" },
    { id: 11, name: "Nho Úc", price: 130000, img: nho, origin: "Úc" },
    { id: 12, name: "Kiwi", price: 140000, img: kiwi, origin: "NZ" },
    { id: 13, name: "Lê Hàn", price: 105000, img: le, origin: "Hàn Quốc" },
    { id: 14, name: "Chuối", price: 28000, img: chuoi, origin: "Nam Mỹ" },
  ], []);

  const [keyword, setKeyword] = useState("");
  const [priceFilter, setPriceFilter] = useState([]);
  const [filter, setFilter] = useState({ local: false, import: false, flash: false, best: false });

  const togglePrice = (range) => {
    setPriceFilter(prev => prev.includes(range) ? prev.filter(r => r !== range) : [...prev, range]);
  };

  const products = allProducts.filter(p => p.name.toLowerCase().includes(keyword.toLowerCase()));

  const filteredProducts = products.filter(p => {
    const isFlash = flashProducts.includes(p.id);
    if (priceFilter.length) {
      const match = priceFilter.some(range =>
        range === "low" ? p.price < 50000 :
        range === "mid" ? p.price <= 100000 :
        p.price > 100000
      );
      if (!match) return false;
    }
    if (filter.local && p.origin !== "Việt Nam") return false;
    if (filter.import && p.origin === "Việt Nam") return false;
    if (filter.flash && !isFlash) return false;
    if (filter.best && !p.best) return false;
    return true;
  });

  const addToCart = (product) => {
    const exist = cart.find(i => i.id === product.id);
    exist
      ? setCart(cart.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i))
      : setCart([...cart, { ...product, qty: 1 }]);
  };

  return (
    <div className="page">
      <header className="header">
        <div className="header-left">
          <img src={logo} className="logo" alt="logo" />
          <div>
            <div className="brand">668 MART</div>
            <div className="sub">Đặc sản trái cây theo mùa</div>
          </div>
        </div>

        <input className="search" placeholder="Tìm trái cây..." value={keyword} onChange={e => setKeyword(e.target.value)} />
        <Link to="/cart">
          <button className="cart-btn">🛒 {cart.reduce((a, b) => a + b.qty, 0)}</button>
        </Link>
      </header>

      <div className="layout">

        {/* ================= FILTER PRO ================= */}
        <aside className="sidebar">
          <h3>Bộ lọc</h3>

          <div className="filter-group">
            <div className="filter-title">Khoảng giá</div>

            <label className={`filter-item ${priceFilter.includes("low") ? "active" : ""}`}>
              <input type="checkbox" checked={priceFilter.includes("low")} onChange={() => togglePrice("low")} />
              <span>Dưới 50k</span>
            </label>

            <label className={`filter-item ${priceFilter.includes("mid") ? "active" : ""}`}>
              <input type="checkbox" checked={priceFilter.includes("mid")} onChange={() => togglePrice("mid")} />
              <span>50k – 100k</span>
            </label>

            <label className={`filter-item ${priceFilter.includes("high") ? "active" : ""}`}>
              <input type="checkbox" checked={priceFilter.includes("high")} onChange={() => togglePrice("high")} />
              <span>Trên 100k</span>
            </label>
          </div>

          <div className="filter-group">
            <div className="filter-title">Loại</div>

            <label className={`filter-item ${filter.local ? "active" : ""}`}>
              <input type="checkbox" checked={filter.local} onChange={() => setFilter(f => ({ ...f, local: !f.local }))} />
              <span>Nội địa</span>
            </label>

            <label className={`filter-item ${filter.import ? "active" : ""}`}>
              <input type="checkbox" checked={filter.import} onChange={() => setFilter(f => ({ ...f, import: !f.import }))} />
              <span>Nhập khẩu</span>
            </label>
          </div>

          <div className="filter-group">
            <div className="filter-title">Ưu đãi</div>

            <label className={`filter-item ${filter.flash ? "active" : ""}`}>
              <input type="checkbox" checked={filter.flash} onChange={() => setFilter(f => ({ ...f, flash: !f.flash }))} />
              <span>Flash Sale</span>
            </label>

            <label className={`filter-item ${filter.best ? "active" : ""}`}>
              <input type="checkbox" checked={filter.best} onChange={() => setFilter(f => ({ ...f, best: !f.best }))} />
              <span>Bán chạy</span>
            </label>
          </div>
        </aside>

        {/* ================= CONTENT ================= */}
        <div className="content">
          <div className="banner-main">
            {banners.map((b, i) => (
              <img key={i} src={b} alt="banner" className={`banner-img ${i === slide ? "active" : ""}`} />
            ))}
          </div>

          <div className="flash-bar">⚡ FLASH SALE — Kết thúc sau: {timeLeft}</div>

          <div className="product-grid">
            {filteredProducts.map(p => {
              const isFlash = flashProducts.includes(p.id);
              const finalPrice = isFlash ? Math.round(p.price * 0.8) : p.price;
              return (
                <div key={p.id} className="card">
                  <div className="card-img">
                    {p.best && <span className="badge-left">Bán chạy</span>}
                    {isFlash && <span className="badge-right">FLASH</span>}
                    <img src={p.img} alt={p.name} />
                  </div>
                  <div className="card-body">
                    <div className="title">{p.name}</div>
                    <div className="origin">Xuất xứ: {p.origin}</div>
                    <div className="price">
                      {isFlash && <span className="old">{p.price.toLocaleString()}đ</span>}
                      <span className="new">{finalPrice.toLocaleString()}đ/kg</span>
                    </div>
                    <div className="combo">Mua 2 giảm 10%</div>
                    <button className="add-btn" onClick={() => addToCart(p)}>+ Thêm vào giỏ</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <footer className="footer">© 2026 668 Mart – Trái cây đặc sản theo mùa</footer>
    </div>
  );
}

export default Home;
