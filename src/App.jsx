import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Home_v2 from "./pages/Home_v2";
import CartPage from "./CartPage";
import CheckoutPage from "./CheckoutPage";

function App() {
  // 🛒 Load cart từ localStorage khi mở web
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // 💾 Mỗi khi cart đổi → lưu lại
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        {/* 🏠 Trang chủ */}
        <Route path="/" element={<Home_v2 cart={cart} setCart={setCart} />} />

        {/* 🛒 Giỏ hàng */}
        <Route path="/cart" element={<CartPage cart={cart} setCart={setCart} />} />

        {/* 💳 Thanh toán */}
        <Route path="/checkout" element={<CheckoutPage cart={cart} setCart={setCart} />} />

        {/* ❌ Route lạ → về trang chủ */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

