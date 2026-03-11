"use client";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  { name: "Priya Sharma", city: "Mumbai", rating: 5, text: "Absolutely love my new coffee table! The craftsmanship is exceptional and it arrived well-packaged. Will definitely order again.", avatar: "P" },
  { name: "Rahul Verma", city: "Delhi", rating: 5, text: "The wooden bookshelf is stunning. Quality is top-notch and the finish is perfect. Customer service was also very helpful.", avatar: "R" },
  { name: "Anita Patel", city: "Bangalore", rating: 4, text: "Beautiful pieces, fast delivery. The dining chair set transformed our home. Worth every rupee!", avatar: "A" },
  { name: "Vikram Singh", city: "Pune", rating: 5, text: "My third purchase from CarpenterBullet. Consistent quality every time. The wall art is absolutely gorgeous!", avatar: "V" },
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 bg-charcoal">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-wood-400 font-semibold text-sm uppercase tracking-widest mb-2">Testimonials</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-cream-100">
            What Our Customers Say
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-wood-600/40 transition-colors"
            >
              <Quote size={20} className="text-wood-400 mb-3" />
              <p className="text-cream-100/70 text-sm leading-relaxed mb-4">{t.text}</p>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} size={12} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-wood-600 flex items-center justify-center text-cream font-bold text-sm">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-cream-100 font-semibold text-sm">{t.name}</p>
                  <p className="text-cream-100/40 text-xs">{t.city}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
