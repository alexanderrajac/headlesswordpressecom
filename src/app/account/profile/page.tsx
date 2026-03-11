"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Package, LogOut, Clock, ChevronRight, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { getCustomerOrders } from "@/lib/auth";
import { formatPrice } from "@/lib/woocommerce";
import type { WCCustomerOrder } from "@/lib/auth";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  "on-hold": "bg-orange-100 text-orange-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
  failed: "bg-red-100 text-red-800",
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoggedIn, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<WCCustomerOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && !isLoggedIn) {
      router.push("/account");
    }
  }, [mounted, isLoggedIn, router]);

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    setLoadingOrders(true);
    try {
      const data = await getCustomerOrders(user.id);
      setOrders(data);
    } catch {
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  }, [user]);

  useEffect(() => {
    if (mounted && isLoggedIn && user) {
      fetchOrders();
    }
  }, [mounted, isLoggedIn, user, fetchOrders]);

  if (!mounted || !isLoggedIn || !user) return null;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-wood-600 flex items-center justify-center">
            <span className="text-cream font-display font-bold text-2xl">
              {user.firstName[0]}{user.lastName[0]}
            </span>
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-charcoal">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-charcoal/50 text-sm">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors text-sm font-semibold"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </motion.div>

      {/* Info cards */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon: Mail, label: "Email", value: user.email },
          { icon: Phone, label: "Phone", value: user.phone || "Not provided" },
          { icon: Package, label: "Orders", value: loadingOrders ? "Loading..." : `${orders.length} orders` },
        ].map(({ icon: Icon, label, value }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-5 shadow-card"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cream-200 rounded-xl flex items-center justify-center">
                <Icon size={18} className="text-wood-600" />
              </div>
              <div>
                <p className="text-xs text-charcoal/50">{label}</p>
                <p className="font-semibold text-sm text-charcoal truncate">{value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Orders section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="font-display font-bold text-xl text-charcoal mb-4 flex items-center gap-2">
          <Package size={20} className="text-wood-600" />
          Recent Orders
        </h2>

        {loadingOrders ? (
          <div className="bg-white rounded-2xl p-10 shadow-card text-center">
            <Loader2 size={24} className="animate-spin mx-auto text-wood-600 mb-2" />
            <p className="text-charcoal/50 text-sm">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 shadow-card text-center">
            <span className="text-5xl">📦</span>
            <p className="font-semibold text-charcoal mt-4">No orders yet</p>
            <p className="text-charcoal/50 text-sm mt-1">Start shopping to see your orders here!</p>
            <button
              onClick={() => router.push("/products")}
              className="btn-primary mt-4 inline-flex items-center gap-2"
            >
              Shop Now <ChevronRight size={16} />
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-5 shadow-card hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-charcoal">Order #{order.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                      statusColors[order.status] || "bg-gray-100 text-gray-800"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <span className="font-display font-bold text-wood-600">
                    {formatPrice(order.total)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-charcoal/50">
                  <Clock size={12} />
                  {new Date(order.date_created).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                  <span className="mx-1">•</span>
                  {order.line_items.length} item{order.line_items.length !== 1 ? "s" : ""}
                </div>
                {order.line_items.length > 0 && (
                  <div className="mt-2 text-sm text-charcoal/60">
                    {order.line_items.map((item, i) => (
                      <span key={i}>
                        {item.name} ×{item.quantity}
                        {i < order.line_items.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
