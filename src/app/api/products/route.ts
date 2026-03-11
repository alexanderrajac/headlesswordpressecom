import { NextResponse } from "next/server";
import { getProducts } from "@/lib/woocommerce";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category") || undefined;
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const minRating = searchParams.get("minRating");
    const inStock = searchParams.get("inStock");
    const orderby = searchParams.get("orderby") || undefined;
    const order = (searchParams.get("order") as "asc" | "desc" | null) || undefined;
    const page = searchParams.get("page");
    const per_page = searchParams.get("per_page");
    const search = searchParams.get("search") || undefined;

    const data = await getProducts({
      category,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minRating: minRating ? Number(minRating) : undefined,
      inStock: inStock ? inStock === "true" : undefined,
      orderby,
      order,
      page: page ? Number(page) : undefined,
      per_page: per_page ? Number(per_page) : undefined,
      search,
    });

    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}

