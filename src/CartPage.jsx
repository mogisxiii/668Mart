import { Link } from "react-router-dom";

function CartPage({ cart, setCart }) {
  // Tính tổng tiền theo số lượng
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div
      style={{
        padding: "30px",
        fontFamily: "Arial",
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <h2>🛒 Giỏ hàng của bạn</h2>

      <Link to="/">
        <button
          style={{
            marginBottom: "15px",
            background: "#ff9800",
            color: "white",
            border: "none",
            padding: "8px 14px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          ⬅ Tiếp tục mua
        </button>
      </Link>

      {cart.length === 0 && (
        <p style={{ marginTop: "20px" }}>Chưa có sản phẩm nào.</p>
      )}

      {cart.map((item, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
            background: "white",
            padding: "12px",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <div>
            <div>
              <b>{item.name}</b>
            </div>
            <div style={{ fontSize: "14px", color: "#555" }}>
              Giá: {item.price.toLocaleString()} đ × {item.qty}
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <b>{(item.price * item.qty).toLocaleString()} đ</b>

            <button
              onClick={() =>
                setCart(cart.filter((_, index) => index !== i))
              }
              style={{
                background: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "5px",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              Xóa
            </button>
          </div>
        </div>
      ))}

      {cart.length > 0 && (
        <>
          <h3 style={{ marginTop: "20px" }}>
            Tổng tiền:{" "}
            <span style={{ color: "#e91e63" }}>
              {total.toLocaleString()} đ
            </span>
          </h3>

          <button
            style={{
              background: "#4CAF50",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              marginTop: "10px",
            }}
            onClick={() => {
              alert("🎉 Đặt hàng thành công!");
              setCart([]);
            }}
          >
            Thanh toán
          </button>
        </>
      )}
    </div>
  );
}

export default CartPage;
