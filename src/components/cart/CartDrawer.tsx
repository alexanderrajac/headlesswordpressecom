"use client";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Minus, Plus, Trash2, ArrowRight, Package } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/price";

export default function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCartStore();
  const total = getTotalPrice();
  const count = getTotalItems();

  // Lock body scroll when open
  useEffect(() => {
    if (isDrawerOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isDrawerOpen]);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-charcoal/50 drawer-backdrop z-50"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-cream-300">
              <div className="flex items-center gap-2">
                <ShoppingCart size={20} className="text-wood-600" />
                <h2 className="font-display font-bold text-lg text-charcoal">
                  My Cart
                  {count > 0 && (
                    <span className="ml-2 text-sm font-body font-normal text-charcoal/50">
                      ({count} {count === 1 ? "item" : "items"})
                    </span>
                  )}
                </h2>
              </div>
              <button
                onClick={closeDrawer}
                className="p-2 rounded-lg hover:bg-cream-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full gap-4 text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-cream-200 flex items-center justify-center">
                    <Package size={32} className="text-wood-600" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-lg text-charcoal">Your cart is empty</p>
                    <p className="text-sm text-charcoal/50 mt-1">Add some beautiful wood pieces!</p>
                  </div>
                  <button
                    onClick={closeDrawer}
                    className="btn-primary mt-2"
                  >
                    Start Shopping
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex gap-3 bg-cream-50 rounded-xl p-3"
                      >
                        {/* Image */}
                        <Link
                          href={`/products/${item.product.slug}`}
                          onClick={closeDrawer}
                          className="relative w-20 h-20 rounded-lg overflow-hidden bg-cream-200 shrink-0"
                        >
                          {item.product.images[0] ? (
                            <Image
                              src={item.product.images[0].src}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">🪵</div>
                          )}
                        </Link>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.product.slug}`}
                            onClick={closeDrawer}
                            className="text-sm font-semibold text-charcoal line-clamp-2 hover:text-wood-600 transition-colors"
                            dangerouslySetInnerHTML={{ __html: item.product.name }}
                          />
                          <p className="text-wood-600 font-bold text-sm mt-1">
                            {formatPrice(item.price)}
                          </p>

                          <div className="flex items-center justify-between mt-2">
                            {/* Quantity */}
                            <div className="flex items-center gap-2 bg-white rounded-lg border border-cream-300">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-7 h-7 flex items-center justify-center hover:bg-cream-200 rounded-l-lg transition-colors text-charcoal"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center hover:bg-cream-200 rounded-r-lg transition-colors text-charcoal"
                              >
                                <Plus size={12} />
                              </button>
                            </div>

                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-1.5 text-charcoal/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-cream-300 px-5 py-4 space-y-3 bg-white">
                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-charcoal/60">Subtotal</span>
                  <span className="font-bold text-charcoal">{formatPrice(total)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-charcoal/60">Shipping</span>
                  <span className="text-sm font-semibold text-green-600">
                    {total >= 999 ? "FREE" : formatPrice(99)}
                  </span>
                </div>
                {total < 999 && (
                  <p className="text-xs text-charcoal/50 bg-cream-100 rounded-lg px-3 py-2">
                    Add {formatPrice(999 - total)} more for free shipping 🚚
                  </p>
                )}
                <div className="flex items-center justify-between border-t border-cream-300 pt-3">
                  <span className="font-semibold text-charcoal">Total</span>
                  <span className="font-display font-bold text-xl text-charcoal">
                    {formatPrice(total + (total >= 999 ? 0 : 99))}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  onClick={closeDrawer}
                  className="btn-primary w-full flex items-center justify-center gap-2 text-center"
                >
                  Proceed to Checkout
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/cart"
                  onClick={closeDrawer}
                  className="btn-secondary w-full text-center block"
                >
                  View Full Cart
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
