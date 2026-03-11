import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-charcoal text-cream-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-wood-600 rounded-lg flex items-center justify-center">
                <span className="text-cream font-display font-bold">CB</span>
              </div>
              <span className="font-display font-bold text-xl text-cream-100">
                Carpenter<span className="text-wood-400">Bullet</span>
              </span>
            </div>
            <p className="text-cream-100/60 text-sm leading-relaxed mb-5">
              Handcrafted with love. Premium wood furniture and decor for your home. Made in India, delivered to your doorstep.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Facebook, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Youtube, href: "#" },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-wood-600 transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-display font-semibold text-cream-100 mb-4">Shop</h3>
            <ul className="space-y-2">
              {[
                { label: "All Products", href: "/products" },
                { label: "Wooden Furnitures", href: "/products?category=wooden" },
                { label: "Hardwares", href: "/products?category=hardwares" },
                { label: "Timbers", href: "/products?category=timbers" },
                { label: "Raw Wood", href: "/products?category=raw-wood" },
                { label: "UPVC", href: "/products?category=upvc" },
                { label: "Innovation", href: "/products?category=innovation" },
                { label: "New Arrivals", href: "/products?orderby=date" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream-100/60 text-sm hover:text-wood-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-display font-semibold text-cream-100 mb-4">Help & Support</h3>
            <ul className="space-y-2">
              {[
                { label: "My Account", href: "/account" },
                { label: "Track Your Order", href: "/track-order" },
                { label: "Returns & Refunds", href: "/returns" },
                { label: "Shipping Policy", href: "/shipping" },
                { label: "FAQs", href: "/faq" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms & Conditions", href: "/terms" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream-100/60 text-sm hover:text-wood-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-cream-100 mb-4">Contact Us</h3>
            <div className="space-y-3">
              <a href="mailto:carpenterbullet.in@gmail.com" className="flex items-start gap-3 text-cream-100/60 text-sm hover:text-wood-400 transition-colors">
                <Mail size={16} className="mt-0.5 shrink-0" />
                carpenterbullet.in@gmail.com
              </a>
              <a href="tel:+918248651695" className="flex items-center gap-3 text-cream-100/60 text-sm hover:text-wood-400 transition-colors">
                <Phone size={16} className="shrink-0" />
                +91 82486 51695
              </a>
              <div className="flex items-start gap-3 text-cream-100/60 text-sm">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                <span>CarpenterBullet, Tamil Nadu, India</span>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs text-cream-100/50 mb-2">We accept</p>
              <div className="flex items-center gap-2 flex-wrap">
                {["UPI", "VISA", "Mastercard", "RuPay", "NetBanking"].map((m) => (
                  <span
                    key={m}
                    className="px-2 py-1 bg-white/10 rounded text-xs text-cream-100/70"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-cream-100/40 text-sm">
            © {new Date().getFullYear()} CarpenterBullet. All rights reserved.
          </p>
          <p className="text-cream-100/40 text-sm">
            Proudly Made in India 🇮🇳
          </p>
        </div>
      </div>
    </footer>
  );
}
