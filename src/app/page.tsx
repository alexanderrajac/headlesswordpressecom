import { Suspense } from "react";
import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import BenefitsStrip from "@/components/home/BenefitsStrip";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import ProductCardSkeleton from "@/components/ui/ProductCardSkeleton";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BenefitsStrip />
      <CategorySection />
      <section className="py-12 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-wood-600 font-semibold text-sm uppercase tracking-widest mb-1">Handpicked</p>
            <h2 className="section-title">Featured Products</h2>
          </div>
          <a href="/products" className="text-wood-600 font-semibold text-sm hover:underline hidden sm:block">
            View All →
          </a>
        </div>
        <Suspense fallback={
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        }>
          <FeaturedProducts />
        </Suspense>
      </section>
      <TestimonialsSection />
      <NewsletterSection />
    </>
  );
}
