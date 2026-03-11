"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, X, Clock, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { searchProducts } from "@/lib/woocommerce";
import type { WCProduct } from "@/types";
import { formatPrice } from "@/lib/woocommerce";

interface Props {
  onClose?: () => void;
}

export default function SearchAutocomplete({ onClose }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<WCProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const debounceRef = useRef<NodeJS.Timeout>();

  const trending = ["Wooden Chair", "Coffee Table", "Bookshelf", "Wall Art", "Lamp Stand"];

  useEffect(() => {
    const saved = localStorage.getItem("cb-searches");
    if (saved) setRecentSearches(JSON.parse(saved).slice(0, 5));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = useCallback(async (q: string) => {
    if (!q.trim() || q.length < 2) {
      setResults([]);
      return;
    }
    setIsLoading(true);
    try {
      const data = await searchProducts(q);
      setResults(data.slice(0, 6));
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => handleSearch(query), 300);
    return () => clearTimeout(debounceRef.current);
  }, [query, handleSearch]);

  const handleSubmit = (q: string) => {
    if (!q.trim()) return;
    const updated = [q, ...recentSearches.filter((s) => s !== q)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("cb-searches", JSON.stringify(updated));
    setIsOpen(false);
    setQuery("");
    onClose?.();
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleProductClick = (slug: string) => {
    setIsOpen(false);
    setQuery("");
    onClose?.();
    router.push(`/products/${slug}`);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="flex items-center bg-white border-2 border-cream-300 rounded-lg overflow-hidden focus-within:border-wood-600 transition-colors">
        <Search size={18} className="ml-3 text-charcoal/40 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit(query)}
          placeholder="Search for furniture, decor, wood art..."
          className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none text-charcoal placeholder-charcoal/40"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setResults([]); inputRef.current?.focus(); }}
            className="p-2 text-charcoal/40 hover:text-charcoal transition-colors"
          >
            <X size={16} />
          </button>
        )}
        <button
          onClick={() => handleSubmit(query)}
          className="bg-wood-600 text-cream px-4 py-2.5 text-sm font-semibold hover:bg-wood-700 transition-colors whitespace-nowrap"
        >
          Search
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (query || recentSearches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-card-hover border border-cream-300 z-50 max-h-[480px] overflow-y-auto"
          >
            {/* Loading */}
            {isLoading && (
              <div className="p-4 text-sm text-charcoal/50 flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-wood-600 border-t-transparent rounded-full animate-spin" />
                Searching...
              </div>
            )}

            {/* Results */}
            {!isLoading && results.length > 0 && (
              <div className="p-2">
                <p className="px-3 py-1 text-xs font-semibold text-charcoal/40 uppercase tracking-wider">Products</p>
                {results.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductClick(product.slug)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-cream-100 transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-cream-200 shrink-0">
                      {product.images[0] && (
                        <Image
                          src={product.images[0].src}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-charcoal line-clamp-1"
                         dangerouslySetInnerHTML={{ __html: product.name }} />
                      <p className="text-xs text-wood-600 font-semibold">
                        {formatPrice(product.sale_price || product.price)}
                      </p>
                    </div>
                  </button>
                ))}
                <button
                  onClick={() => handleSubmit(query)}
                  className="w-full text-center py-2 text-sm text-wood-600 font-semibold hover:bg-cream-100 rounded-lg transition-colors mt-1"
                >
                  See all results for "{query}"
                </button>
              </div>
            )}

            {/* No results */}
            {!isLoading && query.length >= 2 && results.length === 0 && (
              <div className="p-4 text-sm text-charcoal/50 text-center">
                No products found for "{query}"
              </div>
            )}

            {/* Recent + Trending */}
            {!query && (
              <div className="p-2">
                {recentSearches.length > 0 && (
                  <>
                    <p className="px-3 py-1 text-xs font-semibold text-charcoal/40 uppercase tracking-wider flex items-center gap-1">
                      <Clock size={11} /> Recent
                    </p>
                    {recentSearches.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSubmit(s)}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm text-charcoal hover:bg-cream-100 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                    <div className="my-2 border-t border-cream-300" />
                  </>
                )}
                <p className="px-3 py-1 text-xs font-semibold text-charcoal/40 uppercase tracking-wider flex items-center gap-1">
                  <TrendingUp size={11} /> Trending
                </p>
                {trending.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSubmit(s)}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-charcoal hover:bg-cream-100 transition-colors flex items-center gap-2"
                  >
                    <TrendingUp size={12} className="text-wood-600" /> {s}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
