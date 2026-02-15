import { Link, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

function OrderSuccess({ setCart }) {
  const location = useLocation();
  const orderData = location.state;

  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 300);

    // 🧹 Clear cart khi vào trang thành công
    setCart([]);
    localStorage.removeItem("cart");
  }, [setCart]);

  if (!orderData) {
    return <Navigate to="/" replace />;
  }

  const { orderId, total, products } = orderData;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        {/* Brand */}
        <div style={styles.brand}>668<span style={styles.brandHighlight}>Mart</span></div>

        {/* Success Icon */}
        <div
          style={{
            ...styles.checkCircle,
            transform: show ? "scale(1)" : "scale(0.6)",
            opacity: show ? 1 : 0
          }}
        >
          ✓
        </div>

        <h2 style={styles.title}>Đặt hàng thành công!</h2>
        <p style={styles.subtitle}>
          Cảm ơn bạn đã mua sắm tại <strong>668Mart</strong>
        </p>

        {/* Order Info */}
        <div style={styles.infoBox}>
          <div style={styles.infoRow}>
            <span>Mã đơn hàng</span>
            <strong>#{orderId}</strong>
          </div>
          <div style={styles.infoRow}>
            <span>Tổng thanh toán</span>
            <strong style={styles.price}>
              {total.toLocaleString("vi-VN")} đ
            </strong>
          </div>
        </div>

        {/* Product List */}
        <div style={styles.productBox}>
          <div style={styles.productTitle}>Sản phẩm đã mua</div>
          {products.map((item, i) => (
            <div key={i} style={styles.productRow}>
              <span>{item.name}</span>
              <span>x{item.qty}</span>
            </div>
          ))}
        </div>

        <Link to="/" replace style={styles.button}>
          🏠 Tiếp tục mua sắm
        </Link>

      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #fff5f0, #ffece6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px"
  },
  card: {
    background: "white",
    padding: "50px 40px",
    borderRadius: "20px",
    textAlign: "center",
    width: "480px",
    boxShadow: "0 25px 60px rgba(238,77,45,0.15)",
    position: "relative"
  },
  brand: {
    position: "absolute",
    top: "20px",
    left: "30px",
    fontSize: "20px",
    fontWeight: "700",
    color: "#ee4d2d"
  },
  brandHighlight: {
    color: "#ff7337"
  },
  checkCircle: {
    width: "100px",
    height: "100px",
    background: "linear-gradient(135deg, #00c853, #00bfa5)",
    borderRadius: "50%",
    color: "white",
    fontSize: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "20px auto",
    transition: "all 0.4s ease",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
  },
  title: {
    marginTop: "10px",
    fontSize: "26px",
    fontWeight: "700"
  },
  subtitle: {
    color: "#666",
    marginTop: "5px"
  },
  infoBox: {
    marginTop: "25px",
    background: "#fafafa",
    padding: "18px",
    borderRadius: "12px",
    border: "1px solid #f0f0f0"
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
    fontSize: "14px"
  },
  price: {
    color: "#ee4d2d",
    fontSize: "16px"
  },
  productBox: {
    marginTop: "20px",
    textAlign: "left",
    borderTop: "1px solid #eee",
    paddingTop: "15px"
  },
  productTitle: {
    fontWeight: "600",
    marginBottom: "10px"
  },
  productRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
    marginBottom: "6px",
    color: "#444"
  },
  button: {
    display: "block",
    marginTop: "30px",
    padding: "14px",
    background: "linear-gradient(135deg, #ee4d2d, #ff7337)",
    color: "white",
    textDecoration: "none",
    borderRadius: "12px",
    fontWeight: "600",
    transition: "all 0.3s ease",
    boxShadow: "0 8px 20px rgba(238,77,45,0.3)"
  }
};

export default OrderSuccess;
