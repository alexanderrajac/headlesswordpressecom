"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import {
  ShoppingCart, Heart, Share2, Star, ChevronLeft, ChevronRight,
  Shield, Truck, RefreshCw, Check, ZoomIn, Minus, Plus
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { getProductReviews, formatPrice, getDiscountPercent } from "@/lib/woocommerce";
import type { WCProduct, WCReview } from "@/types";
import toast from "react-hot-toast";

interface Props {
  product: WCProduct;
}

export default function ProductDetailClient({ product }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<WCReview[]>([]);
  const [activeTab, setActiveTab] = useState<"description" | "reviews" | "shipping">("description");
  const [isSticky, setIsSticky] = useState(false);
  const stickyRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCartStore();

  const discount = getDiscountPercent(product.regular_price, product.sale_price);
  const isOutOfStock = product.stock_status === "outofstock";
  const rating = parseFloat(product.average_rating);

  useEffect(() => {
    getProductReviews(product.id).then(setReviews).catch(() => {});
  }, [product.id]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsSticky(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-100px 0px 0px 0px" }
    );
    if (stickyRef.current) observer.observe(stickyRef.current);
    return () => observer.disconnect();
  }, []);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    for (let i = 0; i < quantity; i++) addItem(product);
    toast.success("Added to cart!");
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <nav className="flex items-center gap-2 text-sm text-charcoal/50">
          <Link href="/" className="hover:text-wood-600">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-wood-600">Products</Link>
          {product.categories[0] && (
            <>
              <span>/</span>
              <Link href={`/products?category=${product.categories[0].slug}`} className="hover:text-wood-600">
                {product.categories[0].name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-charcoal line-clamp-1" dangerouslySetInnerHTML={{ __html: product.name }} />
        </nav>
      </div>

      {/* Main content */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16">
          {/* Gallery */}
          <div className="space-y-4 product-gallery">
            {/* Main image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-cream-100 cursor-zoom-in">
              {product.images[selectedImage] ? (
                <Zoom>
                  <Image
                    src={product.images[selectedImage].src}
                    alt={product.images[selectedImage].alt || product.name}
                    width={1000}
                    height={1000}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover w-full h-full"
                    priority
                  />
                </Zoom>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl">🪵</div>
              )}

              {/* Zoom indicator */}
              <div className="absolute top-3 right-3 bg-white/80 rounded-full p-2 text-charcoal/60 pointer-events-none">
                <ZoomIn size={16} />
              </div>

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {discount > 0 && (
                  <span className="badge bg-red-500 text-white">-{discount}% OFF</span>
                )}
                {product.featured && (
                  <span className="badge bg-wood-600 text-cream">Featured</span>
                )}
              </div>

              {/* Navigation arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((i) => (i > 0 ? i - 1 : product.images.length - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setSelectedImage((i) => (i < product.images.length - 1 ? i + 1 : 0))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-colors ${
                      selectedImage === i ? "border-wood-600" : "border-cream-300 hover:border-wood-600/50"
                    }`}
                  >
                    <Image src={img.src} alt={img.alt || ""} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="space-y-5">
            {/* Category */}
            {product.categories[0] && (
              <Link
                href={`/products?category=${product.categories[0].slug}`}
                className="text-xs font-semibold text-wood-600 uppercase tracking-widest hover:underline"
              >
                {product.categories[0].name}
              </Link>
            )}

            {/* Name */}
            <h1
              className="font-display text-2xl sm:text-3xl font-bold text-charcoal leading-tight"
              dangerouslySetInnerHTML={{ __html: product.name }}
            />

            {/* Rating */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={16}
                    className={s <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-300"}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-charcoal">{product.average_rating}</span>
              <span className="text-sm text-charcoal/50">({product.rating_count} reviews)</span>
              {product.total_sales > 0 && (
                <span className="text-xs text-charcoal/50">• {product.total_sales} sold</span>
              )}
            </div>

            {/* Price */}
            <div ref={stickyRef} className="flex items-center gap-4 flex-wrap">
              <span className="font-display font-bold text-4xl text-charcoal price-tag">
                {formatPrice(product.sale_price || product.price)}
              </span>
              {product.on_sale && product.regular_price && (
                <>
                  <span className="text-xl text-charcoal/40 line-through price-tag">
                    {formatPrice(product.regular_price)}
                  </span>
                  <span className="badge bg-green-100 text-green-700 font-semibold">
                    Save {formatPrice(parseFloat(product.regular_price) - parseFloat(product.sale_price))}
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-charcoal/50">Inclusive of all taxes. Free shipping on orders above ₹999.</p>

            {/* Short description */}
            {product.short_description && (
              <div
                className="text-sm text-charcoal/70 leading-relaxed border-l-2 border-wood-600 pl-4"
                dangerouslySetInnerHTML={{ __html: product.short_description }}
              />
            )}

            {/* Stock */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isOutOfStock ? "bg-red-500" : "bg-green-500"}`} />
              <span className={`text-sm font-medium ${isOutOfStock ? "text-red-600" : "text-green-600"}`}>
                {isOutOfStock
                  ? "Out of Stock"
                  : product.stock_quantity !== null && product.stock_quantity !== undefined && product.stock_quantity <= 10
                  ? `Only ${product.stock_quantity} left in stock!`
                  : "In Stock"}
              </span>
            </div>

            {/* Quantity + Add to cart */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center border-2 border-cream-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-11 h-11 flex items-center justify-center hover:bg-cream-200 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-11 h-11 flex items-center justify-center hover:bg-cream-200 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 min-w-[200px] flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold text-base transition-all active:scale-95 ${
                  isOutOfStock
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-wood-600 text-cream hover:bg-wood-700 shadow-wood hover:shadow-wood-lg"
                }`}
              >
                <ShoppingCart size={18} />
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </button>

              <button className="w-11 h-11 border-2 border-cream-300 rounded-lg flex items-center justify-center hover:border-wood-600 hover:text-wood-600 transition-colors">
                <Heart size={18} />
              </button>
              <button
                onClick={() => { navigator.share?.({ title: product.name, url: window.location.href }); }}
                className="w-11 h-11 border-2 border-cream-300 rounded-lg flex items-center justify-center hover:border-wood-600 hover:text-wood-600 transition-colors"
              >
                <Share2 size={18} />
              </button>
            </div>

            {/* Delivery info */}
            <div className="bg-cream-100 rounded-xl p-4 space-y-3">
              {[
                { icon: Truck, text: "Free delivery on orders above ₹999" },
                { icon: Shield, text: "1 year warranty on all products" },
                { icon: RefreshCw, text: "7-day hassle-free returns" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm text-charcoal/70">
                  <Icon size={16} className="text-wood-600 shrink-0" />
                  {text}
                </div>
              ))}
            </div>

            {/* Attributes */}
            {product.attributes.length > 0 && (
              <div className="space-y-3">
                {product.attributes.map((attr) => (
                  <div key={attr.id}>
                    <p className="text-sm font-semibold text-charcoal mb-2">{attr.name}</p>
                    <div className="flex flex-wrap gap-2">
                      {attr.options.map((opt) => (
                        <span
                          key={opt}
                          className="px-3 py-1 border border-cream-300 rounded-lg text-sm text-charcoal hover:border-wood-600 cursor-pointer transition-colors"
                        >
                          {opt}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tabs: Description, Reviews, Shipping */}
        <div className="mt-12 border-t border-cream-300">
          <div className="flex gap-0 border-b border-cream-300 overflow-x-auto no-scrollbar">
            {(["description", "reviews", "shipping"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-4 text-sm font-semibold capitalize whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-wood-600 text-wood-600"
                    : "border-transparent text-charcoal/60 hover:text-charcoal"
                }`}
              >
                {tab} {tab === "reviews" && `(${reviews.length})`}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === "description" && (
              <div
                className="prose max-w-none text-charcoal/80 leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1"
                dangerouslySetInnerHTML={{ __html: product.description || "No description available." }}
              />
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6 max-w-2xl">
                {reviews.length === 0 ? (
                  <p className="text-charcoal/50">No reviews yet. Be the first to review this product!</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="border-b border-cream-300 pb-6">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-charcoal">{review.reviewer}</p>
                          <div className="flex items-center gap-1 mt-1">
                            {[1,2,3,4,5].map((s) => (
                              <Star key={s} size={12} className={s <= review.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"} />
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {review.verified && (
                            <span className="badge bg-green-100 text-green-700 text-xs">
                              <Check size={10} className="mr-1" />Verified
                            </span>
                          )}
                          <span className="text-xs text-charcoal/40">
                            {new Date(review.date_created).toLocaleDateString("en-IN")}
                          </span>
                        </div>
                      </div>
                      <div
                        className="text-sm text-charcoal/70 mt-2"
                        dangerouslySetInnerHTML={{ __html: review.review }}
                      />
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="max-w-2xl space-y-4 text-sm text-charcoal/70 leading-relaxed">
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { title: "Standard Delivery", desc: "5-7 business days • ₹99 (Free above ₹999)" },
                    { title: "Express Delivery", desc: "2-3 business days • ₹249" },
                    { title: "Returns", desc: "7-day no questions asked returns" },
                    { title: "Warranty", desc: "1 year manufacturing warranty" },
                  ].map(({ title, desc }) => (
                    <div key={title} className="bg-cream-100 rounded-xl p-4">
                      <p className="font-semibold text-charcoal mb-1">{title}</p>
                      <p>{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky bottom bar */}
      <AnimatePresence>
        {isSticky && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-cream-300 shadow-lg px-4 py-3"
          >
            <div className="max-w-[1440px] mx-auto flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-charcoal line-clamp-1" dangerouslySetInnerHTML={{ __html: product.name }} />
                <p className="text-wood-600 font-bold">{formatPrice(product.sale_price || product.price)}</p>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 ${
                  isOutOfStock ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-wood-600 text-cream hover:bg-wood-700"
                }`}
              >
                <ShoppingCart size={16} />
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
