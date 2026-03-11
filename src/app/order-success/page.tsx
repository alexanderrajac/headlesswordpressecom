"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Package, Truck, Home, ArrowRight, Phone, Mail } from "lucide-react";
import confetti from "canvas-confetti";

export default function OrderSuccessPage({
  searchParams,
}: {
  searchParams: { orderId?: string; orderKey?: string };
}) {
  const { orderId, orderKey } = searchParams;
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Fire confetti
    const duration = 3000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#8B5E3C", "#F5F1E8", "#2F2F2F"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#8B5E3C", "#F5F1E8", "#2F2F2F"],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    setTimeout(() => frame(), 500);
  }, []);

  const steps = [
    { icon: CheckCircle, label: "Order Placed", desc: "We've received your order", done: true },
    { icon: Package, label: "Processing", desc: "Verifying payment & packing", done: false },
    { icon: Truck, label: "Shipped", desc: "On the way to you", done: false },
    { icon: Home, label: "Delivered", desc: "Enjoy your furniture!", done: false },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="text-center mb-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle size={48} className="text-green-600" />
        </motion.div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold text-charcoal mb-3">
          Order Confirmed! 🎉
        </h1>
        <p className="text-charcoal/60 text-lg">
          Thank you for shopping with CarpenterBullet!
        </p>

        {orderId && (
          <div className="inline-flex items-center gap-2 bg-wood-600/10 text-wood-600 px-4 py-2 rounded-full mt-4 font-semibold">
            Order #{orderId}
          </div>
        )}
      </motion.div>

      {/* Order info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-6 shadow-card mb-6"
      >
        <h2 className="font-display font-bold text-xl text-charcoal mb-5">What Happens Next?</h2>

        <div className="space-y-0">
          {steps.map((s, i) => (
            <div key={s.label} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    s.done ? "bg-green-100 text-green-600" : "bg-cream-200 text-charcoal/40"
                  }`}
                >
                  <s.icon size={18} />
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-0.5 h-8 mt-1 ${s.done ? "bg-green-300" : "bg-cream-300"}`} />
                )}
              </div>
              <div className="pb-6">
                <p className={`font-semibold ${s.done ? "text-green-700" : "text-charcoal/60"}`}>
                  {s.label}
                </p>
                <p className="text-sm text-charcoal/50">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Payment verification notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6"
      >
        <p className="font-semibold text-amber-800 mb-2">⏳ Payment Verification</p>
        <p className="text-sm text-amber-700">
          Your UPI payment is being verified. This usually takes 2-4 hours. You'll receive an email confirmation once verified. If you face any issues, contact us with your Order ID.
        </p>
      </motion.div>

      {/* Contact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl p-6 shadow-card mb-8"
      >
        <h3 className="font-semibold text-charcoal mb-4">Need Help?</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <a href="tel:+918248651695" className="flex items-center gap-3 p-3 bg-cream-100 rounded-xl hover:bg-cream-200 transition-colors">
            <Phone size={18} className="text-wood-600" />
            <div>
              <p className="text-xs text-charcoal/50">Call Us</p>
              <p className="text-sm font-semibold">+91 82486 51695</p>
            </div>
          </a>
          <a href="mailto:carpenterbullet.in@gmail.com" className="flex items-center gap-3 p-3 bg-cream-100 rounded-xl hover:bg-cream-200 transition-colors">
            <Mail size={18} className="text-wood-600" />
            <div>
              <p className="text-xs text-charcoal/50">Email Us</p>
              <p className="text-sm font-semibold">carpenterbullet.in@gmail.com</p>
            </div>
          </a>
        </div>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/" className="btn-secondary flex-1 text-center py-3">
          ← Back to Home
        </Link>
        <Link href="/products" className="btn-primary flex-1 text-center py-3 flex items-center justify-center gap-2">
          Continue Shopping <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
