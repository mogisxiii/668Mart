import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

import logo from "../assets/logo.png";
import banner1 from "../assets/products/banner_1.jpg";
import banner2 from "../assets/products/banner_2.jpg";
import banner3 from "../assets/products/banner_3.jpg";
import banner4 from "../assets/products/banner_4.jpg";
import noImg from "../assets/no-image.jpg";

function Home({ cart = [], setCart = () => {} }) {

  /* ================= FLASH SALE ================= */
  const flashProducts = [2, 7, 11];

  const getFlashEnd = () => {
    const saved = localStorage.getItem("flashEnd");
    if (saved) return Number(saved);
    const end = Date.now() + 1000 * 60 * 60 * 6;
    localStorage.setItem("flashEnd", end);
    return end;
  };

  const [flashEnd] = useState(getFlashEnd);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = flashEnd - Date.now();
      if (diff <= 0) {
        setTimeLeft("Hết giờ");
        clearInterval(timer);
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(timer);
  }, [flashEnd]);

  /* ================= BANNER SLIDER ================= */
  const banners = [banner1, banner2, banner3, banner4];
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % banners.length), 4000);
    return () => clearInterval(t);
  }, []);

  /* ================= GOOGLE SHEET FETCH ================= */
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const safeNumber = (val) =>
    Number(String(val).replace(/[^\d]/g, "")) || 0;

  useEffect(() => {
    const controller = new AbortController();

    fetch("https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLiA3Ev-Tht2_DhYSLa9DA2oxhsigOerZhMRiTt0lxs8PltqLb1ESX0EvIEp2r1XtZuN_kjjKU3sfMchrpacmDcrbGbSG_JLbRhEwA5M7BBzWsJ6VdjUlvMFmBk16TVG1w2kyPtI3Xw28nboorJnrVT1WOwY6vayyUou5dnBUAsafU7hubTXTD2MbGK4IYyZQHZauEFV-xC4TWBCsc5Y2IKQNeWjriaw0oECU_5VQ09ZrxdgmPGY4D_GOIyfI1Q1VLWx-ew5KD-FN6OHeDjcTzQiUabsHMDv7Zg6Z8yU&lib=MWyGrXkDut21h2jjgsS02Fge7nZKhXfVE",
      { signal: controller.signal }
    )
      .then(res => res.json())
      .then(data => {
        const productArray = Array.isArray(data) ? data : data.products || [];

        const mapped = productArray.map(item => ({
          id: Number(item.id),
          name: item.name,
          price: safeNumber(item.price),
          img: item.image || item.img,
          origin: item.origin,
          best: item.best === true || item.best === "TRUE"
        }));

        setAllProducts(mapped);
        setLoading(false);
      })
      .catch(err => {
        if (err.name !== "AbortError") console.error("Lỗi load sản phẩm:", err);
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  /* ================= FILTER ================= */
  const [keyword, setKeyword] = useState("");
  const [priceFilter, setPriceFilter] = useState([]);
  const clearPriceFilter = () => setPriceFilter([]);
  const [filter, setFilter] = useState({ flash: false, best: false });

  const togglePrice = (range) => {
    setPriceFilter(prev =>
      prev.includes(range) ? prev.filter(r => r !== range) : [...prev, range]
    );
  };

  const toggleFilter = (key) => {
    setFilter(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const products = allProducts.filter(p =>
    p.name?.toLowerCase().includes(keyword.toLowerCase())
  );

  const filteredProducts = products.filter(p => {
    const isFlash = flashProducts.includes(p.id);

    if (priceFilter.length) {
      const match = priceFilter.some(range =>
        (range === "low" && p.price < 50000) ||
        (range === "mid" && p.price >= 50000 && p.price <= 100000) ||
        (range === "high" && p.price > 100000)
      );
      if (!match) return false;
    }

    if (filter.flash && !isFlash) return false;
    if (filter.best && !p.best) return false;
    return true;
  });

  /* ================= CART ================= */
  const addToCart = (product) => {
    setCart(prev => {
      const exist = prev.find(i => i.id === product.id);
      return exist
        ? prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { ...product, qty: 1 }];
    });
  };

  /* ================= UI ================= */
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

      <input
        className="search"
        placeholder="Tìm trái cây..."
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
      />

      <Link to="/cart">
        <button className="cart-btn">🛒 {cart.reduce((a, b) => a + b.qty, 0)}</button>
      </Link>
    </header>

    {loading && <div style={{ textAlign: "center" }}>Đang tải sản phẩm...</div>}

    {/* ================= SHOP LAYOUT ================= */}
    <div className="shop-layout">

{/* ==== FILTER SIDEBAR (LEFT) ==== */}
<div className="shop-filter">
  <h3>Lọc giá</h3>

  {/* NÚT TẤT CẢ */}
  <button
    className={!priceFilter.length ? "active-filter" : ""}
    onClick={() => setPriceFilter([])}
  >
    Tất cả
  </button>

  <button
    className={priceFilter.includes("low") ? "active-filter" : ""}
    onClick={() => togglePrice("low")}
  >
    Dưới 50k
  </button>

  <button
    className={priceFilter.includes("mid") ? "active-filter" : ""}
    onClick={() => togglePrice("mid")}
  >
    50k–100k
  </button>

  <button
    className={priceFilter.includes("high") ? "active-filter" : ""}
    onClick={() => togglePrice("high")}
  >
    Trên 100k
  </button>

  <h3>Đặc biệt</h3>

  <button
    className={filter.flash ? "active-filter" : ""}
    onClick={() => toggleFilter("flash")}
  >
    Flash Sale
  </button>

  <button
    className={filter.best ? "active-filter" : ""}
    onClick={() => toggleFilter("best")}
  >
    Bán chạy
  </button>
</div>

      {/* ==== CONTENT RIGHT ==== */}
      <div className="shop-products">

        {/* BANNER */}
        <div className="banner-main">
          {banners.map((b, i) => (
            <img
              key={i}
              src={b}
              className={`banner-img ${i === slide ? "active" : ""}`}
              alt=""
            />
          ))}
        </div>

        {/* FLASH BAR */}
        <div className="flash-bar">
          ⚡ FLASH SALE — Kết thúc sau: {timeLeft}
        </div>

        {/* PRODUCTS */}
        <div className="product-grid">
          {filteredProducts.map(p => {
            const isFlash = flashProducts.includes(p.id);
            const finalPrice = isFlash ? Math.round(p.price * 0.8) : p.price;

            return (
              <div key={p.id} className="card">
                <div className="card-img">
                  {p.best && <span className="badge-left">Bán chạy</span>}
                  {isFlash && <span className="badge-right">FLASH</span>}
                  <img src={p.img} alt={p.name} onError={(e)=> e.target.src=noImg} />
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
  </div>
);
}   // 👈 ĐÓNG FUNCTION HOME

export default Home;