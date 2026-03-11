import { getFeaturedProducts } from "@/lib/woocommerce";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";

export default async function FeaturedProducts() {
  let products = [];
  try {
    products = await getFeaturedProducts();
  } catch (e) {
    // If API fails, show placeholder
    return (
      <div className="text-center py-10 text-charcoal/50">
        <p>Unable to load products. Please check your WooCommerce API configuration.</p>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center py-10 text-charcoal/50">
        <p>No featured products found. Mark some products as featured in WooCommerce.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
      <div className="text-center mt-8 sm:hidden">
        <Link href="/products" className="btn-secondary">
          View All Products
        </Link>
      </div>
    </>
  );
}
