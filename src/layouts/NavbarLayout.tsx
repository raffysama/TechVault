// src/layouts/NavBarLayout.tsx
import { useState, type ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../features/carts/hooks/useCarts";
import { useAuth } from "../features/auth/hooks/useAuth";
import LoginModal from "../features/auth/components/LoginModal";
import SignUpModal from "../features/auth/components/SignUpModal";
import toast from "react-hot-toast";

interface NavbarLayoutProps {
  children: ReactNode;
}

const NAV_ITEMS = [
  { path: "/", label: "Home" },
  { path: "/products", label: "Products" },
  { path: "/orders", label: "Orders" },
];

export const NavBarLayout = ({ children }: NavbarLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems, clearCart } = useCart();
  const { user, logout } = useAuth();

  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  async function handleLogout() {
    clearCart();
    await logout();
    setShowLogoutConfirm(false);
    toast.success("Logged out successfully.");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="text-lg font-bold text-slate-900"
          >
            Tech<span className="text-blue-600">Vault</span>
          </button>

          {/* Nav links */}
          <nav className="hidden items-center gap-6 md:flex">
            {NAV_ITEMS.map(({ path, label }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === path
                    ? "text-blue-600"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Cart button */}
            <button
              onClick={() => navigate("/cart")}
              className="relative flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              🛒 Cart
              {totalItems > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Auth buttons */}
            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden text-sm text-slate-500 md:block">
                  {user.email}
                </span>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowLogin(true)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  Login
                </button>
                <button
                  onClick={() => setShowSignUp(true)}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>

      {/* Login Modal */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSwitchToSignUp={() => {
            setShowLogin(false);
            setShowSignUp(true);
          }}
        />
      )}

      {/* Sign Up Modal */}
      {showSignUp && (
        <SignUpModal
          onClose={() => setShowSignUp(false)}
          onSwitchToLogin={() => {
            setShowSignUp(false);
            setShowLogin(true);
          }}
        />
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowLogoutConfirm(false)}
          />
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-base font-semibold text-slate-900">
              Log out of TechVault?
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Your cart will be cleared when you log out.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Log Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
