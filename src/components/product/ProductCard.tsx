"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Star, Zap } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import type { WCProduct } from "@/types";
import { formatPrice, getDiscountPercent } from "@/lib/woocommerce";
import toast from "react-hot-toast";

interface Props {
  product: WCProduct;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: Props) {
  const { addItem } = useCartStore();
  const discount = getDiscountPercent(product.regular_price, product.sale_price);
  const isOutOfStock = product.stock_status === "outofstock";
  const rating = parseFloat(product.average_rating);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem(product);
    toast.success(`${product.name.slice(0, 30)}... added to cart!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col"
    >
      <Link href={`/products/${product.slug}`} className="flex flex-col flex-1">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-cream-100">
          {product.images[0] ? (
            <Image
              src={product.images[0].src}
              alt={product.images[0].alt || product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-cream-200">
              <span className="text-4xl">🪵</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discount > 0 && (
              <span className="badge bg-red-500 text-white text-xs px-2 py-0.5">
                -{discount}%
              </span>
            )}
            {product.featured && (
              <span className="badge bg-wood-600 text-cream text-xs px-2 py-0.5">
                Featured
              </span>
            )}
            {isOutOfStock && (
              <span className="badge bg-charcoal text-white text-xs px-2 py-0.5">
                Out of Stock
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-wood-600 hover:text-cream shadow-sm"
          >
            <Heart size={14} />
          </button>

          {/* Quick add overlay */}
          {!isOutOfStock && (
            <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <button
                onClick={handleAddToCart}
                className="w-full bg-wood-600/95 backdrop-blur-sm text-cream py-2.5 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-wood-700 transition-colors"
              >
                <ShoppingCart size={14} />
                Quick Add
              </button>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col flex-1">
          {/* Category */}
          {product.categories[0] && (
            <span className="text-xs text-wood-600 font-medium uppercase tracking-wider mb-1">
              {product.categories[0].name}
            </span>
          )}

          {/* Name */}
          <h3
            className="text-sm font-semibold text-charcoal line-clamp-2 mb-2 flex-1"
            dangerouslySetInnerHTML={{ __html: product.name }}
          />

          {/* Rating */}
          {rating > 0 && (
            <div className="flex items-center gap-1.5 mb-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={11}
                    className={star <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-300"}
                  />
                ))}
              </div>
              <span className="text-xs text-charcoal/50">({product.rating_count})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base font-bold text-charcoal price-tag">
              {formatPrice(product.sale_price || product.price)}
            </span>
            {product.on_sale && product.regular_price && (
              <span className="text-xs text-charcoal/40 line-through price-tag">
                {formatPrice(product.regular_price)}
              </span>
            )}
          </div>

          {/* Stock indicator */}
          {product.stock_quantity !== null && product.stock_quantity !== undefined && product.stock_quantity <= 5 && product.stock_quantity > 0 && (
            <p className="text-xs text-orange-500 font-medium mt-1">
              Only {product.stock_quantity} left!
            </p>
          )}
        </div>
      </Link>

      {/* Add to cart button (always visible on mobile) */}
      <div className="px-4 pb-4 md:hidden">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
            isOutOfStock
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-wood-600 text-cream hover:bg-wood-700"
          }`}
        >
          <ShoppingCart size={14} />
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </motion.div>
  );
}
