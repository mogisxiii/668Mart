import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function CheckoutPage({ cart, setCart }) {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const safeCart = cart || [];

  const total = safeCart.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.qty) || 0;
    return sum + price * qty;
  }, 0);

  const API_URL =
    "https://script.google.com/macros/s/AKfycbyJ5zMAWz8CwikMX4bTOvdlJvfsaNROZxdx_6To78tDGra8QvEFWpnJBxqrCDGWLCtY/exec";

  const handleOrder = async () => {
    if (!name || !phone || !address) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (safeCart.length === 0) {
      alert("Giỏ hàng đang trống!");
      return;
    }

    setLoading(true);

    const orderId = "DH" + Date.now();

    const orderData = {
      orderId,
      name,
      phone,
      address,
      products: safeCart.map(i => `${i.name} x${i.qty}`).join(", "),
      total,
      date: new Date().toLocaleString("vi-VN")
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(orderData),
      });

      const result = await res.json();

      if (result.result === "success") {
        setCart([]);

        navigate("/order-success", {
          state: { orderId, total, products: safeCart }
        });
      } else {
        alert("❌ Server lỗi, chưa lưu đơn!");
      }
    } catch (err) {
      console.error("Lỗi gửi đơn:", err);
      alert("❌ Lỗi gửi đơn hàng!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "30px", background: "#f5f5f5", minHeight: "100vh" }}>
      <h2>🧾 Trang thanh toán</h2>

      <Link to="/">
        <button style={{
          marginBottom: "15px",
          background: "#ff9800",
          color: "white",
          border: "none",
          padding: "8px 14px",
          borderRadius: "6px",
          cursor: "pointer",
        }}>
          ⬅ Quay lại trang chủ
        </button>
      </Link>

      <div style={{
        background: "white",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}>

        <h3>Thông tin khách hàng</h3>

        <input
          placeholder="Họ và tên"
          value={name}
          onChange={e => setName(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Số điện thoại"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Địa chỉ giao hàng"
          value={address}
          onChange={e => setAddress(e.target.value)}
          style={inputStyle}
        />

        <h3 style={{ marginTop: "20px" }}>Đơn hàng</h3>

        {safeCart.map((item, i) => (
          <div key={i}>
            {item.name} x {item.qty} —{" "}
            {(item.price * item.qty).toLocaleString("vi-VN")} đ
          </div>
        ))}

        <h3 style={{ marginTop: "20px" }}>
          💰 Tổng thanh toán: {total.toLocaleString("vi-VN")} đ
        </h3>

        <button
          onClick={handleOrder}
          disabled={loading}
          style={{
            marginTop: "15px",
            background: loading ? "#999" : "#ee4d2d",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            width: "100%"
          }}
        >
          {loading ? "Đang xử lý..." : "Xác nhận đặt hàng"}
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

export default CheckoutPage;
