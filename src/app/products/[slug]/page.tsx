import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProduct, getRelatedProducts } from "@/lib/woocommerce";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import ProductCard from "@/components/product/ProductCard";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const product = await getProduct(params.slug);
    return {
      title: product.name,
      description: product.short_description.replace(/<[^>]*>/g, "").slice(0, 160),
      openGraph: {
        images: product.images[0]?.src ? [product.images[0].src] : [],
      },
    };
  } catch {
    return { title: "Product Not Found" };
  }
}

export default async function ProductPage({ params }: Props) {
  let product;
  try {
    product = await getProduct(params.slug);
  } catch {
    notFound();
  }

  let related = [];
  try {
    related = await getRelatedProducts(product.related_ids || []);
  } catch {}

  return (
    <div>
      <ProductDetailClient product={product} />

      {related.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-cream-300">
          <h2 className="section-title mb-8">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
