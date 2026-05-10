import type { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface NavbarLayoutProps {
  children: ReactNode;
}

const NAV_ITEMS = [
  {
    path: "/",
    label: "Home",
  },
  {
    path: "/products",
    label: "Products",
  },
  {
    path: "/orders",
    label: "Orders",
  },
];

export const NavBarLayout = ({ children }: NavbarLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

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
            <button
              onClick={() => navigate("/cart")}
              className="relative flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              🛒 Cart
            </button>
            <button
              onClick={() => navigate("/login")}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Login
            </button>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
};
