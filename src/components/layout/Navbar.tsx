"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Search, Menu, X, ChevronDown, Heart, User, MapPin } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import SearchAutocomplete from "@/components/ui/SearchAutocomplete";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { getTotalItems, openDrawer } = useCartStore();
  const { isLoggedIn, user } = useAuthStore();
  const totalItems = getTotalItems();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "All Products", href: "/products" },
    { label: "Wooden Furnitures", href: "/products?category=wooden" },
    { label: "Hardwares", href: "/products?category=hardwares" },
    { label: "Timbers", href: "/products?category=timbers" },
    { label: "Raw Wood", href: "/products?category=raw-wood" },
    { label: "UPVC", href: "/products?category=upvc" },
    { label: "Innovation", href: "/products?category=innovation" },
    { label: "Services", href: "/products?category=services" },
    { label: "Firewood", href: "/products?category=firewood-viragu" },
  ];

  return (
    <>
      {/* Top strip */}
      <div className="bg-charcoal text-cream-100 text-xs py-2 px-4 text-center">
        <span>🚚 Free shipping on orders above ₹999 | </span>
        <span>📞 +91 82486 51695 | </span>
        <span>Made in India 🇮🇳</span>
      </div>

      {/* Main navbar */}
      <nav
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md"
            : "bg-cream-100"
        }`}
      >
        {/* Primary row */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 bg-wood-600 rounded-lg flex items-center justify-center">
                <span className="text-cream font-display font-bold text-sm">CB</span>
              </div>
              <span className="font-display font-bold text-xl text-charcoal hidden sm:block">
                Carpenter<span className="text-wood-600">Bullet</span>
              </span>
            </Link>

            {/* Search bar - desktop */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-4">
              <SearchAutocomplete />
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1 sm:gap-3">
              {/* Mobile search toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-cream-200 transition-colors"
              >
                <Search size={20} className="text-charcoal" />
              </button>

              <Link href={isLoggedIn ? "/account/profile" : "/account"} className="hidden sm:flex items-center gap-1 p-2 rounded-lg hover:bg-cream-200 transition-colors">
                {isLoggedIn ? (
                  <div className="w-6 h-6 rounded-full bg-wood-600 flex items-center justify-center">
                    <span className="text-cream text-xs font-bold">{user?.firstName?.[0]}</span>
                  </div>
                ) : (
                  <User size={20} className="text-charcoal" />
                )}
                <span className="text-sm font-medium text-charcoal hidden lg:block">
                  {isLoggedIn ? user?.firstName : "Account"}
                </span>
              </Link>

              <Link href="/wishlist" className="hidden sm:flex p-2 rounded-lg hover:bg-cream-200 transition-colors">
                <Heart size={20} className="text-charcoal" />
              </Link>

              {/* Cart */}
              <button
                onClick={openDrawer}
                className="relative flex items-center gap-2 bg-wood-600 text-cream px-3 sm:px-4 py-2 rounded-lg hover:bg-wood-700 transition-colors"
              >
                <ShoppingCart size={18} />
                <span className="hidden sm:block text-sm font-semibold">Cart</span>
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                  >
                    {totalItems > 99 ? "99+" : totalItems}
                  </motion.span>
                )}
              </button>

              {/* Mobile menu */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-cream-200 transition-colors"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Mobile search */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden pb-3 overflow-hidden"
              >
                <SearchAutocomplete onClose={() => setIsSearchOpen(false)} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Category nav */}
          <div className="hidden md:flex items-center gap-1 h-10 border-t border-cream-300 overflow-x-auto no-scrollbar">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="whitespace-nowrap px-3 py-1 text-sm text-charcoal/70 hover:text-wood-600 hover:bg-cream-200 rounded-md transition-all duration-150 font-medium"
              >
                {link.label}
              </Link>
            ))}
            <div className="ml-auto flex items-center gap-1 text-xs text-charcoal/50">
              <MapPin size={12} />
              <span>Deliver to India</span>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-cream-300 bg-white overflow-hidden"
            >
              <div className="px-4 py-3 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center px-3 py-2.5 rounded-lg text-charcoal hover:bg-cream-200 hover:text-wood-600 font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-cream-300 pt-3 mt-3 flex items-center gap-4">
                  <Link href={isLoggedIn ? "/account/profile" : "/account"} className="flex items-center gap-2 text-sm text-charcoal/70">
                    <User size={16} /> {isLoggedIn ? user?.firstName : "Account"}
                  </Link>
                  <Link href="/wishlist" className="flex items-center gap-2 text-sm text-charcoal/70">
                    <Heart size={16} /> Wishlist
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
