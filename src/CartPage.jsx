import { Link } from "react-router-dom";

function CartPage({ cart, setCart }) {

  // ✅ TÍNH TỔNG AN TOÀN
  const total = cart.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.qty) || 0;
    return sum + price * qty;
  }, 0);

  const increaseQty = (index) => {
    setCart(prev => {
      const newCart = [...prev];
      newCart[index].qty = (Number(newCart[index].qty) || 0) + 1;
      return newCart;
    });
  };

  const decreaseQty = (index) => {
    setCart(prev => {
      const newCart = [...prev];
      const currentQty = Number(newCart[index].qty) || 0;

      if (currentQty > 1) {
        newCart[index].qty = currentQty - 1;
      } else {
        newCart.splice(index, 1);
      }
      return newCart;
    });
  };

  const removeItem = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  // STYLE
  const qtyBtn = {
    background: "#ff5722",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer"
  };

  const delBtn = {
    marginTop: "5px",
    background: "#f44336",
    color: "white",
    border: "none",
    padding: "4px 8px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px"
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial", background: "#f5f5f5", minHeight: "100vh" }}>
      <h2>🛒 Giỏ hàng của bạn</h2>

      <Link to="/">
        <button style={{
          marginBottom: "15px",
          background: "#ff9800",
          color: "white",
          border: "none",
          padding: "8px 14px",
          borderRadius: "6px",
          cursor: "pointer"
        }}>
          ⬅ Tiếp tục mua
        </button>
      </Link>

      {cart.length === 0 && <p>Chưa có sản phẩm nào.</p>}

      {cart.map((item, i) => {
        const price = Number(item.price) || 0;
        const qty = Number(item.qty) || 0;
        const itemTotal = price * qty;

        return (
          <div key={i} style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            marginBottom: "12px",
            background: "white",
            padding: "12px",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
          }}>
            {/* ✅ ẢNH KHÔNG LỖI */}
            <img
              src={item.img || "https://via.placeholder.com/70"}
              alt={item.name}
              onError={(e) => e.target.src = "https://via.placeholder.com/70"}
              style={{
                width: "70px",
                height: "70px",
                objectFit: "cover",
                borderRadius: "8px"
              }}
            />

            <div style={{ flex: 1 }}>
              <b>{item.name}</b>
              <div style={{ fontSize: "14px", color: "#555" }}>
                {price.toLocaleString()} đ
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button onClick={() => decreaseQty(i)} style={qtyBtn}>−</button>
              <span>{qty}</span>
              <button onClick={() => increaseQty(i)} style={qtyBtn}>+</button>
            </div>

            <div style={{ width: "120px", textAlign: "right" }}>
              <b>{itemTotal.toLocaleString()} đ</b>
              <div>
                <button onClick={() => removeItem(i)} style={delBtn}>Xóa</button>
              </div>
            </div>
          </div>
        );
      })}

      <h3>💰 Tổng cộng: {total.toLocaleString()} đ</h3>

      {/* ✅ NÚT THANH TOÁN */}
      {cart.length > 0 && (
        <Link to="/checkout">
          <button style={{
            marginTop: "15px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px"
          }}>
            Tiến hành thanh toán
          </button>
        </Link>
      )}
    </div>
  );
}

export default CartPage;


