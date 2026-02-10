import { Link } from "react-router-dom";
import { useState } from "react";

function CheckoutPage({ cart, setCart }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

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
      console.log("Server trả về:", result);

      if (result.result === "success") {
        alert("🎉 Đặt hàng thành công!\nMã đơn: " + orderId);
        setCart([]);
        setName("");
        setPhone("");
        setAddress("");
      } else {
        alert("❌ Server lỗi, chưa lưu đơn!");
      }
    } catch (err) {
      console.error("Lỗi gửi đơn:", err);
      alert("❌ Lỗi gửi đơn hàng!");
    }
  };

  const inputStyle = {
    display: "block",
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  };

  const orderBtn = {
    marginTop: "15px",
    background: "#4CAF50",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial", background: "#f5f5f5", minHeight: "100vh" }}>
      <h2>🧾 Trang thanh toán</h2>

      <Link to="/cart">
        <button style={{
          marginBottom: "15px",
          background: "#ff9800",
          color: "white",
          border: "none",
          padding: "8px 14px",
          borderRadius: "6px",
          cursor: "pointer",
        }}>
          ⬅ Quay lại giỏ hàng
        </button>
      </Link>

      <div style={{
        background: "white",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}>
        <h3>Thông tin khách hàng</h3>

        <input placeholder="Họ và tên" style={inputStyle} value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Số điện thoại" style={inputStyle} value={phone} onChange={e => setPhone(e.target.value)} />
        <input placeholder="Địa chỉ giao hàng" style={inputStyle} value={address} onChange={e => setAddress(e.target.value)} />

        <h3 style={{ marginTop: "20px" }}>Đơn hàng</h3>
        {safeCart.map((item, i) => (
          <div key={i}>
            {item.name} x {item.qty} — {(item.price * item.qty).toLocaleString()} đ
          </div>
        ))}

        <h3 style={{ marginTop: "20px" }}>
          💰 Tổng thanh toán: {total.toLocaleString()} đ
        </h3>

        <button onClick={handleOrder} style={orderBtn}>
          Xác nhận đặt hàng
        </button>
      </div>
    </div>
  );
}

export default CheckoutPage;


