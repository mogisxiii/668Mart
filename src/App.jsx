import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Home_v2 from "./pages/Home_v2";
import CartPage from "./CartPage";
import CheckoutPage from "./CheckoutPage";
import OrderSuccess from "./pages/OrderSuccess";

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
    <BrowserRouter>
      <Routes>

        {/* 🏠 Trang chủ */}
        <Route
          path="/"
          element={<Home_v2 cart={cart} setCart={setCart} />}
        />

        {/* 🛒 Giỏ hàng */}
        <Route
          path="/cart"
          element={<CartPage cart={cart} setCart={setCart} />}
        />

        {/* 💳 Thanh toán */}
        <Route
          path="/checkout"
          element={<CheckoutPage cart={cart} setCart={setCart} />}
        />

        {/* ✅ Trang đặt hàng thành công */}
        <Route
          path="/order-success"
          element={<OrderSuccess setCart={setCart} />}
        />

        {/* ❌ Route lạ → về trang chủ */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;



