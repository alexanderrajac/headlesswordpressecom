"use client";
import { useState } from "react";
import { Mail } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="py-16 bg-wood-600">
      <div className="max-w-2xl mx-auto text-center px-4">
        <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-5">
          <Mail size={24} className="text-white" />
        </div>
        <h2 className="font-display text-3xl font-bold text-cream-100 mb-3">
          Get Exclusive Offers
        </h2>
        <p className="text-cream-100/80 mb-8">
          Subscribe to our newsletter and get 10% off your first order. Plus early access to sales & new arrivals.
        </p>
        {submitted ? (
          <div className="bg-white/20 rounded-xl px-6 py-4 text-cream-100 font-semibold">
            🎉 You're in! Check your inbox for your discount code.
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-cream-100 placeholder-cream-100/50 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              onClick={() => email && setSubmitted(true)}
              className="bg-charcoal text-cream-100 px-6 py-3 rounded-lg font-semibold hover:bg-charcoal-dark transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
