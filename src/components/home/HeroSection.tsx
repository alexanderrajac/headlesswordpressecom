"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-charcoal via-charcoal-dark to-[#1a0f08] overflow-hidden min-h-[85vh] flex items-center">
      {/* Wood texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 2px,
            rgba(139,94,60,0.3) 2px,
            rgba(139,94,60,0.3) 4px
          )`,
        }}
      />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-wood-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left content */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 bg-wood-600/20 text-wood-400 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-wood-600/30">
              <Star size={14} className="fill-wood-400" />
              Premium Handcrafted Since 1998
            </span>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-cream-100 leading-tight mb-6">
              Crafted with{" "}
              <span className="text-wood-400">Wood,</span>
              <br />
              Built for{" "}
              <span className="relative inline-block">
                Life
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-wood-600 rounded-full" />
              </span>
            </h1>

            <p className="text-cream-100/60 text-lg leading-relaxed mb-8 max-w-lg">
              Discover our collection of premium handcrafted wooden furniture and decor. Each piece tells a story of skilled artisanship, sustainable materials, and timeless design.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link href="/products" className="btn-primary flex items-center gap-2 text-base px-8 py-4">
                Shop Now
                <ArrowRight size={18} />
              </Link>
              <Link href="/products?featured=true" className="border border-cream-100/30 text-cream-100 px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors text-base">
                View Catalogue
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 mt-10 pt-8 border-t border-white/10">
              {[
                { value: "5000+", label: "Happy Customers" },
                { value: "500+", label: "Unique Designs" },
                { value: "4.8★", label: "Average Rating" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="font-display font-bold text-2xl text-cream-100">{value}</p>
                  <p className="text-xs text-cream-100/50 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right - decorative */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="hidden lg:flex items-center justify-center"
        >
          <div className="relative w-96 h-96">
            {/* Decorative circles */}
            <div className="absolute inset-0 rounded-full border border-wood-600/20 animate-spin" style={{ animationDuration: "20s" }} />
            <div className="absolute inset-8 rounded-full border border-wood-600/30 animate-spin" style={{ animationDuration: "15s", animationDirection: "reverse" }} />
            <div className="absolute inset-16 rounded-full border border-wood-600/40" />

            {/* Center piece */}
            <div className="absolute inset-20 rounded-full bg-wood-600/20 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <span className="text-6xl">🪵</span>
                <p className="text-cream-100/80 font-display font-semibold mt-2 text-sm">Pure Craft</p>
              </div>
            </div>

            {/* Floating badges */}
            {[
              { label: "100% Natural", deg: -30, dist: 160 },
              { label: "Handmade", deg: 90, dist: 160 },
              { label: "Eco Friendly", deg: 210, dist: 160 },
            ].map(({ label, deg, dist }) => {
              const rad = (deg * Math.PI) / 180;
              const x = Math.cos(rad) * dist;
              const y = Math.sin(rad) * dist;
              return (
                <motion.div
                  key={label}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 3, delay: deg / 360 }}
                  className="absolute bg-wood-600 text-cream px-3 py-1.5 rounded-full text-xs font-semibold shadow-wood whitespace-nowrap"
                  style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, transform: "translate(-50%, -50%)" }}
                >
                  {label}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
