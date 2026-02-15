import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // ✅ THÊM DÒNG NÀY
import "./Home_v2.css";
import ChatWidget from "../components/ChatWidget";

const API =
  "https://script.google.com/macros/s/AKfycbwSpMhJ9ctYsZhCFNmydGeU_1tBF99GS5-VaSt8fFeBNOkfSXyY67Jp8boyG1f10oSfVg/exec";

export default function Home_v2({ cart = [], setCart = () => {} }) {

  const navigate = useNavigate(); // ✅ THÊM DÒNG NÀY

  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentBanner, setCurrentBanner] = useState(0);

  const [scrolled, setScrolled] = useState(false);

  const parsePrice = (value) => {
    if (!value) return 0;
    return Number(value.toString().replace(/[^\d]/g, ""));
  };

  const formatPrice = (value) => {
    return value.toLocaleString("vi-VN") + "đ";
  };

  useEffect(() => {
    const controller = new AbortController();

    fetch(API, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        const mappedProducts = (data.products || []).map((p) => {
          const price = parsePrice(p.price);
          const oldPrice = parsePrice(p.old_price);

          const normalizedTag = (p.tag_type || p.tag || "")
            .toString()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();

          const isHot =
            normalizedTag.includes("ban") ||
            normalizedTag.includes("hot");

          const isSale = oldPrice > price && oldPrice > 0;

          return {
            id: p.id,
            name: p.name,
            origin: p.origin,
            price,
            oldPrice,
            image: p.image,
            unit: p.unit || "",   // ✅ THÊM ĐƠN VỊ UNIT
            hot: isHot,
            sale: isSale,
            discountPercent: isSale
              ? Math.round(((oldPrice - price) / oldPrice) * 100)
              : 0,
            originType: (p.origin_type || "")
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .trim(),
          };
        });

        const mappedBanners = (data.banners || [])
          .filter((b) => b?.active === true || b?.active === "TRUE")
          .sort((a, b) => Number(a.order) - Number(b.order));

        const cfg = {};
        (data.config || []).forEach((c) => {
          cfg[c.key] = c.value;
        });

        setProducts(mappedProducts);
        setBanners(mappedBanners);
        setConfig(cfg);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    return () => controller.abort();
  }, []);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!config.favicon) return;

    let link =
      document.querySelector("link[rel='icon']") ||
      document.createElement("link");

    link.rel = "icon";
    link.href = config.favicon;
    document.head.appendChild(link);
  }, [config]);

  useEffect(() => {
    if (!banners[0]?.image) return;

    const existing = document.querySelector(
      `link[rel="preload"][href="${banners[0].image}"]`
    );
    if (existing) return;

    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = banners[0].image;
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, [banners]);

  useEffect(() => {
    if (banners.length < 2) return;

    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [banners]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) =>
        p.name?.toLowerCase().includes(keyword.toLowerCase())
      )
      .filter((p) => {
        if (typeFilter === "local")
          return p.originType.includes("noi");

        if (typeFilter === "import")
          return p.originType.includes("nhap");

        if (typeFilter === "sale")
          return p.sale;

        return true;
      });
  }, [products, keyword, typeFilter]);

  const addToCart = useCallback((product) => {
    setCart((prev) => {
      const exist = prev.find((i) => i.id === product.id);
      return exist
        ? prev.map((i) =>
            i.id === product.id ? { ...i, qty: i.qty + 1 } : i
          )
        : [...prev, { ...product, qty: 1 }];
    });
  }, [setCart]);
  
  const cartCount = cart.reduce((a, b) => a + b.qty, 0);

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  // ✅ ĐÃ SỬA LOGIC THANH TOÁN
  const goToCheckout = () => {
    navigate("/checkout");
  };

/* ================= UI ================= */
return (
  <div className="page">
    {/* ===== HEADER ===== */}
    <header className={`header ${scrolled ? "header-scrolled" : ""}`}>
      <div className="header-left">
        <img
          src="/logo668.jpg"
          alt="668Mart Logo"
          className="logo"
          width="52"
          height="52"
        />
        <div className="brand-group">
          <h1 className="brand">
            {config.siteName || "668Mart"}
          </h1>
          <p className="sub">
            {config.siteDescription || "Trái cây đặc sản mỗi ngày"}
          </p>
        </div>
      </div>

      <div className="search-wrapper">
        <input
          type="text"
          className="search"
          placeholder="Tìm trái cây tươi ngon..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      <div className="cart-btn premium-cart">
        🛒
        {cartCount > 0 && (
          <span className="cart-badge">{cartCount}</span>
        )}
      </div>
    </header>

    {/* ===== HERO ===== */}
    {banners.length > 0 && (
      <section className="hero-banner">
        <div className="banner-slide">
          <img
            src={banners[currentBanner]?.image}
            alt="Banner"
            className="banner-img"
          />
          <div className="banner-overlay-gradient" />
          <div className="banner-content">
            <h2>{banners[currentBanner]?.title}</h2>
            <p>{banners[currentBanner]?.subtitle}</p>
            <button className="banner-cta">
              Xem ưu đãi hôm nay
            </button>
          </div>
        </div>
      </section>
    )}

    {loading && (
      <div className="loading-box">
        Đang tải sản phẩm...
      </div>
    )}

    <div className="shop-layout">
      {/* ===== SIDEBAR ===== */}
      <aside className="shop-filter premium-filter">
        <h3>Danh mục</h3>

        {["local", "import", "sale", "all"].map((type) => (
          <p
            key={type}
            className={typeFilter === type ? "active-filter" : ""}
            onClick={() => setTypeFilter(type)}
          >
            {type === "local" && "Trái cây nội địa"}
            {type === "import" && "Trái cây nhập khẩu"}
            {type === "sale" && "Hàng giảm giá"}
            {type === "all" && "Tất cả"}
          </p>
        ))}
      </aside>

      {/* ===== PRODUCTS ===== */}
      <div className="product-grid">
        {filteredProducts.map((p) => (
          <div className="product-card premium-card" key={p.id}>
            <div className="card-img">
              <img src={p.image} alt={p.name} />

              {p.hot && (
                <div className="badge-hot premium-hot">
                  HOT
                </div>
              )}

              {p.sale && (
                <div className="badge-sale premium-sale">
                  -{p.discountPercent}%
                </div>
              )}
            </div>

            <div className="card-body">
              <h3 className="title">{p.name}</h3>
              <div className="origin">{p.origin}</div>
              <div className="rating">⭐⭐⭐⭐⭐</div>

              <div className="price">
                {p.sale && (
                  <span className="old-price">
                    {formatPrice(p.oldPrice)}
                  </span>
                )}
                <span className="new-price">
                {formatPrice(p.price)}
                {p.unit && (
                <span className="price-unit">
                / {p.unit}
                </span>
  )}
</span>

              </div>

              <button
                className="add-btn premium-add-btn"
                onClick={() => addToCart(p)}
              >
                Thêm vào giỏ
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>

    <ChatWidget hasCart={cartCount > 0} />


    {/* ===== STICKY CHECKOUT ===== */}
    {cartCount > 0 && (
      <div className="checkout-bar premium-checkout">
        <div className="checkout-info">
          <span>🛒</span>
          <div>
            <div>{cartCount} sản phẩm</div>
            <div>{formatPrice(totalPrice)}</div>
          </div>
        </div>

        <button
          className="checkout-btn premium-checkout-btn"
          onClick={goToCheckout}
        >
          Thanh toán
        </button>
      </div>
    )}
  </div>
);


}
