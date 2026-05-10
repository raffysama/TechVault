import "./App.css";
import { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router-dom";
import { NavBarLayout } from "./layouts/NavBarLayout";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <NavBarLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<div>Products Page</div>} />
          <Route path="/cart" element={<div>Cart Page</div>} />
          <Route path="/orders" element={<div>Orders Page</div>} />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </NavBarLayout>
    </>
  );
}

export default App;
