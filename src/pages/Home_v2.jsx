import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import "./Home_v2.css";
import logo from "../assets/logo.png";
import noImg from "../assets/no-image.jpg";

const API =
  "https://script.google.com/macros/s/AKfycbwSpMhJ9ctYsZhCFNmydGeU_1tBF99GS5-VaSt8fFeBNOkfSXyY67Jp8boyG1f10oSfVg/exec";

export default function Home({ cart = [], setCart = () => {} }) {
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [config, setConfig] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");

  const [priceFilter, setPriceFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(data => {
        const mappedProducts = (data.products || []).map(p => ({
          id: p.id,
          name: p.name,
          price: Number(p.price) || 0,
          oldPrice: Number(p.old_price) || 0,
          rating: Number(p.rating) || 0,
          sold: Number(p.sold) || 0,
          img: p.image,
          origin: p.origin,
          originType: p.origin_type,
          unit: p.unit || "kg",
          discount: Number(p.discount) || 0,
          tag: p.tag_type
        }));

        const mappedBanners = (data.banners || [])
          .filter(b => b.active === true)
          .sort((a, b) => Number(a.order) - Number(b.order));

        setProducts(mappedProducts);
        setBanners(mappedBanners);
        setConfig(data.config || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getConfig = key => config.find(c => c.key === key)?.value === true;

  const filtered = useMemo(() => {
    return products
      .filter(p => p.name?.toLowerCase().includes(keyword.toLowerCase()))
      .filter(p => {
        if (priceFilter === "low") return p.price < 50000;
        if (priceFilter === "mid") return p.price >= 50000 && p.price < 100000;
        if (priceFilter === "high") return p.price >= 100000;
        return true;
      })
      .filter(p => {
        if (typeFilter === "local") return p.originType === "nội địa";
        if (typeFilter === "import") return p.originType === "nhập khẩu";
        if (typeFilter === "best") return p.tag === "Bán chạy";
        if (typeFilter === "sale") return p.discount > 0;
        return true;
      });
  }, [products, keyword, priceFilter, typeFilter]);

  const addToCart = product => {
    setCart(prev => {
      const exist = prev.find(i => i.id === product.id);
      return exist
        ? prev.map(i =>
            i.id === product.id ? { ...i, qty: i.qty + 1 } : i
          )
        : [...prev, { ...product, qty: 1 }];
    });
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

        <input
          className="search"
          placeholder="Tìm trái cây..."
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
        />

        <Link to="/cart">
          <button className="cart-btn">
            🛒 {cart.reduce((a, b) => a + b.qty, 0)}
          </button>
        </Link>
      </header>

      {/* HERO */}
      {banners.length > 0 && (
        <section className="hero-banner">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            autoplay={{ delay: 3500 }}
            pagination={{ clickable: true }}
            navigation
            loop
          >
            {banners.map(banner => (
              <SwiperSlide key={banner.id}>
                <div
                  className="banner-slide"
                  style={{ backgroundImage: `url(${banner.image})` }}
                >
                  <div
                    className="banner-overlay"
                    style={{
                      background: banner.overlay_color,
                      opacity: banner.overlay_opacity
                    }}
                  />
                  <div
                    className="banner-content"
                    style={{ color: banner.text_color }}
                  >
                    <h2>{banner.title}</h2>
                    <p>{banner.subtitle}</p>
                    <a href={banner.button_link} className="banner-btn">
                      {banner.button_text}
                    </a>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      )}

      {loading && <div className="loading">Đang tải sản phẩm...</div>}

      <div className="shop-layout">
        {/* SIDEBAR */}
        <aside className="shop-filter">

          <div className="filter-group">
            <div className="filter-title">Lọc theo giá</div>
            <button className={priceFilter === "all" ? "active-filter" : ""} onClick={() => { setPriceFilter("all"); setTypeFilter("all"); }}>Tất cả</button>
            <button className={priceFilter === "low" ? "active-filter" : ""} onClick={() => setPriceFilter("low")}>Dưới 50k</button>
            <button className={priceFilter === "mid" ? "active-filter" : ""} onClick={() => setPriceFilter("mid")}>50k–100k</button>
            <button className={priceFilter === "high" ? "active-filter" : ""} onClick={() => setPriceFilter("high")}>Trên 100k</button>
          </div>

          <div className="filter-group">
            <div className="filter-title">Phân loại</div>
            {getConfig("showLocalFilter") && (
              <button className={typeFilter === "local" ? "active-filter" : ""} onClick={() => setTypeFilter("local")}>Nội địa</button>
            )}
            {getConfig("showImportFilter") && (
              <button className={typeFilter === "import" ? "active-filter" : ""} onClick={() => setTypeFilter("import")}>Nhập khẩu</button>
            )}
            {getConfig("showBestFilter") && (
              <button className={typeFilter === "best" ? "active-filter" : ""} onClick={() => setTypeFilter("best")}>Bán chạy</button>
            )}
            {getConfig("showFlashFilter") && (
              <button className={typeFilter === "sale" ? "active-filter" : ""} onClick={() => setTypeFilter("sale")}>Flash Sale</button>
            )}
          </div>

        </aside>

        {/* PRODUCTS */}
        <main className="shop-products">
          <div className="product-grid">
            {filtered.map(p => (
              <div key={p.id} className="card">
                <div className="card-img">
                  {p.tag && <span className="badge-left">{p.tag}</span>}
                  {p.discount > 0 && <span className="badge-right">-{p.discount}%</span>}
                  <img src={p.img} alt={p.name} onError={e => (e.target.src = noImg)} />
                </div>

                <div className="card-body">
                  <div className="title">{p.name}</div>
                  <div className="origin">{p.origin} • {p.originType}</div>
                  <div className="rating">⭐ {p.rating} | Đã bán {p.sold}</div>

                  <div className="price-box">
                    {p.oldPrice > 0 && <span className="old">{p.oldPrice.toLocaleString()}đ</span>}
                    <span className="new">{p.price.toLocaleString()}đ/{p.unit}</span>
                  </div>

                  <button className="add-btn" onClick={() => addToCart(p)}>+ Thêm vào giỏ</button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
