import { useProducts } from "../features/products/hooks/useProducts";
import ProductCard from "../features/products/components/ProductCard";

function HomePage() {
  const { products, loading } = useProducts();

  return (
    <div>
      {/* Hero */}
      <div className="mb-10 rounded-2xl bg-slate-900 px-8 py-16 text-center text-white">
        <h1 className="text-3xl font-bold md:text-5xl">
          Welcome to <span className="text-blue-400">TechVault</span>
        </h1>
        <p className="mt-3 text-slate-400">
          Your one-stop shop for the latest tech gadgets.
        </p>
      </div>

      {/* Products */}
      <h2 className="mb-6 text-xl font-semibold text-slate-900">
        Featured Products
      </h2>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl bg-white p-4 shadow-sm"
            >
              <div className="mb-4 h-48 rounded-lg bg-slate-200" />
              <div className="h-4 w-3/4 rounded bg-slate-200" />
              <div className="mt-2 h-4 w-1/2 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;
