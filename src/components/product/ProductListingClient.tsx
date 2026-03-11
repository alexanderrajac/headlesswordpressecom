"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, ChevronDown, Grid3X3, List, Filter } from "lucide-react";
import { getProducts, getCategories, formatPrice } from "@/lib/woocommerce";
import type { WCProduct } from "@/types";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "@/components/ui/ProductCardSkeleton";

interface Props {
  searchParams: { [key: string]: string | undefined };
}

export default function ProductListingClient({ searchParams }: Props) {
  const router = useRouter();
  const sp = useSearchParams();

  const [products, setProducts] = useState<WCProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<{ id: number; name: string; slug: string }[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    category: searchParams.category || "",
    minPrice: searchParams.minPrice ? parseInt(searchParams.minPrice) : 0,
    maxPrice: searchParams.maxPrice ? parseInt(searchParams.maxPrice) : 50000,
    minRating: searchParams.minRating ? parseFloat(searchParams.minRating) : 0,
    inStock: searchParams.inStock === "true",
    orderby: searchParams.orderby || "date",
    order: (searchParams.order || "desc") as "asc" | "desc",
    page: searchParams.page ? parseInt(searchParams.page) : 1,
  });

  const [priceRange, setPriceRange] = useState([filters.minPrice, filters.maxPrice]);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { products: data, total: t, totalPages: tp } = await getProducts({
        ...filters,
        per_page: 20,
        minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
        maxPrice: priceRange[1] < 50000 ? priceRange[1] : undefined,
      });
      setProducts(data);
      setTotal(t);
      setTotalPages(tp);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters, priceRange]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateFilter = (key: string, value: string | number | boolean) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const sortOptions = [
    { value: "date|desc", label: "Newest First" },
    { value: "popularity|desc", label: "Most Popular" },
    { value: "rating|desc", label: "Highest Rated" },
    { value: "price|asc", label: "Price: Low to High" },
    { value: "price|desc", label: "Price: High to Low" },
  ];

  const activeFilterCount = [
    filters.category,
    priceRange[0] > 0 || priceRange[1] < 50000,
    filters.minRating > 0,
    filters.inStock,
  ].filter(Boolean).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-charcoal">
            {filters.category
              ? categories.find((c) => c.slug === filters.category)?.name || "Products"
              : "All Products"}
          </h1>
          {!loading && <p className="text-sm text-charcoal/50 mt-1">{total} products found</p>}
        </div>
        <div className="flex items-center gap-3">
          {/* Sort */}
          <div className="relative hidden sm:block">
            <select
              value={`${filters.orderby}|${filters.order}`}
              onChange={(e) => {
                const [orderby, order] = e.target.value.split("|");
                setFilters((p) => ({ ...p, orderby, order: order as "asc" | "desc", page: 1 }));
              }}
              className="input-field py-2 pr-8 text-sm appearance-none cursor-pointer"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-charcoal/40" />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-semibold text-sm transition-colors ${
              isFilterOpen || activeFilterCount > 0
                ? "bg-wood-600 text-cream border-wood-600"
                : "bg-white border-cream-300 text-charcoal hover:border-wood-600"
            }`}
          >
            <Filter size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-white text-wood-600 text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="shrink-0 overflow-hidden"
            >
              <div className="w-[260px] bg-white rounded-2xl p-5 shadow-card sticky top-24 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-semibold text-charcoal">Filters</h3>
                  <button
                    onClick={() => {
                      setFilters({ category: "", minPrice: 0, maxPrice: 50000, minRating: 0, inStock: false, orderby: "date", order: "desc", page: 1 });
                      setPriceRange([0, 50000]);
                    }}
                    className="text-xs text-wood-600 hover:underline font-semibold"
                  >
                    Clear All
                  </button>
                </div>

                {/* Categories */}
                <div>
                  <h4 className="font-semibold text-sm text-charcoal mb-3">Category</h4>
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 cursor-pointer hover:text-wood-600 transition-colors">
                      <input
                        type="radio"
                        name="category"
                        value=""
                        checked={!filters.category}
                        onChange={() => updateFilter("category", "")}
                        className="accent-wood-600"
                      />
                      <span className="text-sm">All Categories</span>
                    </label>
                    {categories.map((cat) => (
                      <label key={cat.id} className="flex items-center gap-2 cursor-pointer hover:text-wood-600 transition-colors">
                        <input
                          type="radio"
                          name="category"
                          value={cat.slug}
                          checked={filters.category === cat.slug}
                          onChange={() => updateFilter("category", cat.slug)}
                          className="accent-wood-600"
                        />
                        <span className="text-sm">{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price range */}
                <div>
                  <h4 className="font-semibold text-sm text-charcoal mb-3">Price Range</h4>
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                      onBlur={fetchProducts}
                      className="input-field py-1.5 text-sm text-center"
                      placeholder="Min"
                    />
                    <span className="text-charcoal/40">—</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                      onBlur={fetchProducts}
                      className="input-field py-1.5 text-sm text-center"
                      placeholder="Max"
                    />
                  </div>
                  <p className="text-xs text-charcoal/50">
                    {formatPrice(priceRange[0])} — {formatPrice(priceRange[1])}
                  </p>
                </div>

                {/* Rating */}
                <div>
                  <h4 className="font-semibold text-sm text-charcoal mb-3">Minimum Rating</h4>
                  <div className="space-y-1">
                    {[0, 3, 4, 4.5].map((r) => (
                      <label key={r} className="flex items-center gap-2 cursor-pointer hover:text-wood-600">
                        <input
                          type="radio"
                          name="rating"
                          checked={filters.minRating === r}
                          onChange={() => updateFilter("minRating", r)}
                          className="accent-wood-600"
                        />
                        <span className="text-sm">
                          {r === 0 ? "All Ratings" : `${r}★ & above`}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Stock */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={(e) => updateFilter("inStock", e.target.checked)}
                      className="w-4 h-4 accent-wood-600 rounded"
                    />
                    <span className="text-sm font-medium text-charcoal">In Stock Only</span>
                  </label>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Products grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(12)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <span className="text-6xl">🪵</span>
              <p className="font-display font-semibold text-xl text-charcoal mt-4">No products found</p>
              <p className="text-charcoal/50 mt-2">Try adjusting your filters</p>
              <button
                onClick={() => {
                  setFilters({ category: "", minPrice: 0, maxPrice: 50000, minRating: 0, inStock: false, orderby: "date", order: "desc", page: 1 });
                  setPriceRange([0, 50000]);
                }}
                className="btn-primary mt-6"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {products.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))}
                    disabled={filters.page === 1}
                    className="px-4 py-2 rounded-lg border border-cream-300 text-sm font-semibold disabled:opacity-40 hover:border-wood-600 transition-colors"
                  >
                    ← Prev
                  </button>
                  {[...Array(Math.min(totalPages, 7))].map((_, i) => {
                    const p = i + 1;
                    return (
                      <button
                        key={p}
                        onClick={() => setFilters((prev) => ({ ...prev, page: p }))}
                        className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                          filters.page === p
                            ? "bg-wood-600 text-cream"
                            : "border border-cream-300 hover:border-wood-600"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))}
                    disabled={filters.page === totalPages}
                    className="px-4 py-2 rounded-lg border border-cream-300 text-sm font-semibold disabled:opacity-40 hover:border-wood-600 transition-colors"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
