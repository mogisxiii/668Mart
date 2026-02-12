import { useEffect, useState, useMemo } from "react";
import "./Home_v2.css";

const API =
  "https://script.google.com/macros/s/AKfycbwSpMhJ9ctYsZhCFNmydGeU_1tBF99GS5-VaSt8fFeBNOkfSXyY67Jp8boyG1f10oSfVg/exec";

export default function Home_v2({ cart = [], setCart = () => {} }) {
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentBanner, setCurrentBanner] = useState(0);

  /* ================= FETCH API ================= */
  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => {
        const mappedProducts = (data.products || []).map((p) => ({
          id: p.id,
          name: p.name,
          origin: p.origin,
          price: Number(p.price) || 0,
          oldPrice: Number(p.old_price) || 0,
          image: p.image,
          hot: p.tag_type === "Bán chạy",
          sale: Number(p.discount) > 0,
          originType: (p.origin_type || "").toLowerCase().trim(),
        }));

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
  }, []);

  /* ================= FAVICON ================= */
  useEffect(() => {
    if (!config.favicon) return;

    let link =
      document.querySelector("link[rel='icon']") ||
      document.createElement("link");

    link.rel = "icon";
    link.href = config.favicon;
    document.head.appendChild(link);
  }, [config]);

  /* ================= AUTO SLIDE ================= */
  useEffect(() => {
    if (banners.length < 2) return;

    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [banners]);

  /* ================= FILTER ================= */
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) =>
        p.name?.toLowerCase().includes(keyword.toLowerCase())
      )
      .filter((p) => {
        if (typeFilter === "local")
          return p.originType.includes("nội");

        if (typeFilter === "import")
          return p.originType.includes("nhập");

        if (typeFilter === "sale")
          return p.sale;

        return true;
      });
  }, [products, keyword, typeFilter]);

  /* ================= CART ================= */
  const addToCart = (product) => {
    setCart((prev) => {
      const exist = prev.find((i) => i.id === product.id);
      return exist
        ? prev.map((i) =>
            i.id === product.id ? { ...i, qty: i.qty + 1 } : i
          )
        : [...prev, { ...product, qty: 1 }];
    });
  };

  /* ================= UI ================= */
  return (
    <div className="page">
      {/* ================= HEADER ================= */}
      <header className="header">
        <div className="header-left">
        <img 
  src="/logo668.jpg" 
  alt="668Mart"
/>


          <div>
            <div className="brand">
              {config.siteName || "668Mart"}
            </div>
            <div className="sub">
              {config.siteDescription || "Trái cây đặc sản"}
            </div>
          </div>
        </div>

        <input
          className="search"
          placeholder="Tìm trái cây..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <div className="cart-btn">
          🛒 {cart.reduce((a, b) => a + b.qty, 0)}
        </div>
      </header>

      {/* ================= HERO ================= */}
      {banners.length > 0 && (
        <section className="hero-banner">
          <div
            className="banner-slide"
            style={{
              backgroundImage: `url(${banners[currentBanner]?.image})`,
            }}
          >
            <div className="banner-overlay" />
            <div className="banner-content">
              <h2>{banners[currentBanner]?.title}</h2>
              <p>{banners[currentBanner]?.subtitle}</p>
            </div>
          </div>
        </section>
      )}

      {loading && <div style={{ padding: 40 }}>Đang tải sản phẩm...</div>}

      {/* ================= SHOP ================= */}
      <div className="shop-layout">
        <aside className="shop-filter">
  <h3>Danh mục</h3>

  <p
    className={typeFilter === "local" ? "active-filter" : ""}
    onClick={() => setTypeFilter("local")}
  >
    Trái cây nội địa
  </p>

  <p
    className={typeFilter === "import" ? "active-filter" : ""}
    onClick={() => setTypeFilter("import")}
  >
    Trái cây nhập khẩu
  </p>

  <p
    className={typeFilter === "sale" ? "active-filter" : ""}
    onClick={() => setTypeFilter("sale")}
  >
    Hàng giảm giá
  </p>

  <p
    className={typeFilter === "all" ? "active-filter" : ""}
    onClick={() => setTypeFilter("all")}
  >
    Tất cả
  </p>
</aside>


        <div className="product-grid">
          {filteredProducts.map((p) => (
            <div className="product-card" key={p.id}>
              <div className="card-img">
                <img src={p.image} alt={p.name} />
                {p.hot && <div className="badge-hot">HOT</div>}
                {p.sale && <div className="badge-sale">SALE</div>}
              </div>

              <div className="card-body">
                <div className="title">{p.name}</div>
                <div className="origin">{p.origin}</div>
                <div className="rating">⭐⭐⭐⭐⭐</div>

                {/* ===== PRICE FIX ===== */}
                <div className="price">
                  {p.oldPrice > 0 && (
                    <span className="old-price">
                      {p.oldPrice.toLocaleString()}đ
                    </span>
                  )}

                  <span className="new-price">
                    {p.price.toLocaleString()}đ
                  </span>
                </div>

                <button
                  className="add-btn"
                  onClick={() => addToCart(p)}
                >
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
