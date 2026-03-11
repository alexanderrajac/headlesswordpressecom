"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { getProducts } from "@/lib/woocommerce";
import type { WCProduct } from "@/types";
import ProductCard from "@/components/product/ProductCard";
import ProductCardSkeleton from "@/components/ui/ProductCardSkeleton";

import { Suspense } from "react";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState<WCProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    getProducts({ search: query, per_page: 24 })
      .then(({ products: data, total: t }) => { setProducts(data); setTotal(t); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-charcoal/50 mb-3">
          <Search size={14} />
          <span>Search results for</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-charcoal">
          "{query}"
        </h1>
        {!loading && (
          <p className="text-charcoal/50 mt-1">{total} results found</p>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <span className="text-6xl">🔍</span>
          <h2 className="font-display text-2xl font-bold text-charcoal mt-4 mb-2">
            No results for "{query}"
          </h2>
          <p className="text-charcoal/50 mb-6">Try different keywords or browse our categories</p>
          <a href="/products" className="btn-primary">Browse All Products</a>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-charcoal/50">
        Loading...
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
