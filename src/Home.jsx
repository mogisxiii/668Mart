import { Link } from "react-router-dom";

function Home({ cart, setCart }) {
  const products = [
    {
      name: "Giỏ Trái Cây Cao Cấp",
      price: 1100000,
      sold: 1244,
      rating: 4.8,
      img: "https://images.unsplash.com/photo-1604908177522-040f63a49d4f"
    },
    {
      name: "Giỏ Trái Cây Kết Hợp Hoa",
      price: 2500000,
      sold: 346,
      rating: 4.9,
      img: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f"
    },
    {
      name: "Hộp Trái Cây Quà Tặng",
      price: 900000,
      sold: 786,
      rating: 4.6,
      img: "https://images.unsplash.com/photo-1574226516831-e1dff420e8f8"
    },
    {
      name: "Giỏ Trái Cây Nhập Khẩu",
      price: 1800000,
      sold: 3706,
      rating: 4.7,
      img: "https://images.unsplash.com/photo-1598514982721-6a5d3b6cbd75"
    }
  ];

  const formatPrice = (p) => p.toLocaleString() + " đ";

  return (
    <div style={{ fontFamily: "Arial", background: "#f5f5f5", minHeight: "100vh" }}>
      
      {/* HEADER */}
      <div style={{
        background: "linear-gradient(90deg,#ff5722,#ff9800)",
        padding: "12px 25px",
        color: "white",
        fontWeight: "bold",
        display: "flex",
        justifyContent: "space-between"
      }}>
        <div>🍎 VUA TRÁI CÂY</div>
        <div>📞 0909 230 150</div>
      </div>

      {/* NÚT GIỎ HÀNG */}
      <div style={{ padding: "15px 25px" }}>
        <Link to="/cart">
          <button style={{
            background: "#ff5722",
            color: "white",
            padding: "10px 15px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}>
            🛒 Xem giỏ hàng ({cart.length})
          </button>
        </Link>
      </div>

      {/* DANH SÁCH SẢN PHẨM */}
      <div style={{
        padding: "20px 25px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "20px"
      }}>
        {products.map((p, i) => (
          <div key={i} style={{
            background: "white",
            borderRadius: "12px",
            padding: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
          }}>
            <img src={p.img} alt={p.name} style={{
              width: "100%",
              height: "180px",
              objectFit: "cover",
              borderRadius: "10px"
            }} />

            <div style={{ fontSize: "13px", marginTop: "5px" }}>
              ⭐ {p.rating} | Đã bán {p.sold}
            </div>

            <h3 style={{ fontSize: "16px" }}>{p.name}</h3>
            <div style={{ color: "#ff5722", fontWeight: "bold", fontSize: "18px" }}>
              {formatPrice(p.price)}
            </div>

            <button
              style={{
                marginTop: "8px",
                width: "100%",
                background: "#ff5722",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "8px",
                cursor: "pointer"
              }}
              onClick={() => setCart(prev => [...prev, p])}
            >
              Mua ngay
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
