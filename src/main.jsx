import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import RouterApp from "./RouterApp"; // ✅ ĐÚNG FILE

function Root() {
  const [cart, setCart] = useState([]);
  return <RouterApp cart={cart} setCart={setCart} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);




