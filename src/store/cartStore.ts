"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, WCProduct } from "@/types";
import { formatPrice } from "@/lib/price";

interface CartStore {
  items: CartItem[];
  isDrawerOpen: boolean;
  addItem: (product: WCProduct, quantity?: number) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  toggleDrawer: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getFormattedTotal: () => string;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          const price = parseFloat(product.sale_price || product.price || "0");
          return {
            items: [...state.items, { id: product.id, product, quantity, price }],
          };
        });
        get().openDrawer();
      },

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        }));
      },

      clearCart: () => set({ items: [] }),

      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),

      getTotalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

      getFormattedTotal: () => formatPrice(get().getTotalPrice()),
    }),
    {
      name: "carpenterbullet-cart",
      skipHydration: true,
    }
  )
);
