// src/pages/ProductDetailPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import type { Product } from "../features/products/hooks/useProducts";
import { useCart } from "../features/carts/hooks/useCarts";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      setLoading(true);
      setImgLoaded(false);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setError("Product not found.");
      } else {
        setProduct(data);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      stock: product.stock,
      quantity: quantity,
    });
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex items-center gap-2">
            <div className="h-4 w-12 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-2 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
          </div>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div className="aspect-square animate-pulse rounded-2xl bg-slate-200" />
            <div className="flex flex-col gap-4 pt-4">
              <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
              <div className="h-8 w-3/4 animate-pulse rounded bg-slate-200" />
              <div className="h-8 w-1/3 animate-pulse rounded bg-slate-200" />
              <div className="mt-2 space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-4/6 animate-pulse rounded bg-slate-200" />
              </div>
              <div className="mt-4 h-12 w-full animate-pulse rounded-xl bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 px-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <svg
              className="h-7 w-7 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <p className="text-lg font-semibold text-slate-800">
            {error ?? "Product not found."}
          </p>
          <p className="text-sm text-slate-500">
            The product you're looking for doesn't exist or was removed.
          </p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          ← Back to Home
        </button>
      </div>
    );
  }

  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-1.5 text-sm text-slate-400">
          <Link to="/" className="transition hover:text-blue-600">
            Home
          </Link>
          <span>/</span>
          <Link to={`/products/category/${product.category.toLowerCase()}`}>
            {product.category}
          </Link>
          <span>/</span>
          <span className="truncate max-w-[180px] font-medium text-slate-700">
            {product.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* ── Image panel ──────────────────────────────────────────────── */}
          <div className="relative">
            <div
              className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-opacity duration-500 ${
                imgLoaded ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={product.image}
                alt={product.name}
                onLoad={() => setImgLoaded(true)}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/600x600/f8fafc/94a3b8?text=No+Image";
                  setImgLoaded(true);
                }}
                className="aspect-square w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>

            {!imgLoaded && (
              <div className="absolute inset-0 animate-pulse rounded-2xl bg-slate-200" />
            )}

            {/* Category badge */}
            <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 shadow-sm backdrop-blur-sm">
              <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                {product.category}
              </span>
            </div>

            {outOfStock && (
              <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/70 backdrop-blur-sm">
                <span className="rounded-full border border-red-200 bg-white px-5 py-2 text-sm font-semibold text-red-500 shadow">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* ── Details panel ────────────────────────────────────────────── */}
          <div className="flex flex-col gap-6 pt-2">
            {/* Name + price */}
            <div>
              <h1 className="text-3xl font-bold leading-tight text-slate-900">
                {product.name}
              </h1>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-4xl font-extrabold text-slate-900">
                  ${product.price.toLocaleString()}
                </span>
                <span className="text-sm text-slate-400">USD</span>
              </div>
            </div>

            {/* Stock status */}
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${
                  outOfStock
                    ? "bg-red-400"
                    : lowStock
                      ? "bg-amber-400"
                      : "bg-green-400"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  outOfStock
                    ? "text-red-500"
                    : lowStock
                      ? "text-amber-600"
                      : "text-green-600"
                }`}
              >
                {outOfStock
                  ? "Out of stock"
                  : lowStock
                    ? `Only ${product.stock} left`
                    : `In stock — ${product.stock} units`}
              </span>
            </div>

            <div className="border-t border-slate-100" />

            {/* Description */}
            <div>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
                Description
              </h2>
              <p className="leading-relaxed text-slate-600">
                {product.description}
              </p>
            </div>

            <div className="border-t border-slate-100" />

            {/* Quantity + Add to cart */}
            {!outOfStock && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-slate-600">
                    Quantity
                  </span>
                  <div className="flex items-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="flex h-10 w-10 items-center justify-center text-slate-400 transition hover:bg-slate-50 hover:text-slate-700 active:bg-slate-100"
                    >
                      −
                    </button>
                    <span className="flex h-10 w-10 items-center justify-center border-x border-slate-200 text-sm font-semibold text-slate-800">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity((q) => Math.min(product.stock, q + 1))
                      }
                      className="flex h-10 w-10 items-center justify-center text-slate-400 transition hover:bg-slate-50 hover:text-slate-700 active:bg-slate-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
                    addedFeedback
                      ? "bg-green-500 text-white"
                      : "bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-md"
                  }`}
                >
                  {addedFeedback ? (
                    <>
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      Add to Cart
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Product meta grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Category", value: product.category },
                { label: "Stock", value: `${product.stock} units` },
                { label: "Product ID", value: `#${product.id.slice(0, 8)}` },
                {
                  label: "Added",
                  value: new Date(product.created_at).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    },
                  ),
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    {label}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold capitalize text-slate-700">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
