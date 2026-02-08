import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import CartPage from "./CartPage";

function RouterApp({ cart, setCart }) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home cart={cart} setCart={setCart} />} />
        <Route path="/cart" element={<CartPage cart={cart} setCart={setCart} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default RouterApp;

