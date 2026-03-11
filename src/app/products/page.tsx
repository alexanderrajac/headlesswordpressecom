import { Suspense } from "react";
import type { Metadata } from "next";
import ProductListingClient from "@/components/product/ProductListingClient";
import ProductCardSkeleton from "@/components/ui/ProductCardSkeleton";

export const metadata: Metadata = {
  title: "All Products",
  description: "Browse our full collection of premium handcrafted wooden furniture and decor.",
};

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Suspense
        fallback={
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        }
      >
        <ProductListingClient searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
