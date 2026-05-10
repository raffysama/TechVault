import { useNavigate } from "react-router-dom";
import type { Product } from "../hooks/useProducts";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/products/${product.id}`)}
      className="cursor-pointer rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
    >
      <img
        src={product.image}
        alt={product.name}
        className="h-48 w-full rounded-t-xl object-cover"
      />
      <div className="p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-blue-600">
          {product.category}
        </span>
        <h3 className="mt-1 font-semibold text-slate-900">{product.name}</h3>
        <p className="mt-1 text-sm text-slate-500 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-slate-900">
            ${product.price.toLocaleString()}
          </span>
          <span
            className={`text-xs font-medium ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}
          >
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
