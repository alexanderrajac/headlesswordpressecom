"use client";
import Link from "next/link";
import { motion } from "framer-motion";

const categories = [
  { name: "Wooden Furnitures", slug: "wooden", emoji: "🪑", desc: "Chairs, tables & more", color: "from-amber-50 to-orange-50" },
  { name: "Hardwares", slug: "hardwares", emoji: "🔩", desc: "Nails, screws & tools", color: "from-slate-50 to-gray-100" },
  { name: "Timbers", slug: "timbers", emoji: "🪵", desc: "Quality timber wood", color: "from-yellow-50 to-amber-50" },
  { name: "Raw Wood", slug: "raw-wood", emoji: "🌳", desc: "Unprocessed raw wood", color: "from-green-50 to-emerald-50" },
  { name: "UPVC", slug: "upvc", emoji: "🏠", desc: "Doors & windows", color: "from-sky-50 to-blue-50" },
  { name: "Innovation", slug: "innovation", emoji: "💡", desc: "Creative wood designs", color: "from-purple-50 to-violet-50" },
  { name: "Services", slug: "services", emoji: "🛠️", desc: "Carpentry services", color: "from-rose-50 to-pink-50" },
  { name: "Firewood", slug: "firewood-viragu", emoji: "🔥", desc: "Firewood & viragu", color: "from-red-50 to-orange-50" },
];

export default function CategorySection() {
  return (
    <section className="py-12 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-wood-600 font-semibold text-sm uppercase tracking-widest mb-1">Browse</p>
        <h2 className="section-title">Shop by Category</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <Link
              href={`/products?category=${cat.slug}`}
              className={`group flex flex-col items-center text-center p-5 rounded-2xl bg-gradient-to-br ${cat.color} border border-cream-300 hover:border-wood-600/30 hover:shadow-wood transition-all duration-300 hover:-translate-y-1`}
            >
              <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">
                {cat.emoji}
              </span>
              <h3 className="font-semibold text-charcoal text-sm">{cat.name}</h3>
              <p className="text-xs text-charcoal/50 mt-0.5">{cat.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
