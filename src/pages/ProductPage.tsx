// src/pages/ProductsPage.tsx
import { useParams, Link, useNavigate } from "react-router-dom";
import { useProducts } from "../features/products/hooks/useProducts";
import ProductCard from "../features/products/components/ProductCard";

export default function ProductsPage() {
  const { category } = useParams<{ category?: string }>();
  const { products, loading } = useProducts();
  const navigate = useNavigate();

  // Get unique categories from all products
  const categories = [...new Set(products.map((p) => p.category))];

  // Filter products by category if one is selected
  const filtered = category
    ? products.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase(),
      )
    : products;

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-slate-400">
        <Link to="/" className="transition hover:text-blue-600">
          Home
        </Link>
        <span>/</span>
        {category ? (
          <>
            <Link to="/products" className="transition hover:text-blue-600">
              Products
            </Link>
            <span>/</span>
            <span className="capitalize font-medium text-slate-700">
              {category}
            </span>
          </>
        ) : (
          <span className="font-medium text-slate-700">Products</span>
        )}
      </nav>

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold capitalize text-slate-900">
            {category ? category : "All Products"}
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {loading ? "Loading..." : `${filtered.length} products`}
          </p>
        </div>
      </div>

      {/* Category pills */}
      {!loading && categories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => navigate("/products")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              !category
                ? "bg-blue-600 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                navigate(`/products/category/${cat.toLowerCase()}`)
              }
              className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${
                category?.toLowerCase() === cat.toLowerCase()
                  ? "bg-blue-600 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="h-48 animate-pulse rounded-t-xl bg-slate-200" />
              <div className="p-4 space-y-3">
                <div className="h-3 w-16 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                <div className="h-3 w-full animate-pulse rounded bg-slate-200" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-slate-200" />
                <div className="flex justify-between pt-1">
                  <div className="h-5 w-16 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <svg
              className="h-7 w-7 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-slate-800">No products found</p>
            <p className="mt-1 text-sm text-slate-500">
              No products in the{" "}
              <span className="capitalize font-medium">"{category}"</span>{" "}
              category yet.
            </p>
          </div>
          <button
            onClick={() => navigate("/products")}
            className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            View All Products
          </button>
        </div>
      )}

      {/* Product grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
