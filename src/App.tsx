import "./App.css";
import { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import { CartProvider } from "./features/carts/context/CartContext";
import { NavBarLayout } from "./layouts/NavbarLayout";
import CartPage from "./pages/CartPage";
import ProductsPage from "./pages/ProductPage";
import OrdersPage from "./features/orders/components/OrdersPage";

function App() {
  return (
    <CartProvider>
      <Toaster position="top-center" />
      <NavBarLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route
            path="/products/category/:category"
            element={<ProductsPage />}
          />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<OrdersPage />} />
        </Routes>
      </NavBarLayout>
    </CartProvider>
  );
}

export default App;
