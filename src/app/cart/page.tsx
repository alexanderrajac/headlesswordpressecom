"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Minus, Plus, ShoppingCart, ArrowRight, Tag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/price";

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [coupon, setCoupon] = useState("");

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const total = getTotalPrice();
  const shipping = total >= 999 ? 0 : 99;
  const grandTotal = total + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-24 h-24 rounded-full bg-cream-200 flex items-center justify-center mx-auto mb-6">
            <ShoppingCart size={40} className="text-wood-600" />
          </div>
          <h1 className="font-display text-3xl font-bold text-charcoal mb-3">Your cart is empty</h1>
          <p className="text-charcoal/50 mb-8">Looks like you haven't added anything yet. Let's fix that!</p>
          <Link href="/products" className="btn-primary inline-flex items-center gap-2">
            Continue Shopping <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-charcoal mb-6">
        Shopping Cart <span className="text-charcoal/40 font-body font-normal text-xl">({getTotalItems()} items)</span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                className="bg-white rounded-2xl p-4 shadow-card flex gap-4"
              >
                <Link href={`/products/${item.product.slug}`}>
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-cream-100 shrink-0">
                    {item.product.images[0] ? (
                      <Image src={item.product.images[0].src} alt={item.product.name} fill className="object-cover" />
                    ) : <div className="w-full h-full flex items-center justify-center text-3xl">🪵</div>}
                  </div>
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/products/${item.product.slug}`}>
                      <h3
                        className="font-semibold text-charcoal hover:text-wood-600 transition-colors line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: item.product.name }}
                      />
                    </Link>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 text-charcoal/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {item.product.categories[0] && (
                    <p className="text-xs text-charcoal/40 mt-1">{item.product.categories[0].name}</p>
                  )}

                  <div className="flex items-end justify-between mt-3 flex-wrap gap-2">
                    <div className="flex items-center border-2 border-cream-300 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-cream-200 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center font-semibold text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-cream-200 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-charcoal">{formatPrice(item.price * item.quantity)}</p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-charcoal/40">{formatPrice(item.price)} each</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="flex items-center justify-between">
            <button onClick={clearCart} className="text-sm text-red-500 hover:underline">
              Clear Cart
            </button>
            <Link href="/products" className="text-sm text-wood-600 hover:underline font-semibold">
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order summary */}
        <div className="space-y-4">
          {/* Coupon */}
          <div className="bg-white rounded-2xl p-5 shadow-card">
            <h3 className="font-semibold text-charcoal mb-3 flex items-center gap-2">
              <Tag size={16} className="text-wood-600" />
              Apply Coupon
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Enter coupon code"
                className="input-field py-2 text-sm"
              />
              <button className="btn-secondary py-2 px-4 text-sm whitespace-nowrap">Apply</button>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-2xl p-5 shadow-card sticky top-24">
            <h3 className="font-display font-bold text-lg text-charcoal mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-charcoal/60">Subtotal ({getTotalItems()} items)</span>
                <span className="font-semibold">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal/60">Shipping</span>
                <span className={`font-semibold ${shipping === 0 ? "text-green-600" : ""}`}>
                  {shipping === 0 ? "FREE" : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal/60">Tax (GST)</span>
                <span className="font-semibold text-charcoal/60">Included</span>
              </div>
              {total < 999 && (
                <p className="text-xs text-orange-500 bg-orange-50 rounded-lg px-3 py-2">
                  Add {formatPrice(999 - total)} more for free shipping!
                </p>
              )}
              <div className="border-t border-cream-300 pt-3 flex justify-between">
                <span className="font-bold text-charcoal">Total</span>
                <span className="font-display font-bold text-2xl text-charcoal">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="btn-primary w-full flex items-center justify-center gap-2 mt-5 text-base py-4"
            >
              Proceed to Checkout
              <ArrowRight size={18} />
            </Link>

            <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
              {["UPI", "VISA", "MC", "RuPay"].map((p) => (
                <span key={p} className="px-2 py-1 bg-cream-100 rounded text-xs text-charcoal/50">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
